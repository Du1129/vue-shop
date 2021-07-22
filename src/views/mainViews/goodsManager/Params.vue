<template>
  <div class="mainContent">
    <el-card>
      <el-alert
          title="注意：只允许为第三级分类设置相关参数"
          type="warning"
          :closable="false"
          show-icon>
      </el-alert>
      <el-row>
        <el-col :span="20">
          <span>选择商品分类：</span>
          <el-cascader
              clearable
              v-model="currentCategory"
              :options="categoriesList"
              :show-all-levels="false"
              @change="getParams"
              :props="{
                    expandTrigger: 'hover',
                    label:'cat_name',
                    value:'cat_id'
                  }"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs type="border-card" @tab-click="changeTab" v-model="activeTab">
        <el-tab-pane name="many" label="动态参数">
          <el-button type="primary" round size="small" style="margin-bottom: 18px" @click="addParam">添加参数</el-button>
          <el-table
              border
              :data="paramsData"
              style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="param">
                <json-viewer
                    :value="param.row"
                    :expand-depth=6
                    copyable
                    boxed
                    sort></json-viewer>
                <el-row>
                  <el-col :span="24">
                    <el-tag v-for="(item,index) in param.row.attr_vals" :key="index" type="info" @close="handleTagClose(param.row,item)" closable>{{item}}</el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="param.row.inputVisible"
                        v-model="param.row.inputValue"
                        @change="addNewTag(param.row)"
                        ref="saveTagInput"
                        size="small"
                    ></el-input>
                    <el-button v-else size="small" class="button-new-tag" @click="changeInput(param.row)">+ New Tag</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>

            <el-table-column
                label="序号"
                type="index"
                width="50"
                :index="indexMethod"
            >
            </el-table-column>

            <el-table-column
                label="属性名称"
                prop="attr_name">
            </el-table-column>

            <el-table-column
                label="操作"
                prop="desc">
              <template slot-scope="param">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editParam(param.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParam(param.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>


        <el-tab-pane name="only" label="静态属性">
          <el-button type="primary" size="small" round style="margin-bottom: 18px" @click="addParam">添加属性</el-button>
          <el-table
              border
              :data="paramsData"
              style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="param">
                <json-viewer
                    :value="param.row"
                    :expand-depth=5
                    copyable
                    boxed
                    sort></json-viewer>
                <el-row>
                  <el-col :span="24">
                    <el-tag v-for="(item,index) in param.row.attr_vals" :key="index" @close="handleTagClose(param.row,item)" closable>{{item}}</el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="param.row.inputVisible"
                        v-model="param.row.inputValue"
                        @change="addNewTag(param.row)"
                        ref="saveTagInput"
                        size="small"
                    ></el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="changeInput(param.row)">+ New Tag</el-button>
                  </el-col>
                </el-row>


              </template>
            </el-table-column>
            <el-table-column
                label="序号"
                type="index"
                width="50"
                :index="indexMethod"
            >
            </el-table-column>
            <el-table-column
                label="属性名称"
                prop="attr_name">
            </el-table-column>
            <el-table-column
                label="操作"
                prop="desc">
              <template slot-scope="param">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editParam(param.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParam(param.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
        :title="dialogTitle"
        :visible.sync="paramDialogFlag"
        :close-on-click-modal="false"
        :show-close="false"
    >
      <el-form ref="paramForm" :model="paramForm" :rules="rules" label-width="80px">
        <el-form-item :label="activeTab === 'only'?'静态属性':'动态参数'" prop="attr_name">
          <el-input v-model="paramForm.attr_name" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="activeTab === 'many'" label="参数值" prop="attr_vals">
          <el-input v-model="paramForm.attr_vals" :disabled="!!editingAttrId" placeholder="参数值之间请用空格分割，否则将视为一个参数" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="submitParamForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {getParamsByCatId,addParamPost,deleteParamById,editParamPut} from "@/api";
import {myMixin} from "@/mixin";
//
export default {
  name: "Params",
  mixins:[myMixin],
  data(){
    return{
      paramsData:[],
      currentCategory:[],
      activeTab:'many',
      paramDialogFlag:false,
      editingAttrId:null,
      paramForm:{
        attr_name:'',
        attr_vals:''
      },
      rules:{
        attr_name:[
          {required:true,message:'请输入属性名或参数名',trigger:blur}
        ]
      }
    }
  },
  computed:{
    dialogTitle(){
      if(this.activeTab === 'many' && this.editingAttrId) return '编辑动态参数';
      else if(this.activeTab === 'many' && !this.editingAttrId) return '添加动态参数';
      else if(this.activeTab === 'only' && !this.editingAttrId) return '添加静态属性';
      else return '编辑静态属性'
    }
  },
  methods:{
    async getParams(cateIdList){
      if(cateIdList.length === 0){
        this.paramsData = [];
        return this.$message.warning('请选择第三级分类')
      }
      let {data,meta} = await getParamsByCatId(cateIdList[cateIdList.length-1],this.activeTab)
      console.log(11,data);
      data.map((item) => {
        item.inputVisible = false;
        item.inputValue = '';
        item.attr_vals = item.attr_vals? item.attr_vals.split(' '):[];
        return item;
      })
      if(meta.status !== 200) return this.$message.error(meta.msg);
      this.paramsData = data;
    },
    indexMethod(val){
      return val+1;

    },
    changeTab(){
      this.getParams(this.currentCategory);
    },
    async addNewTag(row){
      console.log(row);
      row.attr_vals.push(row.inputValue)
      row.inputValue = '';
      let {attr_id,cat_id,attr_sel,attr_name} = row;
      let attr_vals = row.attr_vals.reduce((pre,cur)=> {
        if(!pre) return pre+cur;
        return pre + ' ' +cur;
      },)
      const {meta} = await editParamPut(cat_id,attr_id,{
        attr_name,
        attr_vals,
        attr_sel
      })
      if(meta.status !== 200) return this.$message.error(meta.msg);
      this.$message.success(meta.msg);
      row.inputValue = '';
      row.inputVisible = false
    },
    async handleTagClose(row,name){
      row.attr_vals = row.attr_vals.filter(item => item !== name)
      console.log(row.attr_vals,name)
      let attr_vals = row.attr_vals.reduce((pre,cur)=> {
        if(!pre) return pre+cur;
        return pre + ' ' +cur;
      },)
      let {attr_id,cat_id,attr_sel,attr_name} = row;
      const {meta} = await editParamPut(cat_id,attr_id,{
        attr_name,
        attr_vals,
        attr_sel
      })
      if(meta.status !== 200) return this.$message.error(meta.msg);
      this.$message.success(meta.msg);
    },
    changeInput(row){
      row.inputVisible = true;
    },
    addParam(){
      this.paramDialogFlag = true;
    },
    submitParamForm(){
      if(this.currentCategory.length === 0) return this.$message.error('请先选择第三级分类')
      this.$refs.paramForm.validate(async (valid) => {
        if(!valid) return false;
        const {attr_name,attr_vals} = this.paramForm;
        let res;
        if(!this.editingAttrId){
          res = await addParamPost(
              this.currentCategory[this.currentCategory.length-1],
              {attr_name,attr_sel:this.activeTab,attr_vals})
        }else{
          res = await editParamPut(
              this.currentCategory[this.currentCategory.length-1],
              this.editingAttrId,
              {
                attr_name,
                attr_vals,
                attr_sel:this.activeTab
              })
        }
        const {data,meta} = res;
        if(meta.status !== 201 && meta.status !== 200) return this.$message.error(meta.msg);
        //更新本地数据，不刷新
        data.attr_vals = data.attr_vals?data.attr_vals.split(' '):[];
        data.inputValue = '';
        data.inputVisible = false;
        let targetI = this.paramsData.findIndex(item => item.attr_id === data.attr_id);
        if(targetI === -1)
          this.paramsData.push(data);
        else{
          this.paramsData.splice(targetI,1,data);
        }
        //重置数据
        this.editingAttrId = null;
        this.paramForm = {
          attr_vals:'',
          attr_name:''
        }
        this.paramDialogFlag = false;
        this.$message.success(meta.msg);
      })
    },
    editParam(row){
      this.editingAttrId = row.attr_id;
      this.paramForm.attr_name = row.attr_name;
      if(this.activeTab === 'many'){
        let vals = row.attr_vals.reduce((pre,cur) => {
          if(!pre) return pre+cur;
          return pre + ' ' + cur;
        },'')
        this.paramForm.attr_vals = vals
      }
      this.paramDialogFlag = true;
    },
    deleteParam(row){
      const {cat_id,attr_id} = row;
      this.$confirm('删除后不能恢复，确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then( async () => {
        const {meta} = await deleteParamById(cat_id,attr_id);

        if(meta.status !== 200) return this.$message.error(meta.msg);
        this.paramsData = this.paramsData.filter(item => item.attr_id !== attr_id)
        this.$message({
          type: 'success',
          message: meta.msg
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    handleDialogClose(){
      this.editingAttrId = null;
      this.paramForm = {
        attr_vals:'',
        attr_name:''
      }
      this.paramDialogFlag = false;
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.el-row{
  margin: 18px 0;
  //vertical-align: middle;
}
::v-deep.el-tag{
  //margin-top:18px;
  margin-right:13px;
}

.button-new-tag{
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
</style>