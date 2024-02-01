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
import * as namehash from '@ensdomains/eth-ens-namehash'

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
                    const node = namehash.hash(str)

                    const { decoded: { resolverAddress } }  = await this.$connex.thor
                        .account(vetRegistryAddress)
                        .method(resolverJsonAbi)
                        .call(node)

                    if (resolverAddress === '0x0000000000000000000000000000000000000000') {
                        throw new Error('Name not found')
                    }

                    const { decoded: { address } } = await this.$connex.thor
                        .account(resolverAddress)
                        .method(addrJsonAbi)
                        .call(node)

                    return this.$router.replace({ name: 'account', params: { address: address } })
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

const vetRegistryAddress = '0xa9231da8BF8D10e2df3f6E03Dd5449caD600129b'
const resolverJsonAbi = {
    "inputs": [
        {
            "internalType": "bytes32",
            "name": "node",
            "type": "bytes32"
        }
    ],
    "name": "resolver",
    "outputs": [
        {
            "internalType": "address",
            "name": "resolverAddress",
            "type": "address"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}

const addrJsonAbi = {
    "inputs": [
        {
            "internalType": "bytes32",
            "name": "node",
            "type": "bytes32"
        }
    ],
    "name": "addr",
    "outputs": [
        {
            "internalType": "address payable",
            "name": "address",
            "type": "address"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}
</script>