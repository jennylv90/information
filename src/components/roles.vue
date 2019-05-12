<template>
  <div>
    <!-- 面包屑 -->
    <mybreadxie second="权限管理" third="角色列表"></mybreadxie>
    <!-- 按钮 -->
    <el-button type="success" @click="addFormVisiable=true">添加角色</el-button>
    <!-- table -->
    <el-table :data="tableData5" style="width: 100%" border>
      <!-- tag的容器 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- 最顶级 -->
          <el-row v-for="level1 in props.row.children" class="my-row">
            <el-col :span="6">
              <el-tag
                type="primary"
                closable
                @close="delTag(level1,props.row)"
                :key="level1.id"
              >{{level1.authName}}</el-tag>
              <!-- 图标箭头 -->
              <span class="el-icon-arrow-right"></span>
            </el-col>
            <el-col :span="18">
              <!-- 栅格 -->
              <el-row v-for="level2 in level1.children">
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="delTag(level2,props.row)"
                    :key="level2.id"
                  >{{level2.authName}}</el-tag>
                  <!-- 图标箭头 -->
                  <span class="el-icon-arrow-right"></span>
                </el-col>
                <el-col :span="18">
                  <!-- 循环tag即可 -->
                  <el-tag
                    type="warning"
                    v-for="level3 in level2.children"
                    @close="delTag(level3,props.row)"
                    :key="level3.id"
                    class="my-tag"
                    closable
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 如果没有权限 -->
          <el-row v-if="props.row.children.length==0">没有分配权限</el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="current">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="editOne(current.row)"
            plain
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            @click="delOne(current.row)"
            icon="el-icon-delete"
            plain
            size="mini"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            @click="distOne(current.row)"
            plain
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出的对话框 新增 -->
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 编辑用户 -->
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 权限分配 -->
    <el-dialog title="权限分配" :visible.sync="treeVisiable">
      <!-- tree -->
      <el-tree
        :default-checked-keys="checkedKeys"
        default-expand-all
        :props="props"
        :data="treeData"
        show-checkbox
        node-key="id"
        ref="tree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treeVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 是否显示新增框
      addFormVisiable: false,
      // 新增的数据
      addForm: {},
      tableData5: [],
      // 是否显示编辑框
      editFormVisiable: false,
      // 编辑的数据
      editForm: {
        roleName: "",
        roleDesc: ""
      },
      // 验证规则
      rules: {
        roleName: [{ required: true, message: "不能为空", trigger: "blur" }],
        roleDesc: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      // 树形菜单数据
      treeData: [],
      // props属性
      props: {
        label: "authName",
        children: "children"
      },
      // 是否显示树形菜单
      treeVisiable: false,
      // 默认选中的节点
      checkedKeys: [],
      // 当前编辑的角色
      editItem: {}
    };
  },
  methods: {
    async getRoles() {
      let res = await this.$http.get("roles");
      // console.log(res);
      this.tableData5 = res.data.data;
    },
    // 点击close事件
    async delTag(tag, item) {
      // 调用删除角色指定权限接口
      let res = await this.$http.delete(`roles/${item.id}/rights/${tag.id}`);
      // 重新赋值权限
      // 是一个地址 本质还是大数组中的某一项
      item.children = res.data.data;
    },
    // 删除一个角色
    delOne(item) {
      // 对话框
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 确认
          let res = await this.$http.delete(`roles/${item.id}`);
          // console.log(res);
          if (res.data.meta.status === 200) {
            this.getRoles();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 进入编辑状态
    async editOne(item) {
      // 获取角色信息的接口
      let res = await this.$http.get(`roles/${item.id}`);
      // console.log(res);
      this.editForm = res.data.data;
      // 弹出对话框
      this.editFormVisiable = true;
    },
    // 提交数据
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // let有块级作用域
          let res;
          if (formName === "editForm") {
            res = await this.$http.put(`roles/${this.editForm.roleId}`, {
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc
            });
          } else if (formName === "addForm") {
            res = await this.$http.post(`roles`, {
              roleName: this.addForm.roleName,
              roleDesc: this.addForm.roleDesc
            });
          }
          // console.log(res);
          if (res.data.meta.status === 200 || res.data.meta.status === 201) {
            this.getRoles();
            this.editFormVisiable = false;
            this.addFormVisiable = false;
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    // 弹出分配权限框
    async distOne(item) {
      // 获取所有的权限
      let res = await this.$http.get("rights/tree");
      this.treeData = res.data.data;
      // 弹框
      this.treeVisiable = true;
      // 获取选中的项
      // console.log(item);
      let checkedIds = [];
      function getCheckedIds(item) {
        if (item.children) {
          item.children.forEach(v => {
            // 继续调用自己
            getCheckedIds(v);
          });
        } else {
          // 没有后代了 这一项是被选中的
          checkedIds.push(item.id);
        }
      }
      getCheckedIds(item);
      // console.log(checkedIds);
      // 设置选中的项
      this.checkedKeys = checkedIds;

      // 保存当前编辑的项
      this.editItem = item;
    },
    // 保存权限
    async submit() {
      // 获取选中的key
      let checkedKeys = this.$refs.tree.getCheckedKeys();
      // 获取半选中的key
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      // console.log(checkedKeys);
      // console.log(halfCheckedKeys);
      // 接口调用
      let res = await this.$http.post(`roles/${this.editItem.id}/rights`, {
        rids: [...checkedKeys, ...halfCheckedKeys].join(",")
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.treeVisiable = false;
        this.getRoles();
        // 重新获取菜单数据即可
        let res = await this.$http.get("menus");
        // 设置到Vuex中
        this.$store.commit("setMenu", res.data.data);
      }
    }
  },
  created() {
    this.getRoles();
  }
};
</script>

<style scoped>
.my-row {
  margin-bottom: 10px;
}
.my-tag {
  margin-right: 5px;
  margin-bottom: 10px;
}
</style>
