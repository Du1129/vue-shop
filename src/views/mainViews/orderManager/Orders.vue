<template>
  <div class="mainContent">
    <el-card>
      <el-row style="margin-bottom: 18px">
        <el-col :span="12">
          <el-input
              placeholder="请输入搜索关键字，按回车搜索"
              prefix-icon="el-icon-search"
              clearable
              @change="searchOrder"
              v-model="query">
          </el-input>
        </el-col>
      </el-row>
      <el-table
          :data="orderData.orders"
          border
          style="width: 100%">

        <el-table-column
            type="index"
            width="45"
            :index="indexMethod"
        >
        </el-table-column>

        <el-table-column
            prop="order_number"
            label="订单流水号"
            width="220">
        </el-table-column>
        <el-table-column
            prop="order_price"
            label="价格(元)"
            width="80">
        </el-table-column>
        <el-table-column
            prop="order_pay"
            label="支付方式"
            width="90"
        >
          <template slot-scope="{row}">
            {{payContent[Number(row.order_pay)]}}
          </template>
        </el-table-column>
        <el-table-column
            prop="pay_status"
            label="支付状态"
            width="80">
          <template slot-scope="{row}">
            <el-tag
                size="small"
                :type="payStatusTag[+row.pay_status].type"
                effect="plain"
            >
              {{payStatusTag[+row.pay_status].info}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="order_pay"
            label="是否发货"
            width="80"
        >
          <template slot-scope="{row}">
            {{row.is_send === '否'?'未发货':'已发货'}}
          </template>
        </el-table-column>

        <el-table-column
            prop="consignee_addr"
            :show-overflow-tooltip="true"
            label="发货地址"
        >
          <template slot-scope="{row}">
            {{ row.consignee_addr !== ""?row.consignee_addr:'无'}}
          </template>
        </el-table-column>


        <el-table-column
            label="操作"
            width="220">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editOrder(row.order_id)"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-location-information"></el-button>
<!--            <el-button type="primary" size="mini" icon="el-icon-s-order">详情</el-button>-->
          </template>
        </el-table-column>
      </el-table>


      <el-row style="margin-top:18px">
        <el-col :span="24">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[3,5, 10, 15]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="orderData.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
        title="订单状态"
        :visible.sync="orderDialogFlag"
    >
      <el-form
          ref="orderForm"
          :model="orderForm"
          label-width="80px"
      >
        <el-form-item label="发货状态" prop="is_send">
          <el-radio-group v-model="orderForm.is_send">
            <el-radio-button label="0">未发货</el-radio-button>
            <el-radio-button label="1">已发货</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支付方式" prop="order_pay">
          <el-radio-group v-model="orderForm.order_pay">
            <el-radio-button label="0">未支付</el-radio-button>
            <el-radio-button label="1">支付宝</el-radio-button>
            <el-radio-button label="2">微信</el-radio-button>
            <el-radio-button label="3">银行卡</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单价格" prop="order_price">
          <el-input type="number" v-model="orderForm.order_price"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getOrdersData,getOrderById,updateOrderPut} from "@/api";

export default {
  name: "Orders",
  data(){
    return {
      query:'',
      pageNum:1,
      pageSize:5,
      orderData:{},
      currentOrderId:null,
      payContent:['未支付','支付宝','微信','银行卡'],
      payStatusTag:[
        {info:'未支付',type:'danger'},
        {info:'已支付',type:'success'}
      ],
      is_sendArr:['未发货','已发货'],
      orderDialogFlag:false,
      orderForm:{
        is_send:'0',
        order_pay:'0',
        order_price:null
      }
    }
  },
  created() {
    this.getOrderInfo()
  },
  methods:{
    indexMethod(val){
      return val + 1 + (this.pageNum-1)*this.pageSize;
    },
    async getOrderInfo(){
      const {data,meta} = await getOrdersData({
        query:this.query,
        pagenum:this.pageNum,
        pagesize:this.pageSize
      })
      if(meta.status !== 200) return this.$message.error(meta.msg);
      console.log(data);
      this.orderData = data;

    },
    searchOrder(){
      this.pageNum = 1;
      this.getOrderInfo();

      console.log(this.query)
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.pageNum = 1;
      this.getOrderInfo();
    },
    handleCurrentChange(val){
      this.pageNum = val;
      this.getOrderInfo()
    },
    async editOrder(id){
      this.currentOrderId = id

      const {data} = await getOrderById(id);
      const {order_price,order_pay,is_send} = data;
      this.orderForm.order_price = order_price;
      this.orderForm.order_pay = order_pay;
      this.orderForm.is_send = is_send === '否'? '0':'1';
      this.orderDialogFlag = true;

    },
    handleDialogClose(){
      this.orderDialogFlag = false;
      this.currentOrderId = null
    },
    handleSubmit(){
      this.$refs.orderForm.validate(async (valid) => {
        if(!valid) return false;
        console.log(this.orderForm);
        const {meta} = await updateOrderPut(this.currentOrderId,this.orderForm);
        if(meta.status !== 201) return this.$message.error(meta.msg);
        await this.getOrderInfo();


        this.orderDialogFlag = false;
        this.currentOrderId = null;
        this.$message.success(meta.msg);



      })
    }
  }
}
</script>

<style scoped>

</style>