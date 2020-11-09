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
            <b-form-radio
                class="py-0"
                value="raw"
            >Raw</b-form-radio>
            <b-form-radio
                class="py-0"
                value="decoded"
            >Decoded</b-form-radio>
        </b-form-radio-group>
        <b-textarea
            v-show="view==='raw'"
            class="text-monospace bg-light"
            size="sm"
            readonly
            :value="clause.data"
        />
        <b-card
            no-body
            v-if="decodedViewCreated"
            v-show="view==='decoded'"
        >
            <Decoded :value="{data:clause.data}" />
        </b-card>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        clause: Object as () => Connex.Thor.Transaction['clauses'][number]
    },
    data: () => {
        return {
            view: 'raw' as 'raw' | 'decoded',
            decodedViewCreated: false
        }
    },
    computed: {
        isMethod(): boolean { return !!this.clause.to && this.clause.data.length >= 10 }
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
