<template>
  <div class="mainContent">
    <el-card>
      <el-row style="margin-bottom: 18px">
        <el-col :span="8">
          <el-button type="primary" size="medium" round @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>

      <zk-table
        ref="treeTable"
        :data="categoriesInfo.result"
        :columns="columns"

        :stripe="zkProps.stripe"
        :border="zkProps.border"
        :show-header="zkProps.showHeader"
        :show-row-hover="zkProps.showRowHover"
        :show-index="zkProps.showIndex"
        :tree-type="zkProps.treeType"
        :is-fold="zkProps.isFold"
        :expand-type="zkProps.expandType"
        :selection-type="zkProps.selectionType"
      >
        <template slot="status" slot-scope="{row}">
          <i v-if="!row.cat_deleted" style="color:lightgreen;font-size:20px" class="el-icon-success"></i>
          <i v-else style="color:red;font-size: 20px" class="el-icon-error"></i>
        </template>

        <template slot="level" slot-scope="{row}">
          <el-tag :type="tagObj[row.cat_level].type">{{tagObj[row.cat_level].name}}</el-tag>
        </template>

        <template slot="manipulate" slot-scope="{row}">
          <el-row>
            <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                round
                @click="editCate(row)"
            >编辑</el-button>
            <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteCate(row)"
                round
            >删除</el-button>
          </el-row>
        </template>

      </zk-table>

      <el-row style="margin-top:18px;">
        <el-col :span="24">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[3, 5, 10, 15]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="categoriesInfo.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
        title="添加分类"
        :visible.sync="cateDialogFlag"
        :close-on-click-modal="false"
        :show-close="false"
    >

      <el-form ref="cateFormEl" :model="cateForm" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item v-if="!editCateId" label="父级分类" prop="cat_parent">
          <el-cascader
              v-model="cateForm.cat_parent"
              :show-all-levels="false"
              :options="secondCateList"
              clearable
              :props="{
                    expandTrigger: 'hover',
                    checkStrictly: true,
                    label:'cat_name',
                    value:'cat_id'
                  }"
          ></el-cascader>
        </el-form-item>
      </el-form>



      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="submitCateForm">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import {getCategoriesData, updateCategoriesPost,editCategoriesPut, deleteCategoriesById} from "@/api";
import {myMixin} from "@/mixin";

export default {
  name: "Categories",
  mixins:[myMixin],
  data(){
    return {
      pageSize:5,
      pageNum:1,
      categoriesInfo:{},
      cateDialogFlag:false,
      secondCateList:[],
      cateForm:{
        cat_name:'',
        cat_parent:[]
      },
      editCateId:null,
      rules: {
        cat_name:[{required:true,message:'分类名称不能为空',trigger:'blur'}]
      },
      //zk-table的列配置
      zkProps: {
        stripe: false,
        border: true,
        showHeader: true,
        showRowHover: true,
        showIndex: true,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false,
      },
      columns:[
        {
          label: '分类名称',
          prop: 'cat_name',
          minWidth: '50px',
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type:"template",
          template: "status",
          width:'180px'
        },
        {
          label: '层级',
          prop: 'cat_level',
          type: 'template',
          template:'level',
          minWidth: '180px',
        },{
          label: '操作',
          minWidth: '200px',
          type: 'template',
          template: 'manipulate'
        }
      ],


    }
  },
  created() {
    this.getCateInfo(3);
    this.getSecondCateList()
  },
  computed:{
  },
  methods:{
    async getSecondCateList(){
      const {data} = await getCategoriesData({type:2})
      this.secondCateList = data;

    },
    async getCateInfo(type){
      const {data,meta} = await getCategoriesData({
        type,
        pagenum:this.pageNum,
        pagesize:this.pageSize
      });
      if(meta.status !== 200) return this.$message.error(meta.msg);
      this.categoriesInfo = data
    },
    indexMethod(val){
      return val + this.pageSize*(this.pageNum-1) + 1;
    },
    addCate(){
      this.cateDialogFlag = true;
    },
    editCate(row){
      this.editCateId = row.cat_id;
      this.cateDialogFlag = true;
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getCateInfo(3);

    },
    handleCurrentChange(val){
      this.pageNum = val;
      this.getCateInfo(3);
    },
    handleDialogClose(){
      this.cateDialogFlag = false
      this.editCateId = null;

    },
    submitCateForm(){
      this.$refs.cateFormEl.validate(async (valid)=>{
        if(!valid) return false;
        const {cat_name,cat_parent} = this.cateForm;
        let length = cat_parent.length;
        let res;
        if(!this.editCateId){
          res= await updateCategoriesPost({
            cat_name,
            cat_level:length,
            cat_pid:length === 0 ?0:cat_parent[length-1]
          })
        }else{
          res = await editCategoriesPut(this.editCateId,cat_name);
        }
        if(res.meta.status !== 201&&res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        await this.getCateInfo(3);
      })
      this.$refs.cateFormEl.resetFields();
      this.cateDialogFlag = false;
      this.editCateId = null;
    },
    deleteCate(row){
      const {cat_id} = row;
      this.$confirm('删除后不能恢复，确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then( async () => {
        const {meta} = await deleteCategoriesById(cat_id);
        if(meta.status !== 200) return this.$message.error(meta.msg);
        await this.getCateInfo(3);
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
  }
}
</script>

<style scoped>

</style>