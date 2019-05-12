import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// Vue.config.productionTip = true

// 导入 router
import router from './lib/router'

// 导入饿了么ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 导入抽取的axios插件
import http from './lib/http'
Vue.use(http)

// 全局导入 面包屑组件 并注册
import mybreadxie from './components/mybreadcrumb.vue'
Vue.component('mybreadxie', mybreadxie)

// 导入
import Vuex from 'vuex'

// use
Vue.use(Vuex)

// 实例化
const store = new Vuex.Store({
  //  数据
  state: {
    // 菜单
    menuList: []
  },
  // 方法
  mutations: {
    setMenu(state, newMenu) {
      state.menuList = newMenu
    }
  }
})

new Vue({
  render: h => h(App),
  router,
  // 设置仓库
  store
}).$mount('#app')
