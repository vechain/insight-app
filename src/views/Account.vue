<template>
    <div>
        <div class="my-2">
            <b>Account</b>
            {{displayAddress}}
        </div>
        <div class="card">
            <div v-if="!!account" class="columns card-body"></div>
            <Loading v-else :error="error"/>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { cry } from 'thor-devkit'

@Component
export default class Account extends Vue {
    address = ''
    account: Connex.Thor.Account | null = null
    error: Error | null = null

    get displayAddress() {
        return cry.toChecksumAddress(this.address)
    }

    @Watch('$route')
    routed() {
        if (this.$route.name === 'account') {
            this.address = this.$route.params.address
        }
    }

    @Watch('address')
    async query() {
        this.error = null
        this.account = null
        try{
            this.account = await connex.thor.account(this.address).get()
        }catch(err){
            this.error = err
        }
    }

    created() {
        this.routed()
        this.query()
    }
}
</script>
