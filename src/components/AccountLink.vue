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
            <template v-if="abbr">{{ (vetName || address) | abbr }}</template>
            <template v-else>{{ (vetName || address | checksum) }}</template>
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

export default Vue.extend({
    props: {
        address: String,
        abbr: Boolean,
        icon: Boolean,
        noLink: Boolean
    },
    asyncComputed: {
        async vetName(): Promise<string | null> {
            if (genesisIdToNetwork(this.$connex.thor.genesis.id) !== 'main') {
                return null
            }
            try {               
                const { decoded: { names } }  = await this.$connex.thor
                    .account(vetResolverUtilsAddress)
                    .method(getNamesJsonAbi)
                    .call([this.address])

                return names[0] || null
            } catch {
                return null
            }
        }
    },
    computed: {
        isValid(): boolean {
            return address.test(this.address);
        }
    }
})

const vetResolverUtilsAddress = '0xA11413086e163e41901bb81fdc5617c975Fa5a1A'
const getNamesJsonAbi = {
  "inputs": [
    {
      "internalType": "address[]",
      "name": "addresses",
      "type": "address[]"
    }
  ],
  "name": "getNames",
  "outputs": [
    {
      "internalType": "string[]",
      "name": "names",
      "type": "string[]"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}

</script>