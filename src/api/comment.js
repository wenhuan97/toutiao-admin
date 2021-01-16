// 获取 评论
import request from '../utils/request'

export const getComment = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments'
  })
}
