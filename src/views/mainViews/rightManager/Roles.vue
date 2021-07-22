<template>
  <div class="mainContent">
    <el-card>
      <el-row style="margin-bottom:20px">
        <el-col>
          <el-button type="primary" round @click="roleDialogFlag = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
          :data="rolesList"
          border
          width="95%"
      >
        <el-table-column type="expand" prop="children">
          <template slot-scope="{row}">
            <el-row
                v-for="(item,index) in row.children"
                :key="item.id"

                :class="['expandCenter','bottom_border',index === 0? 'top_border' :'']"
            >
              <el-col :span="5">
                <el-tag closable>{{item.authName}}</el-tag><i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <el-row
                    v-for="(secondItem,index2) in item.children"
                    :class="['expandCenter',index2 === 0 ? '': 'top_border']"
                    :key="secondItem.id"
                >
                  <el-col :span="6">
                    <el-tag closable type="success">{{secondItem.authName}}</el-tag><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag v-for="thirdItem in secondItem.children" type="warning" closable :key="thirdItem.id">
                      {{thirdItem.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

          </template>
        </el-table-column>
        <el-table-column
            type="index"
            :index="indexMethod">
        </el-table-column>
        <el-table-column
            label="角色名称"
            prop="roleName">
        </el-table-column>
        <el-table-column
            label="角色描述"
            prop="roleDesc">
        </el-table-column>
        <el-table-column>
          <template slot-scope="{row}">
            <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                round
                @click="editRole(row)"
            >编辑</el-button>
            <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                round
                @click="deleteRole(row.id)"
            >删除</el-button>
            <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                round
                @click="setRights(row.id)"
            >分配角色权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
        :title="dialogTitle"
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="roleDialogFlag">
      <el-form
          ref="roleForm"
          :model="roleForm"
          label-width="80px"
          :rules="rules"
        >

          <el-form-item label="角色名称" prop="roleName">
            <el-input
                placeholder="请输入角色名称"
                v-model="roleForm.roleName"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="角色描述" prop="roleDesc">
            <el-input
                placeholder="请输入角色描述"
                v-model="roleForm.roleDesc"
            >
            </el-input>
          </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>

    </el-dialog>
    <el-dialog
        title="分配角色权限"
        :close-on-click-modal="false"
        :visible.sync="rightDialogFlag"
    >
      <el-tree
          :data="rightTreeList"
          show-checkbox
          node-key="rightTree"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
          :props="{
            label:'authName',
            children:'children'
          }">
      </el-tree>

    </el-dialog>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex'
import {getRolesData, addRolePost, updateRolePost, deleteRoleById,getRightsData} from "@/api";

export default {
  name: "Roles",
  data(){
    return {
      roleDialogFlag:false,
      rightDialogFlag:false,
      editId:null,
      roleForm:{
        roleName:'',
        roleDesc:''
      },
      rules:{
        roleName:[
          {required:true,message:'请输入角色名称',trigger:'blur'}
        ],
        roleDesc:[
          {required:true,message:'请输入角色描述',trigger:'blur'}
        ]
      },
      rightTreeList:[]
    }
  },
  created(){
    this.updateBreadcrumpList([
      {key:'rightManager',name:'权限管理'},
      {key:'roles',name:'角色列表'}
    ])
    console.log(this.rolesList)
    this.getRightsTree();
  },
  computed:{
    ...mapState(['rolesList']),
    dialogTitle(){
      return this.editId?'编辑角色':'添加角色'
    }
  },
  methods:{
    ...mapMutations(['updateBreadcrumpList']),
    ...mapActions(['setRolesList']),
    async getRightsTree(){
      const {data,meta} = await getRightsData('tree')
      if(meta.status !== 200) return this.$message.error(meta.msg);
      this.rightTreeList = data;
      console.log(data)
    },
    indexMethod(val){
      return val+1;
    },
    editRole(row){

      const {id,roleName,roleDesc} = row
      this.editId = id;
      this.roleForm.roleDesc = roleDesc;
      this.roleForm.roleName = roleName;
      this.roleDialogFlag = true;
    },
    deleteRole(id){
      this.$confirm('即将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then( async () => {
        let {meta} = await deleteRoleById(id);
        if(meta.status !== 200) return this.$message.error(meta.msg);
        const {data} = await getRolesData();
        this.setRolesList(data);
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
    handleDialogClose(){
      this.$refs.roleForm.resetFields()
      this.editId = null;
      this.roleDialogFlag = false;
    },
    handleSubmit(){
      this.$refs.roleForm.validate(async (valid)=>{
        if(!valid) return false;
        let res;
        if(!this.editId){
          res = await addRolePost(this.roleForm);
        }else{
          res = await updateRolePost(this.editId,this.roleForm);
        }
        if(res.meta.status !== 201 && res.meta.status !== 200)
          return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.roleDialogFlag = false;
        this.editId = null;
        const {data} = await getRolesData();
        this.setRolesList(data);

      })
    },
    async setRights(id){
      console.log(id);
      this.rightDialogFlag = true;

    }
  }
}
</script>

<style scoped>
.expandCenter{
  display: flex;
  align-items: center;
}
.top_border{
  border-top: 1px solid #dddddd
}
.bottom_border{
  border-bottom:1px solid #dddddd;
}
::v-deep.el-tag{
  margin:10px
}

</style>