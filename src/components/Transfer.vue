<template>
    <div class="columns">
        <div class="column col-3">
            {{index}}.
            <AccountLink class="ml-2" :address="item.sender" abbr/>
        </div>
        <b class="column col-1">➟</b>
        <div class="column col-3">
            <AccountLink :address="item.recipient" abbr/>
        </div>
        <div class="column">
            <span class="token-amount">{{item.amount | amount}}</span>
            <span class="token-symbol">VET</span>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Transfer extends Vue {
    @Prop(Object) item!: Connex.Thor.Transfer
    @Prop(Number) index !: number
}
</script>
