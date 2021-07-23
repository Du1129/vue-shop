<template>
  <div class="mainContent">
    <el-card>
      <el-row class="header" :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="query" clearable @input="defaultGoods" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="addGood">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table
          :data="goodsData.goods"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            width="50"
            :index="indexMethod"
        >
        </el-table-column>

        <el-table-column
            prop="goods_name"
            :show-overflow-tooltip="true"
            label="商品名称"
            width="650">
        </el-table-column>

        <el-table-column
            prop="goods_price"
            label="商品价格"
            width="70"
        >
        </el-table-column>
        <el-table-column
            prop="goods_weight"
            label="重量"
            width="50">
        </el-table-column>

        <el-table-column
            prop="add_time"
            label="创建时间"
            width="120">
        </el-table-column>

        <el-table-column
            label="操作"
            width="126">
          <template slot-scope="goods">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editGood(goods.row.goods_id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteGood(goods.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>




      <el-row class="footer">
        <el-col :span="24">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="goodsData.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {getGoodsDataRequest, deleteGoodById} from "@/api";
import {mapMutations} from 'vuex'
import {myMixin} from "@/mixin";

export default {
  name: "Goods",
  data(){
    return{
      query:'',
      pageNum:1,
      pageSize:10,
      goodsData:{},
      // currentGoodId:null
    }
  },
  mixins:[myMixin],
  created() {
    this.getOrSearchGoodsData();
  },
  methods:{
    ...mapMutations(['updateBreadcrumpList']),
    indexMethod(val){
      return val + this.pageSize*(this.pageNum-1) + 1;
    },
    async getOrSearchGoodsData(){
      let {meta,data} = await getGoodsDataRequest({pagenum:this.pageNum,pagesize:this.pageSize,query:this.query})
      // console.log();
      if(meta.status !== 200) return this.$message.error(meta.msg);
      this.goodsData = data;
      console.log(data);
    },
    async searchGoods(){
      this.pageNum = 1;
      if(!this.query) return this.$message.error('请输入搜索关键字！')
      const {meta} = await this.getOrSearchGoodsData();
      console.log(meta)
    },
    async defaultGoods(){
      if(!this.query){
        this.pageNum = 1;
        await this.getOrSearchGoodsData();
      }
    },
    addGood(){
      this.$router.push({
        name:'addOrEdit',
        params:{
          from:'add'
        }
      })
    },
    editGood(val){
      console.log(val);
      this.$router.push({
        name:'addOrEdit',
        query:{
          id:val
        },
        params:{
          from:'edit'
        }
      })
    },
    deleteGood(id){
      let tempId = id
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then( async () => {
        console.log(tempId)
        const {meta} = await deleteGoodById(tempId)

        console.log(meta);
        if(meta.status !== 200) return this.$message.error(meta.msg);
        await this.getOrSearchGoodsData();
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
    async handleCurrentChange(val){
      this.pageNum = val;
      await this.getOrSearchGoodsData();
    },
    async handleSizeChange(val){
      this.pageSize = val;
      await this.getOrSearchGoodsData()
    },
  }

}
</script>

<style lang="scss" scoped>
.mainContent{
  ::v-deep.el-card{
    .el-table{
      font-size:12px;
    }
  }
}
</style>