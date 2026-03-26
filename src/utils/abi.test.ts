import { describe, it, expect } from 'vitest'
import { abi } from './abi'

// ────────────────────────────────────────────────────────────
// abi.Function
// ────────────────────────────────────────────────────────────

describe('abi.Function', () => {
    const transferDef = {
        name: 'transfer',
        type: 'function' as const,
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    }

    it('computes canonical name and 4-byte selector', () => {
        const fn = new abi.Function(transferDef)
        expect(fn.canonicalName).toBe('transfer(address,uint256)')
        // Well-known ERC-20 transfer selector
        expect(fn.signature).toBe('0xa9059cbb')
    })

    it('encodes call data starting with selector', () => {
        const fn = new abi.Function(transferDef)
        const to = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'
        const value = 1000
        const data = fn.encode(to, value)
        expect(data.startsWith('0xa9059cbb')).toBe(true)
        // address is zero-padded to 32 bytes in the encoded data
        expect(data.toLowerCase()).toContain('5b38da6a701c568545dcfcb03fcb875f56beddc4')
        // value 1000 = 0x3e8
        expect(data.endsWith('00000000000000000000000000000000000000000000000000000000000003e8')).toBe(true)
    })

    it('decodes output — bool true returns "1", address lowercased', () => {
        const fn = new abi.Function(transferDef)
        // bool true encoded
        const encoded = '0x0000000000000000000000000000000000000000000000000000000000000001'
        const result = fn.decode(encoded)
        expect(result[0]).toBe(true)
    })

    it('round-trips encode then decode for multi-output function', () => {
        const fn = new abi.Function({
            name: 'f1',
            type: 'function',
            inputs: [
                { name: 'a1', type: 'uint256' },
                { name: 'a2', type: 'string' },
            ],
            outputs: [
                { name: 'r1', type: 'address' },
                { name: 'r2', type: 'bytes' },
            ],
        })
        expect(fn.canonicalName).toBe('f1(uint256,string)')

        // decode some known output
        const addr = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'
        const bytesVal = '0xdeadbeef'
        const encoded = abi.encodeParameters(
            [{ name: 'r1', type: 'address' }, { name: 'r2', type: 'bytes' }],
            [addr, bytesVal]
        )
        const result = fn.decode(encoded)
        expect(result['r1']).toBe(addr.toLowerCase())
        expect(result['r2']).toBe(bytesVal)
        expect(result[0]).toBe(addr.toLowerCase())
        expect(result[1]).toBe(bytesVal)
    })

    it('uint256 output is decoded as string, not BigNumber object', () => {
        const fn = new abi.Function({
            name: 'balanceOf',
            type: 'function',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
        })
        const encoded = abi.encodeParameter('uint256', '999999999999999999')
        const result = fn.decode(encoded)
        expect(result[0]).toBe('999999999999999999')
        expect(typeof result[0]).toBe('string')
    })

    it('decodes withdrawStake(address) call data', () => {
        const fn = new abi.Function({
            name: 'withdrawStake',
            type: 'function',
            inputs: [{ name: '_staker', type: 'address' }],
            outputs: [],
        })
        const callData = '0xc23a5cea000000000000000000000000e4c082f2beb813112f3a742044b92581eea22324'
        const dec = abi.decodeParameters(fn.definition.inputs, '0x' + callData.slice(10))
        expect(dec[0]).toBe('0xe4c082f2beb813112f3a742044b92581eea22324')
    })
})

// ────────────────────────────────────────────────────────────
// abi.Event
// ────────────────────────────────────────────────────────────

describe('abi.Event', () => {
    const transferEventDef = {
        name: 'Transfer',
        type: 'event' as const,
        anonymous: false,
        inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
        ],
    }

    it('computes canonical name and 32-byte event topic', () => {
        const ev = new abi.Event(transferEventDef)
        expect(ev.canonicalName).toBe('Transfer(address,address,uint256)')
        // Well-known ERC-20 Transfer topic
        expect(ev.signature).toBe(
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
        )
    })

    it('decodes a Transfer event log', () => {
        const ev = new abi.Event(transferEventDef)
        const from = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'
        const to = '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2'
        const value = '1000'

        const topics = [
            ev.signature,
            '0x0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc4',
            '0x000000000000000000000000ab8483f64d9c6d1ecf9b849ae677dd3315835cb2',
        ]
        // non-indexed value: 1000 = 0x3e8
        const data = '0x00000000000000000000000000000000000000000000000000000000000003e8'

        const result = ev.decode(data, topics)
        expect(result['from']).toBe(from.toLowerCase())
        expect(result['to']).toBe(to.toLowerCase())
        expect(result['value']).toBe(value)
        expect(result[0]).toBe(from.toLowerCase())
        expect(result[1]).toBe(to.toLowerCase())
        expect(result[2]).toBe(value)
    })

    it('encodes indexed parameters into topics', () => {
        const ev = new abi.Event(transferEventDef)
        const from = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'
        const to = '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2'

        const topics = ev.encode({ from, to })
        expect(topics[0]).toBe(ev.signature)
        expect(topics[1]!.toLowerCase()).toContain('5b38da6a701c568545dcfcb03fcb875f56beddc4')
        expect(topics[2]!.toLowerCase()).toContain('ab8483f64d9c6d1ecf9b849ae677dd3315835cb2')
    })

    it('null indexed value becomes null topic', () => {
        const ev = new abi.Event(transferEventDef)
        const topics = ev.encode({ from: null, to: null })
        expect(topics[0]).toBe(ev.signature)
        expect(topics[1]).toBeNull()
        expect(topics[2]).toBeNull()
    })
})

// ────────────────────────────────────────────────────────────
// abi.encodeParameter / decodeParameter
// ────────────────────────────────────────────────────────────

describe('abi.decodeParameter', () => {
    it('decodes uint256 as string', () => {
        const encoded = abi.encodeParameter('uint256', 42)
        expect(abi.decodeParameter('uint256', encoded)).toBe('42')
    })

    it('decodes address as lowercase', () => {
        const addr = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'
        const encoded = abi.encodeParameter('address', addr)
        expect(abi.decodeParameter('address', encoded)).toBe(addr.toLowerCase())
    })

    it('decodes bool', () => {
        expect(abi.decodeParameter('bool', abi.encodeParameter('bool', true))).toBe(true)
        expect(abi.decodeParameter('bool', abi.encodeParameter('bool', false))).toBe(false)
    })

    it('decodes bytes32', () => {
        const val = '0xdeadbeef00000000000000000000000000000000000000000000000000000000'
        expect(abi.decodeParameter('bytes32', abi.encodeParameter('bytes32', val))).toBe(val)
    })
})

// ────────────────────────────────────────────────────────────
// abi.decodeParameters
// ────────────────────────────────────────────────────────────

describe('abi.decodeParameters', () => {
    it('returns both index and name keys', () => {
        const encoded = abi.encodeParameters(
            [{ name: 'amount', type: 'uint256' }, { name: 'recipient', type: 'address' }],
            [500, '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4']
        )
        const result = abi.decodeParameters(
            [{ name: 'amount', type: 'uint256' }, { name: 'recipient', type: 'address' }],
            encoded
        )
        expect(result[0]).toBe('500')
        expect(result['amount']).toBe('500')
        expect(result[1]).toBe('0x5b38da6a701c568545dcfcb03fcb875f56beddc4')
        expect(result['recipient']).toBe('0x5b38da6a701c568545dcfcb03fcb875f56beddc4')
    })
})

// ────────────────────────────────────────────────────────────
// Tuple type
// ────────────────────────────────────────────────────────────

describe('tuple type', () => {
    it('decodes tuple with named fields', () => {
        const tupleDef = {
            name: 'point',
            type: 'tuple',
            components: [
                { name: 'x', type: 'uint256' },
                { name: 'y', type: 'uint256' },
            ],
        }
        const encoded = abi.encodeParameter(tupleDef, [3, 7])
        const result = abi.decodeParameter(tupleDef, encoded) as any
        expect(result[0]).toBe('3')
        expect(result[1]).toBe('7')
        expect(result['x']).toBe('3')
        expect(result['y']).toBe('7')
    })
})
