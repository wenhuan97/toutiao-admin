<template>
  <div class="fans-container">
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- tab栏切换 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="粉丝列表" name="first" v-loading="loading">
          <el-row>
            <el-col
              :key="fans.id.toString()"
              v-for="fans in fansList"
              class="fansStyle"
              :span="2"
            >
              <!-- <div class="demo-basic--circle">
                <el-avatar
                  :size="70"
                  :src="fans.photo"
                  @error="errorHandler"
                ></el-avatar>
              </div> -->
              <div class="demo-type">
                <el-avatar :size="70" :src="fans.photo" @error="errorHandler">
                  <img
                    src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605975993492&di=fc5d1c1d11165a24ee5c2558e3c79969&imgtype=0&src=http%3A%2F%2Fbbs.itheima.com%2Fdata%2Fattachment%2Fforum%2F201509%2F25%2F234548r7riy8y778zslslw.gif"
                  />
                </el-avatar>
              </div>
              <!-- <img class="imgBox" :src="fans.photo" alt="" /> -->
              <p>{{ fans.name }}</p>
              <el-tag class="tag" size="small">+关注</el-tag>
            </el-col>
          </el-row>
          <!-- 分页器 -->
          <el-pagination
            background
            style="margin-top: 20px; display: flex; justify-content: flex-end"
            :current-page.sync="page"
            @current-change="onChangePage"
            :page-size.sync="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalFans"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="second">
          <echarts-com />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// import echarts from 'echarts'
import EchartsCom from './components/echarts.vue'
import { getFans } from '../../api/fans'

export default {
  name: 'fansIndex',
  components: { EchartsCom },
  props: {},
  data() {
    return {
      activeName: 'first',
      fansList: [], // 粉丝数据列表
      pageSize: 24, // 每页显示的数据条数
      totalFans: 0, // 数据总数
      page: 1, // 初始化页码
      loading: false // 粉丝列表加载时的loading
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadFans(1)
  },
  mounted() {},

  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 获取粉丝列表
    async loadFans(page = 1) {
      this.loading = true
      const result = await getFans({
        page,
        per_page: this.pageSize
      })
      console.log(result)
      if (result.status === 200) {
        this.fansList = result.data.data.results
        this.totalFans = result.data.data.total_count
        this.loading = false
      }
    },
    errorHandler() {
      return true
    },
    // 页码改变事件
    onChangePage(page) {
      this.loadFans(page)
    }
  }
}
</script>

<style scoped lang="less">
.fansStyle {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 180px;
  border: 1px solid #ccc;
  margin-right: 50px;
  margin-bottom: 20px;
  .tag {
    cursor: pointer;
  }
  p {
    font-size: 14px;
  }
}
</style>
