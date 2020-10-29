<template>
    <b-card no-body>
        <b-card-header class="border-bottom-0" :class="showTabs?'pb-0':''">
            <b-row>
                <b-col cols="auto" class="px-1">#{{index}}</b-col>
                <b-col cols="auto">
                    <b-badge class="text-uppercase">{{type}}</b-badge>
                </b-col>
                <b-col>
                    <AccountLink v-if="clause.to" icon :address="clause.to" abbr />
                    <AccountLink v-else-if="output" icon :address="output.contractAddress" abbr />
                    <span v-else class="text-monospace">0x??????…????</span>
                </b-col>
                <b-col class="text-right">
                    <Amount sym="VET">{{clause.value}}</Amount>
                </b-col>
            </b-row>
        </b-card-header>
        <b-tabs v-model="tab" card no-key-nav v-if="showTabs">
            <b-tab title="Input Data">
                <InputData :clause="clause" v-if="type!=='transfer'" />
                <div v-else class="text-center">No Data</div>
            </b-tab>

            <b-tab title="Transfers">
                <b-list-group flush v-if="transfers.length">
                    <b-list-group-item v-for="(t, i) in transfers" :key="i">
                        <TransferItem :data="t" />
                    </b-list-group-item>
                </b-list-group>
                <div v-else class="text-center">No Transfer</div>
            </b-tab>
            <b-tab title="Events">
                <template v-if="events.length">
                    <Event
                        v-for="(ev,i) in events"
                        :key="i"
                        :item="ev"
                        :index="i"
                        :class="{'mt-2':i>0}"
                    />
                </template>
                <div v-else class="text-center">No Event</div>
            </b-tab>
        </b-tabs>
        <b-card-body v-else class="text-center">No Output</b-card-body>
    </b-card>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Clause extends Vue {
    @Prop(Number) private index !: number
    @Prop(Object) private clause !: Connex.VM.Clause
    @Prop(Object) private output!: Connex.Thor.Transaction.Receipt['outputs'][number]

    private tab = 0

    get events() { return this.output ? this.output.events : [] }
    get transfers(): TransferItemData[] {
        return this.output ? this.output.transfers.map(t => ({
            from: t.sender,
            to: t.recipient,
            amount: t.amount
        })) : []
    }
    get showTabs() { return this.type !== 'transfer' || this.events.length || this.transfers.length }
    get type() {
        if (this.clause.to) {
            if (this.clause.data === '0x') {
                return 'transfer'
            } else {
                return 'call'
            }
        } else {
            return 'create'
        }
    }
}
</script>
