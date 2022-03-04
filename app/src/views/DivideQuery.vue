<template>
  <div id="divide-query">
    <div class="divide-search">
      <el-row>
        <el-col :span="5">
          <el-date-picker
            v-model="times"
            type="month"
            placeholder="时间"
            @change="queryByDate"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <user-group
            :divideGroup="groups"
            @groupCheck="queryByGroup"
            ref="userGroup"
          ></user-group>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getDivideInfo">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="tip-search">
      当前查询时间: <span :class="typeTime">{{ tipTime }} </span> 当前查询小组:
      <span :class="typeGroup">{{ tipGroup }}</span>
    </div>
    <div class="divide-data">
      <user-tab :dataShow="dataList"></user-tab>
    </div>
  </div>
</template>

<script>
import UserTab from '../components/UserTab.vue';
import UserGroup from '../components/UserGroup.vue';

import divideGroup from '../api/divideQuery.js';

export default {
  name: 'DivideQuery',
  components: {
    UserTab,
    UserGroup,
  },
  data() {
    return {
      times: '',
      groupSave: '',
      // 设置用户要选择的分组
      groups: ['PC', 'SDK', 'RTC', 'PM', 'total'],
      // 存储展示当前选择的所有员工信息
      dataList: [],
      // 请求参数对象
      queryDivideInfo: {
        year: '',
        month: '',
        group: '',
      },
      // 用来判断用户在选择和未选择时的文字提示样式
      isTime: false,
      isGroup: false,
      /*
      这里作用是提示当前用户选择的时间，
      具体这样设置：原因是时间选择有一个清除按钮，点击会把时间重置成1970年
      */
      tips: {
        year: '',
        month: '',
        group: '',
      },
    };
  },
  computed: {
    tipTime() {
      let time = '';
      if (this.tips.year !== '' && this.tips.month !== '') {
        time = `${this.tips.year} 年 ${this.tips.month} 月`;
      } else {
        time = '当前未查询员工数据';
      }
      return time;
    },
    tipGroup() {
      let group = '';
      if (this.groupSave !== '') {
        group = `${this.tips.group} 组`;
      } else {
        group = '当前查询未分组';
      }
      return group;
    },
    typeTime() {
      return [{ 'tip-content': this.isTime }, 'tip-message'];
    },
    typeGroup() {
      return [{ 'tip-content': this.isGroup }, 'tip-message'];
    },
  },
  methods: {
    // 将中国时间转化成yyyy-mm
    translateTime(date) {
      const data = new Date(date);
      const year = data.getFullYear();
      const month = data.getMonth() + 1 < 10 ? `0${data.getMonth() + 1}` : data.getMonth() + 1;
      return { year, month };
    },
    // 点击切换时间时触发，主要功能是在选择时间后，将年和月传递给要请求的参数
    queryByDate() {
      this.isTime = true;
      // 这里的清空操作是在只选择时间的时候，清空分组选择框以及提示当前的信息
      this.$refs.userGroup.groupSave = '';
      this.groupSave = '';
      this.queryDivideInfo.group = '';
      let { year, month } = this.translateTime(this.times);
      this.queryDivideInfo.year = year.toString();
      this.queryDivideInfo.month = month;
      console.log('选择的时间是:', year, month);
    },
    // 点击切换小组，主要功能是在选择小组后，将小组的信息传递给要请求的参数
    queryByGroup(data) {
      this.isGroup = true;
      if (data === 'total') {
        this.groupSave = '';
      } else {
        this.groupSave = data;
      }
      this.queryDivideInfo.group = this.groupSave;
      console.log('选择的小组是:', this.groupSave);
    },
    // 点击查询，请求数据
    async getDivideInfo() {
      let { year, month, group } = this.queryDivideInfo;
      this.tips.year = year;
      this.tips.month = month;
      this.tips.group = group;
      const res = await divideGroup(this.queryDivideInfo);
      console.log('请求的参数是:', this.queryDivideInfo);
      console.log('获取的员工信息:', res);
      this.dataList = res;
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-search {
  margin: 10px 0;
  color: red;
  font-size: 16px;
}
.tip-search {
  .tip-message {
    color: #ccc;
    font-size: 14px;
  }
  .tip-content {
    color: #000;
  }
}
</style>
