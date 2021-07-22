<template>
  <el-empty :image-size="400" description="快开始你的管理吧！">
    <template #image>
      <img src="../../assets/img/welcome-empty-bg.png" alt="">
    </template>
    <el-button type="primary">Get Start<i class="el-icon-right"></i></el-button>
  </el-empty>
</template>

<script>
  import {mapMutations} from 'vuex'
export default {
  name: "Welcome",
  created(){
    this.updateBreadcrumpList([]);
  },
  methods:{
    ...mapMutations(['updateBreadcrumpList'])
  }

}
</script>

<style scoped>
.welcome{
  font-size:20px;
}

</style>