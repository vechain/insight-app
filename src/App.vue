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
                    <VeForgeLink class="mx-2" style="color: white">VeForge</VeForgeLink>
                    <a
                        class="mx-2"
                        style="color: white"
                        href="https://github.com/vechain/insight-app"
                    >Github</a>
                    <div class="ml-2 input-group input-inline col-8">
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
                            <div class="modal-title h6"><span class="text-serif">Connex</span> not detected</div>
                        </div>
                        <div class="modal-body">
                            It's recommended to open in
                            <span class="text-serif">VeChain Sync.</span>
                        </div>
                        <div class="modal-footer">
                            <a class="btn btn-sm btn-primary" @click="openWithSync">Open in</a> or
                            <a :href="syncReleaseUrl">Download</a>
                            <span class="ml-1 text-serif">VeChain Sync</span>
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

    syncReleaseUrl = 'https://github.com/vechain/thor-sync.electron/releases'

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
        const vechainAppUrl = 'vechain-app:///' + window.location.href
        const gotoDownload = () => {
            window.location.href = this.syncReleaseUrl
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

