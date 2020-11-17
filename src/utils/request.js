// 基于axios封装请求模块
import axios from 'axios'

// 创建一个axios实例 就是复制了一个axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'// 请求的基础路径
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

export default request
