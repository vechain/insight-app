<template>
    <span
        :title="amount +' '+ sym"
        class="text-monospace"
    >
        {{noPretty? amount: pretty}}
        <span
            class="text-secondary small ml-1"
            style="white-space: pre"
        >{{sym}}</span>
    </span>
</template>
<script lang="ts">
import Vue from 'vue'
import BigNumber from 'bignumber.js'

export default Vue.extend({
    props: {
        sym: String,
        dec: { default: 2 },
        noPretty: Boolean
    },
    data: () => {
        return { content: '' }
    },
    computed: {
        amount(): string {
            return new BigNumber(this.content).div('1' + '0'.repeat(18)).toFormat()
        },
        pretty(): string {
            const bn = new BigNumber(this.content).div('1' + '0'.repeat(18))
            if (bn.gte(1000 ** 3)) {
                return bn.div(1000 ** 3).toFormat(this.dec) + 'b'
            } else if (bn.gte(1000 ** 2)) {
                return bn.div(1000 ** 2).toFormat(this.dec) + 'm'
            } else if (bn.gte(1000)) {
                return bn.div(1000).toFormat(this.dec) + 'k'
            }
            return bn.toFormat(this.dec)
        }
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
