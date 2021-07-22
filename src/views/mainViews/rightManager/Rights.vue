<template>
  <div class="mainContent">
    <el-card>
      <el-table
          :data="rightsList"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            :index="indexMethod"
            width="50"
        >
        </el-table-column>
        <el-table-column
            prop="authName"
            label="权限名称"
            min-width="180">
        </el-table-column>
        <el-table-column
            prop="path"
            label="路径"
            min-width="180"
        >
        </el-table-column>


        <el-table-column
            prop="level"
            label="角色"
            min-width="160">
          <template slot-scope="{row}">
            <el-tag :type="tagObj[row.level].type">{{tagObj[row.level].name}}</el-tag>

          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
import {getRightsData} from "@/api";
import {myMixin} from "@/mixin";

export default {
  name: "Rights",
  mixins:[myMixin],
  data(){
    return {
      rightsList:[]
    }
  },
  created() {
    this.getRightsList();
  },
  methods:{
    indexMethod(val){
      return val+1;
    },
    async getRightsList(){
      const {data,meta} = await getRightsData('list');
      if(meta.status !== 200) return this.$message.error(meta.msg);
      this.rightsList = data;
      this.$message.success(meta.msg)
    }
  }
}
</script>

<style scoped>

</style>