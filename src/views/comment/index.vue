<template>
  <div class="comment-container">
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table
        :data="comments"
        style="width: 100%"
        stripe
        border
        v-loading="loading"
      >
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch
              :disabled="scope.row.statusDisabled"
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onChangeSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        background
        style="margin-top: 20px; display: flex; justify-content: flex-end"
        :current-page.sync="page"
        @current-change="onChangePage"
        @size-change="onChangePerPage"
        :page-sizes="[10, 15, 30, 50]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalComment"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticle, updataCommentStatus } from '../../api/article'
export default {
  name: 'commentIndex',
  components: {},
  props: {},
  data() {
    return {
      comments: [], // 评论列表
      page: 1, // 当前页码数
      pageSize: 10, // 每页数据条数
      totalComment: 0, // 数据总数
      loading: false // 加载数据时的loading效果
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadComment(1)
  },
  mounted() {},
  methods: {
    // 获取评论列表
    async loadComment(page = 1) {
      this.page = page
      this.loading = true
      const result = await getArticle({
        page,
        per_page: this.pageSize,
        response_type: 'comment'
      })
      if (result.status === 200) {
        const results = result.data.data.results
        results.forEach((article) => {
          article.statusDisabled = false
        })

        this.comments = results
        this.totalComment = result.data.data.total_count
      }
      console.log(result)
      this.loading = false
    },

    // switch 变化时
    async onChangeSwitch(article) {
      article.statusDisabled = true
      // console.log(article.comment_status)
      const result = await updataCommentStatus(
        article.id.toString(),
        article.comment_status
      )
      console.log(result)
      article.statusDisabled = false
      this.$message.success(
        article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
      )
    },

    // 页码变化时
    onChangePage(page) {
      // console.log(page)
      this.loadComment(page)
    },
    // 每页数据条数变化时
    onChangePerPage() {
      this.loadComment(1)
    }
  }
}
</script>

<style scoped lang="less">
</style>
