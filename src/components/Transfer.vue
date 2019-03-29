<template>
    <b-row>
        <b-col cols="1">
            <SvgIcon
                style="transform: scale(1.6)"
                :name="isIn?'arrow-left':'arrow-right'"
                :class="isIn?'text-success':'text-danger'"
            />
        </b-col>
        <b-col cols="4">
            <AccountLink :address="opposite" abbr icon/>
        </b-col>
        <b-col cols="3" class="text-right">
            {{isIn?'+':'-'}}
            <Amount sym="VET">{{item.amount}}</Amount>
        </b-col>
        <b-col
            cols="4"
            class="text-right text-muted"
            v-if="item.meta"
        >{{item.meta.blockTimestamp|date}}</b-col>
    </b-row>
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
