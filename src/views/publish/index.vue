<template>
  <div class="publish-container">
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? '修改文章' : '发布文章'
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        ref="publishFormRef"
        :model="article"
        label-width="80px"
        :rules="formRules"
      >
        <el-form-item label="标题：" prop="title">
          <el-input
            placeholder="请输入标题"
            style="width: 400px"
            v-model="article.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap
            placeholder="请输入文章内容"
            v-model="article.content"
            :extensions="extensions"
            height="400"
            lang="en"
          />
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>

          <!-- 需要把选择的封面图片地址 放到 article.cover.images 这个数组中
           当给事件处理函数 传递自定义参数时 就无法得到 事件本身的 参数

          如果想要在事件处理函数 自定义传参以后得到原来那个事件本身的 参数 需要加$event
          $event 就代表了那个事件本身的参数、

         当你给子组件提供的数据 既要显示又要 修改时 这时给组件使用 v-modal 简化数据绑定
         v-model="article.cover.images[index]"
        相当于 给子组件传递一个名叫value的数据
        ：value = "article.cover.images[index]"
        @input = "article.cover.images[index] = 事件参数"

        注意 v-model 只是简写了操作 本质还是父子组件通信
          -->
          <!-- <div style="display: flex">
            <template v-if="article.cover.type > 0">
              <upload-cover
                style="margin-right: 15px"
                :key="cover"
                v-for="(cover, index) in article.cover.type"
                @update-cover="onUpdateCover($event, index)"
                :cover-image="article.cover.images[index]"
              />
            </template>
          </div> -->
          <div style="display: flex">
            <template v-if="article.cover.type > 0">
              <upload-cover
                style="margin-right: 15px"
                :key="cover"
                v-for="(cover, index) in article.cover.type"
                v-model="article.cover.images[index]"
              />
            </template>
          </div>
        </el-form-item>
        <el-form-item label="频道：" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :key="channel.id"
              v-for="channel in channels"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(false)">{{
            $route.query.id ? '修改' : '发表'
          }}</el-button>
          <el-button @click="onSubmit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { uploadImage } from '../../api/images'
import UploadCover from './components/upload-cover'

import {
  getChannels,
  publishArt,
  getArt,
  updateArticle
} from '../../api/article'

import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  CodeBlock,
  HorizontalRule,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Fullscreen,
  Preview,
  TextColor
} from 'element-tiptap'

// import element-tiptap //样式
import 'element-tiptap/lib/index.css'

export default {
  name: 'publishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  props: {},
  data() {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          // 文章封面
          type: 0, // 封面的类型 -1自动 0无图 1一张 3三张
          images: [] // 封面图片的地址
        },
        channel_id: null // 频道的id
      },
      channels: [], // 频道的数据
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          uploadRequest(file) {
            const fd = new FormData()
            fd.append('image', file)
            // 第一个return 是返回promise对象
            // 第二个return是 返回结果
            return uploadImage(fd).then((res) => {
              return res.data.data.url
            })
          }
        }), // 插入图片
        new Underline(), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(), // 斜体
        new CodeBlock(), // 代码块
        new HorizontalRule(), // 华丽的分割线
        new Strike(), // 删除线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new Fullscreen(), // 全屏
        new Preview(), // 预览
        new TextColor() // 字体颜色
      ],
      // 验证规则
      formRules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '文章内容不能为空', trigger: 'blur' },
          // 自定义校验 富文本编辑器清空后 会 余留p 标签
          {
            validator(rule, value, callback) {
              if (value === '<p></p>') {
                callback(new Error('文章内容不能为空'))
              } else {
                callback()
              }
            }
          }
        ],
        channel_id: [{ required: true, message: '请选择文章频道' }]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.localArtId()

    // 因为修改和添加 文章共用一个组件 所以判断路由路径中是否有id的存在
    if (this.$route.query.id) {
      // 加载文章内容
      this.localArticle()
    }
  },
  mounted() {},
  methods: {
    onSubmit(draft = false) {
      this.$refs.publishFormRef.validate(async (valid) => {
        if (!valid) return

        const articleId = this.$route.query.id
        if (articleId) {
          // 如果路由路径选中有 id 就是修改操作
          const result = await updateArticle(articleId, this.article, draft)
          console.log(result)
          if (result.status === 201) {
            this.$message.success(`${draft ? '存入草稿' : '修改文章'}成功~`)
            this.$router.push('/article')
          }
        } else {
          const result = await publishArt(this.article, draft)
          console.log(draft)
          console.log(result)
          if (result.status === 201) {
            this.$message.success(`${draft ? '存入草稿' : '发布文章'}成功~`)
            this.$router.push('/article')
          }
        }
      })
    },

    // 获取 频道数据、
    async localArtId() {
      const result = await getChannels()
      this.channels = result.data.data.channels
    },

    // 获取文章 数据
    async localArticle() {
      const articleId = this.$route.query.id
      const result = await getArt(articleId)
      if (result.status === 200) {
        this.article = result.data.data
      }
    },

    // 接受 子组件传递的 封面图片地址
    onUpdateCover(url, index) {
      // console.log(url)
      this.article.cover.images[index] = url
    }
  }
}
</script>

<style scoped lang="less">
</style>
