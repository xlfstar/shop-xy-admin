import request from './request'

export const login = (data) => request.post(`/admin/login`, data)
export const uploadImg = (data, config) => request.post('/m/action/uploadImg', data, config)
//商品分类相关
export const getCategories = (data) => request.get('/m/category/list', data)
export const addCategory = (data) => request.post('/m/category/create', data)
export const upCategory = (data) => request.post('/m/category/update', data)
export const delCategory = (data) => request.post('/m/category/delete', data)
//商品相关

export const getGoodsList = (query) => request.get('/m/goods/list', query)
export const addGoods = (data) => request.post('/m/goods/create', data)
export const upGoods = (data) => request.post(`/m/goods/update`, data)
export const getGoodsById = (id) => request.get(`/m/goods/findOne/${id}`)
//商品规格
export const addGoodsSpec = (data) => request.post('/m/spec/create', data)
export const upGoodsSepc = (data) => request.post('/m/spec/update', data)
export const delGoodsSpec = (data) => request.post('/m/spec/delete', data)
export const getSpecList = (query) => request.get('/m/spec/list', query)
//商品规格属性
export const addGoodsAttr = (data) => request.post('/m/attr/create', data)
export const upGoodsAttr = (data) => request.post('/m/attr/update', data)
export const delGoodsAttr = (data) => request.post('/m/attr/delete', data)
export const getGoodsAttrList = (query) => request.get('/m/attr/list', query)

//sku
export const addSkus = (goods_id, data) => request.post(`/m/sku/add/${goods_id}`, data)
export const getSkusList = (query) => request.get('/m/sku/list', query)

//订单
export const getOrderList = (query) => request.get('/m/order/list', query)

//付款方式
export const getPayMethodList = (query) => request.get('/m/paymethod/list', query)
export const addPayMethod = (data) => request.post('/m/paymethod/create', data)
export const upPayMethod = (data) => request.post('/m/paymethod/update', data)
export const delPayMethod = (data) => request.post('/m/paymethod/delete', data)

//品牌
//付款方式
export const getBrandList = (query) => request.get('/m/brand/list', query)
export const addBrand = (data) => request.post('/m/brand/create', data)
export const upBrand = (data) => request.post('/m/brand/update', data)
export const delBrand = (data) => request.post('/m/brand/delete', data)
