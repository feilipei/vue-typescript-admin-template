// request为axios实例
import request from '@/utils/request'

// request向后台发送请求

// 函数表达式，变量赋值的写法，
// “箭头”（=>）定义函数。如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。
// 将一个匿名函数赋值给变量。这时这个匿名函数又称函数表达式（Function Expression）
// 函数名login
export const login = (data: any) =>
  request({
    url: '/users/login', // 用于请求的服务器 URL
    method: 'post', // 创建请求时使用的方法
    data // 作为请求主体被发送的数据,只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  })

// 函数表达式：函数声明
export const getUsers = (params: any) =>
  request({
    url: '/users',
    method: 'get',
    params // 即将与请求一起发送的 URL 参数
  })

export const getUserInfo = (data: any) =>
  request({
    url: '/users/info',
    method: 'post',
    data // 作为请求主体被发送的数据,只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  })

export const getUserByName = (username: string) =>
  request({
    // 模板字符串是增强版的字符串，用反引号（`）标识，在字符串中嵌入变量，需要将变量名写在${}之中
    url: `/users/${username}`,
    method: 'get'
  })

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: 'put',
    data
  })

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'delete'
  })

export const logout = () =>
  request({
    url: '/users/logout',
    method: 'post'
  })

export const register = (data: any) =>
  request({
    url: '/users/register',
    method: 'post',
    data
  })
