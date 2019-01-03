<template>
    <div>
        <div>
            <span class="h5 mr-2">Account</span>
            <template v-if="!!account">
                <span class="text-mono">{{address | checksum}}</span>
                <VeForgeLink btn type="acc" :arg="address" class="ml-2"/>
            </template>
        </div>
        <div>
            <span
                v-if="!!account"
                class="label my-2 caption text-bold"
                :class="{'label-primary': account.hasCode}"
            >{{account.hasCode? 'Contract': 'Regular'}}</span>
            <span
                v-show="!depositFormOpen"
                class="btn btn-sm btn-link ml-2"
                style="line-height: normal;height:auto;"
                @click="depositFormOpen=true"
            >
                <b>+</b>
                Deposit
            </span>
        </div>
        <div v-if="depositFormOpen" class="card col-6">
            <div class="card-header">
                <b>Deposit</b>
                <span class="ml-2 text-error">{{depositError}}</span>
            </div>
            <div class="card-body form-group">
                <label class="form-label caption">
                    VET
                    <span class="ml-2 text-error">{{vetAmountError}}</span>
                </label>
                <input
                    v-model="vetAmount"
                    class="form-input input-sm"
                    type="number"
                    step="any"
                    placeholder="VET amount"
                    @focus="vetAmountFocus"
                >
                <label class="form-label caption">
                    VTHO
                    <span class="ml-2 text-error">{{vthoAmountError}}</span>
                </label>
                <input
                    v-model="vthoAmount"
                    class="form-input input-sm"
                    type="number"
                    step="any"
                    placeholder="VTHO amount"
                    @focus="vthoAmountFocus"
                >
                <div class="text-right mt-2">
                    <button class="btn btn-sm btn-link" @click="depositFormOpen=false">Cancel</button>
                    <button class="btn btn-sm btn-primary ml-2" @click="confirmDeposit">Confirm</button>
                </div>
            </div>
        </div>
        <div v-if="!!account" class="card my-2">
            <div class="columns card-body is-align-center">
                <div class="field-name">Balance</div>
                <div class="field-value">
                    <span class="token-amount">{{account.balance |amount}}</span>
                    <span class="token-symbol">vet</span>
                </div>
                <div class="field-name">Energy</div>
                <div class="field-value">
                    <span class="token-amount">{{account.energy |amount}}</span>
                    <span class="token-symbol">vtho</span>
                </div>
            </div>
        </div>
        <div v-else class="card my-2">
            <div class="card-body">
                <Loading :error="error"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class Account extends Vue {
    account: Connex.Thor.Account | null = null
    error: Error | null = null

    address = ''
    depositFormOpen = false

    vetAmount = ''
    vthoAmount = ''

    vetAmountError = ''
    vthoAmountError = ''
    depositError = ''

    @Watch('$store.state.chainStatus')
    async reload() {
        try {
            const acc = await connex.thor.account(this.address).get()
            this.account = acc
        } catch (err) {
            this.error = err
        }
    }

    vetAmountFocus() {
        this.depositError = ''
        this.vetAmountError = ''
    }

    vthoAmountFocus() {
        this.depositError = ''
        this.vthoAmountError = ''
    }

    @Watch('depositFormOpen')
    depositFormOpenChanged() {
        this.vetAmount = ''
        this.vthoAmount = ''
        this.vetAmountError = ''
        this.vthoAmountError = ''
        this.depositError = ''
    }

    created() {
        this.address = this.$route.params.address
        this.reload()
    }

    async confirmDeposit() {
        this.vetAmountError = ''
        this.vthoAmountError = ''
        this.depositError = ''
        try {
            const message: Connex.Vendor.SigningService.TxMessage = []
            const vet = toWei(this.vetAmount)
            const vtho = toWei(this.vthoAmount)
            if (!/^[0-9]+$/.test(vet)) {
                this.vetAmountError = 'Invalid amount'
                return
            }
            if (!/^[0-9]+$/.test(vtho)) {
                this.vthoAmountError = 'Invalid amount'
            }
            if (vet !== '0') {
                message.push({
                    to: this.address,
                    value: vet,
                    data: '0x'
                })
            }
            if (vtho !== '0') {
                const clause = connex.thor
                    .account(energyContractAddress)
                    .method(energyTransferJsonABI)
                    .asClause(this.address, vtho)
                message.push({
                    ...clause,
                    comment: `transfer ${this.vthoAmount} VTHO`
                })
            }
            if (message.length > 0) {
                await connex.vendor.sign('tx')
                    .request(message)
                this.depositFormOpen = false
            }
        } catch (err) {
            this.depositError = err.message
        }
    }
}

import BigNumber from 'bignumber.js'
const e18 = new BigNumber('1' + '0'.repeat(18))
function toWei(amount: string) {
    return new BigNumber(amount || 0)
        .times(e18)
        .integerValue(0)
        .toString(10)
}

const energyContractAddress = '0x0000000000000000000000000000456E65726779'
const energyTransferJsonABI = {
    "constant": false,
    "inputs": [{
        "name": "_to",
        "type": "address"
    }, {
        "name": "_amount",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}

</script>
