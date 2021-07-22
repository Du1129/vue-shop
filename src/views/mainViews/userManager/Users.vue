<template>
  <div class="mainContent">
    <el-card>
      <el-row class="header" :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="query" clearable @input="defaultData" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData.users"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          :index="indexMethod"
          >
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          min-width="180"
          >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          min-width="180">
        </el-table-column>

        <el-table-column
          prop="role_name"
          label="角色"
          min-width="160">
        </el-table-column>
        <el-table-column
          label="状态"
          width="80">

          <template slot-scope="users">
              <el-switch
                v-model="users.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="updateUserState(users.row)"
              >
              </el-switch>

          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="users">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(users.row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUser(users.row.id)"></el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="setUser(users.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="footer">
        <el-col :span="24">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[2, 3, 5, 10]"
              :page-size="currentPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <!--newUser dialog-->
    <el-dialog title="添加用户" :visible.sync="addDialogFlag" :show-close="false">
      <el-form
          ref="newUser"
          :model="newUserForm"
          label-width="80px"
          :rules="rules"
      >

        <el-form-item label="用户名" prop="username">
          <el-input
              placeholder="请输入内容"
              v-model="newUserForm.username">
          </el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
              placeholder="请输入内容"
              v-model="newUserForm.password"
              show-password
          >
          </el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
              placeholder="请输入内容"
              v-model="newUserForm.email"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
              placeholder="请输入内容"
              v-model="newUserForm.mobile"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo('newUser')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- editUser dialog-->
    <el-dialog title="编辑用户" :visible.sync="editDialogFlag" :show-close="false">
      <el-form 
      ref="editUser" 
      :model="editForm" 
      label-width="80px"
      :rules="rules"
      >

        <el-form-item label="用户名">
          <el-input
            placeholder="请输入内容"
            v-model="editForm.username"
            :disabled="true">
          </el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            placeholder="请输入内容"
            v-model="editForm.email"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            placeholder="请输入内容"
            v-model="editForm.mobile"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo('editUser')">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配角色-->
    <el-dialog class="userSetting" title="设置角色" :visible.sync="settingDialogFlag" :show-close="false">
      <el-row>
        <el-col class="label" :span="4">用户名：</el-col>
        <el-col :span="8">{{currentSetUser.username }}</el-col>
      </el-row>
      <el-row>
        <el-col class="label" :span="4">角色名：</el-col>
        <el-col :span="8">{{ currentSetUser.role_name }}</el-col>
      </el-row>
      <el-row>
        <el-col class="label" :span="4">设置新角色：</el-col>
        <el-col :span="8">
          <el-select v-model="roleValue" placeholder="请选择">
            <el-option
                    v-for="item in rolesList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-col>

      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="settingDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="updateUserRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersData,
  getUserInfoById,
  addUserPost,
  putUpdateUserInfo,
  putUserState,
  putUpdateUserRole,
  deleteUserById
} from "@/api"
import {mapMutations, mapState} from 'vuex'


export default {
  name: "Users",
  data(){
    var checkMobile = (rule, value, callback) => {
      let reg = new RegExp(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)
      if(!reg.test(value)) return callback(new Error('请输入正确的手机号码'))
      callback();
    }
    return {
      query:'',
      tableData: {},
      currentPage:1,
      currentPageSize:5,
      addDialogFlag:false,
      editDialogFlag:false,
      settingDialogFlag:false,
      roleValue:'',
      rules: {
        username:[
          {required: true, message: '请设置您的用户名！', trigger: 'blur'},
          {min:3,max:10,message:'长度为3到10个字符',trigger:'blur'}
        ],
        password:[
          {required: true, message: '请设置您的登录密码！', trigger: 'blur'},
          {min:6,max:15,message:'长度为6到15个字符',trigger:'blur'}
        ],
        email: [
          {required: true, message: '请输入您的邮箱地址！', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入您的手机号码！', trigger: 'blur'},
          {validator:checkMobile, trigger: 'blur'}
        ],
      },
      newUserForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      editForm:{},
      currentSetUser:{
        username:'',
        role_name:'',
        id:null,
      }
    }
  },
  created(){
    this.getUsersList();
    this.updateBreadcrumpList([
      {key:'userManager',name:'用户管理'},
      {key:'users',name:'用户列表'}
    ])

  },
  computed:{
    ...mapState(['rolesList']),
  },
  methods:{
    ...mapMutations(['updateBreadcrumpList']),
    indexMethod(val){
      return val + 1 + this.currentPageSize*(this.currentPage-1);
    },
    async getUsersList(){
      let {data,meta} = await getUsersData({pagesize:this.currentPageSize,pagenum:this.currentPage})
      if(meta.status !== 200) return this.$message.error(meta.msg);
      this.tableData = data;

    },
    defaultData(val){
      if(!val)
        this.getUsersList();
    },
    async searchUser(){
      console.log(this.query);
      this.currentPage = 1;
      let {data,meta} = await getUsersData({
        pagesize:this.currentPageSize,
        pagenum:this.currentPage,
        query:this.query
      })
      console.log(data,meta);
      this.tableData = data;

    },
    addUser(){
      this.addDialogFlag = true;
    },
    addUserInfo(formName){
      this.$refs[formName].validate(async (valid) =>{
        if(!valid) return false;
        let {meta} = await addUserPost(this.newUserForm);
        if(meta.status !== 201) return this.$message.error(meta.msg);
        this.$message.success(meta.msg)
        await this.getUsersList();
        this.addDialogFlag = false;
      })
    },
    async editUser(id){
      let {data,meta} = await getUserInfoById(id);
      if(meta.status === 200){
        this.editDialogFlag = true;
        this.editForm = data;
        console.log(data,meta);
      }else{
        this.$message.error(meta.msg)
      } 
    },
    async updateUserInfo(formName){
      this.$refs[formName].validate(async (valid) =>{
        if(!valid) return false;
        const {id,mobile,email} = this.editForm;
        let data  = {
          mobile,
          email,
        }
        let {meta} = await putUpdateUserInfo(id,data);
        if(meta.status !== 200) return this.$message.error(meta.msg);
        let target = this.tableData.users.findIndex(item =>item.id == id)
        this.tableData.users[target].email = email
        this.tableData.users[target].mobile = mobile
        // console.log(res);
        // await this.getUsersList();
        this.editDialogFlag = false;
      })
    },
    async updateUserState(row){
      console.log('row',row)
      let {meta} = await putUserState(row.id,row.mg_state)
      if(meta.status !== 200) return this.$message.error(meta.msg);
      this.$message.success(meta.msg);
    },
    deleteUser(id){
      this.currentSetUser.id = id;
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then( async () => {
        let {meta} = await deleteUserById(this.currentSetUser.id);
        if(meta.status !== 200) return this.$message.error(meta.msg);
        await this.getUsersList();
        this.$message({
          type: 'success',
          message: meta.msg
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    setUser(row){
      const {id,username,role_name} = row;
      this.currentSetUser = {id,username,role_name};
      this.settingDialogFlag = true;
    },
    async updateUserRole(){
      if(!this.roleValue) return this.$message.error('请选择角色')
      console.log(this.currentSetUser.id,this.roleValue);
      let {meta} = await putUpdateUserRole(+this.currentSetUser.id,this.roleValue);
      if(meta.status !== 200) return this.$message.error(meta.msg);
      await this.getUsersList()
      this.settingDialogFlag = false;
      this.$message.success(meta.msg);
    },
    //分页器操作
    async handleSizeChange(pageSize){
      this.currentPageSize = pageSize;
      await this.getUsersList();
    },
    async handleCurrentChange(page){
      this.currentPage = page;
      await this.getUsersList()
    }
  }
}
</script>

<style lang="scss" scoped>

.userSetting{
  ::v-deep.el-row{
    margin-bottom:16px;
    .label{
      text-align: right;
    }
  }

}


</style>