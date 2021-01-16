<template>
  <div class="article-container">
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 筛选表单 -->
      <el-form ref="form" :model="form" label-width="60px" size="mini">
        <el-form-item label="状态：">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <el-select v-model="channelId" placeholder="请选择">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              :key="channel.id"
              v-for="channel in channels"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="rangDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="loading" type="primary" @click="onSubmit"
            >筛选</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 筛选结果 -->
    <el-card class="box-card" style="margin-top: 30px">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到{{ total }}条消息</span>
      </div>
      <!-- 表格 -->
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        border
        size="medium"
        v-loading="loading"
      >
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                正在拼命地加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <img src="./no-cover.gif" alt="" />
              </div>
            </el-image>
            <!-- <img
              v-if="scope.row.cover.images[0]"
              class="cover-img"
              :src="scope.row.cover.images[0]"
              alt=""
            />
            <img v-else class="cover-img" src="./no-cover.gif" alt="" /> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- scope.row 为当前项 的对象 -->
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
            <!-- <el-tag type="success" v-else-if="scope.row.status === 1"
              >待审核</el-tag
            >
            <el-tag type="primary" v-else-if="scope.row.status === 2"
              >审核通过</el-tag
            >
            <el-tag type="warning" v-else-if="scope.row.status === 3"
              >审核失败</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.status === 4"
              >已删除</el-tag
            > -->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="$router.push('/publish?id=' + scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteArt(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        :disabled="loading"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="currentChange"
        @size-change="handleSizeChange"
        :current-page.sync="page"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticle, getChannels, deleteArt } from '../../api/article'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: ''
      },
      articles: [], // 文章列表数据
      articleStatus: [
        // 文章状态
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: 'parimary' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      page: 1, // 当前页码
      total: 0, // 数据的总条数
      pageSize: 10, // 每页的数据条数
      status: null, // 查询文章的状态
      channels: [], // 文章频道的列表
      channelId: null, // 文章频道id
      rangDate: [], // 时间日期的范围
      loading: true
    }
  },
  computed: {},
  watch: {},
  created() {
    // 加载频道列表
    this.localChannels()
    this.loaclArticle(1)
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.loaclArticle()
    },
    // 获取文章列表
    async loaclArticle(page = 1) {
      this.loading = true
      const result = await getArticle({
        page: this.page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId, // 文章频道的id
        begin_pubdate: this.rangDate ? this.rangDate[0] : null,
        end_pubdate: this.rangDate ? this.rangDate[1] : null
      })
      console.log(result)
      this.loading = false
      console.log(result)
      this.articles = result.data.data.results
      this.total = result.data.data.total_count
    },

    // 页码数改变事件
    currentChange(page) {
      // console.log(page)
      this.loaclArticle(page)
    },

    // 每页显示的数据条数变化时
    handleSizeChange(perPage) {
      this.pageSize = perPage
      this.loaclArticle()
    },

    // 获取 文章频道列表
    async localChannels() {
      const result = await getChannels()
      console.log(result)
      this.channels = result.data.data.channels
    },

    // 删除文章
    deleteArt(id) {
      console.log(id.toString())
      console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteArt(id.toString()).then((res) => {
            // console.log(res) 删除成功 获取文章列表
            this.loaclArticle(this.page)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped lang="less">
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.image-slot {
  img {
    width: 100px;
  }
}
</style>
