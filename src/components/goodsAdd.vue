<template>
  <el-card class="box-card">
    <!-- 提示框 -->
    <el-alert class="alert" title="添加商品信息" type="info" center :closable="false" show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps class="steps" :space="400" align-center :active="active*1" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tabs选项卡 -->
    <!-- element-ui已经封装好了，当切换时,v-model的值自动切换为el-tabs-pane的name对应的值. -->
    <el-tabs class="tabs" v-model="active" tab-position="left" style="height: 200px;">
      <el-tab-pane name="1" label="基本信息">基本信息</el-tab-pane>
      <el-tab-pane name="2" label="商品参数">商品参数</el-tab-pane>
      <el-tab-pane name="3" label="商品属性">商品属性</el-tab-pane>
      <el-tab-pane name="4" label="商品图片">商品图片</el-tab-pane>
      <el-tab-pane name="5" label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
export default {};
</script>
<style>
</style>
