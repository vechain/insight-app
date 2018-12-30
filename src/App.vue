<template>
    <div style="display:flex;height:100%;width:100%;flex-direction:column">
        <div
            style="background-color:#303030;flex: 0 0 auto;position:relative;box-shadow:0px 0px 1px 1px rgba(0, 0, 0, 0.3);"
        >
            <header class="navbar container grid-lg py-2">
                <section class="navbar-section">
                    <router-link :to="{name:'home'}" class="navbar-brand mr-2 text-serif">
                        <h4 class="my-0">Insight</h4>
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
                <transition name="fade" mode="out-in">
                    <router-view v-if="hasConnex" :key="$route.fullPath"/>
                </transition>
            </div>
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
$gray-color: #808080;
$base-font-family: "Roboto";
$mono-font-family: "Roboto Mono";
$font-size: 0.7rem;
$font-size-sm: 0.65rem;
$font-size-lg: 0.8rem;

@import "node_modules/spectre.css/src/spectre";
html,
body {
    height: 100%;
    overflow: hidden;
}

.heading {
    font-size: 0.6rem;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
}
.caption {
    font-size: 0.65rem;
}

.column.is-narrow {
    flex-grow: 0;
}

.field-name {
    @extend .column;
    @extend .col-2;
    @extend .text-gray;
    @extend .caption;
}
.field-value {
    @extend .column;
    @extend .col-10;
    line-height: 220%;
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
    font-family: "Roboto Mono";
}
.text-serif {
    font-family: "Roboto Slab";
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.12s;
    transition-timing-function: ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.indent {
    margin-left: 2.8rem;
}

.sub-panel {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px inset;
}
.sub-panel-head {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px inset;
    background-color: rgba(0, 0, 0, 0.05);
    @extend .px-2;
    @extend .py-1;
}

.sub-panel-body {
    @extend .px-2;
    @extend .py-2;
}

.form-input {
    border: none;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px inset;
}
.form-input[readonly] {
    background-color: #fdfdfd;
}

.token-amount {
    font-family: "Roboto Mono";
    letter-spacing: -1px;
}
.token-symbol {
    font-size: 0.6rem;
    text-transform: uppercase;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px inset;
    border-radius: 3px;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    @extend .mx-1;
}
</style>
