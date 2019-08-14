<template>
    <b-button v-show="!!href" size="sm" variant="primary" :href="href" target="_blank">
        <div class="d-flex align-items-center">
            <SvgIcon name="eye" class="mr-1" />VeForge
        </div>
    </b-button>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { veForgeBaseUrl } from '../utils'

@Component
export default class VeForgeLink extends Vue {
    @Prop(String) private type!: 'block' | 'tx' | 'acc' | ''
    @Prop(String) private arg!: string

    get href() {
        const baseUrl = veForgeBaseUrl()
        if (!baseUrl) {
            return ''
        }

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
