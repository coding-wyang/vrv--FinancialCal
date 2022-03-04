<template>
  <div id="user-manage">
    <div class="header-search">
      <el-row class="search">
        <el-col :span="3">
          <el-button type="primary" @click="addUser" class="add-btn"
            >添加</el-button
          >
        </el-col>
        <el-col :span="6">
          <user-group
            :divideGroup="divideGroup"
            @groupCheck="groupCheck"
            ref="userGroup"
          ></user-group>
        </el-col>
      </el-row>
    </div>
    <div class="tab-message">
      <el-table :data="tabShow" stripe style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="group" label="小组"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEdit(scope)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="userDelete(scope)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加弹出框 -->
    <el-dialog
      title="用户信息"
      :visible.sync="isVisible"
      width="50%"
      @close="clearAdd"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分组" prop="group">
          <el-select v-model="addForm.group" placeholder="请选择">
            <el-option
              :label="item"
              :value="item"
              v-for="(item, index) in groups"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取消</el-button>
        <el-button type="primary" @click="uploadData">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="isEdit"
      width="50%"
      @close="clearEdit"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分组" prop="group">
          <el-select v-model="editForm.group" placeholder="请选择">
            <el-option
              :label="item"
              :value="item"
              v-for="(item, index) in groups"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEdit = false">取消</el-button>
        <el-button type="primary" @click="userEdit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UserGroup from '../components/UserGroup.vue';

import { getData, editUser, saveData, deleteUser } from '../api/userManage.js';

export default {
  name: 'ManageMent',
  components: {
    UserGroup,
  },
  data() {
    return {
      groups: ['PC', 'SDK', 'RTC', 'PM'],
      divideGroup: ['PC', 'SDK', 'RTC', 'PM', 'total'],
      tableList: [],
      tabShow: [],
      isVisible: false,
      addForm: {
        id: '',
        name: '',
        group: '',
      },
      editForm: {
        id: '',
        name: '',
        group: '',
      },
      isEdit: false,
      groupSave: '',
      addRules: {
        name: [
          { required: true, message: '请输入2到5个字符', trigger: 'blur' },
          {
            min: 2,
            max: 5,
            message: '长度在 2 到 5个字符',
            trigger: 'blur',
          },
        ],
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入2到5个字符', trigger: 'blur' },
          {
            min: 2,
            max: 5,
            message: '长度在 2 到 5个字符',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  watch: {
    editForm(newValue) {
      this.editForm = newValue;
    }
  },
  created() {
    this.getTabList();
  },
  methods: {
    // 显示添加用户弹框
    addUser() {
      this.isVisible = true;
      this.$nextTick(() => {
        if (this.groupSave) {
          this.addForm.group = this.groupSave;
        }
      });
    },
    // 删除用户
    userDelete(scope) {
      this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(async () => {
          const id = scope.row.id;
          const res = await deleteUser(id);
          if (res.status === 200) {
            this.$message.success('删除用户成功');
            this.getTabList(this.groupSave);
          }
        })['catch'](() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 关闭添加弹窗清除表单的内容
    clearAdd() {
      this.$refs.addRuleForm.resetFields();
      this.isVisible = false;
    },
    // 关闭修改弹窗清除表单的内容
    clearEdit() {
      this.$refs.editRuleForm.resetFields();
      this.isEdit = false;
    },
    // 添加数据
    uploadData() {
      this.$refs.addRuleForm.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请输入正确的姓名');
        }
        let id = `vrv${Math.random().toString(36).substr(3)}`;
        this.addForm.id = id;
        const res = await saveData(this.addForm);
        console.log('保存数据库', res);
        if (res.status === 200) {
          this.$message.success('保存数据库成功!');
          this.getTabList(this.groupSave);
          this.$refs.userGroup.groupSave = '';
        }
        this.isVisible = false;
      });
    },
    // 获取列表数据
    async getTabList(divideGroup) {
      this.tableList = [];
      const res = await getData();
      if (divideGroup) {
        res.forEach((item) => {
          if (item.group.includes(divideGroup)) {
            this.tableList.push(item);
          }
        });
      } else {
        res.forEach((item) => {
          this.tableList.push(item);
        });
      }
      this.tabShow = this.tableList;
    },
    showEdit(scope) {
      this.isEdit = true;
      this.editForm.group = scope.row.group;
      this.editForm.name = scope.row.name;
      this.editForm.id = scope.row.id;
    },
    // 修改员工信息
    async userEdit() {
      const res = await editUser(this.editForm);
      console.log('修改之后返回的数据', res);
      console.log('小组', this.groupSave);
      if (res.status === 200) {
        this.$message.success('用户信息更新成功');
      }
      this.getTabList(this.groupSave);
      this.isEdit = false;
    },
    // 切换分组
    groupCheck(data) {
      this.tabShow = [];
      this.groupSave = data;
      this.getTabList(this.groupSave);
      this.tableList.forEach((item) => {
        if (item.group.includes(this.groupSave)) {
          this.tabShow.push(item);
        }
      });
      if (this.groupSave === 'total') {
        this.groupSave = '';
        this.getTabList(this.groupSave);
        this.$refs.userGroup.groupSave = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#usermanage {
  width: 800px;
  margin: auto;
  .header-search {
    display: flex;
    justify-content: center;
    .search {
      width: 100%;
      .add-btn {
        width: 100%;
      }
    }
  }
  .tab-message {
    height: 1000px;
  }
}
</style>
