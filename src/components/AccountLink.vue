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
        </span>
        <router-link
            class="text-monospace text-truncate"
            v-else
            :to="{ name: 'account', params: { address: address, net: $net } }"
        >
            <template v-if="abbr">{{ address | abbr }}</template>
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
    }
})
</script>
