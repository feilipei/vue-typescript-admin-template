import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
// Element UI 是一套采用 Vue 2.0 作为基础框架实现的组件库
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

// App.vue已经把components文件夹里面的组件都整合在一起了，为根组件
import App from '@/App.vue'
import store from '@/store'
import { AppModule } from '@/store/modules/app'
// 导入router目录下的index.ts
import router from '@/router'
import i18n from '@/lang'
import '@/icons/components'
import '@/permission'
import '@/utils/error-log'
import '@/pwa/register-service-worker'
import * as directives from '@/directives'
import * as filters from '@/filters'

// 安装 Vue.js 插件
// 引入完整的 Element，全局配置对象，size 用于改变组件的默认尺寸，zIndex 设置弹框的初始 z-index（默认值：2000）
Vue.use(ElementUI, {
  size: AppModule.size, // Set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value)
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

// Register global directives 。
// Object.keys方法用来遍历对象的属性。参数是一个对象，返回一个数组.
// forEach方法与map方法很相似，也是对数组的所有成员依次执行参数函数。但是forEach方法不返回值，只用来操作数据
Object.keys(directives).forEach(key => {
  // 注册或获取全局指令
  Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  // 注册或获取全局过滤器。
  Vue.filter(key, (filters as { [key: string ]: Function })[key])
})

// 全局配置：设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

// main.js是项目的入口文件，定义了vue实例，并引入根组件app.vue，将其挂载到public文件夹下index.html中id为‘app’的节点上
// 1.入口文件是一个webpack概念；入口文件是webpack构建内部依赖图的起点。
// 2.app.js是由webpack打包生成的输出文件。
// 3.而将app.js挂载到index.html这一过程是由webpack的一个插件——html-webpack-plugin完成的。

// 每个Vue应用程序都通过使用以下函数创建一个新的Vue实例开始。
// 一个Vue应用程序由一个创建的根Vue实例组成new Vue，可选地组织成一个嵌套的可重用组件树
new Vue({
  router, // 相当于router：router,将路由对象传递给Vue的实例
  store, // 在vue实例全局引入store对象
  i18n,
  render: (h) => h(App) // 等价于components: { App }  vue1.0的写法
  // 如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用 vm.$mount() 手动地挂载一个未挂载的实例。等价于el: '#app'
  // 如果一个组件没有挂载那就相当声明了之后却没有使用它。将它挂载到id为app的div上，这个id为app又是在哪里？很简单，就在src同级目录下的index.html文件里。
}).$mount('#app')
