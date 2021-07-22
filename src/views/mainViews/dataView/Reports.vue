<template>
  <div class="mainContent">
    <el-card>
      <div id="main" style="width: 700px;height:550px">
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {getReportData} from "@/api";

export default {
  name: "Reports",
  data(){
    return {

    }
  },
  created() {

  },
  mounted() {
    this.getReportOpt()
  },
  methods:{
    async getReportOpt(){
      const {data,meta} = await getReportData();
      if(meta.status !== 200) return this.$message.error(meta.msg)
      data.series.map(item =>{
        item.emphasis = {
          focus:'series'
        }
      })
      var myChart = echarts.init(document.getElementById('main'));
      let option = {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        ...data,
      }

      myChart.setOption(option)
      console.log(data);
      // this.opt = res.data;

    }
  }
}
</script>

<style scoped>

</style>