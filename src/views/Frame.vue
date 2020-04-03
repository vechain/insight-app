<template>
    <div>
        <b-navbar toggleable="lg" variant="secondary" type="dark">
            <div class="container">
                <b-navbar-brand>
                    <router-link
                        :to="{name:'home', params: {net:$net}}"
                        class="text-decoration-none text-white"
                    >
                        <span class="text-serif h4">Insight</span>
                    </router-link>
                    <b-dropdown
                        size="sm"
                        :text="network"
                        :variant="networkBadgeVariant"
                        toggle-class="py-0 px-1"
                        style="vertical-align:top"
                        class="ml-2"
                    >
                        <b-dropdown-item
                            v-for="(n, i) in switchableNetworks"
                            :key="i"
                            :href="n.href"
                        >{{n.name}}</b-dropdown-item>
                    </b-dropdown>
                </b-navbar-brand>
                <b-navbar-toggle target="nav_collapse" />
                <b-collapse is-nav id="nav_collapse">
                    <b-navbar-nav class="ml-auto">
                        <template v-if="price">
                            <b-nav-item
                                class="text-monospace small"
                                href="https://www.coingecko.com/en/coins/vechain"
                                target="_blank"
                            >
                                <div class="small">
                                    &nbsp;VET
                                    <span class="text-light">${{price.vet.toFixed(5)}}</span>
                                </div>
                            </b-nav-item>
                            <b-nav-item
                                class="text-monospace small mr-3"
                                href="https://www.coingecko.com/en/coins/vethor-token"
                                target="_blank"
                            >
                                <div class="small">
                                    VTHO
                                    <span class="text-light">${{price.vtho.toFixed(5)}}</span>
                                </div>
                            </b-nav-item>
                        </template>
                        <b-nav-item-dropdown class="mr-3">
                            <!-- Using button-content slot -->
                            <template slot="button-content">
                                <span>Alternatives</span>
                            </template>
                            <b-dropdown-item
                                v-for="(item,i) in alters"
                                :key="i"
                                :href="item.href"
                                target="_blank"
                            >{{item.title}}</b-dropdown-item>
                        </b-nav-item-dropdown>
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
                        <b-nav-item href="https://github.com/vechain/" target="_blank">
                            <SvgIcon name="mark-github" />
                        </b-nav-item>
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
                                        <SvgIcon name="search" />
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-nav-form>
                    </b-navbar-nav>
                </b-collapse>
            </div>
        </b-navbar>
        <div class="py-4" v-if="isHeadReady">
            <transition name="fade" mode="out-in">
                <keep-alive include="Block,Tx">
                    <router-view :key="routeViewKey" />
                </keep-alive>
            </transition>
        </div>
        <div v-else class="py-4 d-flex align-items-center justify-content-center">
            <b-spinner type="grow" />
            <div>Connecting ...</div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { genesisIdToNetwork } from '../utils'

@Component
export default class Frame extends Vue {
    private searchString = ''

    get routeName() { return this.$route.name }
    get isHome() { return this.routeName === 'home' }
    get price() { return this.$store.state.price }
    get isHeadReady() { return this.$store.state.chainStatus.head.number > 0 }

    get network() {
        switch (genesisIdToNetwork(this.$connex.thor.genesis.id)) {
            case 'main': return 'MainNet'
            case 'test': return 'TestNet'
            case 'solo': return 'Solo'
            case 'custom': return 'Custom'
        }
    }

    get switchableNetworks(): Array<{ name: string, href: string }> {
        switch (genesisIdToNetwork(this.$connex.thor.genesis.id)) {
            case 'main': return [{ name: 'TestNet', href: '#/test/' }]
            case 'test': return [{ name: 'MainNet', href: '#/main/' }]
            default: return [{ name: 'TestNet', href: '#/test/' }, { name: 'MainNet', href: '#/main/' }]
        }
    }

    get networkBadgeVariant() {
        return genesisIdToNetwork(this.$connex.thor.genesis.id) === 'main' ? 'light' : 'warning'
    }

    private search() {
        const str = this.searchString.trim()
        this.searchString = ''
        if (!str) {
            return
        }
        this.$router.push({ name: 'search', query: { q: str } })
    }
    get alters() {
        return [
            { title: 'Official Explorer', href: 'https://explore.vechain.org/' },
            { title: 'VeChainThorScan', href: 'https://vechainthorscan.com/' },
            { title: 'Vexplorer', href: 'https://vexplorer.io/' },
            { title: 'VeChainStats', href: 'https://vechainstats.com/' }
        ]
    }

    get tools() {
        return [
            { title: 'Inspector', href: 'https://inspector.vecha.in' },
            { title: 'Tokens', href: 'https://laalaguer.github.io/vechain-token-transfer/' },
            { title: 'B32', href: 'https://b32.vecha.in' },
            { title: 'VeChainLinks', href: 'https://vechainlinks.com' }
        ].filter(i => !!i.href)
    }

    get routeViewKey() {
        if (this.$route.matched.find(i => i.name === 'account')) {
            return `accounts-${this.$route.params.address.toLowerCase()}`
        }
        return this.$route.fullPath
    }

    @Watch('$route.path')
    private routed() {
        const name = this.$route.name
        const params = this.$route.params

        let subTitle
        if (this.$route.matched.find(r => r.name === 'account')) {
            subTitle = 'Account ' + this.$options.filters!.checksum(params.address)
        } else if (name === 'tx') {
            subTitle = 'Tx ' + params.id
        } else if (name === 'block') {
            subTitle = 'Block ' + params.id
        } else if (name === 'search') {
            subTitle = 'Search'
        }
        document.title = subTitle ? `Insight | ${subTitle}` : 'Insight - VeChain Explorer'
    }
    private created() {
        this.routed()
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
