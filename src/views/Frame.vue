<template>
    <div>
        <b-navbar
            toggleable="lg"
            variant="secondary"
            type="dark"
        >
            <div class="container">
                <b-navbar-brand>
                    
                    <div class="d-flex align-items-center d-flex-row">
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
                        class="ml-4"
                    >
                        <b-dropdown-item
                            v-for="(n, i) in switchableNetworks"
                            :key="i"
                            :href="n.href"
                        >{{n.label}}</b-dropdown-item>
                    </b-dropdown>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="text-monospace" style="font-size: x-small;">
                            {{nodeUrl}}
                        </span>
                    </div>
                </b-navbar-brand>

                <b-navbar-toggle target="nav_collapse" />
                <b-collapse
                    is-nav
                    id="nav_collapse"
                >
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
                        <b-nav-item
                            href="https://github.com/vechain/"
                            target="_blank"
                        >
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
                                    <b-button
                                        size="sm"
                                        variant="primary"
                                        @click="search"
                                    >
                                        <SvgIcon name="search" />
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-nav-form>
                    </b-navbar-nav>
                </b-collapse>
            </div>
        </b-navbar>
        <div class="py-4">
            <transition
                name="fade"
                mode="out-in"
            >
                <keep-alive include="Block,Tx">
                    <router-view :key="routeViewKey" />
                </keep-alive>
            </transition>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { genesisIdToNetwork, networkToGenesisId } from '../utils'
import { nodeUrls } from '@/create-connex'

const isSoloUrl = !!process.env.VUE_APP_SOLO_URL
const isCustomurl = !!process.env.VUE_APP_CUSTOM_URL


export default Vue.extend({
    data: () => {
        return {
            searchString: ''
        }
    },
    computed: {
        routeName(): string { return this.$route.name || '' },
        isHome(): boolean { return this.routeName === 'home' },
        price() { return this.$state.price },
        nodeUrl() { return nodeUrls[genesisIdToNetwork(this.$connex.thor.genesis.id)] },
        network() {
            switch (genesisIdToNetwork(this.$connex.thor.genesis.id)) {
                case 'main': return 'MainNet'
                case 'test': return 'TestNet'
                case 'solo': return 'SoloNet'
                case 'custom': return `Custom:0x${this.$connex.thor.genesis.id.slice(-2)}`
            }
        },
        networks(): Array<{ name: string, label: string, href: string }> {
            return [
                { name: 'main',label: 'MainNet', href: '#/main/' },
                { name: 'test',label: 'TestNet', href: '#/test/' },
                ...(isSoloUrl ? [{ name:'solo',label: 'SoloNet', href: '#/solo/' }] : []),
                ...(isCustomurl ? [{ name:'custom',label: `Custom:0x${this.$connex.thor.genesis.id.slice(-2)}`, href: '#/custom/' }] : [])
            ]
        },
        switchableNetworks(): Array<{ name: string, label: string, href: string }> {
            return this.networks.filter(i =>  this.$connex.thor.genesis.id !== networkToGenesisId(i.name))
        },
        networkBadgeVariant() {
            return genesisIdToNetwork(this.$connex.thor.genesis.id) === 'main' ? 'light' : 'warning'
        },
        alters() {
            return [
                { title: 'Official Explorer', href: 'https://explore.vechain.org/' },
                { title: 'VeChainStats', href: 'https://vechainstats.com/' },
                { title: 'VeBlocks', href: 'https://www.veblocks.net/' }
            ]
        },
        tools() {
            return [
                { title: 'Inspector', href: 'https://inspector.vecha.in' },
                { title: 'Tokens', href: 'https://laalaguer.github.io/vechain-token-transfer/' },
                { title: 'B32', href: 'https://b32.vecha.in' },
            ].filter(i => !!i.href)
        },
        routeViewKey() {
            if (this.$route.matched.find(i => i.name === 'account')) {
                return `accounts-${this.$route.params.address.toLowerCase()}`
            }
            return this.$route.fullPath
        }
    },
    methods: {
        search() {
            const str = this.searchString.trim()
            this.searchString = ''
            if (!str) {
                return
            }
            this.$router.push({ name: 'search', query: { q: str } })
        },
        routed() {
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
    },
    watch: {
        '$route.path'() {
            this.routed()
        }
    },
    created() {
        this.routed()
    }
})
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
