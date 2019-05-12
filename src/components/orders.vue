<template>
  <div>
    <!-- 面包屑 -->
    <mybreadxie second="订单管理" third="订单列表"></mybreadxie>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="order_number" label="订单标号" width="180"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="180"></el-table-column>
      <el-table-column prop="order_pay" label="是否付款">
        <template slot-scope="scope">
          <el-button v-if="scope.row.order_pay==='0'" type="danger">未付款</el-button>
          <el-button v-else type="success">已付款</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column prop="create_time" label="下单时间">
        <template slot-scope="scope">{{scope.row.create_time | formatTime}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="current">
          <el-button
            type="primary"
            @click="editVisiable=true"
            icon="el-icon-edit"
            plain
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :total="total"
      :page-sizes="[5, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></el-pagination>
    <!-- 对话框 角色框 -->
    <el-dialog title="订单信息修改" :visible.sync="editVisiable">
      <el-form
        :model="editForm"
        label-position="right"
        label-width="120px"
        class="my-form"
        status-icon
        ref="editForm"
      >
        <el-form-item label="省市区/县" prop>
          <!-- 饿了吗ui的级联选择器 -->
          <el-cascader expand-trigger="hover" :options="options" v-model="selectedOptions2"></el-cascader>
          <!-- 省市联动独立组件 -->
          <v-distpicker></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址" prop>
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
// 导入数据
import options from "../lib/city_data2017_element.js";
// 独立的省市联动插件
import VDistpicker from "v-distpicker";
export default {
  data() {
    return {
      tableData: [{}, {}],
      // 数据
      sendData: {
        pagenum: 1,
        pagesize: 10
      },
      // 总条数
      total: 0,
      // 级联选择器数据
      options,
      selectedOptions2: [],
      // 标记弹框显示的字段
      editVisiable: false
    };
  },
  // 注册组件
  components: { VDistpicker },
  // 过滤器
  filters: {
    formatTime(value) {
      // 处理时间 并返回 基于moment
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  methods: {
    // 获取数据
    async getOrderData() {
      let res = await this.$http.get("orders", { params: this.sendData });
      // console.log(res);
      this.tableData = res.data.data.goods;
      this.total = res.data.data.total;
    },
    // 实现代码
    sizeChange(size) {
      // console.log(size);
      this.sendData.pagesize = size;
      this.getOrderData();
    },
    currentChange(current) {
      // console.log(current);
      this.sendData.pagenum = current;
      this.getOrderData();
    }
  },
  created() {
    // 获取数据
    this.getOrderData();
  }
};
</script>

<style>
</style>
