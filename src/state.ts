import Vue from 'vue'

export function build() {
    return Vue.observable({
        chainStatus: null as Connex.Thor.Status | null,
        price: null as {
            vet: number,
            vtho: number
        } | null,
        updateAvailable: false
    })
}
