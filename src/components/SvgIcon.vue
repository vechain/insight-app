<template>
    <svg class="octicon" aria-hidden="true" style="width:1em;height:1em;">
        <use :xlink:href="`#icon-${name}`"></use>
    </svg>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import '../assets/octicons/index.scss'

import '../assets/octicons/svg/key.svg'
import '../assets/octicons/svg/search.svg'
import '../assets/octicons/svg/arrow-right.svg'
import '../assets/octicons/svg/arrow-left.svg'
import '../assets/octicons/svg/package.svg'
import '../assets/octicons/svg/shield.svg'
import '../assets/octicons/svg/eye.svg'

@Component
export default class SvgIcon extends Vue {
    @Prop(String) private name!: string
}
</script>
