<template>
    <div id="canvas">
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator"
    import {AnimationControl} from "./model/AnimationControl"
    var animationControl: AnimationControl;
    @Component({ name: "App" })
    export default class App extends Vue{
        mounted(){
            animationControl = new AnimationControl(this);
        }
    }
</script>
<style scoped lang="scss">
</style>