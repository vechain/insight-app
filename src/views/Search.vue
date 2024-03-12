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
                try {
                    const { decoded: { addresses } }  = await this.$connex.thor
                        .account(vetResolverUtilsAddress)
                        .method(getAddressesJsonAbi)
                        .call([str])

                    if (!addresses[0] || addresses[0] === '0x0000000000000000000000000000000000000000') {
                        throw new Error('Name not found')
                    }

                    return this.$router.replace({ name: 'account', params: { address: addresses[0] } })
                } catch (err) {
                    this.error = new Error('Name not found')
                }
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

const vetResolverUtilsAddress = '0xA11413086e163e41901bb81fdc5617c975Fa5a1A'
const getAddressesJsonAbi = {
  "inputs": [
    {
      "internalType": "string[]",
      "name": "names",
      "type": "string[]"
    }
  ],
  "name": "getAddresses",
  "outputs": [
    {
      "internalType": "address[]",
      "name": "addresses",
      "type": "address[]"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}

</script>