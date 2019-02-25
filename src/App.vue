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
                <transition name="fade" mode="out-in">
                    <router-view :key="$route.fullPath"/>
                </transition>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class App extends Vue {
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
}
</script>

