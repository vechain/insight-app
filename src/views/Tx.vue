<template>
    <div>
        <div>
            <span class="h5 mr-2">Transaction</span>
            <span class="text-mono">{{tx?tx.id:''}}</span>
        </div>
        <div
            v-if="!!receipt && receipt.reverted"
            class="label label-error my-2 caption text-bold"
        >Reverted</div>
        <template v-if="!!tx">
            <div class="card my-2">
                <div class="columns card-body is-align-center">
                    <div class="field-name">Size</div>
                    <div class="field-value">{{tx.size|locale}} B</div>
                    <div class="field-name">Gas Used</div>
                    <div class="field-value">{{receipt.gasUsed | locale}} / {{tx.gas | locale}}</div>
                    <div class="field-name">Gas Price Coef</div>
                    <div class="field-value">{{tx.gasPriceCoef}}</div>
                    <div class="field-name">Fee</div>
                    <div class="field-value">
                        <span class="token-amount">{{receipt.paid | amount}}</span>
                        <span class="token-symbol">VTHO</span>
                    </div>
                    <div class="field-name">Origin</div>
                    <div class="field-value text-mono">
                        <AccountLink :address="tx.origin"/>
                    </div>
                    <div class="field-name">Fee Payer</div>
                    <div class="field-value">
                        <span v-if="tx.origin === receipt.gasPayer">Origin</span>
                        <AccountLink v-else :address="receipt.gasPayer"/>
                    </div>
                    <div class="field-name">Timestamp</div>
                    <div class="field-value">{{tx.meta.blockTimestamp|date}}</div>
                    <div class="field-name">Block</div>
                    <div class="field-value">
                        <router-link
                            :to="{name:'block', params: {id: tx.meta.blockID}}"
                        >#{{tx.meta.blockNumber}}</router-link>
                    </div>
                    <div class="field-name">Reward</div>
                    <div class="field-value">
                        <span class="token-amount">{{receipt.reward | amount}}</span>
                        <span class="token-symbol">VTHO</span>
                    </div>
                    <div class="field-name">Block Ref</div>
                    <div class="field-value text-mono">{{tx.blockRef}}</div>
                    <div class="field-name">Expiration</div>
                    <div class="field-value">{{tx.expiration}}</div>
                    <div class="field-name">Nonce</div>
                    <div class="field-value text-mono">{{tx.nonce}}</div>
                    <div class="field-name">Depends On</div>
                    <div class="field-value">
                        <router-link
                            class="text-mono"
                            v-if="!!tx.dependsOn"
                            :to="{name:'tx', params:{id:tx.dependsOn}}"
                        >{{tx.dependsOn}}</router-link>
                        <span v-else>-</span>
                    </div>
                    <div class="field-name">Chain Tag</div>
                    <div class="field-value text-mono">0x{{tx.chainTag.toString(16)}}</div>
                </div>
            </div>
            <div class="h6 text-gray">{{clauseCountText}}</div>
            <div class="card my-2" v-for="(c,i) in clauses" :key="i">
                <div class="card-body">
                    <Clause :clause="c" :output="receipt.outputs?receipt.outputs[i]:null"/>
                </div>
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
import { Vue, Component } from 'vue-property-decorator'


@Component
export default class Tx extends Vue {
    error: Error | null = null
    tx: Connex.Thor.Transaction | null = null
    receipt: Connex.Thor.Receipt | null = null
    id = ''

    get clauses() { return this.tx!.clauses }

    get clauseCountText() {
        if (this.clauses.length === 0) {
            return 'No Clause'
        } else if (this.clauses.length === 1) {
            return '1 Clause'
        } else {
            return `${this.clauses.length} Clauses`
        }
    }

    async reload() {
        this.error = null
        this.tx = null
        this.receipt = null

        try {
            const tv = connex.thor.transaction(this.id)
            const [tx, receipt] = await Promise.all([
                tv.get(),
                tv.getReceipt()
            ])

            if (tx && receipt) {
                this.tx = tx
                this.receipt = receipt
            } else {
                this.error = new Error('not found')
            }
        } catch (err) {
            this.error = err
        }
    }

    created() {
        this.id = this.$route.params.id
        this.reload()
    }
}   
</script>

