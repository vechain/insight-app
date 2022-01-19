<template>
    <b-container>
        <b-card no-body>
            <b-card-header>
                <span class="h4">Transaction</span>
                <b-badge
                    v-if="!!receipt && receipt.reverted"
                    class="ml-3"
                    variant="warning"
                >Reverted</b-badge>
                <b-badge
                    v-if="!!tx && !receipt"
                    class="ml-3"
                    variant="secondary"
                >Pending</b-badge>
            </b-card-header>
            <b-card-body>
                <template v-if="tx">
                    <b-row>
                        <b-col lg="2">
                            <strong>ID</strong>
                        </b-col>
                        <b-col
                            lg="10"
                            class="d-flex"
                        >
                            <span class="text-monospace text-truncate">{{tx.id}}</span>
                            <Copy
                                :value="tx.id"
                                class="ml-2"
                            />
                        </b-col>
                    </b-row>
                    <hr />

                    <b-row>
                        <b-col lg="2">
                            <strong>Size</strong>
                        </b-col>
                        <b-col lg="10">{{tx.size|locale}} B</b-col>
                    </b-row>
                    <hr />
                    <template v-if="!!receipt ">
                        <b-row>
                            <b-col lg="2">
                                <strong>Timestamp</strong>
                            </b-col>
                            <b-col lg="10">
                                {{receipt.meta.blockTimestamp|date}}
                                <router-link :to="{name:'block', params: {id: receipt.meta.blockID, net:$net}}">#{{receipt.meta.blockNumber}}</router-link>
                            </b-col>
                        </b-row>
                        <hr />
                    </template>
                    <b-row>
                        <b-col lg="2">
                            <strong>Origin</strong>
                        </b-col>
                        <b-col lg="10">
                            <AccountLink
                                :address="tx.origin"
                                icon
                            />
                        </b-col>
                    </b-row>
                    <hr />
                    <b-row>
                        <b-col lg="2">
                            <strong>Total Transfer</strong>
                        </b-col>
                        <b-col lg="10">
                            <Amount sym="VET">{{totalTransferAmount}}</Amount>
                            <b-button
                                :disabled="!receipt"
                                v-if="clauses.length>0"
                                size="sm"
                                variant="primary"
                                class="ml-3 py-0"
                                v-b-toggle.clauses
                            >{{clauses.length}} {{clauses.length>1?'clauses':'clause'}}</b-button>
                        </b-col>
                    </b-row>
                    <template v-if="!!receipt ">
                        <b-collapse
                            v-if="clauses.length>0"
                            id="clauses"
                        >
                            <div class="mt-3 small">
                                <Clause
                                    v-for="(c, i) in clauses"
                                    :key="i"
                                    :clause="c"
                                    :index="i"
                                    :output="receipt.outputs?receipt.outputs[i]:null"
                                    class="mt-2"
                                />
                            </div>
                        </b-collapse>
                        <hr />
                        <b-row>
                            <b-col lg="2">
                                <strong>Gas Used</strong>
                            </b-col>
                            <b-col lg="10">
                                {{receipt.gasUsed | locale}} / {{tx.gas | locale}}
                                <sup>price coef {{tx.gasPriceCoef}}</sup>
                            </b-col>
                        </b-row>
                        <hr />
                        <b-row>
                            <b-col lg="2">
                                <strong>Fee</strong>
                            </b-col>
                            <b-col lg="10">
                                <Amount
                                    sym="VTHO"
                                    :dec="null"
                                    class="mr-2"
                                >{{receipt.paid}}</Amount>paid by
                                <strong v-if="tx.origin === receipt.gasPayer">Origin</strong>
                                <AccountLink
                                    v-else
                                    :address="receipt.gasPayer"
                                    abbr
                                    icon
                                />
                                <b-badge
                                    v-if="vip191"
                                    variant="info"
                                    class="ml-3"
                                >VIP-191</b-badge>
                            </b-col>
                        </b-row>
                        <hr />
                        <b-row>
                            <b-col lg="2">
                                <strong>Reward</strong>
                            </b-col>
                            <b-col lg="10">
                                <Amount
                                    sym="VTHO"
                                    :dec="null"
                                >{{receipt.reward}}</Amount>
                            </b-col>
                        </b-row>
                    </template>
                    <hr />
                    <b-row>
                        <b-col lg="2">
                            <strong>Block Ref</strong>
                        </b-col>
                        <b-col
                            lg="10"
                            class="text-monospace"
                        >{{tx.blockRef}}</b-col>
                    </b-row>
                    <hr />
                    <b-row>
                        <b-col lg="2">
                            <strong>Expiration</strong>
                        </b-col>
                        <b-col lg="10">{{tx.expiration}}</b-col>
                    </b-row>
                    <hr />
                    <b-row>
                        <b-col lg="2">
                            <strong>Nonce</strong>
                        </b-col>
                        <b-col
                            lg="10"
                            class="text-monospace"
                        >{{tx.nonce}}</b-col>
                    </b-row>
                    <hr />
                    <b-row>
                        <b-col lg="2">
                            <strong>Depends On</strong>
                        </b-col>
                        <b-col lg="10">
                            <router-link
                                class="text-monospace"
                                v-if="!!tx.dependsOn"
                                :to="{name:'tx', params:{id:tx.dependsOn, net:$net}}"
                            >{{tx.dependsOn}}</router-link>
                            <span v-else>-</span>
                        </b-col>
                    </b-row>
                    <hr />
                    <b-row>
                        <b-col lg="2">
                            <strong>Chain Tag</strong>
                        </b-col>
                        <b-col
                            lg="10"
                            class="text-monospace"
                        >0x{{tx.chainTag.toString(16)}}</b-col>
                    </b-row>
                </template>
                <template v-else>
                    <div
                        v-if="error"
                        class="text-center"
                    >
                        <p>Oops</p>
                        <p class="text-warning">Error: {{error.message}}</p>
                        <b-button
                            size="sm"
                            @click="reload"
                        >Reload</b-button>
                    </div>
                    <Loading
                        v-else
                        class="my-3"
                    />
                </template>
            </b-card-body>
        </b-card>
    </b-container>
</template>
<script lang="ts">
import Vue from 'vue'
import BigNumber from 'bignumber.js'

export default Vue.extend({
    data: () => {
        return {
            error: null as Error | null,
            tx: null as Connex.Thor.Transaction | null,
            receipt: null as Connex.Thor.Transaction.Receipt | null,
            id: ''
        }
    },
    computed: {
        clauses() { return this.tx!.clauses },
        totalTransferAmount() {
            let total = new BigNumber(0)
            this.clauses.forEach(c => {
                total = total.plus(c.value)
            })
            return total.toString()
        },
        vip191() { return !!(this.tx as any).delegator }
    },
    methods: {
        async reload() {
            this.error = null
            this.tx = null
            this.receipt = null

            try {
                const tv = this.$connex.thor.transaction(this.id).allowPending()
                const [tx, receipt] = await Promise.all([
                    tv.get(),
                    tv.getReceipt()
                ])

                if (tx) { this.tx = tx } else { this.error = new Error('not found') }
                if (receipt) { this.receipt = receipt }
            } catch (err) {
                this.error = err
            }
        }
    },
    async created() {
        this.$ga.page('/insight/tx')
        this.id = this.$route.params.id
        this.reload()

        let destroyed = false
        this.$once('hook:beforeDestroy', () => {
            destroyed = true
        })

        const ticker = this.$connex.thor.ticker()
        const tv = this.$connex.thor.transaction(this.id)
        for (; ;) {
            await ticker.next()
            if (destroyed || this.receipt) {
                break
            }
            try {
                this.receipt = await tv.getReceipt()
            } catch { }
        }
    }
})
</script>
