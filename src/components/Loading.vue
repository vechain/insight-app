<template>
    <div v-if="!!error" class="empty">
        <div class="empty-title text-error">{{error.name}}</div>
        <div class="empty-subtitle">{{error.message}}</div>
    </div>
    <div v-else class="py-2" :style="{visibility:showSpinner? 'visible': 'hidden'}">
        <div class="loading loading-lg"/>
        <div class="text-center">Loading...</div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class Loading extends Vue {
    @Prop(Error) error!: Error
    showSpinner = false

    mounted() {
        setTimeout(() => {

            this.showSpinner = true

        }, 500)
    }
}
</script>

