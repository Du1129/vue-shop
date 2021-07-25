<template>
    <div class="center mainContent">
        <img src="../assets/img/very_sorry.png"/>
    </div>
</template>

<script>

export default {
//import引入的组件需要注入到对象中才能使用
    name:'notFound',
    components: {},
    data() {
        return {

        }
    },
//监听属性 类似于data概念
    computed: {},
    created() {

    },
//生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },



//方法集合
    methods: {

    }
}
</script>
<style lang='scss' scoped>
.center{
    display:flex;
    justify-content: center;
    min-width:800px;
}

</style>