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
const notFound = () => import("@/views/notFound")

const routeMap = {
  users:{path:'/users',name:'users',component:Users},
  roles:{path:'/roles',name:'roles',component:Roles},
  rights:{path:'/rights',name:'Rights',component:Rights},
  orders:{path:'/orders',name:'orders',component:Orders},
  goods:{path:'/goods',name:'goods',component:Goods},
  params:{path:'/params',name:'params',component:Params},
  categories:{path:'/categories',name:'categories',component:Categories},
  reports:{path:'/reports',name:'reports',component:Reports}
}

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
    component:Home,
    children:[
      {path:'/',redirect:'/welcome'},
      {path:'/welcome',name:'welcome',component:Welcome},
      {path:'/goods/:from',name:'addOrEdit',component:AddOrEditGood,props:true},
      // {path:'/users',name:'users',component:Users},
      // {path:'/roles',name:'roles',component:Roles},
      // {path:'/rights',name:'Rights',component:Rights},
      // {path:'/orders',name:'orders',component:Orders},
      // {path:'/goods',name:'goods',component:Goods},
      // {path:'/goods/:from',name:'addOrEdit',component:AddOrEditGood,props:true},
      // {path:'/params',name:'params',component:Params},
      // {path:'/categories',name:'categories',component:Categories},
      // {path:'/reports',name:'reports',component:Reports}
    ]
  },
  {
    path:"*",component:notFound
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

export const initDynamicRoutes = () => {
  const routeArr = router.options.routes
  const subMenuList = JSON.parse(sessionStorage.getItem("subMenuList"));
  subMenuList.forEach(item =>{
    item.children.forEach(cItem => {
      routeArr[2].children.push(routeMap[cItem.path])
    })
  })
  console.log(routeArr)
  //让该路由规则重新启动
  router.addRoutes(routeArr)
}

export default router
