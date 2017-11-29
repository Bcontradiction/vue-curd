// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入axios
import axios from  'axios'
//引入vuex
import Vuex from 'vuex'
//引入element-ui
import ElementUi from 'element-ui'
//
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false

//创建过滤器
Vue.filter('formatter',function (value) {
  if(value == true){
    return '启用'
  }
  return '停用'
})

// 使用vuex
Vue.use(Vuex)
//使用element-ui
Vue.use(ElementUi)
//传建一个vuex的实例
const store = new Vuex.Store({
  //存放数据的地方
  state:{

  },
//  getter也是存放数据的地方，但是这里和state的区别主要在于getter中用于计算后的结果
  getter:{

  },
//  用于改变状态的地方
  mutations:{

  },
//  也适用于改变状态的地方,蛋通常用于异步改变
  actions:{

  },
  //木块
  modules:{

  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, //Vue-router
  store,  //VueX
  template: '<App/>',
  components: { App },
  render: h => h(App)
})
