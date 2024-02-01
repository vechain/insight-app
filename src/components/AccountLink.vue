<template>
    <div
        v-if="isValid"
        class="d-inline-flex align-items-center mw-100"
    >
        <Ident
            v-if="icon"
            class="mr-2 flex-shrink-0"
            :value="address"
            style="width: 1.4em; height: 1em; border-radius: 0.2em"
        />
        <span
            v-if="noLink"
            class="text-monospace text-truncate"
        >
            <template v-if="abbr">{{ address | abbr }}</template>
            <template v-else>{{ address | checksum }}</template>
            <template v-if="vetName"> ({{ vetName }})</template>
        </span>
        <router-link
            class="text-monospace text-truncate"
            v-else
            :to="{ name: 'account', params: { address: address, net: $net } }"
        >
            <template v-if="abbr">{{ vetName || address | abbr }}</template>
            <template v-else>{{ address | checksum }}</template>
        </router-link>
    </div>
    <span
        v-else
        class="text-truncate"
    >{{ this.address }}</span>
</template>
<script lang="ts">
import Vue from "vue"
import { address } from "thor-devkit"
import { genesisIdToNetwork } from '../utils'
import * as namehash from '@ensdomains/eth-ens-namehash'

export default Vue.extend({
    props: {
        address: String,
        abbr: Boolean,
        icon: Boolean,
        noLink: Boolean
    },
    computed: {
        isValid(): boolean {
            return address.test(this.address);
        }
    },
    asyncComputed: {
        async vetName(): Promise<string | null> {
            if (genesisIdToNetwork(this.$connex.thor.genesis.id) !== 'main') {
                return null
            }

            try {               
                const node = namehash.hash(`${this.address.slice(2).toLowerCase()}.addr.reverse`)

                const { decoded: { resolverAddress } }  = await this.$connex.thor
                    .account(vetRegistryAddress)
                    .method(resolverJsonAbi)
                    .call(node)

                if (resolverAddress === '0x0000000000000000000000000000000000000000') {
                    return null
                }

                const { decoded: { name } } = await this.$connex.thor
                    .account(resolverAddress)
                    .method(nameJsonAbi)
                    .call(node)

                return name
            } catch {
                return null
            }
        }
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

const nameJsonAbi = {
    inputs: [
    {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
    },
    ],
    name: "name",
    outputs: [
    {
        internalType: "string",
        name: "name",
        type: "string",
    },
    ],
    stateMutability: "view",
    type: "function",
}
</script>
