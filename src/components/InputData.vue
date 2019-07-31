<template>
    <div>
        <b-form-radio-group
            v-if="isMethod"
            class="mb-2"
            buttons
            button-variant="outline-secondary"
            size="sm"
            v-model="view"
        >
            <b-form-radio class="py-0" value="raw">Raw</b-form-radio>
            <b-form-radio class="py-0" value="decoded">Decoded</b-form-radio>
        </b-form-radio-group>
        <b-textarea
            v-show="view==='raw'"
            class="text-monospace bg-light"
            size="sm"
            readonly
            :value="clause.data"
        />
        <b-card no-body v-if="decodedViewCreated" v-show="view==='decoded'">
            <Decoded :value="{data:clause.data}"/>
        </b-card>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class InputData extends Vue {
    @Prop(Object) private clause!: Connex.Thor.Transaction['clauses'][number]

    private view = 'raw' as 'raw' | 'decoded'
    private decodedViewCreated = false
    @Watch('view')
    private viewChanged() {
        if (this.view === 'decoded') {
            this.decodedViewCreated = true
        }
    }
    get isMethod() { return this.clause.to && this.clause.data.length >= 10 }
}

</script>


