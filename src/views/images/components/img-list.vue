<template>
  <div class="img-list">
    <!-- 把素材库中的 图片 单独封装成一个组件使用 -->
    <!-- 按钮样式的 radio -->
    <div class="radioStyle">
      <el-radio-group @change="onChangeRadio" v-model="collect" size="mini">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button v-if="isShow" @click="uploadImg" type="success" size="mini"
        >上传文件</el-button
      >
    </div>
    <!-- 素材列表 -->
    <el-row :gutter="20">
      <el-col
        style="position: relative"
        :key="image.id"
        v-for="(image, index) in imageList"
        :xs="12"
        :md="6"
        :sm="6"
        :lg="4"
        @click.native="selected = index"
      >
        <el-image
          style="height: 100px; position: relative"
          :src="image.url"
          fit="cover"
        >
        </el-image>
        <!-- 被选中图片的样式 -->
        <div v-if="isShowSelected && selected === index" class="selected"></div>
        <!-- 收藏和删除的按钮 -->
        <div class="image-action" v-if="isShow">
          <el-button
            :loading="image.loading"
            type="primary"
            :icon="image.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            circle
            @click="onCollect(image)"
            size="mini"
          ></el-button>
          <!-- <i
              @click="onCollect(image)"
              :class="{
                'el-icon-star-on': image.is_collected,
                'el-icon-star-off': !image.is_collected
              }"
            ></i> -->
          <!-- <i @click="deleteImg(image.id)" class="el-icon-delete-solid"></i> -->
          <el-button
            :loading="image.loading"
            size="mini"
            @click="onDelete(image)"
            type="danger"
            icon="el-icon-delete-solid"
            circle
          ></el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 分页器 -->
    <el-pagination
      background
      style="margin-top: 20px; display: flex; justify-content: flex-end"
      :current-page.sync="page"
      @current-change="onChangePage"
      @size-change="onChangePerPage"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="per_page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalImg"
    >
    </el-pagination>

    <!-- 上传图片的 提示框 -->
    <el-dialog title="上传素材" :visible.sync="dialogUploadleVisible">
      <!-- upload不用自己发送请求  默认会发送post请求  请求路径 action-->
      <!-- 要写完整路径 并配置请求头 headers -->
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadheaders"
        name="image"
        multiple
        :on-success="onSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImage, collectImg, deleteImg } from '../../../api/images'
export default {
  name: 'ImagesList',
  components: {},
  props: {
    // 是否显示 上传文件按钮和 收藏 删除按钮
    isShow: {
      type: Boolean, // 类型
      default: true // 默认值
    },
    // 是否显示 选中图片的效果
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    return {
      collect: false, // 默认显示全部的 素材
      imageList: [], // 素材图片列表
      dialogUploadleVisible: false, // 控制提示框的显示与隐藏
      uploadheaders: {
        Authorization: `Bearer ${userInfo.token}`
      }, // 组件上传素材需配置请求头
      totalImg: 0, // 素材数据总数
      page: 1,
      per_page: 10,
      selected: null // 被选中图片的索引
    }
  },
  computed: {},
  watch: {},
  created() {
    this.localImages()
  },
  mounted() {},
  methods: {
    async localImages() {
      // 重置高亮页码 防止页码 页面不对应
      // this.page = page
      const result = await getImage({
        collect: this.collect,
        page: this.page,
        per_page: this.per_page
      })
      if (result.status === 200) {
        // console.log(result)
        const results = result.data.data.results
        // 向遍历出的 每一个 数据 中 添加一个loading 属性
        results.forEach((image) => {
          image.loading = false
        })

        this.imageList = results
        this.totalImg = result.data.data.total_count
      }
    },
    // radio 变化时
    onChangeRadio(value) {
      this.page = 1
      // console.log(value)
      this.localImages(value)
    },
    // 上传素材
    uploadImg() {
      this.dialogUploadleVisible = true
    },
    // 上传成功后的事件
    onSuccess() {
      this.dialogUploadleVisible = false // 关闭对话框
      this.localImages() // 刷新素材列表
      this.$message.success('上传图片成功~')
    },
    // 页码变化时
    onChangePage(page) {
      this.page = page
      this.localImages(this.page)
    },
    // 每页显示数量的变化
    onChangePerPage(num) {
      // console.log(num)
      this.per_page = num
      this.localImages(this.per_page)
    },
    // 点击收藏按钮事件
    async onCollect(image) {
      // console.log(image)
      // 开启loading效果
      image.loading = true
      const result = await collectImg(image.id, !image.is_collected)
      if (result.status === 201) {
        image.is_collected = !image.is_collected
        // 关闭loading效果
        image.loading = false
      }
      // console.log(id)
      // const result = await collectImg(id, collect)
      // console.log(result)
    },

    // 删除图片素材
    async onDelete(image) {
      const imgId = image.id
      image.loading = true
      const result = await deleteImg(imgId)
      // 刷新列表
      if (result.status === 204) {
        // console.log(11)
        this.localImages()
        this.$message.success('删除成功请自行刷新~')
        image.loading = false
      }
    }
    // onDelete(image) {
    //   image.loading = true
    //   deleteImg(image.id).then((res) => {
    //     // 重新加载数据列表
    //     this.localImages()
    //     image.loading = false
    //   })
    // }
  }
}
</script>

<style scoped lang="less">
.radioStyle {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image-action {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: 4px;
  left: 11px;
  height: 30px;
  width: 90%;
  background-color: rgba(204, 204, 204, 0.5);
  font-size: 20px;
  text-align: center;
  line-height: 30px;
  color: #fff;
}

.selected {
  position: absolute;
  top: 0;
  background: url('./selected.png') no-repeat;
  background-color: rgba(0, 0, 0, 0.6);
  background-size: cover;
  width: 109px;
  height: 100px;
}
</style>
