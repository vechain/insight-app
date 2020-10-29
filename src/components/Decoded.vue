<template>
    <div v-if="decoded">
        <b-card-header class="py-1 px-2">
            <strong class="text-monospace">{{abi.json.type}} {{decoded.canonicalName}}</strong>
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
                    <tr class="text-monospace" v-for="(param, i) in decoded.params" :key="i">
                        <td>{{i}}</td>
                        <td>{{param.name}}</td>
                        <td>
                            {{param.type}}
                            <sup v-if="param.indexed">indexed</sup>
                        </td>
                        <td>
                            <AccountLink v-if="param.type==='address'" :address="param.value" />
                            <template v-else>{{param.value}}</template>
                        </td>
                    </tr>
                </template>
                <tr v-else class="table-borderless">
                    <td align="center">No Parameter</td>
                </tr>
            </table>
        </div>
    </div>
    <b-card-body v-else>
        <Loading v-if="abi.loading" />
        <div v-else-if="abi.error" class="text-center">
            <p class="h5">Oops</p>
            <p class="text-warning">{{abi.error.name}}: {{abi.error.message}}</p>
            <b-button size="sm" variant="primary" @click="reload">Retry</b-button>
        </div>
        <div v-else class="text-center">
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { abi } from 'thor-devkit'

@Component
export default class Decoded extends Vue {
    @Prop(Object) private value !: {
        data: string,
        topics?: string[]
    }

    private abi = {
        json: null as abi.Function.Definition | abi.Event.Definition | null,
        loading: false,
        error: null as Error | null
    }

    get decoded() {
        const json = this.abi.json
        if (!json) {
            return null
        }

        if (json.type === 'event') {
            const ev = new abi.Event(json)
            const dec = ev.decode(this.value.data, this.value.topics!)
            return {
                params: json.inputs.map((p, i) => {
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
            const fn = new abi.Function(json)
            const dec = abi.decodeParameters(json.inputs, '0x' + this.value.data.slice(10))
            return {
                params: json.inputs.map((p, i) => {
                    return {
                        name: p.name,
                        type: p.type,
                        value: dec[i]
                    }
                }),
                canonicalName: fn.canonicalName
            }
        }
    }

    @Watch('value')
    private async reload() {
        if (this.abi.loading) {
            return
        }

        this.abi.json = null
        this.abi.error = null
        if (this.value.topics) {
            this.abi.json = abiCache.get(this.value.topics[0]) || null
        } else {
            this.abi.json = abiCache.get(this.value.data.slice(0, 10)) || null
        }

        if (this.abi.json) {
            return
        }

        try {
            this.abi.loading = true
            const sig = this.value.topics ? this.value.topics[0] : this.value.data.slice(0, 10)
            const json = await queryABI(sig)
            if (json) {
                this.abi.json = json
                abiCache.set(sig, json)
            }
        } catch (err) {
            this.abi.error = err
        } finally {
            this.abi.loading = false
        }
    }

    private created() {
        this.reload()
    }
}


export const abiCache = new Map<string, any>()
export async function queryABI(sig: string) {
    const url = `https://b32.vecha.in/q/${sig}.json`

    const resp = await fetch(url)
    if (resp.status === 404) {
        return null
    }
    if (resp.status !== 200) {
        throw new Error(`Failed to query ABI (status: ${resp.status})`)
    }

    const json = await resp.json()
    if (!Array.isArray(json) || !json[0]) {
        throw new Error('Failed to query ABI (bad response)')
    }
    return json[0]
}
</script>
<style lang="scss" scoped>
th,
td {
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
}
</style>
