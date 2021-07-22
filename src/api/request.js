import axios from "axios";
import Vue from 'vue'

export const request = (options) => {
    const req = axios.create({
        baseURL:'http://127.0.0.1:8888/api/private/v1/',
        timeout:5000
    })
    let loading;
    req.interceptors.request.use(config => {
        loading = Vue.prototype.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.6)'
        });
        //统一配置token
        config.headers.Authorization = sessionStorage.getItem('token');
        // 在发送请求之前做些什么
        return config;
    }, error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    });
    req.interceptors.response.use(response => {
        //响应拦截
        loading.close();
        return response.data;
    }, error => {
        loading.close();
        // 对返回错误做些什么
        return Promise.reject(error);
    });
    return req(options);
}