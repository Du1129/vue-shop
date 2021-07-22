import {getCategoriesData} from "@/api";

export const myMixin = {
    data(){
        return{
            tagObj: [
                {name:'一级',type:'primary'},
                {name:'二级',type:'warning'},
                {name:'三级',type:'info'},
            ],
            categoriesList:[]
        }
    },
    created() {
        this.getCategoriesList()
    },
    methods:{
        async getCategoriesList(){
            let {data,meta} = await getCategoriesData({type:3});
            if(meta.status !== 200) return this.$message.error(meta.msg);
            this.categoriesList =data;
        },
    }
}