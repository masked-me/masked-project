<template>
  <div class="fileupload">
    <input type="file" @change="handleFileChange" />
    <el-button @click="handleUpload">上传</el-button>
    <el-button @click="handlePause" v-if="isPaused">暂停</el-button>
    <el-button @click="handleResume" v-else>恢复</el-button>
    <h2 class="title">计算文件 hash</h2>
    <el-progress :percentage="hashPercentage"></el-progress>
    <h2 class="title">总进度</h2>
    <el-progress :percentage="fakeUploadPercentage"></el-progress>
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="hash" label="切片hash" width="400" align="center">
      </el-table-column>
      <el-table-column prop="chunk.size" label="大小（KB）" align="center">
      </el-table-column>
      <el-table-column prop="percentage" label="进度" align="center">
        <template slot-scope="scope">
          <el-progress
            :percentage="scope.row.percentage"
            color="gray"
          ></el-progress>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const LENGTH = 10; //切片数量
import request from "../lib/utils";
import Worker from "worker-loader!sspublic/hash.worker.js";
export default {
  data() {
    return {
      container: {
        file: null,
        worker: null,
        hash: null,
      },
      data: [],
      hashPercentage: 0,
      requestList: [],
      isPaused: true,
      fakeUploadPercentage: 0,
    };
  },
  created() {},
  methods: {
    handleFileChange(e) {
      let [file] = e.target.files;
      console.log(file);
      if (!file) return;
      //this.$options.data() 这个是vue原始的数据，就是你页面刚加载时的data
      //this.$data 这个是现在阶段的vue数据，就是你改变data的数据
      //使用Object.assign将原始数据和现在的数据融合，会将改变的数据重置到初始状态
      Object.assign(this.$data, this.$options.data());
      this.container.file = file;
    },
    // 生成文件切片
    createFileChunk(file, length = LENGTH) {
      const fileChunkList = [];
      const chunkSize = Math.ceil(file.size / length);
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + chunkSize) });
        cur += chunkSize;
      }
      return fileChunkList;
    },
    // 上传切片
    async uploadChunks(uploadedList = []) {
      const requestList = this.data
        .filter(({ hash }) => !uploadedList.includes(hash))
        .map(({ chunk, hash, fileHash, index }) => {
          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("hash", hash);
          formData.append("fileHash", fileHash);
          formData.append("filename", this.container.file.name);
          return { formData, index };
        })
        .map(async ({ formData, index }) => {
          return request({
            url: "http://localhost:3000",
            data: formData,
            onProgress: this.createProgressHandler(this.data[index]),
            requestList: this.requestList,
          });
        });
      await Promise.all(requestList);
      // 合并切片
      if (uploadedList.length + requestList.length === this.data.length) {
        await this.mergeRequest();
      }
    },
    async mergeRequest() {
      console.log("1");
      await request({
        url: "http://localhost:3000/merge",
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify({
          filehash: this.container.hash,
          filename: this.container.file.name,
        }),
      });
    },
    // 生成文件 hash(web-worker)
    calculateHash(fileChunkList) {
      let _this = this;
      return new Promise((resolve) => {
        // 添加 worker 属性
        _this.container.worker = new Worker();
        _this.container.worker.postMessage({ fileChunkList });
        _this.container.worker.onmessage = (e) => {
          const { percentage, hash } = e.data;
          _this.hashPercentage = percentage;
          if (hash) {
            console.log("hash", hash);
            resolve(hash);
          }
        };
      });
    },
    async verifyUpload(filename, fileHash) {
      const { data } = await request({
        url: "http://localhost:3000/verify",
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify({
          filename,
          fileHash,
        }),
      });
      return JSON.parse(data);
    },
    async handleResume() {
      this.isPaused = true;
      const { uploadedList } = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      );
      await this.uploadChunks(uploadedList);
    },
    handlePause() {
      this.isPaused = false;
      this.requestList.forEach((xhr) => xhr?.abort());
      this.requestList = [];
    },
    async handleUpload() {
      if (!this.container.file) return;
      const fileChunkList = this.createFileChunk(this.container.file);
      this.container.hash = await this.calculateHash(fileChunkList);
      const { shouldUpload, uploadedList } = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      );
      if (!shouldUpload) {
        this.$message.success("秒传：上传成功!");
        return;
      }
      this.data = fileChunkList.map(({ file }, index) => ({
        fileHash: this.container.hash, //
        chunk: file,
        index,
        hash: this.container.hash + "-" + index, // 文件名 + 数组下标
        percentage: 0,
        // percentage: uploadedList.includes(this.container.hash + "-" + index)
        //   ? 100
        //   : 0,
      }));
      await this.uploadChunks(uploadedList);
    },
    createProgressHandler(item) {
      return (e) => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100));
      };
    },
  },
  computed: {
    uploadPercentage() {
      if (!this.container.file || !this.data.length) return 0;
      const loaded = this.data
        .map((item) => item.chunk.size * item.percentage)
        .reduce((acc, cur) => acc + cur, 0);
      return parseInt((loaded / this.container.file.size).toFixed(2));
    },
  },
  watch: {
    uploadPercentage(now) {
      if (now > this.fakeUploadPercentage) {
        this.fakeUploadPercentage = now;
      }
    },
  },
};
</script>

<style scoped>
.fileupload {
  width: 1080px;
  margin: 0 auto;
}
.title {
  text-align: left;
}
</style>
