<template>
    <div
        style="max-width:30rem;"
        class="mx-auto"
    >
        <p>Send VET and VTHO to this account</p>
        <hr>
        <b-input-group>
            <b-input-group-prepend>
                <b-input-group-text
                    style="width:4rem"
                    class="small"
                >VET</b-input-group-text>
            </b-input-group-prepend>
            <b-form-input
                type="number"
                v-model="vet.value"
            />
        </b-input-group>
        <p
            class="small text-muted"
            v-if="vet.wei && price"
        >≈ ${{vet.wei | usd(price.vet)}}</p>
        <p
            class="small text-muted"
            v-else-if="vet.wei"
        >&nbsp;</p>
        <p
            class="small text-danger"
            v-else
        >Invalid amount</p>
        <b-input-group class="mt-3">
            <b-input-group-prepend>
                <b-input-group-text
                    style="width:4rem"
                    class="small"
                >VTHO</b-input-group-text>
            </b-input-group-prepend>
            <b-form-input
                type="number"
                v-model="vtho.value"
            />
        </b-input-group>
        <p
            class="small text-muted"
            v-if="vtho.wei && price"
        >≈ ${{vtho.wei | usd(price.vtho)}}</p>
        <p
            class="small text-muted"
            v-else-if="vtho.wei"
        >&nbsp;</p>
        <p
            class="small text-danger"
            v-else
        >Invalid amount</p>
        <hr>
        <div class="text-right">
            <b-button
                variant="success"
                @click="send"
                :disabled="(!vet.wei || vet.wei==='0') && (!vtho.wei || vtho.wei==='0')"
            >Send</b-button>
        </div>
        <b-modal
            hide-header
            hide-footer
            v-model="showProgress"
        >
            <div class="text-center p-1 text-break">
                <div v-if="!!session.result">
                    <div>Successfully sent!</div>
                    <span>
                        txid: <router-link :to="{name: 'tx', params:{id: session.result.txid, net:$net}}">{{session.result.txid}}</router-link>
                    </span>
                </div>
                <div v-else-if="!!session.error">
                    <div>Error occurred</div>
                    <div class="text-danger">{{session.error.message}}</div>
                </div>
                <div v-else>
                    <b-spinner />
                    <div v-if="session.accepted">
                        Accepted, processing...
                    </div>
                    <div v-else>
                        Sending request...
                    </div>
                </div>
            </div>
        </b-modal>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import BigNumber from 'bignumber.js'

const e18 = new BigNumber('1' + '0'.repeat(18))

class Value {
    public value = ''
    get wei() {
        const str = new BigNumber(this.value || 0)
            .times(e18)
            .integerValue(0)
            .toString(10)

        if (/^[0-9]+$/.test(str)) {
            return str
        }
        return null
    }
}

export default Vue.extend({
    data: () => {
        const session: {
            accepted: boolean
            error: Error | null
            result: Connex.Vendor.TxResponse | null
        } = { accepted: false, error: null, result: null }
        return {
            address: '',
            vet: new Value(),
            vtho: new Value,
            showProgress: false,
            session
        }
    },
    computed: {
        price() { return this.$state.price }
    },
    methods: {
        async send() {
            if (!this.vet.wei || !this.vtho.wei) {
                return
            }

            const message: Connex.Vendor.TxMessage = []
            if (this.vet.wei !== '0') {
                message.push({
                    to: this.address,
                    value: this.vet.wei,
                    data: '0x'
                })
            }
            if (this.vtho.wei !== '0') {
                const clause = this.$connex.thor
                    .account(energyContractAddress)
                    .method(energyTransferJsonABI)
                    .asClause(this.address, this.vtho.wei)
                message.push({
                    ...clause,
                    comment: `Transfer ${this.vtho.value} VTHO`
                })
            }
            if (message.length > 0) {
                this.showProgress = true
                this.session = { accepted: false, error: null, result: null }
                const session = this.session
                try {
                    session.result = await this.$connex.vendor.sign('tx', message)
                        .accepted(() => {
                            if (session === this.session) {
                                this.showProgress = true
                            }
                            session.accepted = true
                        })
                        .request()

                    if (session === this.session && this.showProgress) {
                        this.vet.value = ''
                        this.vtho.value = ''
                    }
                } catch (err) {
                    session.error = err as Error
                } finally {
                    if (session === this.session) {
                        this.showProgress = true
                    }
                }
            }

        }
    },
    created() {
        this.address = this.$route.params.address.toLowerCase()
    }
})

const energyContractAddress = '0x0000000000000000000000000000456E65726779'
const energyTransferJsonABI = {
    constant: false,
    inputs: [{
        name: '_to',
        type: 'address'
    }, {
        name: '_amount',
        type: 'uint256'
    }],
    name: 'transfer',
    outputs: [{
        name: 'success',
        type: 'bool'
    }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
}
</script>

