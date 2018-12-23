<template>
    <div>
        <div>
            <span class="h5 mr-2">Account</span>
            <span class="text-mono">{{address | checksum}}</span>
        </div>
        <div
            v-if="!!account && account.hasCode"
            class="label label-primary my-2 heading text-bold"
        >Contract</div>
        <div v-if="!!account" class="card my-2">
            <div class="columns card-body">
                <div class="column col-md-12 col-2 text-gray caption">Balance</div>
                <div class="column col-md-12 col-10">
                    {{account.balance |amount}}
                    <span class="heading">vet</span>
                </div>
                <div class="column col-md-12 col-2 text-gray caption">Energy</div>
                <div class="column col-md-12 col-10">
                    {{account.energy |amount}}
                    <span class="heading">vtho</span>
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
import { cry } from 'thor-devkit'

@Component
export default class Account extends Vue {
    account: Connex.Thor.Account | null = null
    error: Error | null = null

    get address() {
        return this.$route.params.address
    }

    @Watch('address')
    async reload() {
        this.account = null
        this.error = null

        const addr = this.address
        try {
            const acc = await connex.thor.account(addr).get()
            if (addr === this.$route.params.address) {
                this.account = acc
            }
        } catch (err) {
            if (addr === this.address) {
                this.error = err
            }
        }
    }

    created() {
        this.reload()
    }
}
</script>
