<template>
    <span
        :title="amount +' VTHO'"
        class="text-monospace"
    >
        {{pretty}}
        <span
            class="text-secondary small ml-1"
            style="white-space: pre"
        >Gwei</span>
    </span>
</template>
<script lang="ts">
import Vue from 'vue'
import BigNumber from 'bignumber.js'

export default Vue.extend({
    props: {},
    data: () => {
        return { content: '' }
    },
    computed: {
        amount(): string {
            const bn = new BigNumber(this.content).div('1' + '0'.repeat(18))
            return bn.toFormat()
        },
        pretty(): string {
            const bn = new BigNumber(this.content).div('1' + '0'.repeat(9))
            return bn.toFormat(0)
        },
    },
    methods: {
        extractSlot() {
            const slot = (this.$slots.default || [])[0]
            this.content = slot ? (slot.text || '').trim() : ''
        }
    },
    created() {
        this.extractSlot()
    },
    beforeUpdate() {
        this.extractSlot()
    }
})
</script>
