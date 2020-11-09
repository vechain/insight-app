<template>
    <div
        class="d-inline-block overflow-hidden"
        style="background-color:rgba(0,0,0,0.1);"
    >
        <div
            style="height:70%;"
            :style="styleObject"
        />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { picasso } from '@vechain/picasso'

export default Vue.extend({
    props: {
        value: String
    },
    computed: {
        styleObject() {
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
})

const svgCache = new Map<string, string>()
</script>

