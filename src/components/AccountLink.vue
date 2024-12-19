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

            <!-- display the resolved domain name in no link mode(only used in account summary page) -->
            <span class="text-black-50 small" v-if="!!resolvedName"> {{ resolvedName }}</span>
        </span>
        <router-link
            class="text-monospace text-truncate"
            v-else
            :to="{ name: 'account', params: { address: address, net: $net } }"
        >
            <template v-if="resolvedName">{{ resolvedName }}</template>
            <template v-else-if="abbr">{{ address | abbr }}</template>
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
import { resolveDomainName } from '../resolver'

export default Vue.extend({
    props: {
        address: String,
        abbr: Boolean,
        icon: Boolean,
        noLink: Boolean
    },
    asyncComputed: {
        async resolvedName(): Promise<string | null> {
            if (genesisIdToNetwork(this.$connex.thor.genesis.id) !== 'main') {
                return null
            }
            return resolveDomainName(this.address, this.$connex)
        }
    },
    computed: {
        isValid(): boolean {
            return address.test(this.address);
        }
    }
})

</script>