<template>
  <div class="user-tab">
    <el-table :data="dataShow" border style="width: 100%" show-summary stripe >
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="meal" label="餐补"></el-table-column>
    <el-table-column prop="traffic" label="交补"></el-table-column>
    <el-table-column prop="total" label="合计"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    dataShow: Array,
  }
};
</script>

<style>

</style>