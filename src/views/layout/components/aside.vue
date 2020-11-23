<template>
  <el-menu
    :default-active="this.$route.path"
    class="nav-menu"
    background-color="#011f34"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapse"
  >
    <el-menu-item index="/">
      <i class="iconfont iconhome"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="iconfont iconarticle"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/images">
      <i class="iconfont iconl-img"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont iconpublish"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="iconfont iconpinglun"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="iconfont iconfensi"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  components: {},
  props: ['is-collapse'], // 父组件传递的值
  data() {
    return {
      // isCollapse:false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.nav-menu {
  .iconfont {
    margin-right: 10px;
    padding-left: 5px;
  }
}
</style>
