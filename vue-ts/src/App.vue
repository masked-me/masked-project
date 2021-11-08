<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <test1 />
    <button @click="show = !show">切换</button>
    <keep-alive>
      <active v-if="show" />
    </keep-alive>
    <!-- <model v-if="show" @cancel="(val) => (show = val)" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import test1 from "./components/test1.vue";
import active from "./components/active.vue";
import model from "./components/model.vue";

export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
    test1,
    active,
    model,
  },
  provide() {
    return {
      title: "w s app title",
      userInfo: {
        userName: "app",
        age: 20,
      },
    };
  },
  setup() {
    const show = ref(false);

    return {
      show,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
