<template>
    <div>
        <p>Send VET and VTHO to this account</p>
        <hr>
        <b-input-group>
            <b-input-group-prepend>
                <b-input-group-text style="width:4rem" class="small">VET</b-input-group-text>
            </b-input-group-prepend>
            <b-form-input type="number" v-model="vetAmount.value"/>
        </b-input-group>
        <p class="small text-danger">{{vetAmount.error || '&nbsp;'}}</p>
        <b-input-group class="mt-3">
            <b-input-group-prepend>
                <b-input-group-text style="width:4rem" class="small">VTHO</b-input-group-text>
            </b-input-group-prepend>
            <b-form-input type="number" v-model="vthoAmount.value"/>
        </b-input-group>
        <div class="small text-danger">{{vthoAmount.error || '&nbsp;'}}</div>

        <hr>
        <div class="text-right">
            <span class="small text-danger text-right mr-3">{{error ? error.message : ''}}</span>
            <b-button variant="primary" @click="send">Send</b-button>
        </div>
        <b-modal ok-only ref="popover">
            <p>Successfully sent!</p>
        </b-modal>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Deposit extends Vue {
    @Prop(String) private address!: string

    private vetAmount = {
        value: '',
        error: ''
    }
    private vthoAmount = {
        value: '',
        error: ''
    }

    private error = null as Error | null

    private async send() {
        this.vetAmount.error = ''
        this.vthoAmount.error = ''
        this.error = null

        try {
            const message: Connex.Vendor.SigningService.TxMessage = []
            const vet = toWei(this.vetAmount.value)
            const vtho = toWei(this.vthoAmount.value)
            if (!/^[0-9]+$/.test(vet)) {
                this.vetAmount.error = 'Invalid amount'
                return
            }
            if (!/^[0-9]+$/.test(vtho)) {
                this.vthoAmount.error = 'Invalid amount'
                return
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
                    comment: `Transfer ${this.vthoAmount.value} VTHO`
                })
            }
            if (message.length > 0) {
                await connex.vendor.sign('tx')
                    .request(message)

                this.vetAmount.value = ''
                this.vetAmount.error = ''

                this.vthoAmount.value = ''
                this.vthoAmount.error = ''
                this.error = null;

                (this.$refs.popover as any).show()
            }
        } catch (err) {
            this.error = err
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
