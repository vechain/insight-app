<template>
    <b-btn
        size="sm"
        class="py-1 px-2"
        variant="primary"
        :href="link"
        target="_blank"
    >
        <b-img
            :src="iconURL"
            style="height:1rem"
        />
    </b-btn>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        address: String
    },
    computed: {
        link(): string {
            return `https://vechainstats.com/account/${this.address}/`
        },
        iconURL(): string {
            return require('../assets/vechainstats-logo.png')
        }
    }
})
</script>
