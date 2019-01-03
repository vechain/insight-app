<template>
    <div>
        <div>
            <span class="h5 mr-2">Account</span>
            <template v-if="!!account">
                <span class="text-mono">{{address | checksum}}</span>
                <VeForgeLink btn type="acc" :arg="address" class="ml-2"/>
            </template>
        </div>
        <div
            v-if="!!account"
            class="label my-2 caption text-bold"
            :class="{'label-primary': account.hasCode}"
        >{{account.hasCode? 'Contract': 'Regular'}}</div>
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

    @Watch('$store.state.chainStatus')
    async reload() {
        try {
            const acc = await connex.thor.account(this.address).get()
            this.account = acc
        } catch (err) {
            this.error = err
        }
    }

    created() {
        this.address = this.$route.params.address
        this.reload()
    }
}
</script>
