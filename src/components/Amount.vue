<template>
    <span :title="amount +' '+ sym" class="text-monospace">
        {{noPretty? amount: pretty}}
        <span
            class="text-secondary small ml-1"
            style="white-space: pre"
        >{{sym}}</span>
    </span>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'

@Component
export default class Amount extends Vue {
    @Prop(String) private sym !: string
    @Prop({ type: Number, default: 2 }) private dec !: number
    @Prop(Boolean) private noPretty!: boolean
    private content = ''

    get pretty() {
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
    get amount() {
        return new BigNumber(this.content).div('1' + '0'.repeat(18)).toFormat()
    }

    private created() {
        this.extractSlot()
    }
    private beforeUpdate() {
        this.extractSlot()
    }

    private extractSlot() {
        const slot = (this.$slots.default || [])[0]
        this.content = slot ? (slot.text || '').trim() : ''
    }
}
</script>

