<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="user" class="login-form" :rules="rules">
      <div class="logo">
        <img src="./logo_index.png" alt="" />
      </div>
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree"
          >我已阅读并同意用户协议和隐私条款</el-checkbox
        >
      </el-form-item>
      <el-form-item class="login-btn">
        <el-button type="primary" @click="onLogin" :loading="loginLoading"
          >登录</el-button
        >
        <el-button @click="resetLoginForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '../../api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '13955555555', // 手机号
        code: '246810', // 验证码
        agree: true // 是否勾选用户协议的 复选框
      },
      rules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|7|8|9]\d{9}$/,
            message: '手机号不正确',
            trigger: 'change'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          {
            pattern: /^\d{6}$/,
            message: '验证码错误',
            trigger: 'change'
          }
        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过 callback()
            // 验证失败 callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                console.log(value)
                callback(new Error('请勾选用户协议'))
              }
            },
            // message: 'nixixixi',
            trigger: 'change'
          }
        ]
      },
      loginLoading: false // 显示loading效果的登录按钮
    }
  },
  methods: {
    onLogin() {
      // 获取表单数据
      // const user = this.user
      // 点击登录后 开启loading效果
      this.loginLoading = true
      // 表单验证

      this.$refs.loginFormRef.validate((valid, err) => {
        if (!valid) {
          return
        }
        this.login()
      })
      this.loginLoading = false
    },
    // 发送登录请求
    login() {
      login(this.user)
        .then((res) => {
          //  将获取到的令牌 token 存储到本地
          const userInfo = res.data.data
          window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
          // console.log(res.data.data.token)
          this.$message.success({
            message: '登录成功！',
            type: 'success'
          })
          this.loginLoading = false // 点击登录后关闭loading效果

          // 跳转到 首页
          this.$router.push('/')
          // this.$router.push({
          //   name: 'home'
          // })
        })
        .catch(() => {
          // console.log('登录失败', err)
          this.$message.error('登陆失败~')
          this.loginLoading = false // 点击登录后关闭loading效果
        })
    },
    resetLoginForm() {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    }
  },
  computed: {},
  watch: {}
  // created: {},
}
</script>

<style lang="less">
.login-container {
  position: fixed;
  flex-direction: column;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('./login_bg.jpg');
  background-size: cover;

  .login-form {
    position: relative;
    background-color: #fff;
    padding: 100px 50px 20px;
    min-width: 350px;
    .login-btn {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0;
      // flex-direction: column;
    }
  }
  .logo {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>
