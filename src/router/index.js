import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//按需引入组件
const Login = () => import("@/views/Login")
const Home = () => import("@/views/Home")
//main组件
const Welcome = () => import("@/views/mainViews/Welcome")
const Users = () => import("@/views/mainViews/userManager/Users")
const Roles = () => import("@/views/mainViews/rightManager/Roles")
const Rights = () => import("@/views/mainViews/rightManager/Rights")
const Orders = () => import("@/views/mainViews/orderManager/Orders")
const Goods = () => import("@/views/mainViews/goodsManager/Goods")
const AddOrEditGood = () => import("@/views/mainViews/goodsManager/components/AddOrEditGood")
const Params = () => import("@/views/mainViews/goodsManager/Params")
const Categories = () => import("@/views/mainViews/goodsManager/Categories")
const Reports = () => import("@/views/mainViews/dataView/Reports")


const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    name:'login',
    component:Login
  },
  {
    path:'/home',
    name:'home',
    component:Home,
    children:[
      {path:'/',redirect:'/welcome'},
      {path:'/welcome',name:'welcome',component:Welcome},
      {path:'/users',name:'users',component:Users},
      {path:'/roles',name:'roles',component:Roles},
      {path:'/rights',name:'Rights',component:Rights},
      {path:'/orders',name:'orders',component:Orders},
      {path:'/goods',name:'goods',component:Goods},
      {path:'/goods/:from',name:'addOrEdit',component:AddOrEditGood,props:true},
      {path:'/params',name:'params',component:Params},
      {path:'/categories',name:'categories',component:Categories},
      {path:'/reports',name:'reports',component:Reports}
    ]
  }
]

const router = new VueRouter({
  mode:'history',
  routes
})
router.beforeEach((to,from,next) => {
  if(to.path !== '/login'){
    if(!sessionStorage.getItem('token')){
      alert('请先登录！')
      next('/login');
    }else{
      next();
    }
  }else{
    next()
  }
})

export default router
