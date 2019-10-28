<template>
    <span>
        <b-btn v-show="!copied" @click="copy" class="btn-sm btn-light py-0 border-0">
            <SvgIcon name="clippy" />
        </b-btn>
        <span v-show="copied" class="small">Copied</span>
    </span>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class Copy extends Vue {
    @Prop(String) private value!: string
    private copied = false
    private async copy() {
        const value = this.value
        if (value) {
            try {
                await this.$copyText(value)
                this.copied = true
                setTimeout(() => { this.copied = false }, 2000)
                // tslint:disable-next-line:no-empty
            } catch (err) {
            }
        }
    }
}
</script>
