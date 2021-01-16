// 获取 粉丝列表
import request from '../utils/request'

export const getFans = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/followers',
    params
  })
}
