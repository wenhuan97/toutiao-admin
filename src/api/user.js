// 用户相关的请求模块
import request from '../utils/request'
// 用户登录

// 拿到 存储在本地中的 token 令牌
// const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
// console.log(userToken)
export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    // 设置POST请求体
    data
  })
}

// 获取用户资料
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
    // 后端要求把需要授权的 用户身份 放到请求头中
    // axios可以通过headers设置请求头
    // headers: {
    //   // 属性名和属性值 要看后端的要求
    //   Authorization: `Bearer ${userInfo.token}`
    // }
  })
}

// 编辑用户头像
export const updataUserAvatar = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}

// 编辑用户资料
export const updataUser = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}
