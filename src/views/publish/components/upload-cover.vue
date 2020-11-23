<template>
  <div class="upload-cover" @click="showCover">
    <div class="cover-wrap">
      <img :src="value" class="cover-img" ref="cover-img" />
    </div>
    <el-dialog title="选择封面" :visible.sync="dialogVisible" append-to-body>
      <!-- tab栏切换 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <!-- ref 的作用
           1. 作用到普通HTML标签上  可以获取DOM
           2. 作用到组件上 可以获取组件
          -->

          <image-list is-show-selected :is-show="false" ref="img-list" />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input ref="pCover" type="file" @change="onChangeFile" />
          <img :src="perviewCover" alt="" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '../../../api/images'
import ImageList from '../../images/components/img-list'

export default {
  name: 'uploadCover',
  components: { ImageList },
  props: ['value'],
  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
      // 预览封面 图片的地址
      perviewCover: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    showCover() {
      this.dialogVisible = true
    },
    // 预览图片
    onChangeFile() {
      // console.log('change file')
      const file = this.$refs.pCover.files[0]
      const pUrl = window.URL.createObjectURL(file)
      this.perviewCover = pUrl
      // 防止 用户选择同一张图片
      // this.$refs.pCover.value = ''
    },
    // 上传封面
    async onCoverConfirm() {
      const file = this.$refs.pCover.files[0]
      if (this.activeName === 'second') {
        if (!file) {
          this.$message.info('请选择上传的图片')
          return
        }
        // 执行文件上传的操作
        const fd = new FormData()
        fd.append('image', file)
        const result = await uploadImage(fd)
        if (result.status === 201) {
          // 关闭对话框
          this.dialogVisible = false
          // 在封面展示此图
          this.$refs['cover-img'].src = result.data.data.url
          // 将图片地址 传给父组件
          this.$emit('input', result.data.data.url)
          // this.$emit('update-cover', result.data.data.url)
        }
      } else if (this.activeName === 'first') {
        // 要拿到被选中图片的地址
        // 还有一种通信 父组件可直接访问子组件中的数据
        const imgList = this.$refs['img-list']
        const selected = imgList.selected
        if (selected === null) {
          this.$message.info('请选择要上传的图片')
          return
        }
        // 关闭对话框
        this.dialogVisible = false
        // 修改父组件 绑定数据
        this.$emit('input', imgList.imageList[selected].url)
      }
    }
  }
}
</script>

<style scoped lang="less">
.upload-cover {
  width: 100px;
  height: 120px;
  border: 1px solid #ccc;
  .cover-img {
    height: 120px;
    max-width: 100%;
  }
}
</style>
