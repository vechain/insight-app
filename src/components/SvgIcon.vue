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
import '../assets/octicons/svg/key.svg'
import '../assets/octicons/svg/search.svg'
import '../assets/octicons/svg/arrow-right.svg'
import '../assets/octicons/svg/arrow-left.svg'
import '../assets/octicons/svg/package.svg'
import '../assets/octicons/svg/shield.svg'
import '../assets/octicons/svg/eye.svg'
import '../assets/octicons/svg/clippy.svg'
import '../assets/octicons/svg/mark-github.svg'

export default Vue.extend({
    props: {
        name: String
    }
})
</script>
