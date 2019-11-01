<template>
    <b-btn size="sm" class="py-1 px-2" variant="primary" :href="link" target="_blank">
        <b-img :src="iconURL" style="height:1rem" />
    </b-btn>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class VeChainStatsLink extends Vue {
    @Prop(String) private address!: string
    get link() {
        return `https://vechainstats.com/account/${this.address}/`
    }
    private iconURL = require('../assets/vechainstats-logo.png')
}
</script>
