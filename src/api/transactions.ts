// 导入axios实例，request为axios实例
import request from '@/utils/request'

// ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法,这时属性名就是变量名, 属性值就是变量值
// 可以通过向 axios 传递相关配置来创建请求：axios(config)
export const getTransactions = (params: any) =>
  request({
    url: '/transactions', // 用于请求的服务器 URL
    method: 'get', // 创建请求时使用的方法
    params // 即将与请求一起发送的URL参数必须是一个无格式对象(plain object)或 URLSearchParams 对象
  })

// request请求配置:这些是创建请求时可以用的配置选项。只有 url 是必需的
// `headers` 是即将被发送的自定义请求头
// `data` 是作为请求主体被发送的数据,只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
// `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
// 'proxy' 定义代理服务器的主机名称和端口

// response响应结构:某个请求的响应包含以下信息
// `data` 由服务器提供的响应
// `status` 来自服务器响应的 HTTP 状态码
