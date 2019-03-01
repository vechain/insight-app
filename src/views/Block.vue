<template>
    <div>
        <div>
            <span class="h5 mr-2">Block</span>
            <template v-if="block">
                <span>#{{block.number}}</span>
                <VeForgeLink btn type="block" :arg="block.id" class="ml-2"/>
            </template>
        </div>
        <div
            v-if="!!block&&!block.isTrunk"
            class="label label-warning my-2 caption text-bold"
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
                    <div class="field-value">
                        <AccountLink :address="block.signer"/>
                    </div>
                    <div class="field-name">Beneficiary</div>
                    <div class="field-value">
                        <AccountLink :address="block.beneficiary"/>
                    </div>
                    <div class="field-name">State Root</div>
                    <div class="field-value text-mono">{{block.stateRoot}}</div>
                    <div class="field-name">Transactions Root</div>
                    <div class="field-value text-mono">{{block.txsRoot}}</div>
                    <div class="field-name">Receipts Root</div>
                    <div class="field-value text-mono">{{block.receiptsRoot}}</div>
                </div>
            </div>
            <div class="h6 text-gray">{{txsCountText}}</div>
            <div v-if="txs.length>0" class="card my-2">
                <div class="card-body caption">
                    <div class="my-1" v-for="(txid,i) in txs" :key="i">
                        {{i+1}}.
                        <router-link
                            class="text-mono ml-2"
                            :to="{name: 'tx', params:{id: txid}}"
                        >{{txid}}</router-link>
                    </div>
                </div>
            </div>
        </template>
        <div v-else class="card my-2">
            <div class="card-body">
                <Loading :error="error" @reload="reload"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

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

    id = ''

    get txs() { return this.block!.transactions }
    get txsCountText() {
        if (this.txs.length === 0) {
            return 'No Transaction'
        } else if (this.txs.length === 1) {
            return '1 Transaction'
        } else {
            return `${this.txs.length} Transactions`
        }
    }

    async reload() {
        this.block = null
        this.error = null

        try {
            const block = await connex.thor.block(this.id).get()
            if (!block) {
                this.error = new Error('block not found')
            } else {
                this.block = block
            }
        } catch (err) {
            this.error = err
        }
    }

    created() {
        this.$ga.page('/insight/block')
        this.id = this.$route.params.id
        this.reload()
    }
}
</script>
