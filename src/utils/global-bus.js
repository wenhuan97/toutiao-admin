//  全局 组件通信 可以让任意组件之间互相通信
import Vue from 'vue'

export default new Vue()

// 假设 a组件 向 b组件 发送数据
// b注册通信的事件
// a发布通信事件
