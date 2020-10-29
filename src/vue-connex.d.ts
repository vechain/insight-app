import 'vue'

declare module 'vue/types/vue' {
    interface Vue {
        $connex: Connex
        $net: string
    }
}
