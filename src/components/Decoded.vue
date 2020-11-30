<template>
    <div v-if="decoded">
        <b-card-header class="py-1 px-2">
            <strong class="text-monospace">{{decoded.def.type}} {{decoded.canonicalName}}</strong>
        </b-card-header>
        <div class="px-3 py-2 overflow-auto">
            <table class="table mb-0">
                <template v-if="decoded.params.length>0">
                    <tr class="table-borderless">
                        <th>#</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Data</th>
                    </tr>
                    <tr
                        class="text-monospace"
                        v-for="(param, i) in decoded.params"
                        :key="i"
                    >
                        <td>{{i}}</td>
                        <td>{{param.name}}</td>
                        <td>
                            {{param.type}}
                            <sup v-if="param.indexed">indexed</sup>
                        </td>
                        <td>
                            <AccountLink
                                v-if="param.type==='address'"
                                :address="param.value"
                            />
                            <template v-else>{{param.value}}</template>
                        </td>
                    </tr>
                </template>
                <tr
                    v-else
                    class="table-borderless"
                >
                    <td align="center">No Parameter</td>
                </tr>
            </table>
        </div>
    </div>
    <b-card-body v-else>
        <Loading v-if="$asyncComputed.decoded.updating" />
        <div
            v-else-if="$asyncComputed.decoded.exception"
            class="text-center"
        >
            <p class="h5">Oops</p>
            <p class="text-warning">{{$asyncComputed.decoded.exception.name}}: {{$asyncComputed.decoded.exception.message}}</p>
            <b-button
                size="sm"
                variant="primary"
                @click="$asyncComputed.decoded.update()"
            >Retry</b-button>
        </div>
        <div
            v-else
            class="text-center"
        >
            <p>JSON ABI Missing</p>
            <b-button
                size="sm"
                variant="primary"
                href="https://github.com/vechain/b32/new/master/ABIs"
                target="_blank"
            >Submit JSON ABI</b-button>
        </div>
    </b-card-body>
</template>
<script lang="ts">
import Vue from 'vue'
import { abi } from 'thor-devkit'

type Decoded = {
    def: abi.Function.Definition | abi.Event.Definition
    canonicalName: string
    params: Array<{ name: string, type: string, value: string, indexed?: boolean }>
}

export default Vue.extend({
    props: {
        value: Object as () => {
            data: string,
            topics?: string[]
        }
    },
    asyncComputed: {
        async decoded(): Promise<Decoded | null> {
            const val = this.value
            const sig = val.topics ? val.topics[0] : val.data.slice(0, 10)
            let defs: Array<abi.Function.Definition | abi.Event.Definition> | undefined = abiCache.get(sig)
            if (!defs) {
                defs = await queryABI(sig)
                abiCache.set(sig, defs)
            }

            for (const def of defs) {
                try {
                    if (def.type === 'event') {
                        const ev = new abi.Event(def)
                        const dec = ev.decode(val.data, val.topics!)
                        return {
                            def,
                            params: def.inputs.map((p, i) => {
                                return {
                                    name: p.name,
                                    type: p.type,
                                    value: dec[i],
                                    indexed: p.indexed
                                }
                            }),
                            canonicalName: ev.canonicalName
                        }
                    } else {
                        const fn = new abi.Function(def)
                        const dec = abi.decodeParameters(def.inputs, '0x' + val.data.slice(10))
                        return {
                            def,
                            params: def.inputs.map((p, i) => {
                                return {
                                    name: p.name,
                                    type: p.type,
                                    value: dec[i]
                                }
                            }),
                            canonicalName: fn.canonicalName
                        }
                    }
                } catch {
                    // continue
                }
            }
            return null
        }
    }
})

export const abiCache = new Map<string, any[]>()
export async function queryABI(sig: string) {
    const url = `https://b32.vecha.in/q/${sig}.json`

    const resp = await fetch(url)
    if (resp.status === 404) {
        return []
    }
    if (resp.status !== 200) {
        throw new Error(`Failed to query ABI (status: ${resp.status})`)
    }

    const json = await resp.json()
    if (!Array.isArray(json)) {
        throw new Error('Failed to query ABI (bad response)')
    }
    return json
}
</script>
<style lang="scss" scoped>
th,
td {
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
}
</style>
