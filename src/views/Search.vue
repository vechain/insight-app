<template>
    <div class="my-5 container">
        <div
            v-if="error"
            class="text-center"
        >
            <h3>Oops</h3>
            <p class="text-danger">{{error.message}}</p>
            <b-button
                variant="primary"
                @click="reload"
            >Reload</b-button>
        </div>
        <Loading v-else />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { genesisIdToNetwork } from '../utils'
import { resolveAddressByName } from '@/resolver'

export default Vue.extend({
    data: () => {
        return {
            error: null as Error | null
        }
    },
    methods: {
        async reload() {
            this.error = null
            await this.$nextTick()
            const str = ((this.$route.query.q as string) || '').trim()
            if (!str) {
                return this.$router.replace({ name: 'home' })
            }

            if (/^0x[0-9a-f]{40}$/i.test(str)) {
                // address
                return this.$router.replace({ name: 'account', params: { address: str } })
            } else if (/^0x[0-9-a-f]{64}$/i.test(str)) {
                // bytes32
                try {
                    const block = await this.$connex.thor.block(str).get()
                    if (block) {
                        return this.$router.replace({ name: 'block', params: { id: block.id } })
                    }
                } catch (err) {
                    this.error = err as Error
                }
                this.error = null
                try {
                    const tx = await this.$connex.thor.transaction(str).allowPending().get()
                    if (tx) {
                        return this.$router.replace({ name: 'tx', params: { id: tx.id } })
                    }
                } catch (err) {
                    this.error = err as Error
                }
            } else if (/^[0-9]+$/.test(str)) {
                const num = parseInt(str, 10)
                if (num < 2 ** 32) {
                    try {
                        const block = await this.$connex.thor.block(num).get()
                        if (block) {
                            return this.$router.replace({ name: 'block', params: { id: block.id } })
                        }
                    } catch (err) {
                        this.error = err as Error
                    }
                }
            } else if (/\./.test(str) && genesisIdToNetwork(this.$connex.thor.genesis.id) === 'main') {
                const address = await resolveAddressByName(str, this.$connex)

                if (address && address !== '0x0000000000000000000000000000000000000000') {
                    return this.$router.replace({ name: 'account', params: { address: address } })
                }
                this.error = new Error('Name not found')
            }
            if (!this.error) {
                this.error = new Error(`No result for '${str}'`)
            }
        }
    },
    created() {
        this.reload()
    }
})

</script>