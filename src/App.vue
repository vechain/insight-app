<template>
    <div>
        <header class="navbar container grid-lg py-2">
            <section class="navbar-section">
                <div class="navbar-brand mr-2">
                    <router-link :to="{name:'home'}">
                        <h4 class="mb-0">Insight</h4>
                    </router-link>
                    <div class="text-gray caption">Super lightweight VeChain explorer</div>
                </div>
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
                    <button class="btn btn-primary input-group-btn btn-sm" @click="search">Search</button>
                </div>
            </section>
        </header>
        <div class="container grid-lg">
            <transition name="fade" mode="out-in">
                <router-view v-if="hasConnex" :key="$route.fullPath"/>
            </transition>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

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
}
</script>
<style lang="scss">
$primary-color: #3f51b5;
$body-bg: #f8f8f8;

@import "node_modules/spectre.css/src/spectre";

.heading {
    font-size: 11px;
    letter-spacing: 1px;
    margin-bottom: 5px;
    text-transform: uppercase;
}
.caption {
    font-size: 0.7rem;
}

.column.is-narrow {
    flex-grow: 0;
}

.field-name {
    @extend .column;
    @extend .col-md-12;
    @extend .col-2;
    @extend .text-gray;
    @extend .caption;
}
.field-value {
    @extend .column;
    @extend .col-md-12;
    @extend .col-10;
    line-height: 200%;
}

.is-align-center {
    align-items: center;
}

.card {
    border: none;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px inset,
        0px 1px 4px 0px rgba(0, 0, 0, 0.05);
}
.text-mono {
    font-family: monospace;
    letter-spacing: -1px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s;
    transition-timing-function: ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
