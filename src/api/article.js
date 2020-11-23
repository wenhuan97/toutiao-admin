// 用户相关的请求模块
import request from '../utils/request'

// 文章相关的请求模块
export const getArticle = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // 设置GET请求体
    // baby参数使用data设置
    // Query参数使用params设置
    // Headers 参数使用 headers设置
    params
  })
}

// 获取文章频道
export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章
export const deleteArt = articleId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 发布文章
export const publishArt = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: { // 是否存为草稿 true存为草稿
      draft
    },
    data
  })
}

// 修改文章
export const updateArticle = (id, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${id}`,
    params: { // 是否存为草稿 true存为草稿
      draft
    },
    data
  })
}

// 获取文章
export const getArt = (id) => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${id}`
  })
}

// 修改文章盘评论状态
export const updataCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}
