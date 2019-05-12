<template>
  <div>
    <!-- 面包屑 -->
    <mybreadxie second="商品管理" third="商品列表"></mybreadxie>
    <!-- 栅格布局搜索栏 -->
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <!-- 添加按钮 -->
          <el-button type="danger" plain>添加商品</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="current">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :page-sizes="[2, 4, 6, 8]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{}, {}]
    };
  }
};
</script>

<style>
</style>
