<template>
    <b-container>
        <b-card no-body>
            <b-card-header>
                <span class="h4">Transaction</span>
                <b-badge class="ml-3"
                    v-if="isDynamicFeeTx"
                    variant="secondary">
                    Type Dynamic Fee
                </b-badge>
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
                    </template>
                    <hr />
                    <template v-if="!!receipt">
                        <b-row>
                            <b-col lg="2">
                                <strong>Gas Used</strong>
                            </b-col>
                            <b-col lg="10">
                                {{receipt.gasUsed | locale}} / {{tx.gas | locale}}
                            </b-col>
                        </b-row>
                        <hr/>
                        <b-row>
                            <b-col lg="2">
                                <strong>Gas Price</strong>
                            </b-col>
                            <b-col lg="10">
                                <Fee>{{effectiveGasPrice}}</Fee>
                                <sup v-if="!isDynamicFeeTx" class="ml-2">price coef {{tx.gasPriceCoef}}</sup>
                            </b-col>
                        </b-row>
                        <hr />
                    </template>
                    <template v-if="isDynamicFeeTx || isFeeMarketActivated">
                        <b-row class="mt-2">
                            <b-col lg="2">
                                <strong>Gas Fees</strong>
                            </b-col>
                            <b-col lg="10">
                                <span v-if="!!receipt" class="text-secondary">Base:</span>
                                <Fee v-if="!!receipt">{{baseFeePerGas}}</Fee>
                                <span v-if="!!receipt" class="text-secondary mx-2">|</span>
                                <span class="text-secondary">Max:</span>
                                <Fee>{{maxFeePerGas}}</Fee>
                                <span class="text-secondary mx-2">|</span>
                                <span class="text-secondary">MaxPriority:</span>
                                <Fee>{{maxPriorityFeePerGas}}</Fee>
                            </b-col>
                        </b-row>
                        <hr />
                    </template>
                    <template v-if="!!receipt">
                        <b-row>
                            <b-col lg="2">
                                <strong>Fee Paid</strong>
                            </b-col>
                            <b-col lg="10">
                                <Amount
                                    sym="VTHO"
                                    :dec="null"
                                    class="mr-2"
                                >{{receipt.paid}}</Amount>by
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
                        <hr />
                    </template>
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
import { genesisIdToGalacticaNumber } from '@/utils'

type Transaction = {
    id: string
    type: 0|81
    chainTag: number
    blockRef: string
    expiration: number
    clauses: Array<{
        to: string | null
        value: string
        data: string
    }>
    gasPriceCoef?: number
    maxPriorityFeePerGas?: string
    maxFeePerGas?: string
    gas: number
    origin: string
    delegator?: string | null
    nonce: string
    dependsOn: string | null
    size: number
    meta: {
        blockID: string
        blockNumber: number
        blockTimestamp: number
    }
}

export default Vue.extend({
    data: () => {
        return {
            error: null as Error | null,
            tx: null as Transaction | null,
            receipt: null as Connex.Thor.Transaction.Receipt | null,
            id: '',
            isFeeMarketActivated: false,
            baseFeePerGas: '0',
            maxFeePerGas: '0',
            maxPriorityFeePerGas: '0',
            effectiveGasPrice: '0'
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
        vip191() { return !!(this.tx as any).delegator },
        isDynamicFeeTx() { return this.tx && this.tx.type === 81 },
    },
    methods: {
        async reload() {
            this.error = null
            this.tx = null
            this.receipt = null
            this.isFeeMarketActivated = false
            this.baseFeePerGas = '0'
            this.maxFeePerGas = '0'
            this.maxPriorityFeePerGas = '0'
            this.effectiveGasPrice = '0'

            try {
                const tv = this.$connex.thor.transaction(this.id).allowPending()
                const [tx, receipt] = await Promise.all([
                    tv.get(),
                    tv.getReceipt()
                ])

                if (tx) { this.tx = tx as Transaction } else { this.error = new Error('not found') }
                if (receipt) { this.receipt = receipt }

                await this.updateIsFeeMarketActivated()
                await this.updateFeeParams()
            } catch (err) {
                this.error = err as Error
            }
        },
        async updateIsFeeMarketActivated() {
            if (!this.receipt) { 
                this.isFeeMarketActivated = false
                return
            }

            if (!!this.receipt.type) { 
                this.isFeeMarketActivated = true
                return
            }

            const num = genesisIdToGalacticaNumber(this.$connex.thor.genesis.id)
            if (num !== -1) {
                this.isFeeMarketActivated = this.receipt.meta.blockNumber >= num
                return
            }

            // if it's not the well known genesis, check the block
            const block = await this.$connex.thor.block(this.receipt.meta.blockID).get()
            if (block) {
                this.isFeeMarketActivated = !!block.baseFeePerGas
                return
            }
        },
        async updateFeeParams() {
            if (this.isDynamicFeeTx) {
                this.maxPriorityFeePerGas = this.tx!.maxPriorityFeePerGas as string
                this.maxFeePerGas = this.tx!.maxFeePerGas as string

                if (this.receipt) {
                    const effectiveGasPrice = new BigNumber(this.receipt!.paid).div(this.receipt!.gasUsed)
                    const effectivePriorityFee = new BigNumber(this.receipt!.reward).div(this.receipt!.gasUsed)

                    this.effectiveGasPrice = effectiveGasPrice.toString()
                    this.baseFeePerGas = effectiveGasPrice.minus(effectivePriorityFee).toString()
                }
            } else {
                // legacy tx
                if (this.receipt) {
                    this.effectiveGasPrice = new BigNumber(this.receipt!.paid).div(this.receipt!.gasUsed).toString()
                    if (this.isFeeMarketActivated) {
                        const effectivePriorityFee = new BigNumber(this.receipt!.reward).div(this.receipt!.gasUsed)
                        const blk = await this.$connex.thor.block(this.receipt!.meta.blockID).get()

                        this.baseFeePerGas = blk!.baseFeePerGas as string
                        this.maxPriorityFeePerGas = new BigNumber(this.baseFeePerGas).plus(effectivePriorityFee).toString()
                        this.maxFeePerGas = this.maxPriorityFeePerGas
                    }
                }
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
                await this.updateIsFeeMarketActivated()
                await this.updateFeeParams()
            } catch { }
        }
    }
})


</script>
