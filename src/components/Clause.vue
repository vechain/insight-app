<template>
    <div>
        <div class="columns is-align-center">
            <div class="column col-2">
                <span
                    class="label caption text-bold text-uppercase"
                    :class="output?'label-success': 'label-error'"
                >{{type}}</span>
            </div>
            <div class="column col-4">
                <span class="mr-2 text-gray caption">{{type==='create' ? 'deployed':'to'}}:</span>
                <AccountLink :address="clause.to || output.contractAddress" abbr/>
            </div>
            <div class="column col-4">
                <span class="mr-2 text-gray caption">value:</span>
                <span class="token-amount">{{clause.value | amount}}</span>
                <span class="token-symbol">vet</span>
            </div>
            <div class="column text-right">
                <div
                    v-show="!!output"
                    class="btn btn-primary caption my-0 py-0"
                    style="height:auto;line-height:inherit;"
                    @click="expand=!expand"
                >
                    Detail
                    <i class="icon" :class="expand?'icon-arrow-up':'icon-arrow-down'"/>
                </div>
            </div>
        </div>
        <div v-if="expand && !!output">
            <div class="divider"/>
            <div class="heading mt-2 mb-1">data</div>
            <div class="indent caption">
                <template v-if="type!=='transfer'">
                    <textarea
                        class="form-input caption text-mono"
                        readonly
                        rows="2"
                        :value="clause.data"
                    />
                </template>
                <span v-else class="text-gray">- No data -</span>
            </div>
            <div class="divider"/>
            <div class="heading mt-2 mb-1">transfers</div>
            <div class="indent caption">
                <template v-if="output.transfers.length>0">
                    <Transfer
                        v-for="(item,i) in output.transfers"
                        :key="i"
                        :item="item"
                        :index="i+1"
                    />
                </template>
                <span v-else class="text-gray">- None -</span>
            </div>
            <div class="divider"/>
            <div class="heading mt-2 mb-1">events</div>
            <div class="indent caption">
                <template v-if="output.events.length>0">
                    <Event v-for="(item,i) in output.events" :key="i" :item="item" :index="i+1"/>
                </template>
                <span v-else class="text-gray">- None -</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Clause extends Vue {
    @Prop(Object) clause !: Connex.Thor.Clause
    @Prop(Object) output!: Connex.Thor.Receipt['outputs'][number]

    expand = false

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

