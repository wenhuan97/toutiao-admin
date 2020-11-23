<template>
  <div class="setting-container">
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form
            ref="updateUserForm"
            :model="user"
            label-width="100px"
            :rules="formRules"
          >
            <el-form-item label="编号："> {{ user.id }} </el-form-item>
            <el-form-item label="手机："> {{ user.mobile }} </el-form-item>
            <el-form-item prop="name" label="媒体名称：">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item prop="intro" label="媒体介绍：">
              <el-input v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱：">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="uploadUserLoading"
                type="primary"
                @click="onSubmit"
                >保存设置</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col style="text-align: center" :offset="3" :span="5">
          <el-avatar
            shape="square"
            :size="200"
            fit="cover"
            :src="user.photo"
            @click.native="$refs.file.click()"
          ></el-avatar>
          <p>修改头像</p>
          <input ref="file" hidden type="file" @change="onChangeFile" />
        </el-col>
      </el-row>
    </el-card>

    <!-- 修改头像的 对话框 -->
    <el-dialog
      title="修改头像"
      :visible.sync="dialogAvatar"
      @opened="dialogOpened"
      @closed="onDialogClosed"
    >
      <div class="perview-img-wrap">
        <img ref="preview-img" class="perview-img" :src="perviewImg" alt="" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAvatar = false">取 消</el-button>
        <el-button type="primary" @click="onUpdatePhoto" :loading="avaLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { getUserProfile, updataUserAvatar, updataUser } from '../../api/user'
import globalBus from '../../utils/global-bus'

export default {
  name: 'settingIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        // 用户资料
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      // 头像对话框的显示与隐藏
      dialogAvatar: false,
      // 预览图片
      perviewImg: '',
      // 裁切器实例
      cropper: null,
      //  更新头像的loading效果
      avaLoading: false,
      //  更新用户的loading效果
      uploadUserLoading: false,
      // 表单验证
      formRules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'change' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'change' }
        ],
        intro: [
          { required: true, message: '请输入媒体描述', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: '邮箱格式有误',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUser()
  },
  mounted() {},
  methods: {
    onSubmit() {
      // console.log('submit!')
      // 表单验证
      this.uploadUserLoading = true
      this.$refs.updateUserForm.validate(async (valid) => {
        if (!valid) return

        const { name, intro, email } = this.user
        const result = await updataUser({
          name,
          intro,
          email
        })
        console.log(result)
        if (result.status === 201) {
          this.loadUser()
          this.$message.success('修改用户资料成功~')
          this.uploadUserLoading = false
          // 发布自定义事件
          globalBus.$emit('update-user', this.user)
        }
      })
    },
    // 获取用户资料
    async loadUser() {
      const result = await getUserProfile()
      if (result.status === 200) {
        this.user = result.data.data
      }
    },
    // 用户上传文件时
    onChangeFile() {
      // console.log(66)
      this.dialogAvatar = true
      // 处理图片预览
      const file = this.$refs.file
      //  拿到 选择的文件对象  file.files[0]
      // 直接拿到 可以给图片设置 src
      const blobData = window.URL.createObjectURL(file.files[0])
      // console.log(blobData)
      this.perviewImg = blobData
      // 解决选择相同文件 不触发的问题
      this.$refs.file.value = ''
    },

    // 对话框完全打开后的回调函数
    dialogOpened() {
      // 获取图片的DOM节点
      const image = this.$refs['preview-img']
      // 初始化裁切器
      // 裁切器 基于img进行初始化 必须在 对话框完全打开时 才能完成初始化
      // 因为裁切要在对话框中完成 所以在 对话框完全打开时 的回调函数中执行
      this.cropper = new Cropper(image, {
        aspectRatio: 1, // 初始化比例
        viewMode: 1, // 禁止裁切框 移出 图片范围
        dragMode: 'none', // 禁止移动画布
        cropBoxResizable: false // 禁止改变裁切框 的大小
        // 移动裁切器时 会触发crop方法
        // crop(event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    //  对话框关闭后
    onDialogClosed() {
      // 销毁 裁切器 解决 关闭后无法使用 最新图片的问题
      this.cropper.destroy()
    },

    // 更新 裁切后的头像
    onUpdatePhoto() {
      // console.log(111)
      // 获取裁剪 的图片大小
      this.avaLoading = true
      this.cropper.getCroppedCanvas().toBlob((file) => {
        const fd = new FormData() // 上传文件的FormData对象
        fd.append('photo', file)
        // 发送请求 提交 fd
        updataUserAvatar(fd).then((res) => {
          // 关闭对话框
          this.dialogAvatar = false
          // 更新视图
          // 可以吧裁剪好的 图片 直接用于图片的src属性
          this.user.photo = window.URL.createObjectURL(file)
          // 速度慢
          // this.user.photo = res.data.data.photo
          console.log(res)
          this.avaLoading = false
          globalBus.$emit('update-user', this.user)
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.perview-img-wrap {
  .perview-img {
    display: block;

    /* This rule is very important, please don't ignore this */
    max-width: 100%;
    height: 300px;
  }
}
</style>
