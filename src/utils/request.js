// 基于axios封装请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '../router'
import { Message } from 'element-ui'

// 创建一个axios实例 就是复制了一个axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 请求的基础路径
  // 专门用于定义 后端返回原始数据 的处理
  // data 为后端原始的 字符串数据
  transformResponse: [function (data) {
    // 后台返回的数据可能不是JSON格式的字符串
    // 如果不是JSONbig就报错 使用try catch 捕获异常 处理异常的发生

    try {
      // 默认 return的是 JSON.parse(data)
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  //  所有请求会经过这里
  // config 是当前请求相关的配置信息对象
  // config 是可以修改的
  // console.log(config);
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  // 如果有 登录信息 就统一设置 token
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, function (error) {
  // 请求失败经过这里
  return Promise.reject(error)
})

// 响应拦截器
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // 所有 2.xx 的响应码 都会经过这里
  return response
}, function (error) {
  // 所有超过2.xx的响应码 都会经过这里
  const status = error.response.status
  if (status === 401) {
    window.localStorage.removeItem('userInfo')
    // 跳转到登录页面
    router.push('/login')
    Message.error('登录状态无效，请重新登陆')
  } else if (status === 403) {
    // 没有操作权限
    Message.error('登录失败，没有操作权限')
  } else if (status === 400) {
    // 客户端参数错误
    Message.error('登录失败，请检查请求参数')
  } else if (status >= 500) {
    // 没有操作权限
    Message.error('服务器端内部异常，请稍后再试')
  }
  return Promise.reject(error)
})
export default request
