// Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大.
// Axios 是一个基于 promise 的 HTTP 库
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'

// 1新建一个 axios 实例，使用自定义请求配置新建一个 axios 实例
const service = axios.create({
  // node模块环境变量：process.env，process是node的全局模块，可以通过它来获得node进程相关的信息
  baseURL: process.env.VUE_APP_BASE_API,
  // url = base url + request url,将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  timeout: 5000 // 请求超时的毫秒数(0 表示无超时时间)
  // withCredentials: true // send cookies when cross-domain requests
})

// 2Request interceptors 请求拦截器,在请求被 then 或 catch 处理前拦截它们。
service.interceptors.request.use(
  // 在发送请求之前做些什么：config请求配置
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['X-Access-Token'] = UserModule.token
    }
    return config
  },
  // 对请求错误做些什么
  (error) => {
    Promise.reject(error)
  }
)

// 3Response interceptors 响应拦截器
service.interceptors.response.use(
  (response) => { // response为响应结构
    // Some example codes here:
    // code == 20000: success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // You can change this part for your own usage.
    const res = response.data // 返回值：由服务器提供的响应
    if (res.code !== 20000) { // 自定义码
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken()
          location.reload() // To prevent bugs from vue-router
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response.data // 返回由服务器提供的响应
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 4导出axios实例
// export default命令，为模块指定默认输出。其他模块加载该模块时，import命令可以为该匿名函数指定任意名字。
// 需要注意的是，这时import命令后面，不使用大括号。
// 一个模块只能有一个默认输出，因此export default命令只能使用一次
export default service
