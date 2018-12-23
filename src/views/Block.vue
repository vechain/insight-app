<template>
    <div>
        <div>
            <span class="h5 mr-2">Block</span>
            <span>#{{block?block.number: ''}}</span>
        </div>
        <div
            v-if="!!block&&!block.isTrunk"
            class="label label-warning my-2 heading text-bold"
        >Branch</div>
        <template v-if="!!block">
            <div class="card my-2">
                <div class="columns card-body is-align-center">
                    <div class="field-name">ID</div>
                    <div class="field-value text-mono">{{block.id}}</div>
                    <div class="field-name">Size</div>
                    <div class="field-value">{{block.size|locale}}B</div>
                    <div class="field-name">Timestamp</div>
                    <div class="field-value">{{block.timestamp | date}}</div>
                    <div class="field-name">Parent</div>
                    <div class="field-value text-mono">
                        <router-link
                            :to="{name:'block', params: {id: block.parentID}}"
                        >{{block.parentID}}</router-link>
                    </div>
                    <div class="field-name">Gas Used</div>
                    <div class="field-value">{{block.gasUsed | locale}}/{{block.gasLimit | locale}}</div>
                    <div class="field-name">Total Score</div>
                    <div class="field-value">{{block.totalScore | locale}}</div>
                    <div class="field-name">Signer</div>
                    <div class="field-value text-mono">
                        <router-link
                            :to="{name: 'account', params:{address: block.signer}}"
                        >{{block.signer}}</router-link>
                    </div>
                    <div class="field-name">Beneficiary</div>
                    <div class="field-value text-mono">{{block.beneficiary}}</div>
                    <div class="field-name">State Root</div>
                    <div class="field-value text-mono">{{block.stateRoot}}</div>
                    <div class="field-name">Transactions Root</div>
                    <div class="field-value text-mono">{{block.txsRoot}}</div>
                    <div class="field-name">Receipts Root</div>
                    <div class="field-value text-mono">{{block.receiptsRoot}}</div>
                </div>
            </div>
            <div class="h6">{{txs.length>0?`${txs.length} Transaction(s)`: 'No Transaction'}}</div>
            <div v-if="txs.length>0" class="card my-2">
                <ol v-if="txs.length>0" class="card-body mx-0 my-0">
                    <li v-for="txid in txs" :key="txid">
                        <router-link
                            class="text-mono"
                            :to="{name: 'tx', params:{id: txid}}"
                        >{{txid}}</router-link>
                    </li>
                </ol>
            </div>
        </template>
        <div v-else class="card my-2">
            <div class="card-body">
                <Loading :error="error"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

type Item = {
    name: string
    value: string | number
    linkTo?: {
        name: string,
        params: { [name: string]: string }
    }
}

@Component
export default class Block extends Vue {
    block: Connex.Thor.Block | null = null
    error: Error | null = null

    get id() {
        return this.$route.params.id
    }

    get txs() {
        return this.block!.transactions
    }

    @Watch('id')
    async reload() {
        this.block = null
        this.error = null

        const id = this.id
        try {
            const block = await connex.thor.block(id).get()
            if (id === this.id) {
                if (!block) {
                    this.error = new Error('block not found')
                } else {
                    this.block = block
                }
            }
        } catch (err) {
            console.log(3, this.id)
            if (id === this.id) {
                this.error = err
            }
        }
    }

    created() {
        this.reload()
    }
}
</script>
