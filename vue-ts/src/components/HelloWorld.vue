<template>
  <div class="hello">
    <div>
      <h1>{{ msg }}</h1>
      <div>{{ num + "2" + name }}</div>
      <div>{{ value }}</div>
      <button @click="numClick">click me</button>
      <input type="text" name="" id="" v-model="num" />
      <el-rate
        v-model="value"
        :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
        show-text
      >
      </el-rate>
      <el-date-picker v-model="value1" type="date" placeholder="Pick a day">
      </el-date-picker>
      <div>value1{{ value1 }}</div>
      <input type="text" v-model="keyword" />
      X- {{ getdata }} -X
      {{ searchData }}
      <div v-for="(item, index) in getdata" :key="index">
        {{ item }}
      </div>
    </div>

    <div>
      <button v-on:click="add">Add</button>
      <button v-on:click="remove">Remove</button>
      <transition-group name="list" tag="p">
        <p
          style="display: inline-block; position: absolute"
          v-for="(item, index) in items"
          :style="{
            left: index * 50 + 'px',
            'transition-delay': 0.1 * index + 's',
          }"
          :key="item + index"
        >
          {{ item }}
        </p>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup(prop) {
    console.log(prop);

    let num = ref(0);
    const data = reactive({
      name: "sss",
      value: 2,
      value1: "",
      dataList: ["apple", "banana", "orange"],
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10,
      keyword: 3,
    });

    let methods = {
      getdata: computed(() => {
        return data.keyword + 's';
      }),
      numClick: (): void => {
        num.value++;
      },
      randomIndex: function () {
        return Math.floor(Math.random() * data.items.length);
      },
      add: function () {
        data.items.splice(this.randomIndex(), 0, 2);
      },
      remove: function () {
        data.items.splice(this.randomIndex(), 1);
      },
    };
    return {
      num,
      ...toRefs(data),
      ...methods,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<style >
/* .list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
 {
  opacity: 0;
  transform: translateY(30px);
} */

.list-enter-active,
.list-leave-active {
  transition: transform 1s ease, opacity 1s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(50%);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}
</style>
