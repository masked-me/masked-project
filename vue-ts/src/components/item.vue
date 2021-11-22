<template>
  <div>
    <!-- type 0   &&  true   不展示
         type 0   &&  false  展示
         type 1   &&  true   展示
         type 1   &&  false  不展示
    -->
    <div class="box">
      <div class="title">正在进行中</div>
      <div class="dataList">
        <template v-for="(item, index) in dataList">
          <div class="item" v-if="type ? item.check : !item.check" :key="index">
            <input
              type="checkbox"
              name=""
              :disabled="type"
              id=""
              v-model="item.check"
            />
            <span class="content">{{ item.content }}</span>
            <span @click="remove(item.id, type)">X</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs } from "vue";
export default defineComponent({
  name: "test",
  props: {
    dataList: {
      type: [Object, Array],
      default: () => {},
    },
    type: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: "",
    },
  },
  setup(prop, param) {
    console.log(prop);
    console.log(param);
    const methods = {
      remove: (id, type) => {
        let a = 2;
        let b = 3;
        let c = 4;
        let d = 5;
        let f = 6;
        param.emit("removeHandle", id, type, a, b, c, d, f);
      },
    };
    return {
      ...toRefs(prop),
      ...methods,
    };
  },
});
</script>

<style lang='less'>
.item {
  display: flex;
  justify-content: space-between;
}
</style>
