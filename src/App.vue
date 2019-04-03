<template>
    <div class="app">
        <b-navbar toggleable="lg" variant="secondary" type="dark">
            <div class="container">
                <b-navbar-brand href="#/">
                    <span class="text-serif h4">Insight</span>
                </b-navbar-brand>
                <b-navbar-nav class="small text-monospace ml-5 mr-auto">
                    <b-nav-text v-if="price" class="small py-0">
                        <div>
                            &nbsp;VET
                            <span class="text-light">${{price.vet.toFixed(5)}}</span>
                        </div>
                        <div>
                            VTHO
                            <span class="text-light">${{price.vtho.toFixed(5)}}</span>
                        </div>
                    </b-nav-text>
                </b-navbar-nav>

                <b-navbar-toggle target="nav_collapse"/>
                <b-collapse is-nav id="nav_collapse">
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item href="https://github.com/vechain/" target="_blank">Code Repo</b-nav-item>
                    </b-navbar-nav>

                    <!-- Right aligned nav items -->
                    <b-navbar-nav>
                        <!-- 
                    <b-nav-item-dropdown text="Lang" right>
                        <b-dropdown-item href="#">EN</b-dropdown-item>
                        <b-dropdown-item href="#">ES</b-dropdown-item>
                        <b-dropdown-item href="#">RU</b-dropdown-item>
                        <b-dropdown-item href="#">FA</b-dropdown-item>
                        </b-nav-item-dropdown>-->

                        <b-nav-item-dropdown class="mr-3">
                            <!-- Using button-content slot -->
                            <template slot="button-content">
                                <span>Tools</span>
                            </template>
                            <b-dropdown-item
                                v-for="(item,i) in tools"
                                :key="i"
                                :href="item.href"
                                target="_blank"
                            >{{item.title}}</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-form v-if="!isHome">
                            <b-input-group>
                                <b-form-input
                                    class="border-0"
                                    size="sm"
                                    placeholder="block, tx or account"
                                    style="min-width:15rem"
                                    v-model="searchString"
                                    @keydown.enter.prevent="search"
                                />
                                <b-input-group-append>
                                    <b-button size="sm" variant="primary" @click="search">
                                        <SvgIcon name="search"/>
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-nav-form>
                    </b-navbar-nav>
                </b-collapse>
            </div>
        </b-navbar>
        <div class="py-4">
            <transition name="fade" mode="out-in">
                <keep-alive exclude="Home,Search">
                    <router-view :key="$route.fullPath"/>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { isMainnet } from './utils'
@Component
export default class App extends Vue {
    private searchString = ''

    get routeName() { return this.$route.name }
    get isHome() { return this.routeName === 'home' }
    get price() { return this.$store.state.price }

    private search() {
        const str = this.searchString.trim()
        this.searchString = ''
        if (!str) {
            return
        }
        this.$router.push({ name: 'search', query: { q: str } })
    }

    get isMainnet() { return isMainnet() }

    get tools() {
        return [
            { title: 'VeForge', href: isMainnet ? 'https://explore.veforge.com/' : 'https://testnet.veforge.com/' },
            { title: 'Inspector', href: 'https://inspector.vecha.in' },
            { title: 'Tokens', href: 'https://laalaguer.github.io/vechain-token-transfer/' },
            { title: 'B32', href: 'https://b32.vecha.in' }

        ]
    }
}
</script>
<style lang="scss" scoped>
@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.app {
    animation: fade-in 0.4s;
}
</style>


