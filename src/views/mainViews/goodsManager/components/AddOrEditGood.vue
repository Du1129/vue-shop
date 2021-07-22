<template>
  <div class="mainContent">
    <el-card>
      <el-alert
          :title="from === 'add'?'请添加商品信息':'请编辑商品信息'"
          type="info"
          center
          :closable="false"
          show-icon>
      </el-alert>
      <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 18px">
        <el-step title="基本信息" icon="el-icon-edit-outline"></el-step>
        <el-step title="商品参数" icon="el-icon-tickets"></el-step>
        <el-step title="商品属性" icon="el-icon-collection-tag"></el-step>
        <el-step title="商品图片" icon="el-icon-picture"></el-step>
        <el-step title="商品内容" icon="el-icon-document"></el-step>
        <el-step title="完成" icon="el-icon-success"></el-step>
      </el-steps>
      <el-form
          ref="goodsForm"
          label-position="top"
          :model="goodForm"
          :rules="rules"
      >
        <el-tabs
            v-model="activeTab"
            tab-position="left"
            style="margin-top:18px"
            :before-leave="validateBasicInfo"
            @tab-click="changeTab"

        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格(单位：元)" prop="goods_price">
              <el-input type="number" v-model="goodForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="goodForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量(单位：kg)" prop="goods_weight">
              <el-input type="number" v-model="goodForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                  v-model="goodForm.goods_cat"
                  :options="categoriesList"
                  clearable
                  @change="getParams"
                  :props="{
                    expandTrigger: 'hover',
                    label:'cat_name',
                    value:'cat_id'
                  }"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane name="1" label="商品参数">
            <el-form-item
                v-for="item in manyChecksList"
                :key="item.attr_id"
                :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                    v-for="(checkItem,index) in item.attr_vals"
                    :key="index"
                    :label="checkItem"
                    border
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>

          </el-tab-pane>

          <el-tab-pane name="2" label="商品属性">
            <el-form-item
                v-for="item in onlyChecksList"
                :key="item.attr_id"
                :label="item.attr_name"
            >
              <el-input
                  v-model="item.attr_vals"
              >
              </el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane name="3" label="商品图片">
            <el-upload
                class="upload-demo"
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :headers="header"
                :on-success="handleSuccess"
                :on-error="handleError"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane name="4" label="商品内容">
            <div id="subTextContainer"></div>
            <el-row style="margin-top:18px">
              <el-col :span="8">
                <el-button type="primary" size="medium" @click="handleSubmit" round>提交</el-button>
              </el-col>
            </el-row>
          </el-tab-pane>

        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="imgPreviewFlag">
      <img :src=previewImgUrl alt="加载失败">
    </el-dialog>


  </div>
</template>

<script>


//富文本编辑器
import E from 'wangeditor'
import {getParamsByCatId,addGoodsPost} from "@/api";


import {myMixin} from "@/mixin";

export default {
  name: "AddOrEditGood",
  props:['from'],
  mixins:[myMixin],
  data(){
    return {
      activeStep:0,
      activeTab:"0",
      manyChecksList:[],
      onlyChecksList:[],
      goodForm:{
        goods_name:'',
        goods_price:null,
        goods_number:null,
        goods_weight:null,
        goods_cat:null,
        goods_introduce:'',
        pics:[],
        attrs:[]
      },
      rules: {
        goods_name: [
          {required: true, message: '请输入商品名称！', trigger: 'blur'},
        ],
        goods_price: [
          {required: true, message: '请输入商品价格！', trigger: 'blur'},
        ],
        goods_number: [
          {required: true, message: '请输入商品数量！', trigger: 'blur'},
        ],
        goods_weight: [
          {required: true,message:'请输入商品重量！'},
        ],
        goods_cat: [
          {required: true},
        ],
      },
      header:{
        authorization:sessionStorage.getItem('token')
      },
      previewImgUrl:null,
      imgPreviewFlag:false,
    }
  },
  created() {
    console.log(this.$route.query.id)
  },
  mounted() {
    const editor = new E('#subTextContainer')
    editor.config.onchange = () => {
      this.goodForm.goods_introduce = editor.txt.text();
    };
    // 配置触发 onchange 的时间频率，默认为 200ms
    editor.config.onchangeTimeout = 500
    editor.create();
  },
  computed:{
  },
  methods:{
    validateBasicInfo(){
      if(!this.goodForm.goods_cat&&this.activeTab === "0") {
        this.$message.error('请选择商品分类！')
        return false
      }
    },
    async getParams(val){
      console.log(val);
      if(val.length !==0){
        let manyRes = await getParamsByCatId(val[val.length-1],'many');
        let onlyRes = await getParamsByCatId(val[val.length-1],'only');
        console.log(manyRes,onlyRes);
        manyRes.data.map(item =>{
          item.attr_vals = item.attr_vals?item.attr_vals.split(' '):null
        })
        this.manyChecksList = manyRes.data
        this.onlyChecksList = onlyRes.data
      }

    },
    changeTab(item){
      if(this.goodForm.goods_cat){
        this.activeStep = +item.name
      }

    },

    handleSuccess(res){
      // this.imgList.push(res.data);
      console.log(res);
      this.goodForm.pics.push({pic:res.data.tmp_path})
    },
    //图片上传类
    handleError(){
      this.$message.error('上传失败！')
    },
    handlePreview(file){
      this.imgPreviewFlag = true;
      this.previewImgUrl = file.url;
    },
    handleRemove(file){
      const {response} = file;
      this.goodForm.pics = this.goodForm.pics.filter((item)=>{
        return item.pic !== response.data.tmp_path;
      })
      console.log(response.data.url);
    },
    handleSubmit(){
      this.$refs.goodsForm.validate(async (valid)=>{
        if(!valid){
          this.$message.error('请完善商品信息')
          return false;
        }
        this.goodForm.goods_cat = this.goodForm.goods_cat.join()
        let onlyAttrs = this.onlyChecksList.filter(item => item.attr_vals !== '').map(item =>{ return {attr_id:item.attr_id,attr_value:item.attr_vals}})

        let manyChecked = this.manyChecksList.filter(item => item.attr_vals !== null);
        console.log(manyChecked)
        manyChecked.map(item=>{
          item.attr_vals = item.attr_vals.join(' ');
        })
        let manyAttrs = manyChecked.map(item => {return {attr_id:item.attr_id,attr_value:item.attr_vals}})
        this.goodForm.attrs = [...onlyAttrs,...manyAttrs]
        console.log(this.goodForm);
        this.goodForm.goods_number = Number(this.goodForm.goods_number);
        this.goodForm.goods_price = Number(this.goodForm.goods_number);
        this.goodForm.goods_weight = Number(this.goodForm.goods_weight);
        const {meta} = await addGoodsPost(this.goodForm);
        if(meta.status !== 201) return this.$message.error(meta.msg);
        this.$message.success(meta.msg);
        this.$router.back();
      })

    }
  }

}
</script>

<style lang="scss" scoped>

</style>