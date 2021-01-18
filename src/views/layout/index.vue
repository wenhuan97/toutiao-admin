<template>
  <el-container class="layout-container">
    <el-aside width="auto" class="aside">
      <div class="logo">
        <img
          :class="[isShows ? 'isShow' : 'isHidden']"
          src="./1.jpg"
          alt=""
        />
      </div>
      <!-- 侧边栏 -->
      <app-aside class="aside-menu" :is-collapse="isCollapse"></app-aside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="head-left">
          <i
            @click="showCollapse"
            :class="{
              'el-icon-s-unfold': isCollapse,
              'el-icon-s-fold': !isCollapse
            }"
          ></i>
          <span>仿头条内容发布系统</span>
        </div>
        <div class="head-right">
          <img :src="user.photo" alt="" />
          <span>{{ user.name }}</span>
          <el-dropdown>
            <i class="el-icon-arrow-down el-icon--right"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人设置</el-dropdown-item>
              <el-dropdown-item @click.native="logOut"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '../../api/user'
import globalBus from '../../utils/global-bus'

export default {
  name: 'layoutIndex',
  components: {
    AppAside
  },
  props: {},
  data() {
    return {
      user: {}, // 当前登录用户信息
      isShows: true, // 侧边栏的logo显示与隐藏
      isCollapse: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.localUserProfile()
    // 注册 自定义事件 个人设置组件 向 layout组件通信
    // 当这个事件被 发布 时  注册函数的 事件 才会被调用
    globalBus.$on('update-user', (data) => {
      // console.log('update-user')
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  mounted() {},
  methods: {
    // 除了登录接口 其他接口必须要授权身份令牌才能使用
    async localUserProfile() {
      const result = await getUserProfile()
      this.user = result.data.data
      // console.log(this.user)
    },
    showCollapse() {
      this.isShows = !this.isShows
      this.isCollapse = !this.isCollapse
    },
    // 退出
    logOut() {
      // console.log(11)
      // const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.$confirm('你确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功~'
          })
          window.localStorage.removeItem('userInfo')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
}
</script>

<style scoped lang="less">
.el-menu {
  border: none;
}
.layout-container {
  height: 100vh;
}
.aside {
  overflow: hidden;
  background-color: #011f34;
  .aside-menu {
    height: 100%;
  }
}

.isShow {
  width: 150px;
  height: 90px;
  padding: 15px 8px 0;
  box-sizing: border-box;
}

.isHidden {
  width: 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  .head-left {
    line-height: 60px;
    i {
      font-size: 17px;
    }
    span {
      font-size: 17px;
    }
  }
}

.el-icon--right:hover {
  cursor: pointer;
}

.head-right {
  display: flex;
  align-items: center;
  height: 100%;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  span {
    margin: 0 10px;
  }
}

.main {
  background-color: #fff;
}
</style>
