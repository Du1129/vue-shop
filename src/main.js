import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入公共样式
import "./assets/global-css/reset.css"

import {
    Button,
    Form,
    FormItem,
    Input,
    Header,
    Aside,
    Main,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Avatar,
    Empty,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Breadcrumb,
    BreadcrumbItem,
    Tree,
    Tag,
    Table,
    TableColumn,
    Tabs,
    TabPane,
    Pagination,
    Switch,
    Select,
    Steps,
    Step,
    Option,
    Dialog,
    Alert,
    Tooltip,
    Card,
    Cascader,
    Checkbox,
    CheckboxGroup,
    CheckboxButton,
    Row,
    Col,
    Upload,
    Loading,
    Message,
    MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Alert)
Vue.use(Main)
Vue.use(Container)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Avatar)
Vue.use(Empty)
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Tree);
Vue.use(Tag);
Vue.use(Table);
Vue.use(TableColumn)
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Steps);
Vue.use(Step);
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Option)
Vue.use(Card)
Vue.use(Cascader)
Vue.use(CheckboxGroup)
Vue.use(CheckboxButton)
Vue.use(Checkbox)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$loading = Loading.service;


import JsonViewer from 'vue-json-viewer'
//树形表格插件
import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ZkTable)

// Import JsonViewer as a Vue.js plugin
Vue.use(JsonViewer)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
