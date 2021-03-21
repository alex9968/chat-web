/* eslint-disable no-unused-vars */
import Vue from 'vue'
// import axios from 'axios'
import { MessageBox, Message, Row, Collapse, DatePicker, Radio, CollapseItem, TabPane, Tabs, Avatar, Image, Col, Button, Input, Loading, Dialog, Dropdown, DropdownMenu, DropdownItem, FormItem, Select, Option } from 'element-ui'
//import ElementUI from 'element-ui'
import MyAvatar from './components/avatar.vue'
import App from './App.vue'
import store from './store/index'
import API from './services/index'
import router from './router/index'
import tim from 'tim'
import TIM from 'tim-js-sdk'
import './assets/icon/iconfont.css'
import './assets/icon/tim.css'


window.tim = tim
window.TIM = TIM
window.API = API
window.store = store
Vue.prototype.$bus = new Vue() // event Bus 用于无关系组件间的通信。
Vue.prototype.tim = tim
Vue.prototype.TIM = TIM
Vue.prototype.API = API
Vue.prototype.$store = store
// Vue.prototype.$confirm = MessageBox.confirm
// Vue.prototype.$message= Message
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Avatar)
Vue.use(Image)
Vue.use(Loading)
Vue.use(TabPane)
Vue.use(DatePicker)
Vue.use(Radio)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tabs)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(Select)
Vue.use(Option)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(FormItem)
Vue.component('avatar', MyAvatar)

// 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   // 判断是否存在token,如果存在将每个页面header添加token
//   if (localStorage.getItem("token")) {
//     config.headers.common['Authorization'] = sessionStorage.getItem("token");
//   }
//   return config
// }, function (error) {
//   router.push('/login')
//   return Promise.reject(error)
// })
// Vue.use(axios)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
