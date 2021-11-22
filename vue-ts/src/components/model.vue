<template>
  <teleport to="body">
    <div class="model-pages">
      <div class="box">
        model内容<button @click="cancelHandle">关闭</button>
      </div>
    </div>
  </teleport>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  name: "model",
  setup(prop, params) {
    const data = reactive({
      curIndex: 0,
      dataList: [
        {
          title: "nodejs教学",
          content: "今天开始使用nodejs进行前端web开发",
          index: 0,
        },
        {
          title: "php教学",
          content:
            "《秋叶：如何高效读懂一本书？》/读书的10个误区，你中了几个？",
          index: 0,
        },
        {
          title: "webpack教学",
          content: "Welcome to Your Vue.js + TypeScript App",
          index: 0,
        },
      ],
    });

    const methods = {
      content: computed(() => {
        return data.dataList[data.curIndex].content;
      }),
      cancelHandle: () => {
        params.emit("cancel", false);
      },
    };

    return {
      ...toRefs(data),
      ...methods,
    };
  },
  activated(ac) {
    console.log("ac", ac);
  },
  deactivated(bc) {
    console.log("bc", bc);
  },
});
</script>

<style lang='less'>
.model-pages {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(200, 200, 200, 0.9);
  .box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    margin: 0 auto;
    height: 200px;
    background: #fff;
  }
}
</style>