<template>
  <el-container class="content">
    <el-header>
      <div class="logo">
        <img src="~assets/img/logo2.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <div class="headerRight">
        <el-dropdown @command="handleCommand">
          <el-avatar :src="circleUrl" :size="40"></el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-user">个人中心</el-dropdown-item>
            <el-dropdown-item icon="el-icon-s-check">权限管理</el-dropdown-item>
            <el-dropdown-item icon="el-icon-goods">商品管理</el-dropdown-item>
            <el-dropdown-item icon="el-icon-data-line">数据统计</el-dropdown-item>
            <el-dropdown-item icon="el-icon-setting">设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" command="logOut" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i @click="show" class="el-icon-full-screen"></i>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="asideWidth">
        <div @click="toggleAsideBar" class="toggleBtn"><i :class="[showAside ? 'el-icon-s-fold' : 'el-icon-s-unfold']"></i></div>

        <el-menu
            class="el-menu-vertical-demo"
            background-color="#373d41"
            text-color="#fff"
            :default-active="path"
            active-text-color="#66b1ff"
            :collapse="!showAside"
            unique-opened
            :router="true"
        >

          <el-submenu :index="`${index+1}`" :key="index+1" v-for="(item,index) in subMenuList" :popper-append-to-body="false">
            <template slot="title">
              <i :class="iconClass[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item v-for="(menuItem,menuIndex) in item.children" :key="`${index+1}-${menuIndex}`" :index="'/'+menuItem.path">
                <i class="el-icon-menu"></i>
                <span slot="title">{{ menuItem.authName }}</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>

      </el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item >{{ breadCrumbList[0] }}</el-breadcrumb-item>
          <el-breadcrumb-item >{{ breadCrumbList[1] }}</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import {getSubMenuData,getRolesData} from "@/api";
import {mapActions} from 'vuex'


export default {
  name: "Home",
  data() {
    return {
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      showAside:true,
      subMenuList:[],
      iconClass:{
        125:"el-icon-user-solid",
        103:"el-icon-s-tools",
        101:"el-icon-s-goods",
        102:"el-icon-s-order",
        145:"el-icon-data-line"
      },
      asideWidth:'200px'
    }
  },
  computed:{

    breadCrumbList(){
      let arr;
      switch (this.$route.path) {
        case '/users': arr = ['用户管理','用户列表'];
        break;
        case '/goods': arr = ['商品管理','商品列表'];
        break;
        case '/categories': arr = ['商品管理','分类列表'];
        break;
        case '/params': arr = ['商品管理','分类参数'];
        break;
        case '/roles': arr = ['权限管理','角色列表'];
        break;
        case '/rights': arr = ['权限管理','权限列表'];
        break;
        case '/reports': arr = ['数据统计','数据列表'];break;
        default : arr = ['订单管理','订单列表']

      }
      return arr

    },
    path(){
      return this.$route.path;
    }
  },
  created() {
    this.getSubMenu();
    this.getRolesList();
  },
  methods:{
    ...mapActions(['setRolesList']),
    show(){
      console.log('clicked')
    },
    toggleAsideBar(){
      this.showAside = !this.showAside;
      if(this.showAside) this.asideWidth = '200px';
      else this.asideWidth = ''
    },
    async getSubMenu(){
      let {data,meta} = await getSubMenuData();
      if(meta.status !== 200) return this.$message.error(meta.msg);
      sessionStorage.setItem("subMenuList",JSON.stringify(data))

      this.subMenuList = data;
      console.log(this.subMenuList)
    },
    async getRolesList(){
      let {data,meta} = await getRolesData();
      if(meta.status !== 200) return this.$message.error(meta.msg);
      this.setRolesList(data);
    },
    handleCommand(command){
      console.log(command);
      if(command === "logOut"){
        sessionStorage.clear();
        localStorage.clear();
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.content{
  // min-width:1000px;
  height:100%;
  ::v-deep.el-header{
    background-color: #373d41;
    color: #fff;
    text-align: center;
    line-height: 60px;
    display:flex;
    justify-content: space-between;
    align-items:center;
    .logo{
      display:flex;
      align-items: center;
      img {
        width: 55px;
        height: 55px;
        border-radius: 25%;
      }
      span{
        font-size:20px;
        margin-left:20px;
      }
    }
    .headerRight{
      height:60px;
      display: flex;
      align-items:center;
      .el-dropdown{
        display: flex;
      }
      .el-icon-full-screen{
        margin-left:16px;
        font-size:26px;
        cursor: pointer;
      }
    }

  }
  ::v-deep.el-aside {
    overflow:visible;
    background-color: #373d41;
    color: #333;
    .toggleBtn{
      font-size:18px;
      background-color:#4a5064;
      color:#fff;
      text-align:center;
    }
    .el-menu{
      border-right:none;
      //.el-submenu .el-submenu__title [class^=el-icon-]{
      //  color:#fff;
      //}
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }
  }
  ::v-deep.el-main {
    background-color: #E9EEF3;
    color: #333;
    //box-sizing: border-box;
    //overflow: scroll;
    //text-align: center;
    //line-height: 160px;
  }
}



</style>