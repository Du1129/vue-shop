<template>
  <div class="login">
    <div class="content">
      <div class="logo">
        <img src="~assets/img/logo.png" alt="">
      </div>
      <el-form ref="refForm" :model="userForm" :rules="rules" label-width="80px">
        <el-form-item  label-width="0px" prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="userForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label-width="0px" prop="password">
          <el-input prefix-icon="el-icon-lock" clearable placeholder="请输入密码" v-model="userForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item class="btnBox" label-width="0px">
          <el-button type="primary" @click="login('refForm')" round>登录</el-button>
          <el-button round @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {loginPost} from "@/api";

export default {
  name: "Login",
  data(){
    return{
      userForm:{
        username:'admin',
        password:'123456'
      },
      rules: {
        username: [
          {required: true, message: '请输入您的用户名', trigger: 'blur'},
          {min: 3,message: '长度至少为3个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空！', trigger: 'blur'},
          {min: 4,message: '长度至少为4个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods:{
    login(formName){
      this.$refs[formName].validate(async (valid)=>{
        if(!valid) return false;
        const {data,meta} = await loginPost(this.userForm)
        if(meta.status === 400) return this.$message.error(meta.msg);
        console.log(data);
        sessionStorage.setItem("token",data.token);
        await this.$router.push('/home');
        this.$message.success('登录成功！')
      });
    },
    resetForm(){
      this.$refs.refForm.resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  width:100%;
  height:100vh;
  position:absolute;
  background:url('~assets/img/login-bg.jpg') no-repeat;
  background-size:cover;
  display:flex;
  justify-content: center;
  align-items:center;
  min-width:700px;
  .content{
    background-color:rgba(255,255,255,.6);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
    width: 450px;
    height: 300px;
    border-radius: 5px;
    position:relative;
    .logo{
      //box-shadow: 0 0 10px #ddd;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
      border: 1px solid rgba(255,255,255,.6);
      padding:8px;
      background-color:rgba(255,255,255,1);
      position :absolute;
      width:130px;
      height:130px;
      border-radius: 50%;
      img{
        border-radius:50%;
        background-color:#eee;
      }
      left:50%;
      transform: translate(-50%,-50%);
    }
    ::v-deep.el-form{
      position:absolute;
      bottom:0;
      left:0;
      right:0;
      padding:0 16px;
      .btnBox{
        display:flex;
        justify-content: flex-start;
        .el-button{
          width:140px;

        }
      }

    }
  }
}

</style>