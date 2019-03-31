<template>
    <div v-if="owner" class="d-flex align-items-center">
        <SvgIcon
            style="transform: scale(1.4)"
            :name="isIn?'arrow-left':'arrow-right'"
            :class="isIn?'text-success':'text-danger'"
        />
        <AccountLink :address="opposite" abbr icon class="mx-4"/>
        <div style="width:11rem;" class="text-right">
            {{isIn?'+':'-'}}
            <Amount sym="VET">{{item.amount}}</Amount>
        </div>
        <div class="flex-grow-1 text-right text-muted small">{{item.meta.blockTimestamp|date}}</div>
    </div>
    <div v-else class="d-flex align-items-center">
        <AccountLink :address="item.sender" abbr icon/>
        <SvgIcon name="arrow-right" class="mx-3"/>
        <AccountLink :address="item.recipient" abbr icon/>
        <div style="width:10rem;" class="text-right">
            <Amount sym="VET">{{item.amount}}</Amount>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Transfer extends Vue {
    @Prop(Object) private item!: Connex.Thor.Transfer
    @Prop(Number) private index !: number
    @Prop(String) private owner !: string

    get isIn() { return this.owner === this.item.recipient }
    get opposite() { return this.isIn ? this.item.sender : this.item.recipient }
}
</script>
