<template>
    <div class="d-inline-block overflow-hidden" style="background-color:rgba(0,0,0,0.1);">
        <div style="height:70%;filter:saturate(140%)" :style="styleObject" />
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { picasso } from '@vechain/picasso'

@Component
export default class Ident extends Vue {
    @Prop(String) private value!: string

    get styleObject() {
        const text = this.value || ''
        let svg = svgCache.get(text)
        if (!svg) {
            svg = picasso(text)
            svgCache.set(text, svg)
        }
        return {
            'background': `no-repeat url('data:image/svg+xml;utf8,${svg}')`,
            'background-size': 'cover'
        }
    }
}

const svgCache = new Map<string, string>()
</script>

