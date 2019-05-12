<template>
  <div>
    <!-- 面包屑 -->
    <mybreadxie second="数据统计" third="数据报表"></mybreadxie>
    <!-- echarts容器 div -->
    <div id="main" ref="container" style="width: 800px;height:400px;"></div>
  </div>
</template>

<script>
// 局部引入 echarts
import echarts from "echarts";
import $ from 'jquery';
export default {
  data() {
    return {
      options: {
        title: {
          text: "用户来源"
        },
        // echarts的设置
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        // 顶部内容
        legend: {
          data: []
        },
        // 希望开启的功能
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        // 布局的尺寸
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: []
      }
    };
  },

  // Vue实例挂在到dom元素上
  // 在这里才可以操纵dom元素 之前不行
  async mounted() {
    // 数据获取
    let res = await this.$http.get("reports/type/1");
    // console.log(res);
    // 合并数据 服务器返回的 覆盖本地的 同名属性
    // 使用循环合并数据 额外添加属性-----
    // for (const key in res.data.data) {
    //   this.options[key] = res.data.data[key];
    // }
    // // 增加设置 x轴从最左边开始
    // this.options.xAxis[0].boundaryGap = false;


    // es6中有一个对象合并语法
    // 参数1 合并到的对象
    // 参数2 合并的对象
    // 浅拷贝，只会合并 最外层的属性 内部的并不会合并
    // Object.assign(this.options,res.data.data);
    // this.options.xAxis[0].boundaryGap = false;

    // 框架中也有对象合并的语法 $.extend
    $.extend(true,this.options,res.data.data);
    


    let myChart = echarts.init(this.$refs.container);
    myChart.setOption(this.options);
  }
};
</script>

<style>
</style>
