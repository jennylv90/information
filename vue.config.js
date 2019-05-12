module.exports = {
  // 取消map文件,
  productionSourceMap: false,
  // 基础路径默认是 /
  publicPath: './',
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      // 饿了吗ui
      'element-ui': 'ELEMENT'
    }
  }
}
