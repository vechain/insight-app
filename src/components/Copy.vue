<template>
    <span>
        <b-btn
            v-show="!copied"
            @click="copy"
            class="btn-sm btn-light py-0 border-0"
        >
            <SvgIcon name="clippy" />
        </b-btn>
        <span
            v-show="copied"
            class="small"
        >Copied</span>
    </span>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        value: String
    },
    data: () => {
        return {
            copied: false
        }
    },
    methods: {
        async copy() {
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
})
</script>
