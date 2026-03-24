<template>
    <svg
        class="octicon"
        aria-hidden="true"
        style="width:1em;height:1em;"
    >
        <use :xlink:href="`#icon-${name}`"></use>
    </svg>
</template>
<script lang="ts">
import Vue from 'vue'
import '../assets/octicons/index.scss'

export default Vue.extend({
    props: {
        name: String
    }
})
</script>
