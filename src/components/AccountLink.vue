<template>
    <div
        v-if="isValid"
        class="d-inline-flex align-items-center mw-100"
        :title="owned?'Owned Account':''"
    >
        <Ident
            v-if="icon"
            class="mr-2 flex-shrink-0"
            :value="address"
            style="width:1.4em;height:1em;border-radius:0.2em"
        />
        <span v-if="noLink" class="text-monospace text-truncate">
            <template v-if="abbr">{{address | abbr}}</template>
            <template v-else>{{address | checksum}}</template>
        </span>
        <router-link
            class="text-monospace text-truncate"
            v-else
            :to="{name:'account',params:{address:address, net:$net}}"
        >
            <template v-if="abbr">{{address | abbr}}</template>
            <template v-else>{{address | checksum}}</template>
        </router-link>
        <SvgIcon v-if="owned" name="key" class="ml-1 flex-shrink-0" />
    </div>
    <span v-else class="text-truncate">{{this.address}}</span>
</template>
<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator'
import { address } from 'thor-devkit'

@Component
export default class AccountLink extends Vue {
    @Prop(String) private address!: string
    @Prop(Boolean) private abbr!: boolean
    @Prop(Boolean) private icon!: boolean
    @Prop(Boolean) private noLink!: boolean

    private owned = false

    get isValid() { return address.test(this.address) }

    private created() {
        this.addressChanged()
    }

    @Watch('address')
    private async addressChanged() {
        // const addr = this.address
        // if (cry.isAddress(addr)) {
        //     if (addr && this.$connex.vendor.owned) {
        //         const owned = await this.$connex.vendor.owned(addr)
        //         if (addr === this.address) {
        //             this.owned = owned
        //         }
        //     }
        // } else {
        //     this.owned = false
        // }
    }
}
</script>

