<template>
  <div id="upload-file">
    <el-alert
      title="上传文件格式例如:2021-02补助.xls"
      type="info"
      effect="dark"
      class="upload-alert"
      center
      show-icon
    ></el-alert>
    <div class="upload">
      <el-progress
        type="line"
        style="width: 500px"
        class="upload-progress"
        :show-text="false"
        :stroke-width="4"
        :percentage="percentage"
        v-show="isProgress"
      ></el-progress>
      <el-upload
        class="upload-demo"
        :action="uploadPath"
        multiple
        :on-progress="onProgress"
        :on-success="onSuccess"
        :limit="3"
        :show-file-list="false"
        v-show="isUpload"
        ref="upload"
        accept=".xls"
      >
        <el-button
          size="small"
          type="primary"
          @click="chooseFile"
          class="btn-file"
          >点击选择文件</el-button>
        <div slot="tip" class="el-upload__tip">仅支持excel文件</div>
      </el-upload>
      <div class="on-prosses" v-show="isProsses">
        <p v-show="isCompute" class="prosses-message">正在计算...</p>
        <p class="file-name">
          {{ fileName }}
          <i class="el-icon-error" v-if="isDisabled"></i>
          <span class="reupload-file" @click="reUpload" else>重新上传</span>
        </p>
        <el-button
          :class="startShow"
          :disabled="isCompute || isDisabled"
          @click="startCompute"
          >开始计算</el-button>
      </div>
    </div>
    <!-- 保存到数据库 -->
    <div class="save-message">
      <el-button type="success" @click="saveMessage" :disabled="isSave">
        保存到数据库 <i class="el-icon-upload"></i>
      </el-button>
    </div>
    <!-- 数据展示区 -->
    <div class="data-show" v-show="isMessage">
      <div class="header-show">
        <span>部门合计：{{ totalMoney.toFixed(2) }}元</span>
        <el-button @click="download" type="primary">下载表格 <i class="el-icon-download"></i></el-button>
      </div>
      <div class="footer-show">
        <p>详情:</p>
        <!-- tab栏 -->
        <ul class="btn-shows">
          <li
            v-for="(item, index) in tabList"
            :key="index"
            :class="[{ tag: index === currentIndex }, 'show-check']"
            @click="tagColor(item, index)"
          >
            {{ item }}
          </li>
        </ul>
        <user-tab :dataShow="dataShow"></user-tab>
      </div>
    </div>
  </div>
</template>

<script>
import UserTab from '../components/UserTab.vue';

import { saveFile, downloadExcel, multiTableQuery } from '../api/uploadFile.js';

export default {
  name: 'UploadFile',
  components: {
    UserTab,
  },
  data() {
    return {
      percentage: 0,
      isUpload: true,
      fileName: '',
      uploadPath: 'http://localhost:5000/api/upload/',
      isProsses: false,
      isDisabled: true,
      isCompute: false,
      isProgress: false,
      isMessage: false,
      isSave: true,
      fileList: [],
      isTag: false,
      tabList: ['PC', 'SDK', 'RTC', 'PM'],
      currentIndex: 0,
      dataList: [],
      dataShow: [],
      totalMoney: 0,
      year: '',
      month: '',
      pcList: [],
      sdkList: [],
      rtcList: [],
      pmList: [],
    };
  },
  computed: {
    startShow() {
      return {
        'compute-start': this.isCompute || this.isDisabled,
        'compute-end': !this.isCompute || !this.isDisabled,
      };
    },
  },
  methods: {
    // 点击上传文件
    chooseFile() {
      this.isMessage = false;
      this.dataList = [];
      this.clearUpload();
    },
    onProgress(event, file) {
      this.isProgress = true;
      this.fileName = file.name;
      this.year = this.fileName.slice(0, 4);
      this.month = this.fileName.slice(5, 7);
      this.isUpload = false;
      this.isProsses = true;
      this.percentage = 50;
    },
    onSuccess(response, file, fileList) {
      console.log('res', response);
      console.log('file', file);
      this.isDisabled = false;
      this.percentage = 100;
      this.fileList = fileList;
      console.log('文件信息:', this.fileList);
      this.isSave = false;
      this.listGroup({ year: this.year, month: this.month });
      this.$message({
        type: 'success',
        message: '上传成功',
      });
      setTimeout(() => {
        this.isProgress = false;
      }, 1000);
    },
    // 重新上传
    reUpload() {
      this.isUpload = true;
      this.isProsses = false;
      this.isMessage = false;
      this.isSave = true;
      this.dataList = [];
      this.clearUpload();
    },
    clearUpload() {
      this.dataShow = [];
      this.totalMoney = 0;
      this.fileList.shift();
    },
    // 计算
    startCompute() {
      this.clearUpload();
      this.isMessage = true;
      if (!this.dataList) {
        return this.$message.error('计算错误');
      }
      this.tagColor('PC', 0);
      this.dataList.forEach((item) => {
        this.totalMoney += item.total;
      });
      this.isUpload = true;
      this.isProsses = false;
    },
    async saveMessage() {
      let res = await saveFile(this.year, this.month);
      if (res.status === 200) {
        this.$message.success(res.message);
      } else if (res.status === 201) {
        this.$message.success(res.message);
      } else {
        this.$message.error(res.message);
      }
    },
    // 修改
    tagColor(group, index) {
      if (group === '') {
        this.currentIndex = index;
      } else {
        this.dataShow = [];
        this.currentIndex = index;
        console.log('当前点击的是', group);
        this.dataList.forEach((item) => {
          if (item.group.includes(group)) {
            this.dataShow.push(item);
          }
        });
      }
    },
    tabCom(tag) {
      let arr = [];
      this.dataList.forEach((item) => {
        if (item.group.includes(tag)) {
          arr.push(item);
        }
      });
      return arr;
    },
    // 下载表格的分组信息
    computeList(tag) {
      if (tag === 'PC') {
        this.pcList = this.tabCom(tag);
      } else if (tag === 'SDK') {
        this.sdkList = this.tabCom(tag);
      } else if (tag === 'RTC') {
        this.rtcList = this.tabCom(tag);
      } else if (tag === 'PM') {
        this.pmList = this.tabCom(tag);
      }
    },
    // 下载文件
    async download() {
      this.computeList('PC');
      this.computeList('SDK');
      this.computeList('RTC');
      this.computeList('PM');
      const result = await downloadExcel({
        pc: this.pcList,
        sdk: this.sdkList,
        rtc: this.rtcList,
        pm: this.pmList,
      }, 'arraybuffer');
      console.log('下载的数据', result);
      let data = result;
      let url = window.URL.createObjectURL(
        new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocment.spreadsheetml.sheet',
        })
      );
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', `${this.fileName}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 多表查询
    async listGroup(data) {
      const res = await multiTableQuery(data);
      console.log('多表查询返回的数据', res);
      // 这里做个遍历，把group和id彻底分离结合到一个对象里面，根据点击不同的按钮返回的值来匹配数据进行显示
      res.forEach((item) => {
        if (item.dataList.length !== 0) {
          let { dataList, name, total, traffic, meal } = item;
          let obj = {
            group: dataList[0].group,
            id: dataList[0].id,
            name,
            total,
            traffic: traffic === 0 ? traffic.toFixed(0) : traffic.toFixed(2),
            meal,
          };
          this.dataList.push(obj);
        }
      });
      console.log('获取的数据', this.dataList);
    },
  },
};
</script>

<style lang="scss" scoped>
#upload-file {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 100px auto;
  width: 500px;
  .upload-alert {
    color:#fff;
  }
  .upload {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 500px;
    height: 150px;
    text-align: center;
    background-color: #eee;
    .el-button {
      width: 150px;
      height: 35px;
      background-color: #169bd5;
    }
    .el-progress {
      position: absolute;
      top: 0;
      left: 0;
    }
    .el-icon-error {
      color: red;
      cursor: pointer;
    }
    .compute-start {
      position: absolute;
      bottom: 10px;
      right: 20px;
      background-color: #999;
      color: #fff;
    }
    .compute-end {
      position: absolute;
      bottom: 10px;
      right: 20px;
      background-color: #169bd5;
      color: #fff;
    }
    .reupload-file {
      color: #169bd5;
      cursor: pointer;
    }
  }
  .save-message {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }
  .data-show {
    .header-show {
      display: flex;
      justify-content: space-between;
      width: 500px;
      margin-top: 20px;
    }
    .footer-show {
      width: 500px;
      height: 1000px;
      .btn-shows {
        .show-check {
          float: left;
          color: #333;
          list-style: none;
          cursor: pointer;
          margin-right: 10px;
          font-size: 16px;
          .show-divide {
            color: #000;
          }
        }
        .tag {
          color: #169bd5 !important;
        }
      }
    }
  }
}

</style>
