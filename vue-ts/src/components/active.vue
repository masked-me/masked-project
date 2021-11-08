<template>
  <div class="active-pages">
    <div>
      <ul>
        <li
          :class="curIndex === index ? 'active' : ''"
          v-for="(item, index) in dataList"
          :key="index"
          @click="curIndex = index"
        >
          {{ item.title }}
        </li>
        <div>{{ content }}</div>
      </ul>
      {{ title }}
      {{ userInfo.userName }} --- {{ userInfo.age }}
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  name: "active",
  inject: ["title", "userInfo"],
  setup() {
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
ul {
  list-style: none;
  li {
    display: inline;
    padding: 5px 10px;
  }
  div {
    padding: 5px 10px;
    background: #eee;
  }
}
.active {
  color: #fff;
  background: orange;
}
.active-pages {
  width: 400px;
  margin: 0 auto;
  background: #ccc;
}
</style>