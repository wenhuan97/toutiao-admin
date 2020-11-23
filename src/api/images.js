// 上传用户图片素材
import request from '../utils/request'

export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    data
    // 一般上传文件的接口 都要求把请求头中的Content-Type 设置为 multipart/form-data
    // 如果使用axios上传文件 不需手动设置 只需给 data 一个 FormData 对象即可
  })
}

// 获取文章图片素材
export const getImage = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

// 收藏图片素材
export const collectImg = (imgId, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imgId}`,
    data: {
      collect
    }
  })
}

// 删除图片素材
export const deleteImg = imgId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imgId}`
  })
}
