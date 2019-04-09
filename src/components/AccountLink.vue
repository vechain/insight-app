<template>
    <div
        v-if="isValid"
        class="d-inline-flex align-items-center text-break"
        :title="owned?'Owned Account':''"
    >
        <Ident
            v-if="icon"
            class="mr-2"
            :value="address"
            style="width:1.5em;height:1em;border-radius:0.2em"
        />
        <span v-if="noLink" class="text-monospace">
            <template v-if="abbr">{{address | abbr}}</template>
            <template v-else>{{address | checksum}}</template>
        </span>
        <router-link v-else class="text-monospace" :to="{name:'account',params:{address:address}}">
            <template v-if="abbr">{{address | abbr}}</template>
            <template v-else>{{address | checksum}}</template>
        </router-link>
        <SvgIcon v-if="owned" name="key" class="ml-1"/>
    </div>
    <span v-else>{{this.address}}</span>
</template>
<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import { isAddress } from 'thor-devkit/es6/cry'

@Component
export default class AccountLink extends Vue {
    @Prop(String) private address!: string
    @Prop(Boolean) private abbr!: boolean
    @Prop(Boolean) private icon!: boolean
    @Prop(Boolean) private noLink!: boolean

    get owned() { return connex.vendor.owned && connex.vendor.owned(this.address) }
    get isValid() { return isAddress(this.address) }
}
</script>

