<template>
    <div id="app">
        <header class="navbar container grid-lg py-2">
            <section class="navbar-section">
                <a href="#" class="navbar-brand mr-2">
                    <h1>Insight</h1>
                </a>
                <span class="text-gray">super lightweight VeChain explorer</span>
            </section>
            <section class="navbar-section">
                <div class="input-group input-inline col-8">
                    <input class="form-input" type="text" placeholder="block, tx or account">
                    <button class="btn btn-primary input-group-btn">Search</button>
                </div>
            </section>
        </header>

        <keep-alive>
            <router-view class="container grid-lg my-2"/>
        </keep-alive>
    </div>
</template>

<style lang="scss">

</style>
