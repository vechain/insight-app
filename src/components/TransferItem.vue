<template>
    <b-row v-if="data.owner">
        <b-col lg="4">
            <SvgIcon
                style="transform: scale(1.4)"
                :name="isIn?'arrow-left':'arrow-right'"
                :class="isIn?'text-success':'text-danger'"
                class="mr-4"
            />
            <AccountLink
                :address="opposite"
                abbr
                icon
            />
        </b-col>
        <b-col
            lg="3"
            class="text-right"
        >
            {{isIn?'+':'-'}}
            <Amount :sym="sym">{{data.amount}}</Amount>
        </b-col>
        <b-col
            lg="5"
            class="text-right text-muted small"
        >{{data.timestamp|date}}</b-col>
    </b-row>
    <b-row v-else>
        <b-col lg="8">
            <b-row>
                <b-col cols="5">
                    <AccountLink
                        :address="data.from"
                        abbr
                        icon
                    />
                </b-col>
                <b-col cols="2">
                    <SvgIcon
                        name="arrow-right"
                        style="font-size:130%"
                    />
                </b-col>
                <b-col cols="5">
                    <AccountLink
                        :address="data.to"
                        abbr
                        icon
                    />
                </b-col>
            </b-row>
        </b-col>
        <b-col
            lg="4"
            class="text-right"
        >
            <Amount :sym="sym">{{data.amount}}</Amount>
        </b-col>
    </b-row>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        data: Object as () => TransferItemData,
        sym: String
    },
    computed: {
        isIn(): boolean { return this.data.owner === this.data.to },
        opposite(): string { return this.isIn ? this.data.from : this.data.to }
    }
})
</script>
