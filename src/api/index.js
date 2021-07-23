import {request} from "@/api/request";
//登录验证
export const loginPost = (data) => {
    return request({
        url:'login',
        method:'post',
        data
    })
}

export const getSubMenuData = () => {
    return request({
        url:'menus',
        method:'get'
    })
}
//获取用户列表
export const getUsersData = (params) => {
    return request({
        url:'users',
        method:'get',
        params
    })
}
//添加新用户
export const addUserPost = (data) => {
    return request({
        url:'users',
        method:'post',
        data,
    })
}
//修改用户状态
export const putUserState = (id,state) => {
    return request({
        url:`users/${id}/state/${state}`,
        method:'put'
    })
}
//根据id查询用户信息
export const getUserInfoById = (id) => {
    return request({
        url:'users/'+id,
        method:'get'
    })
}

//编辑用户提交
export const putUpdateUserInfo = (id,data) => {
    return request({
        url:'users/'+id,
        method:'put',
        data:data? data:{}
    })
}
//删除用户角色
export const deleteUserById = (id) => {
    return request({
        url:`users/${id}`,
        method:'delete'
    })
}
//设置用户角色
export const putUpdateUserRole = (id,rid) =>{
    return request({
        url:`users/${id}/role`,
        method:'put',
        data:{
            id,
            rid
        }
    })
}

//获取角色列表
export const getRolesData = () => {
    return request({
        url:'roles',
        method:'get'
    })
}
//添加角色
export const addRolePost = (data) => {
    return request({
        url:'roles',
        method:'post',
        data
    })
}

//编辑角色
export const updateRolePost =(id,data)=>{
    return request({
        url:`roles/${id}`,
        method:'put',
        data
    })
}
//删除角色
export const deleteRoleById = (id) => {
    return request({
        url:`roles/${id}`,
        method:'delete'
    })
}

//角色授权
export const setRightsPost = (roleId,rids) => {
    return request({
        url:`roles/${roleId}/rights`,
        method:'post',
        data:{
            rids
        }
    })
}
//删除指定角色的指定权限
export const deleteRightsById = (roleId,rightId) => {
    return request({
        url:`roles/${roleId}/rights/${rightId}`,
        method:'delete'
    })
}



//获取权限list型列表
export const getRightsData = (type) =>{
    return request({
        url:`rights/${type}`,
        method:'get'
    })
}
//商品管理类
//获取商品列表数据
export const getGoodsDataRequest = (params)=>{
    return request({
        url:'goods',
        method:'get',
        params
    })
}
//根据id获取详情参数
export const getGoodDataById = (id) =>{
    return request({url:`goods/${id}`})
}
// 添加商品
export const addGoodsPost = (data) =>{
    return request({
        url:'goods',
        method:'post',
        data
    })
}
//编辑商品
export const editGoodsPut = (id,data) => {
    return request({
        url:`goods/${id}`,
        method:'put',
        data

    })
}
//删除商品
export const deleteGoodById = (id) => {
    return request({
        url:'goods/'+id,
        method:'delete'
    })
}
//获取商品分类列表
export const getCategoriesData = (params) =>{
    return request({
        url:'categories',
        method:'get',
        params
    })
}
//上传图片
export const uploadImgPost = (file) => {
    return request({
        url:'upload',
        method:'post',
        data:{
            file
        }
    })
}

//分类参数页面api
//参数列表
export const getParamsByCatId = (id,sel) => {
    return request({
        url:`categories/${id}/attributes`,
        method:'get',
        params:{
            sel
        }
    })
}
//添加动态或静态参数
export const addParamPost = (id,data) => {
    return request({
        url:`categories/${id}/attributes`,
        method:'post',
        data
    })
}
//编辑动态或静态参数
export const editParamPut = (id,attr_id,data) => {
    return request({
        url:`categories/${id}/attributes/${attr_id}`,
        method:'put',
        data
    })
}

//删除参数
export const deleteParamById = (id,attrid) =>{
    return request({
        url:`categories/${id}/attributes/${attrid}`,
        method:'delete'
    })
}
//分类管理
// 添加
export const updateCategoriesPost = (data) => {
    return request({
        url:'categories',
        method:'post',
        data
    })
}
export const editCategoriesPut = (id,cat_name) => {
    return request({
        url:`categories/${id}`,
        method:'put',
        data:{
            cat_name
        }
    })
}
//删除分类
export const deleteCategoriesById = (id) => {
    return request({
        url:`categories/${id}`,
        method:'delete'
    })
}

//订单类
export const getOrdersData = (params) => {
    return request({
        url:`orders`,
        method:'get',
        params
    })
}
//根据id查看订单
export const getOrderById = (id) => {
    return request({url:`orders/${id}`})
}
//修改订单状态
export const updateOrderPut = (order_id,data) => {
    return request({
        url:`orders/${order_id}`,
        method:'put',
        data
    })
}

//数据统计的页面
export const getReportData = () => {
    return request({
        url:'reports/type/1',
        method:'get'
    })
}