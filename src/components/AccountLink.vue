<template>
    <router-link
        v-bind="$attrs"
        v-on="$listeners"
        class="text-mono"
        :to="{name:'account',params:{address:address}}"
    >
        <template v-if="abbr">{{address | abbr}}</template>
        <template v-else>{{address | checksum}}</template>
    </router-link>
</template>
<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class AccountLink extends Vue {
    @Prop(String) address!: string
    @Prop(Boolean) abbr!: boolean
}
</script>

