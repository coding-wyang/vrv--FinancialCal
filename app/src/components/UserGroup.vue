<template>
  <div class="user-group">
    <el-select  placeholder="请选择" @change="groupCheck" v-model="groupSave">
    <el-option
      :label="item"
      :value="item"
      v-for="(item, index) in divideGroup"
      :key="index"
    ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'userGroup',
  props: {
    divideGroup: Array
  },
  data() {
    return {
      groupSave: ''
    };
  },
  watch: {
    groupSave(newValue) {
      this.groupSave = newValue;
    }
  },
  methods: {
    groupCheck() {
      this.$emit('groupCheck', this.groupSave);
    }
  }
};
</script>

<style>

</style>