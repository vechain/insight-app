import { defaultAbiCoder, EventFragment, FunctionFragment, ParamType } from '@ethersproject/abi'
import { keccak256 } from '@ethersproject/keccak256'
import { toUtf8Bytes } from '@ethersproject/strings'

export type AbiInput = {
    name: string
    type: string
    components?: AbiInput[]
    indexed?: boolean
}

export type FunctionDef = {
    name: string
    inputs: AbiInput[]
    outputs: AbiInput[]
    type?: string
}

export type EventDef = {
    name: string
    inputs: AbiInput[]
    anonymous?: boolean
    type?: string
}

function processDecoded(pt: ParamType, value: unknown): unknown {
    const base = pt.baseType
    if (base === 'address') return (value as string).toLowerCase()
    if (base.startsWith('uint') || base.startsWith('int'))
        return (value as { toString(): string }).toString()
    if (base === 'array')
        return (value as unknown[]).map(v => processDecoded(pt.arrayChildren!, v))
    if (base === 'tuple') {
        const arr = value as unknown[]
        const out = arr.map((v, i) => processDecoded(pt.components![i], v)) as unknown[] &
            Record<string, unknown>
        pt.components!.forEach((comp, i) => { if (comp.name) out[comp.name] = out[i] })
        return out
    }
    return value
}

function toParamType(t: AbiInput): ParamType {
    return ParamType.from({ name: t.name, type: t.type, components: t.components })
}

function encodeValues(types: AbiInput[], values: unknown[]): string {
    try {
        return defaultAbiCoder.encode(types.map(toParamType), values as any[])
    } catch (err: any) {
        throw new Error(err?.message ?? String(err))
    }
}

function decodeValues(types: AbiInput[], data: string): unknown[] {
    if (types.length === 0) return []
    try {
        const pts = types.map(toParamType)
        const raw = defaultAbiCoder.decode(pts, data)
        return pts.map((pt, i) => processDecoded(pt, raw[i]))
    } catch (err: any) {
        throw new Error(err?.message ?? String(err))
    }
}

function normalise(t: string | AbiInput): AbiInput {
    return typeof t === 'string' ? { name: '', type: t } : t
}

/** First 4 bytes of keccak256, as hex with 0x prefix */
function selector4(canonicalName: string): string {
    return keccak256(toUtf8Bytes(canonicalName)).slice(0, 10)
}

/** Full 32-byte keccak256 as hex with 0x prefix */
function topic32(canonicalName: string): string {
    return keccak256(toUtf8Bytes(canonicalName))
}

function isValueType(type: string): boolean {
    return (
        type === 'address' ||
        type === 'bool' ||
        /^u?int(\d*)$/.test(type) ||
        /^bytes(\d+)$/.test(type)
    )
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace abi {
    /** Encode a single ABI parameter */
    export function encodeParameter(type: string | AbiInput, value: unknown): string {
        return encodeValues([normalise(type)], [value])
    }

    /** Decode a single ABI parameter */
    export function decodeParameter(type: string | AbiInput, data: string): unknown {
        return decodeValues([normalise(type)], data)[0]
    }

    /** Encode multiple ABI parameters */
    export function encodeParameters(types: Array<string | AbiInput>, values: unknown[]): string {
        return encodeValues(types.map(normalise), values)
    }

    /**
     * Decode multiple ABI parameters.
     * Returns an object with both index keys (0, 1, …) and name keys where available.
     */
    export function decodeParameters(
        types: Array<string | AbiInput>,
        data: string
    ): Record<string | number, unknown> {
        const normalised = types.map(normalise)
        const result = decodeValues(normalised, data)
        const decoded: Record<string | number, unknown> = {}
        normalised.forEach((t, i) => {
            decoded[i] = result[i]
            if (t.name) decoded[t.name] = result[i]
        })
        return decoded
    }

    /** Wraps a contract function ABI definition for encoding call data and decoding output */
    export class Function {
        readonly definition: FunctionDef
        readonly canonicalName: string
        /** 4-byte selector with 0x prefix, e.g. `'0xa9059cbb'` */
        readonly signature: string

        constructor(definition: FunctionDef) {
            this.definition = definition
            this.canonicalName = FunctionFragment.from({ stateMutability: 'nonpayable', ...definition } as any).format('sighash')
            this.signature = selector4(this.canonicalName)
        }

        /** Encode call data: 4-byte selector + ABI-encoded inputs */
        encode(...args: unknown[]): string {
            return this.signature + encodeParameters(this.definition.inputs, args).slice(2)
        }

        /** Decode output data. Returns object with index and name keys. */
        decode(outputData: string): Record<string | number, unknown> {
            return decodeParameters(this.definition.outputs, outputData)
        }
    }

    /** Wraps a contract event ABI definition for encoding filter topics and decoding logs */
    export class Event {
        readonly definition: EventDef
        readonly canonicalName: string
        /** Full 32-byte event topic with 0x prefix */
        readonly signature: string

        constructor(definition: EventDef) {
            this.definition = definition
            this.canonicalName = EventFragment.from(definition as any).format('sighash')
            this.signature = topic32(this.canonicalName)
        }

        /** Build the topics array for log filtering by indexed parameters */
        encode(indexed: Record<string, unknown>): (string | null)[] {
            const topics: (string | null)[] = []
            if (!this.definition.anonymous) topics.push(this.signature)
            for (const input of this.definition.inputs) {
                if (!input.indexed) continue
                const value = indexed[input.name]
                if (value == null) {
                    topics.push(null)
                } else if (isValueType(input.type)) {
                    topics.push(encodeParameter(input.type, value) as string)
                } else if (input.type === 'string') {
                    topics.push(keccak256(toUtf8Bytes(value as string)))
                } else if (
                    typeof value === 'string' &&
                    /^0x[0-9a-f]+$/i.test(value) &&
                    value.length % 2 === 0
                ) {
                    // pre-encoded bytes value: hash the raw bytes
                    const bytes = Buffer.from(value.slice(2), 'hex')
                    topics.push(keccak256(bytes))
                } else {
                    throw new Error(`event.encode: invalid ${input.type} value`)
                }
            }
            return topics
        }

        /** Decode an event log. Returns object with index and name keys. */
        decode(data: string, topics: string[]): Record<string | number, unknown> {
            if (!this.definition.anonymous) topics = topics.slice(1)

            const indexedInputs = this.definition.inputs.filter(t => t.indexed)
            if (indexedInputs.length !== topics.length)
                throw new Error('invalid topics count')

            const nonIndexedInputs = this.definition.inputs.filter(t => !t.indexed)
            const decodedNonIndexed = decodeValues(nonIndexedInputs, data)
            let topicIdx = 0
            let nonIdxIdx = 0

            const decoded: Record<string | number, unknown> = {}
            this.definition.inputs.forEach((t, i) => {
                if (t.indexed) {
                    const topic = topics[topicIdx++]
                    decoded[i] = isValueType(t.type) ? decodeParameter(t.type, topic) : topic
                } else {
                    decoded[i] = decodedNonIndexed[nonIdxIdx++]
                }
                if (t.name) decoded[t.name] = decoded[i]
            })
            return decoded
        }
    }
}
