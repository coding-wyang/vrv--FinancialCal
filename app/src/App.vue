<template>
  <div id="app">
    <div class="router-skip">
      <el-button type="primary" @click="managePage">员工管理</el-button>
      <el-button type="primary" @click="toUploadRouter">上传文件</el-button>
      <el-button type="primary" @click="toDivideRouter">按年月查询</el-button>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    // 跳转到员工管理页面
    managePage() {
      if (this.$route.path === '/manage') {
        return;
      }
      this.$router.push('/manage');
    },
    toDivideRouter() {
      if (this.$route.path === '/query') {
        return;
      }
      this.$router.push('/query');
    },
    // 跳转到上传文件页面
    toUploadRouter() {
      if (this.$route.path === '/upload') {
        return;
      }
      this.$router.push('/upload');
    }
  }
};
</script>

<style>
#app {
  width: 800px;
  margin: auto;
}
.router-skip{
  margin-bottom: 20px;
}
</style>
