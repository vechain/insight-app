<template>
    <div class="d-flex align-items-center justify-content-center" v-show="showSpinner">
        <b-spinner type="grow" class="mr-3"/>
        {{text || 'Loading...'}}
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Loading extends Vue {
    @Prop(String) private text!: string
    private showSpinner = false

    private mounted() {
        setTimeout(() => {
            this.showSpinner = true
        }, 500)
    }
}
</script>
