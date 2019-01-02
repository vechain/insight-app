<template>
    <div
        style="display:flex;height:100%;width:100%;flex-direction:column;transition: opacity 0.35s"
    >
        <div
            style="background-color:#383838;flex: 0 0 auto;position:relative;box-shadow:0px 0px 1px 1px rgba(0, 0, 0, 0.3);"
        >
            <header class="navbar container grid-lg py-2">
                <section class="navbar-section">
                    <router-link :to="{name:'home'}" class="navbar-brand mr-2 text-serif">
                        <h4 class="my-0" style="color: white">Insight</h4>
                    </router-link>
                    <span class="caption text-gray mt-2">Serverless VeChain Explorer</span>
                </section>
                <section class="navbar-section">
                    <div class="input-group input-inline col-8">
                        <input
                            v-model="searchString"
                            class="form-input input-sm"
                            type="text"
                            placeholder="block, tx or account"
                            @keypress.enter="search"
                        >
                        <button
                            class="btn btn-primary input-group-btn btn-sm"
                            @click="search"
                        >Search</button>
                    </div>
                </section>
            </header>
        </div>
        <div style="flex:1 1 auto;overflow:auto">
            <div class="container grid-lg py-2">
                <template v-if="hasConnex">
                    <transition name="fade" mode="out-in">
                        <router-view :key="$route.fullPath"/>
                    </transition>
                </template>
                <div v-else class="modal active" id="modal-id">
                    <div class="modal-overlay" style="opacity:0.5"/>
                    <div class="modal-container">
                        <div class="modal-header">
                            <div class="modal-title h6">Connex not detected</div>
                        </div>
                        <div class="modal-body text-large">
                            <div class="content text-center">
                                <div class="btn btn-primary" @click="openWithSync">
                                    Open with
                                    <b class="text-serif">VeChain Sync</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
const customProtocolDetection = require('custom-protocol-detection')

@Component
export default class App extends Vue {
    hasConnex = !!window.connex
    searchString = ''

    search() {
        const str = this.searchString.trim()
        this.searchString = ''
        if (!str) {
            return
        }

        this.$router.push({ name: 'search', query: { q: str } })
    }
    mounted() {
        this.$el.style.opacity = '0'
        setTimeout(() => this.$el.style.opacity = null, 0)
    }

    openWithSync() {
        const vechainAppUrl = 'vechain-app:///' + encodeURIComponent(window.location.href)
        const gotoDownload = () => {
            window.location.href = 'https://github.com/vechain/thor-sync.electron/releases'
        }
        customProtocolDetection(vechainAppUrl, () => {
            gotoDownload()
        }, () => {
            console.log('opened with sync')
        }, () => {
            gotoDownload()
        })
    }
}
</script>

