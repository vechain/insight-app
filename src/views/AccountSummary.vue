<template>
    <div v-if="account.entity">
        <div>
            <b-badge
                :variant="account.entity.hasCode? 'success':'secondary'"
            >{{account.entity.hasCode? 'Contract': 'Regular'}}</b-badge>
        </div>
        <hr>
        <b-row>
            <b-col lg="2">
                <strong>Balance</strong>
            </b-col>
            <b-col lg="4" class="text-right">
                <Amount sym="VET ">{{account.entity.balance}}</Amount>
            </b-col>
            <b-col
                lg="4"
                v-if="price"
                class="text-monospace text-muted small"
            >≈ ${{account.entity.balance | usd(price.vet)}}</b-col>
        </b-row>
        <hr>
        <b-row>
            <b-col lg="2">
                <strong>Energy</strong>
            </b-col>
            <b-col lg="4" class="text-right">
                <Amount sym="VTHO">{{account.entity.energy}}</Amount>
            </b-col>
            <b-col
                lg="4"
                v-if="price"
                class="text-monospace text-muted small"
            >≈ ${{account.entity.energy | usd(price.vtho)}}</b-col>
        </b-row>
        <template v-if="account.entity.hasCode">
            <hr>
            <b-row>
                <b-col lg="3">
                    <strong>Runtime Bytecode</strong>
                </b-col>
                <b-col lg="9">
                    <b-textarea
                        v-if="code.entity"
                        class="text-monospace bg-light"
                        size="sm"
                        readonly
                        :value="code.entity.code"
                    />
                    <template v-else>
                        <b-button size="sm" @click="loadCode" :disabled="code.loading">
                            View Code
                            <b-spinner v-if="code.loading" type="grow" small/>
                        </b-button>
                        <span v-if="code.error" class="text-warning ml-3">code.error.message</span>
                    </template>
                </b-col>
            </b-row>
        </template>
        <hr>
        <b-row class="small">
            <b-col lg="2">
                <em>Master</em>
            </b-col>
            <b-col lg="4" v-if="master">
                <span v-if="master.error" class="text-warning">{{master.error}}</span>
                <AccountLink v-else :address="master.addr" abbr/>
            </b-col>
            <b-col lg="2" class="border-left">
                <em>Sponsor</em>
            </b-col>
            <b-col lg="4" v-if="sponsor">
                <span v-if="sponsor.error" class="text-warning">{{sponsor.error}}</span>
                <AccountLink v-else :address="sponsor.addr" abbr/>
            </b-col>
        </b-row>
    </div>
    <div v-else>
        <div v-if="account.error" class="text-center">
            <p>Oops</p>
            <p class="text-warning">Error: {{account.error.message}}</p>
            <b-button size="sm" @click="reload">Reload</b-button>
        </div>
        <Loading v-else class="my-3"/>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class AccountSummary extends Vue {
    get address() { return this.$route.params.address.toLowerCase() }
    get price() { return this.$store.state.price }
    private account = {
        entity: null as Connex.Thor.Account | null,
        error: null as Error | null
    }

    private code = {
        entity: null as Connex.Thor.Code | null,
        error: null as Error | null,
        loading: false
    }
    private sponsor = {
        addr: '',
        error: null as Error | null,
    }
    private master = {
        addr: '',
        error: null as Error | null,
    }

    @Watch('$store.state.chainStatus')
    private async reload() {
        this.loadBalance()
        this.loadMaster()
        this.loadSponsor()
    }
    private async loadBalance() {
        const acc = connex.thor.account(this.address)
        try {
            this.account.entity = await acc.get()
            this.account.error = null
        } catch (err) {
            this.account.error = err
        }
    }
    private async loadMaster() {
        try {
            const out = await connex.thor
                .account(prototypeAddress)
                .method(masterJsonABI)
                .cache([this.address])
                .call(this.address)

            const addr = out.decoded![0]
            this.master.addr = addr === zeroAddress ? 'N/A' : addr
            this.master.error = null
        } catch (err) {
            this.master.error = err
        }
    }
    private async loadSponsor() {
        try {
            const out = await connex.thor
                .account(prototypeAddress)
                .method(currentSponsorJsonABI)
                .cache([this.address])
                .call(this.address)

            const addr = out.decoded![0]
            this.sponsor.addr = addr === zeroAddress ? 'N/A' : addr
            this.sponsor.error = null
        } catch (err) {
            this.sponsor.error = err
        }
    }

    private async loadCode() {
        try {
            this.code.loading = true
            this.code.entity = await connex.thor.account(this.address).getCode()
            this.code.error = null
        } catch (err) {
            this.code.error = err
        } finally {
            this.code.loading = false
        }
    }
    private created() {
        this.reload()
    }
}

const prototypeAddress = '0x000000000000000000000050726f746f74797065'
const zeroAddress = '0x0000000000000000000000000000000000000000'

const masterJsonABI = {
    constant: true,
    inputs: [
        {
            name: '_self',
            type: 'address'
        }
    ],
    name: 'master',
    outputs: [
        {
            name: '',
            type: 'address'
        }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
}

const currentSponsorJsonABI = {
    constant: true,
    inputs: [
        {
            name: '_self',
            type: 'address'
        }
    ],
    name: 'currentSponsor',
    outputs: [
        {
            name: '',
            type: 'address'
        }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
}
</script>

