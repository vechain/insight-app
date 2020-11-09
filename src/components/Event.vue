<template>
    <div>
        <b-card no-body>
            <b-card-header class="py-1 px-2">
                <b>#{{index}}</b>
                <span
                    v-if="item.meta"
                    class="float-right text-muted"
                >{{item.meta.blockTimestamp | date}}</span>
            </b-card-header>
            <div class="p-2">
                <b-form-radio-group
                    v-if="isDecodable"
                    buttons
                    button-variant="outline-secondary"
                    size="sm"
                    v-model="view"
                >
                    <b-form-radio
                        class="py-0"
                        value="raw"
                    >Raw</b-form-radio>
                    <b-form-radio
                        class="py-0"
                        value="decoded"
                    >Decoded</b-form-radio>
                </b-form-radio-group>

                <span
                    v-if="item.meta"
                    class="float-right"
                >
                    txid
                    <router-link
                        class="text-monospace"
                        :to="{name: 'tx', params:{id: item.meta.txID, net:$net}}"
                    >{{item.meta.txID | abbr}}</router-link>
                </span>
                <span
                    v-else
                    class="float-right"
                >
                    emitter
                    <AccountLink
                        abbr
                        :address="item.address"
                    />
                </span>
            </div>
            <div
                v-show="view==='raw'"
                class="p-3"
            >
                <b-row>
                    <b-col lg="1">
                        <strong>Topics</strong>
                    </b-col>
                    <b-col
                        lg="11"
                        class="text-monospace"
                    >
                        <div
                            v-for="(t,i) in item.topics"
                            :key="i"
                        >[{{i}}] {{t}}</div>
                    </b-col>
                </b-row>
                <hr class="my-2">
                <b-row>
                    <b-col lg="1">
                        <strong>Data</strong>
                    </b-col>
                    <b-col
                        lg="11"
                        class="text-monospace"
                    >{{item.data}}</b-col>
                </b-row>
            </div>
            <div
                v-if="decodedViewCreated"
                v-show="view==='decoded'"
                class="px-2"
            >
                <Decoded :value="{data:item.data,topics:item.topics}" />
            </div>
        </b-card>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        item: Object as () => (Connex.VM.Event & Partial<Connex.Thor.Filter.WithMeta>),
        index: Number
    },
    data: () => {
        return {
            view: 'raw' as 'raw' | 'decoded',
            decodedViewCreated: true
        }
    },
    computed: {
        isDecodable(): boolean { return this.item.topics.length > 0 }
    },
    watch: {
        view(newVal) {
            if (newVal === 'decoded') {
                this.decodedViewCreated = true
            }
        }
    }
})
</script>
