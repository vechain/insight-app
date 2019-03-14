<template>
    <div v-if="decoded" class="sub-panel">
        <div class="sub-panel-head my-2">Decoded</div>
        <div class="sub-panel-body">
            <strong class="text-mono">{{methodName}}</strong>
            <table class="table">
                <tr class="text-gray">
                    <th>#</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Data</th>
                </tr>
                <template v-if="decoded.length>0">
                    <tr v-for="(d, i) in decoded" :key="i">
                        <td>{{i}}</td>
                        <td>{{d.name}}</td>
                        <td>{{d.type}}</td>
                        <td class="text-mono">{{d.data}}</td>
                    </tr>
                </template>
                <tr v-else>
                    <td colspan="4" align="center">No Parameter</td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { abi } from 'thor-devkit/es6/abi'

@Component
export default class DecodedData extends Vue {
    @Prop(String) private data!: string
    private decoded: Array<{ name: string, type: string, data: any }> | null = null
    private methodName = ''
    public created() {
        this.refresh()
    }

    @Watch('data')
    private async refresh() {
        this.decoded = null
        this.methodName = ''
        const data = this.data
        if (data.length <= 10) {
            return
        }
        const json = await queryABI(data.slice(0, 10))
        if (!json) {
            return
        }
        const dec = new abi.Function({
            outputs: json.inputs,
            inputs: [],
            payable: false,
            name: 'foo',
            type: 'function',
            stateMutability: 'view',
        })
        const decoded = dec.decode('0x' + data.slice(10)) as any
        this.decoded = dec.definition.outputs!.map((p, i) => {
            return {
                name: p.name,
                type: p.type,
                data: decoded[i]
            }
        })
        this.methodName = `${json.name}(${json.inputs.map((v: any) => v.type).join(', ')})`
    }
}

import axios from 'axios'

const cache = new Map<string, any>()

async function queryABI(sig: string) {
    const abi = cache.get(sig)
    if (abi) {
        return abi
    }
    const url = `https://b32.vecha.in/q/${sig}.json`
    try {
        const resp = await axios.get(url, {})
        if (resp.status === 200) {
            cache.set(sig, resp.data[0])
            return resp.data[0]
        }
    } catch (err) {
        console.warn('query ABI', err)
    }
    return null
}
</script>
