<template>
    <b-card no-body>
        <b-card-header class="border-bottom-0 pb-0">
            <div class="d-flex">
                <span style="width:10em;">
                    <b-badge class="text-uppercase">{{type}}</b-badge>
                </span>
                <div style="width:15em;">
                    <AccountLink v-if="clause.to" icon :address="clause.to" abbr/>
                    <AccountLink v-else-if="output" icon :address="output.contractAddress" abbr/>
                    <span v-else class="text-monospace">0x??????…????</span>
                </div>
                <Amount sym="VET">{{clause.value}}</Amount>
                <b class="ml-auto">#{{index}}</b>
            </div>
        </b-card-header>
        <b-tabs
            v-model="tab"
            card
            no-key-nav
            v-if="type!=='transfer' || events.length || transfers.length"
        >
            <b-tab title="Input Data">
                <InputData :clause="clause" v-if="type!=='transfer'"/>
                <div v-else class="text-center">No Data</div>
            </b-tab>

            <b-tab title="Transfers">
                <b-list-group flush v-if="transfers.length">
                    <b-list-group-item v-for="(t, i) in transfers" :key="i">
                        <Transfer :item="t" :index="i"/>
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
    @Prop(Object) private clause !: Connex.Thor.Clause
    @Prop(Object) private output!: Connex.Thor.Receipt['outputs'][number]

    private tab = 0

    get events() { return this.output ? this.output.events : [] }
    get transfers() { return this.output ? this.output.transfers : [] }
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
