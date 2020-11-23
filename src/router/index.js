import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Home from '../views/home'
import Layout from '../views/layout'
import Article from '../views/article'
import Publish from '../views/publish'
import Images from '../views/images'
import Comment from '../views/comment'
import Settings from '../views/setting'
import Fans from '../views/fans'

Vue.use(VueRouter)

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/images',
        name: 'images',
        component: Images
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由拦截器 所有页面的导航都会经过这里
// to:去哪
// from:来自哪
// next:放行

router.beforeEach((to, from, next) => {
  // 判断是否访问的是 登录页面 /login 校验登录状态
  // 如果没登录 就跳转到登录页面
  // 登录了就 放行
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  if (to.path !== '/login') {
    if (userInfo) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
  // if (to.path === '/login') {
  //   if (userInfo) {
  //     next('/')
  //   }
  // }
})

export default router
