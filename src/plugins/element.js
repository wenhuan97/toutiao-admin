import Vue from 'vue'

import {
  Button,
  Input,
  Form,
  FormItem,
  Checkbox,
  Message,
  Container,
  Aside,
  Header,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Checkbox)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
// 配置到全局可用
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
