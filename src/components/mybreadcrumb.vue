<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="my-breadcrumb">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{second}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{third}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  // 对外暴露的可以设置的属性
  props:['second','third']
};
</script>

<style>
.el-breadcrumb.my-breadcrumb {
  height: 45px;
  line-height: 45px;
  background-color: #d3dce6;
  padding-left: 10px;
}
</style>
