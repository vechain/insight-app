<template>
    <a v-bind="$attrs" v-on="$listeners" :href="href" :style="styleObject" :class="classes">
        <slot/>
        <template v-if="btn">
            <i class="icon icon-search"/>
            VeForge
        </template>
    </a>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { isMainnet } from '../utils'

@Component
export default class VeForgeLink extends Vue {
    @Prop(String) type!: 'block' | 'tx' | 'acc' | ''
    @Prop(String) arg!: string
    @Prop(Boolean) btn!: boolean

    get href() {
        const baseUrl = isMainnet() ? 'https://explore.veforge.com/' : 'https://testnet.veforge.com/'
        const path =
            this.type === 'block' ? 'blocks/' :
                this.type === 'tx' ? 'transactions/' :
                    this.type === 'acc' ? 'accounts/' : ''

        if (path) {
            return new URL(path + this.arg, baseUrl).href
        }
        return baseUrl
    }
    get styleObject() {
        return this.btn ? {
            height: 'auto',
            'line-height': 'normal',
            'vertical-align': 'baseline'
        } : {}
    }
    get classes() {
        return this.btn ? 'btn btn-sm btn-primary my-0' : ''
    }
}
</script>
