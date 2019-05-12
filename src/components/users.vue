<template>
  <div>
    <!-- 面包屑 -->
    <mybreadxie second="用户管理吗？" third="用户列表(＾－＾)V"></mybreadxie>
    <!-- 栅格布局搜索栏 -->
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-input
            placeholder="请输入内容"
            @keyup.native.enter="search"
            v-model="sendData.query"
            class="input-with-select"
          >
            <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <!-- 添加按钮 -->
          <el-button type="success" @click="addFormVisiable=true" plain>添加用户</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="statusChange(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="current">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(current.row)"
            plain
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delOne(current.row)"
            plain
            size="mini"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            @click="chooseRule(current.row)"
            plain
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :page-sizes="[2, 4, 6, 8]"
      :page-size="sendData.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></el-pagination>

    <!-- 对话框 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addFormVisiable">
      <el-form
        :model="addForm"
        :rules="rules"
        label-position="right"
        label-width="80px"
        class="my-form"
        status-icon
        ref="addForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 添加用户 -->
    <el-dialog title="编辑用户" :visible.sync="editFormVisiable">
      <el-form
        :model="editForm"
        :rules="rules"
        label-position="right"
        label-width="80px"
        class="my-form"
        status-icon
        ref="editForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 角色框 -->
    <el-dialog title="角色分配" :visible.sync="ruleFormVisiable">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-position="right"
        label-width="120px"
        class="my-form"
        status-icon
        ref="ruleForm"
      >
        <el-form-item label="当前用户" prop="username">{{ruleForm.username}}</el-form-item>
        <el-form-item label="请选择角色" prop>
          <el-select v-model="ruleForm.role_name" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleFormVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入组件 使用组件
// import mybreadxie from "./mybreadcrumb.vue";
export default {
  // 局部注册组件
  // components: {
  //   mybreadxie
  // },
  data() {
    // 邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      // 延迟延迟
      setTimeout(() => {
        // 定义正则表达式
        let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        // 验证是否匹配
        if (reg.test(value)) {
          // 格式匹配
          callback();
        } else {
          // 不匹配
          callback(new Error("请正确输入邮箱"));
        }
      }, 1000);
    };
    // 验证手机号
    var checkMobile = (rule, value, callback) => {
      if (value != "") {
        // 延迟延迟
        setTimeout(() => {
          // 定义正则表达式
          let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
          // 验证是否匹配
          if (reg.test(value)) {
            // 格式匹配
            callback();
          } else {
            // 不匹配
            callback(new Error("请正确输入手机号"));
          }
        }, 1000);
      } else {
        callback();
      }
    };
    return {
      // 提交的数据
      sendData: {
        query: "",
        pagenum: "1",
        pagesize: 2
      },
      // 总条数
      total: 0,
      // table数据
      tableData: [],
      // 标记新增框是否显示
      addFormVisiable: false,
      // 标记新增框是否显示
      editFormVisiable: false,
      // 标记角色框是否显示
      ruleFormVisiable: false,
      // 新增的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 编辑的表单数据
      editForm: {
        username: "",
        email: "",
        mobile: ""
      },
      // 角色的表单数据
      ruleForm: {
        username: "",
        email: "",
        mobile: ""
      },
      // 角色列表
      roleList: [],
      // 新增的表单数据验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 13, message: "长度在 6 到 13 个字符", trigger: "blur" }
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }]
      }
    };
  },
  // 方法
  methods: {
    async handleEdit(item) {
      // 弹框
      this.editFormVisiable = true;
      // 接口调用
      let res = await this.$http.get(`users/${item.id}`);
      // console.log(res);
      // 设置给编辑的表单数据
      this.editForm = res.data.data;
    },
    // 查询数据
    async search() {
      let res = await this.$http.get("users", {
        // headers: {
        //   Authorization: window.sessionStorage.getItem("token")
        // },
        params: this.sendData
      });
      // 数据赋值
      this.tableData = res.data.data.users;
      // 设置总条数
      this.total = res.data.data.total;
    },
    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // 数据正确
          // 提取 res生命
          let res;
          // 提交数据即可
          if (formName == "editForm") {
            // console.log("编辑");
            res = await this.$http.put(
              `users/${this.editForm.id}`,
              this.editForm
            );
          } else if (formName == "addForm") {
            res = await this.$http.post("users", this.addForm, {});
          } // 角色表单提交
          else if (formName == "ruleForm") {
            res = await this.$http.put(`users/${this.ruleForm.id}/role`, {
              rid: this.ruleForm.role_name
            });
            // console.log(res);
          }
          // console.log(res);
          // 重新获取数据(局部刷新)
          if (res.data.meta.status == "201" || res.data.meta.status == "200") {
            // 重新获取数据
            this.search();
            // 收起框框
            this.addFormVisiable = false;
            this.editFormVisiable = false;
            this.ruleFormVisiable = false;
            // 重置表单
            this.$refs[formName].resetFields();
          }
        } else {
          // 数据错误
          this.$message.warning("请正确输入数据");
          return false;
        }
      });
    },
    // 删除数据
    delOne(item) {
      this.$confirm("你真的要把它干掉？", "提示", {
        confirmButtonText: "狠心确认",
        cancelButtonText: "善心拒绝",
        type: "warning"
      })
        .then(async () => {
          // 确认
          // console.log(item);
          let res = await this.$http.delete(`users/${item.id}`);
          // console.log(res)
          if (res.data.meta.status == 200) {
            this.search();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "你真好！！"
          });
        });
    },
    // 状态改变
    async statusChange(item) {
      // console.log(item);
      // 调用接口
      let res = await this.$http.put(`users/${item.id}/state/${item.mg_state}`);
      console.log(res);
    },
    // 选择角色
    async chooseRule(item) {
      // 弹框
      this.ruleFormVisiable = true;
      // 保存数据
      this.ruleForm = item;
      // 获取角色信息
      let res = await this.$http.get("roles");
      // console.log(res);
      this.roleList = res.data.data;
    },
    // 页容量改变
    sizeChange(size) {
      // console.log(size);
      this.sendData.pagesize = size;
      // 重新获取数据
      this.search();
    },
    // 页码改变
    currentChange(current) {
      // console.log(current);
      this.sendData.pagenum = current;
      this.search();
    }
  },
  // 数据获取
  created() {
    // let res = await this.$http.get('users',this.sendData);
    this.search();
  }
};
</script>

<style>
.my-form {
  height: auto;
  padding: 0;
}
</style>
