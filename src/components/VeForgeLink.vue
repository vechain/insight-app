<template>
    <b-button size="sm" variant="primary" :href="href" target="_blank">
        <div class="d-flex align-items-center">
            <SvgIcon name="eye" class="mr-1"/>VeForge
        </div>
    </b-button>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { isMainnet } from '../utils'

@Component
export default class VeForgeLink extends Vue {
    @Prop(String) private type!: 'block' | 'tx' | 'acc' | ''
    @Prop(String) private arg!: string

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
}
</script>
