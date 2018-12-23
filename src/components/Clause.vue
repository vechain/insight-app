<template>
    <div>
        <div class="columns is-align-center">
            <div class="column col-2 col-md-12" >
                <div
                    class="label my-2 heading text-bold"
                    :class="output?'label-success': 'label-error'"
                >{{type}}</div>
            </div>

            <div class="column col-5 col-md-6 text-center">
                <div class="heading">{{type==='create' ? 'deployed contract':'to'}}</div>
                <router-link
                class="text-mono"
                    :to="{name:'account',params:{address:clause.to || output.contractAddress}}"
                >{{clause.to || output.contractAddress}}</router-link>
            </div>
            <div class="column col-5 col-md-6 text-center">
                <div class="heading">value</div>
                <div>
                    {{clause.value | amount}}
                    <span class="heading">vet</span>
                </div>
            </div>
        </div>

        <!-- <div
            class="label my-2 heading text-bold"
            :class="output?'label-success': 'label-error'"
        >{{type}}</div>
        <div class="columns is-align-center">
            <template v-if="type!=='create'">
                <div class="field-name">To</div>
                <div class="field-value">
                    <router-link :to="{name:'account',params:{address:clause.to}}">{{clause.to}}</router-link>
                </div>
            </template>
            <div class="field-name">Value</div>
            <div class="field-value">
                {{clause.value | amount}}
                <span class="heading">VET</span>
            </div>
            <div class="field-name">Data</div>
            <div class="field-value">
                <span v-if="type==='transfer'">-</span>
                <textarea v-else class="form-input caption" readonly rows="2" :value="clause.data"/>
            </div>
        </div>

        <div v-if="!!output" class="columns is-align-center">
            <template v-if="type==='create'">
                <div class="field-name">Deployed Contract</div>
                <div class="field-value">
                    <router-link
                        v-if="type==='create'"
                        :to="{name:'account',params:{address:output.contractAddress}}"
                    >{{output.contractAddress}}</router-link>
                </div>
            </template>
            <div class="field-name">Events</div>
            <div class="field-value">
                <div v-for="(event,ei) in output.events" :key="ei" class="columns is-align-center">
                    <div class="field-name">Address</div>
                    <div class="field-value">
                        <router-link
                            :to="{name:'account',params:{address:event.address}}"
                        >{{event.address}}</router-link>
                    </div>
                    <div class="field-name">Topics</div>
                    <div class="field-value">
                        <ol>
                            <li v-for="(topic, topici) in event.topics" :key="topici">{{topic}}</li>
                        </ol>
                    </div>
                    <div class="field-name">Data</div>
                    <div class="field-value">
                        <textarea class="form-input caption" readonly rows="1" :value="event.data"/>
                    </div>
                </div>
            </div>
            <div class="heading">Transfers</div>
            <div
                v-for="(transfer,ti) in output.transfers"
                :key="ti"
                class="columns is-align-center"
            >
                <div class="field-name">Sender</div>
                <div class="field-value">
                    <router-link
                        :to="{name:'account',params:{address:transfer.sender}}"
                    >{{transfer.sender}}</router-link>
                </div>
                <div class="field-name">Recipient</div>
                <div class="field-value">
                    <router-link
                        :to="{name:'account',params:{address:transfer.recipient}}"
                    >{{transfer.recipient}}</router-link>
                </div>
                <div class="field-name">Amount</div>
                <div class="field-value">
                    {{transfer.amount|amount}}
                    <span class="heading">vet</span>
                </div>
            </div>
        </div>-->
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Clause extends Vue {
    @Prop(Object) clause !: Connex.Thor.Clause
    @Prop(Object) output!: Connex.Thor.Receipt['outputs'][number]

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

