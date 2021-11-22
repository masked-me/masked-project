<template>
  <div class="test-pages">
    <div class="test-pages-top">
      <div class="wrap">
        <div class="left">ToDolist</div>
        <div class="right">
          <input
            type="text"
            name=""
            id=""
            v-model="addMsg"
            @keydown.enter="add"
          />
        </div>
      </div>
    </div>

    <div class="test-pages-bottom">
      <div class="wrap">
        <item
          title="正在进行中"
          :dataList="dataList"
          :type="0"
          @removeHandle="remove"
        ></item>
        <item
          title="已经完成"
          :dataList="resList"
          :type="1"
          @removeHandle="remove"
        ></item>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, toRefs, watch } from "vue";
import item from "./item.vue";
export default defineComponent({
  name: "test",
  components: {
    item,
  },
  setup() {
    const data = reactive({
      addMsg: "",
      dataList: [],
    });

    const methods = {
      resList: computed(() => {
        return (data.dataList || []).filter((item) => item.check);
      }),
      remove: (id, type, a, b, c, d, f) => {
        console.log(id, type, a, b, c, d, f);
        type
          ? data.dataList.some((item) => {
              if (item.id === id) {
                item.check = false;
              }
            })
          : data.dataList.splice(id, 1);
      },
      add: () => {
        if (!data.addMsg) return;
        let obj = {
          check: false,
          content: data.addMsg,
          id: data.dataList.length,
        };
        data.dataList.push(obj);
      },
      setStorage: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      getStorage: (key) => {
        return JSON.parse(localStorage.getItem(key));
      },
      removeStorage: () => {},
    };

    data.dataList = methods["getStorage"]("dataList") || [];
    watch(
      data.dataList,
      (cur, pre) => {
        console.log("cur", cur);
        console.log("pre", pre);
        methods["setStorage"]("dataList", cur);
      },
      { deep: true }
    );
    return {
      ...toRefs(data),
      ...methods,
    };
  },
});
</script>

<style lang='less'>
* {
  margin: 0;
  padding: 0;
}
.test-pages {
  text-align: center;
  margin: 0 auto;
  &-top {
    background-color: gray;
    & > div {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
    }
    .left {
      color: #fff;
    }
  }
  &-bottom {
    text-align: left;
  }
  .wrap {
    width: 400px;
    margin: 0 auto;
  }
}
</style>