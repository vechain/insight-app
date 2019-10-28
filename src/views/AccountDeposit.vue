<template>
    <div style="max-width:30rem;" class="mx-auto">
        <p>Send VET and VTHO to this account</p>
        <hr>
        <template v-if="!$isConnexShuffle">
        <b-input-group>
            <b-input-group-prepend>
                <b-input-group-text style="width:4rem" class="small">VET</b-input-group-text>
            </b-input-group-prepend>
            <b-form-input type="number" v-model="vet.value"/>
        </b-input-group>
        <p class="small text-muted" v-if="vet.wei && price">≈ ${{vet.wei | usd(price.vet)}}</p>
        <p class="small text-muted" v-else-if="vet.wei">&nbsp;</p>
        <p class="small text-danger" v-else>Invalid amount</p>
        <b-input-group class="mt-3">
            <b-input-group-prepend>
                <b-input-group-text style="width:4rem" class="small">VTHO</b-input-group-text>
            </b-input-group-prepend>
            <b-form-input type="number" v-model="vtho.value"/>
        </b-input-group>
        <p class="small text-muted" v-if="vtho.wei && price">≈ ${{vtho.wei | usd(price.vtho)}}</p>
        <p class="small text-muted" v-else-if="vtho.wei">&nbsp;</p>
        <p class="small text-danger" v-else>Invalid amount</p>
        <hr>
        <div class="text-right">
            <span class="small text-danger text-right mr-3">{{error ? error.message : ''}}</span>
            <b-button
                variant="success"
                @click="send"
                :disabled="(!vet.wei || vet.wei==='0') && (!vtho.wei || vtho.wei==='0')"
            >Send</b-button>
        </div>
        <b-modal ok-only ref="popover">
            <p>Successfully sent!</p>
        </b-modal>
        </template>
        <div v-else>
            <i>Unsupported in shuffle mode</i>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
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

@Component({ name: 'AccountDeposit' })
export default class AccountDeposit extends Vue {
    private address = ''
    private vet = new Value()
    private vtho = new Value()

    private error = null as Error | null

    get price() { return this.$store.state.price }


    private created() {
        this.address = this.$route.params.address.toLowerCase()
    }

    private async send() {
        this.error = null

        try {
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
                await this.$connex.vendor.sign('tx')
                    .request(message)

                this.vet.value = ''
                this.vtho.value = ''
                this.error = null;

                (this.$refs.popover as any).show()
            }
        } catch (err) {
            this.error = err
        }
    }
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

