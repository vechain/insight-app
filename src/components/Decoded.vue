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
        <Loading v-if="abi.loading" />
        <div
            v-else-if="abi.error"
            class="text-center"
        >
            <p class="h5">Oops</p>
            <p class="text-warning">{{abi.error.name}}: {{abi.error.message}}</p>
            <b-button
                size="sm"
                variant="primary"
                @click="reload"
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
    data: () => {
        return {
            abi: {
                defs: [] as Array<abi.Function.Definition | abi.Event.Definition>,
                loading: false,
                error: null as Error | null
            }
        }
    },
    computed: {
        decoded(): Decoded | null {
            for (const def of this.abi.defs) {
                try {
                    if (def.type === 'event') {
                        const ev = new abi.Event(def)
                        const dec = ev.decode(this.value.data, this.value.topics!)
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
                        const dec = abi.decodeParameters(def.inputs, '0x' + this.value.data.slice(10))
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
    },
    watch: {
        value() {
            this.reload()
        }
    },
    methods: {
        async reload() {
            if (this.abi.loading) {
                return
            }

            this.abi.defs = []
            this.abi.error = null
            if (this.value.topics) {
                this.abi.defs = abiCache.get(this.value.topics[0]) || []
            } else {
                this.abi.defs = abiCache.get(this.value.data.slice(0, 10)) || []
            }

            if (this.abi.defs.length > 0) {
                return
            }

            try {
                this.abi.loading = true
                const sig = this.value.topics ? this.value.topics[0] : this.value.data.slice(0, 10)
                const defs = await queryABI(sig)
                if (defs) {
                    this.abi.defs = defs
                    abiCache.set(sig, defs)
                }
            } catch (err) {
                this.abi.error = err
            } finally {
                this.abi.loading = false
            }
        }
    },
    created() {
        this.reload()
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
