<template>
    <div class="sub-panel">
        <div class="sub-panel-head">
            {{index}}.
            <span class="text-gray">Emitter</span>
            <AccountLink class="ml-2 caption" :address="item.address" />
        </div>
        <div class="sub-panel-body columns is-align-center">
            <div class="column col-1 text-gray">Topics</div>
            <div class="column col-11">
                <pre class="text-mono">{{item.topics.join('\n')}}</pre>
            </div>
            <div class="column col-1 text-gray">Data</div>
            <div class="column col-11">
                <textarea
                    class="form-input caption text-mono"
                    readonly
                    rows="2"
                    :value="item.data"
                />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Event extends Vue {
    @Prop(Object) item!: Connex.Thor.Event
    @Prop(Number) index!: number

}
</script>
