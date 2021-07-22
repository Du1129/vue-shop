const path = require('path')//定义路径的
function resolve(dir){
    return path.join(__dirname,dir)
}

module.exports = {
    css:{
        loaderOptions:{}
    },
    chainWebpack:(config) => {
        config.resolve.alias
            .set('@',resolve('src'))
            .set('assets',resolve('src/assets'))
            .set('components',resolve('src/components'))
            .set('views',resolve('src/views'))
            .set('network',resolve('src/network'))
            .set('utils',resolve('src/utils'))
            .set('store',resolve('src/store'))
    },
    devServer:{
        // host:'192.168.0.193',//编译后会自动加上http://  和  端号：8080；
        open:true,//是否自动开启浏览器；
        // proxy:{
        //     'api':{
        //         target:'http://127.0.0.1:8888',
        //         changeOrigin:true //是否跨域
        //     }
        // }
    }

}