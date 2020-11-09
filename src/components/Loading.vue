<template>
    <div
        class="d-flex align-items-center justify-content-center"
        :class="{invisible: !showSpinner}"
    >
        <b-spinner
            type="grow"
            class="mr-3"
        />
        {{text || 'Loading...'}}
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        text: String
    },
    data: () => {
        return { showSpinner: false }
    },
    mounted() {
        setTimeout(() => {
            this.showSpinner = true
        }, 500)
    }
})
</script>
