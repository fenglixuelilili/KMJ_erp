import axios from 'axios';

//测试
// let base = 'http://testerp.kmjiu.com/waimai_api/v1';
// let baseI = 'http://testerp.kmjiu.com/api/v1';
// let baseII = 'http://testerp.kmjiu.com/entity/v1'
// 正式
let base = 'https://duperp.kmjiu.com/waimai_api/v1';
let baseI = 'https://duperp.kmjiu.com/api/v1';
let baseII = 'https://duperp.kmjiu.com/entity/v1'

// 获取地区数据
// export const getAreaData = () => { return axios.get('https://testfonterp.kmjiu.com/region.json ').then(res => res.data) }
export const getAreaData = () => {
    return axios.get('https://fonterp.kmjiu.com/region.json ').then(res => res.data)
}

function getAccessToken() {
    return '?access_token=' + sessionStorage.getItem('access_token');
}

// 预定义编号
export const getPredefined = params => {
    return axios.get(`${baseI}/predefined/bn${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 店铺列表
export const storeList = params => {
    return axios.get(`${base}/stores${getAccessToken()}`, {params: params}).then(res => res.data)
}

// 店铺详情
export const storeDetails = (store_id, params) => {
    return axios.get(`${base}/stores/${store_id}${getAccessToken()}`, {params: params}).then(res => res.data)
}

// 新增店铺
export const addStore = params => {
    return axios.post(`${base}/stores${getAccessToken()}`, params).then(res => res.data)
}

// 店铺编辑
export const editStore = (store_id, params) => {
    return axios.put(`${base}/stores/${store_id}${getAccessToken()}`, params).then(res => res.data)
}

// 店铺删除
export const removeStore = item_id => {
    return axios.delete(`${base}/${item_id}${getAccessToken()}`).then(res => res.data)
}

// 绑定店铺
export const bindStore = (store_id, params) => {
    return axios.post(`${base}/stores/${store_id}/bonded${getAccessToken()}`, params).then(res => res.data)
}
// 解除绑定店铺
export const unbindStore = (store_id, params) => {
    return axios.post(`${base}/stores/${store_id}/unbonded${getAccessToken()}`, params).then(res => res.data)
}

// 获取外部外卖平台店铺列表
export const getOuterStores = (params) => {
    return axios.get(`${base}/outer_stores${getAccessToken()}`, {params: params}).then(res => res.data)
}

// 订单列表
export const getOrderList = params => {
    return axios.get(`${base}/orders${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 外卖异常订单
export const getanOrderList = params => {
    return axios.get(`${base}/orders/abnormalOrder${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 外卖异常订单重试
export const regainOrder_W = order_id => {
    return axios.get(`${base}/orders/checkOrder/${order_id}${getAccessToken()}`).then(res => res.data)
}


// 查询外卖店铺管理员账号信息
export const getManager = (store_id, params) => {
    return axios.get(`${base}/stores/${store_id}/manager${getAccessToken()}`, {params: params}).then(res => res.data)
}

// 修改外卖店铺管理员密码
export const editManager = (store_id, params) => {
    return axios.put(`${base}/stores/${store_id}/update_manager${getAccessToken()}`, params).then(res => res.data)
}

// 订单详情
export const orderDetails = (order_id, params) => {
    return axios.get(`${base}/orders/${order_id}${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 店铺统计
export const getStatistics = params => {
    return axios.get(`${base}/statistic/storeFinance${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 订单统计
export const getOrderStatistics = params => {
    return axios.get(`${base}/statistic/orderCost${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 配货单列表
export const getOrderBlanks = params => {
    return axios.get(`${base}/order_blanks${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 外卖门店配货单详情
export const getDetailsBlanks = (ob_id, params) => {
    return axios.get(`${base}/order_blanks/${ob_id}${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 新增配货单
export const addDetailsBlanks = params => {
    return axios.post(`${base}/order_blanks${getAccessToken()}`, params).then(res => res.data)
}
// 配货单已收货
export const ReceivingBlanks = (ob_id, params) => {
    return axios.post(`${base}/order_blanks/confirmRecive/${ob_id}${getAccessToken()}`, params).then(res => res.data)
}


// 仓库列表
export const getwarehouse = params => {
    return axios.get(`${baseI}/warehouses${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 物料列表
export const getItemsList = params => {
    return axios.get(`${baseI}/skus${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 编辑配货单
export const editBlanks = (op_id, params) => {
    return axios.put(`${base}/order_blanks/${op_id}${getAccessToken()}`, params).then(res => res.data)
}
// 删除配货单
export const removeBlanks = (ob_id, params) => {
    return axios.delete(`${base}/order_blanks/${ob_id}${getAccessToken()}`, params).then(res => res.data)
}
// 配货单sku查询
export const blanksSkutotal = params => {
    return axios.get(`${base}/order_blanks/skusTotal${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 库存列表
export const getStock = params => {
    return axios.get(`${base}/stock${getAccessToken()}`, {params: params}).then(res => res.data)
}

// 库存出入
export const getOutIn = params => {
    return axios.get(`${base}/periodStock${getAccessToken()}`, {params: params}).then(res => res.data)
}

// 商品列表
export const getItemList = params => {
    return axios.get(`${base}/items${getAccessToken()}`, {params: params}).then(res => res.data)
}

// 商品详情
export const getItemsDetails = (item_id, params) => {
    return axios.get(`${base}/items/${item_id}${getAccessToken()}`, {params: params}).then(res => res.data)
}

// 商品编辑
export const editItems = (item_id, params) => {
    return axios.post(`${base}/items/${item_id}${getAccessToken()}`, params).then(res => res.data)
}

// 删除在售商品
export const deleteItems = item_id => {
    return axios.delete(`${base}/items/${item_id}${getAccessToken()}`).then(res => res.data)
}

// 添加商品
export const addItems = params => {
    return axios.post(`${base}/items${getAccessToken()}`, params).then(res => res.data)
}

// 新增管理员
export const addManager = (store_id, params) => {
    return axios.post(`${base}/stores/${store_id}/create_manager${getAccessToken()}`, params).then(res => res.data)
}

// 分割-----------------------------------------------------------------------------------------------------------

// 图片上传地址
export let imgUploadUrl = `${baseI}/images${getAccessToken()}`


// 用户登录接口
export const requestLogin = params => {
    return axios.post(`${baseI}/auth/login`, params).then(res => res.data);
};
// 修改密码接口
export const changePassword = params => {
    return axios.post(`${baseI}/auth/password/change${getAccessToken()}`, params).then(res => res.data)
}

// 获取物料列表接口
export const getItemsListPage = params => {
    return axios.get(`${baseI}/items${getAccessToken()}`, {params: params}).then(res => res.data);
};
// 获取在售商品详情接口
export const getItemDetail = item_id => {
    return axios.get(`${baseI}/items/${item_id}${getAccessToken()}`).then(res => res.data)
}
// 删除物料接口
export const removeItem = item_id => {
    return axios.delete(`${baseI}/items/${item_id}${getAccessToken()}`).then(res => res.data);
}
// 物料新增接口
export const addItem = params => {
    return axios.post(`${baseI}/items${getAccessToken()}`, params).then(res => res.data)
}
// 物料编辑接口
export const editItem = (item_id, params) => {
    return axios.put(`${baseI}/items/${item_id}${getAccessToken()}`, params).then(res => res.data)
}


// 获取物料分类列表接口
export const getCategoriesList = params => {
    return axios.get(`${baseI}/categories${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 获取在售商品详情接口
export const getCategoriesDetail = cat_id => {
    return axios.get(`${baseI}/categories/${cat_id}${getAccessToken()}`).then(res => res.data)
}


// 获取sku列表
export const getSkuList = params => {
    return axios.get(`${baseI}/skus${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 异常商品
export const getAbnormal = () => {
    return axios.get(`${base}/items/abnormals${getAccessToken()}`).then(res => res.data)
}


// 获取在售商品列表接口
export const getCommoditiesList = params => {
    return axios.get(`${baseI}/commodities${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 获取在售商品详情接口
export const getCommoditiesDetail = commodity_id => {
    return axios.get(`${baseI}/commodities/${commodity_id}${getAccessToken()}`).then(res => res.data)
}
// 新增在售商品接口
export const addCommodity = params => {
    return axios.post(`${baseI}/commodities${getAccessToken()}`, params).then(res => res.data)
}
// 编辑在售商品接口
export const editCommodity = (commodity_id, params) => {
    return axios.put(`${baseI}/commodities/${commodity_id}${getAccessToken()}`, params).then(res => res.data)
}
// 删除在售商品接口
export const removeCommodity = commodity_id => {
    return axios.delete(`${baseI}/commodities/${commodity_id}${getAccessToken()}`).then(res => res.data);
}


// 获取仓库列表接口
export const getWareHousesList = params => {
    return axios.get(`${baseI}/warehouses${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 新增仓库接口
export const addWarehouse = params => {
    return axios.post(`${baseI}/warehouses${getAccessToken()}`, params).then(res => res.data)
}
// 修改仓库接口
export const editWarehouse = (warehouses_id, params) => {
    return axios.put(`${baseI}/warehouses/${warehouses_id}${getAccessToken()}`, params).then(res => res.data)
}
// 删除仓库接口
export const removeWarehouse = warehouses_id => {
    return axios.delete(`${baseI}/warehouses/${warehouses_id}${getAccessToken()}`).then(res => res.data)
}


// 获取供应商列表接口
export const getSuppliersList = params => {
    return axios.get(`${baseI}/suppliers${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 新增供应商接口
export const addSupplier = params => {
    return axios.post(`${baseI}/suppliers${getAccessToken()}`, params).then(res => res.data)
}
// 修改供应商接口
export const editSupplier = (supplier_id, params) => {
    return axios.put(`${baseI}/suppliers/${supplier_id}${getAccessToken()}`, params).then(res => res.data)
}
// 删除供应商接口
export const removeSupplier = supplier_id => {
    return axios.delete(`${baseI}/suppliers/${supplier_id}${getAccessToken()}`).then(res => res.data)
}


// 获取入库单列表接口
export const getInstocksList = params => {
    return axios.get(`${baseI}/instocks${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 获取入库单详情接口
export const getInstocksDetail = instock_id => {
    return axios.get(`${baseI}/instocks/${instock_id}${getAccessToken()}`).then(res => res.data)
}
// 新增入库单接口
export const addInstock = params => {
    return axios.post(`${baseI}/instocks${getAccessToken()}`, params).then(res => res.data)
}
// 修改入库单接口
export const editInstock = (instock_id, params) => {
    return axios.put(`${baseI}/instocks/${instock_id}${getAccessToken()}`, params).then(res => res.data)
}
// 删除入库单接口
export const removeInstock = instock_id => {
    return axios.delete(`${baseI}/instocks/${instock_id}${getAccessToken()}`).then(res => res.data)
}
// 确认入库单接口
export const confirmInstock = params => {
    return axios.post(`${baseI}/instocks/confirm${getAccessToken()}`, params).then(res => res.data)
}
// 入库单sku统计
export const getInstockskutotal = params => {
    return axios.get(`${baseI}/instocks/skusTotal${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 入库类型
export const getInstockType = io_type => {
    return axios.get(`${baseI}/io_type${getAccessToken()}`, {params: io_type}).then(res => res.data)
}


// 获取出库单列表接口
export const getOutstocksList = params => {
    return axios.get(`${baseI}/outstocks${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 获取出库单详情接口
export const getOutstocksDetail = outstock_id => {
    return axios.get(`${baseI}/outstocks/${outstock_id}${getAccessToken()}`).then(res => res.data)
}
// 新增出库单接口
export const addOutstock = params => {
    return axios.post(`${baseI}/outstocks${getAccessToken()}`, params).then(res => res.data)
}
// 修改出库单接口
export const editOutstock = (outstock_id, params) => {
    return axios.put(`${baseI}/outstocks/${outstock_id}${getAccessToken()}`, params).then(res => res.data)
}
// 删除出库单接口
export const removeOutstock = outstock_id => {
    return axios.delete(`${baseI}/outstocks/${outstock_id}${getAccessToken()}`).then(res => res.data)
}
// 确认出库单接口
export const confirmOutstock = params => {
    return axios.post(`${baseI}/outstocks/confirm${getAccessToken()}`, params).then(res => res.data)
}
// 出库单sku统计
export const getOutstockSkutotal = params => {
    return axios.get(`${baseI}/outstocks/skusTotal${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 出库物料统计
export const getOutstockSkus = params => {
    return axios.get(`${baseI}/outstocks/skusCount${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 获取属性列表接口
export const getPropsList = params => {
    return axios.get(`${baseI}/props${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 获取菜单列表接口
export const getMenuList = params => {
    return axios.get(`${baseI}/role/menus${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 获取skutotal列表接口
export const getSkutotal = params => {
    return axios.get(`${baseI}/skus/storelogs${getAccessToken()}`, {params: params}).then(res => res.data)
}

// 采购单列表
export const getPurchasseList = params => {
    return axios.get(`${baseI}/purchase/orders${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 删除采购单
export const deletePurchasse = po_id => {
    return axios.delete(`${baseI}/purchase/orders/${po_id}${getAccessToken()}`).then(res => res.data)
}
// 新增采购单
export const addPurchase = params => {
    return axios.post(`${baseI}/purchase/orders${getAccessToken()}`, params).then(res => res.data)
}
// 采购单详情
export const PurchaseDetail = (po_id, params) => {
    return axios.get(`${baseI}/purchase/orders/${po_id}${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 编辑采购单
export const editPurchases = (po_id, params) => {
    return axios.put(`${baseI}/purchase/orders/${po_id}${getAccessToken()}`, params).then(res => res.data)
}
// 采购单sku信息
export const PurchaseSku = params => {
    return axios.get(`${baseI}/purchase/orders/skusList${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 采购单生效
export const purchaseEffect = (po_id, params) => {
    return axios.put(`${baseI}/purchase/orders/${po_id}/implement${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 采购单审核
export const auditPurchase = (po_id, params) => {
    return axios.put(`${baseI}/purchase/orders/${po_id}/check${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 确认完成采购单
export const confirmPuchase = po_id => {
    return axios.put(`${baseI}/purchase/orders/${po_id}/finished${getAccessToken()}`, {po_id: po_id}).then(res => res.data)
}


// 订单全部
export const getAorders = params => {
    return axios.get(`${baseI}/trades${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 历史订单
export const getOrderHistory = params => {
    return axios.get(`${baseI}/trades/history${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 订单详情
export const getOrderDe = tid => {
    return axios.get(`${baseI}/trades/${tid}${getAccessToken()}`, {params: tid}).then(res => res.data)
}
// 异常订单
export const getOrderAbnormal = params => {
    return axios.get(`${baseI}/trades/exceptional${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 批量修改备注
export const editMemo = params => {
    return axios.put(`${baseI}/trades/vender_remark${getAccessToken()}`, params).then(res => res.data)
}
// 批量关闭订单
export const closeOrder = params => {
    return axios.put(`${baseI}/trades/close_trades${getAccessToken()}`, params).then(res => res.data)
}
// 异常订单重试
export const regainOrder = order_id => {
    return axios.get(`${baseI}/trades/checkOrder/${order_id}${getAccessToken()}`).then(res => res.data)
}


// 电商平台订单列表
export const getDSorders = params => {
    return axios.get(`${baseI}/finance/trades/lists${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 电商平台销售商品明细
export const getDSinfo = params => {
    return axios.get(`${baseI}/finance/trades/itemsInfo${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 销售额总计
export const getsalesAmount = params => {
    return axios.get(`${baseI}/finance/trades/salesAmount${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 外卖平台订单列表
export const getWMorders = params => {
    return axios.get(`${base}/finance/orders${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 外卖平台销售商品明细
export const getWMinfo = params => {
    return axios.get(`${base}/finance/orderSku${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 外卖销售额总计
export const getWMAmount = params => {
    return axios.get(`${base}/finance/orderSum${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 外卖入库类型列表
export const getWinstockType = params => {
    return axios.get(`${base}/io_type${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 外卖入库单列表
export const getWinstockList = params => {
    return axios.get(`${base}/instocks${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 外卖新增入库单
export const addWinstock = params => {
    return axios.post(`${base}/instocks${getAccessToken()}`, params).then(res => res.data)
}
// 外卖入库单详情
export const WinstockDetail = instock_id => {
    return axios.get(`${base}/instocks/${instock_id}${getAccessToken()}`).then(res => res.data)
}
// 外卖编辑入库单
export const WinstockEdit = (instock_id, params) => {
    return axios.put(`${base}/instocks/${instock_id}${getAccessToken()}`, params).then(res => res.data)
}
// 外卖入库sku统计查询
export const WinstockTotal = params => {
    return axios.get(`${base}/instocks/skusTotal${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 外卖删除入库单
export const WdeleteInstock = instock_id => {
    return axios.delete(`${base}/instocks/${instock_id}${getAccessToken()}`).then(res => res.data)
}
// 外卖入库单确认
export const WconfirmInstock = instock_id => {
    return axios.post(`${base}/instocks/confirm${getAccessToken()}`, instock_id).then(res => res.data)
}


// 外卖出库单列表
export const getWoutstockList = params => {
    return axios.get(`${base}/outstocks${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 外卖新增出库单
export const addWoutstock = params => {
    return axios.post(`${base}/outstocks${getAccessToken()}`, params).then(res => res.data)
}
// 外卖出库单详情
export const WoutstockDetail = instock_id => {
    return axios.get(`${base}/outstocks/${instock_id}${getAccessToken()}`).then(res => res.data)
}
// 外卖编辑出库单
export const WoutstockEdit = (instock_id, params) => {
    return axios.put(`${base}/outstocks/${instock_id}${getAccessToken()}`, params).then(res => res.data)
}
// 外卖出库sku统计查询
export const WoutstockTotal = params => {
    return axios.get(`${base}/outstocks/skusTotal${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 外卖删除出库单
export const WdeleteOutstock = outstock_id => {
    return axios.delete(`${base}/outstocks/${outstock_id}${getAccessToken()}`).then(res => res.data)
}
// 外卖出库单确认
export const WconfirmOutstock = outstock_id => {
    return axios.post(`${base}/outstocks/confirm${getAccessToken()}`, outstock_id).then(res => res.data)
}
// 外卖店铺列表
export const WstoreList = params => {
    return axios.get(`${base}/simplelists${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 盘点单列表
export const getIncentoryList = params => {
    return axios.get(`${baseI}/inventories${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 完成盘点订单
export const finishedIncentory = inventory_id => {
    return axios.put(`${baseI}/inventories/finish/${inventory_id}${getAccessToken()}`, {inventory_id: inventory_id}).then(res => res.data)
}
// 盘点单生效
export const effectIncentory = inventory_id => {
    return axios.put(`${baseI}/inventories/implement/${inventory_id}${getAccessToken()}`, {inventory_id: inventory_id}).then(res => res.data)
}
// 盘点单确认
export const confirmIncentory = inventory_id => {
    return axios.put(`${baseI}/inventories/check/${inventory_id}${getAccessToken()}`, {inventory_id: inventory_id}).then(res => res.data)
}
// 盘点单删除
export const deleteIncentory = inventory_id => {
    return axios.delete(`${baseI}/inventories/${inventory_id}${getAccessToken()}`).then(res => res.data)
}
// 盘点物料查询
export const incentorySkutotal = params => {
    return axios.get(`${baseI}/inventories/skusList${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 新增盘点单
export const addIncentory = params => {
    return axios.post(`${baseI}/inventories${getAccessToken()}`, params).then(res => res.data)
}
// 盘点单详情
export const IncentoryDetail = (inventory_id, params) => {
    return axios.get(`${baseI}/inventories/${inventory_id}${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 盘点单编辑
export const editInventory = (inventory_id, params) => {
    return axios.put(`${baseI}/inventories/${inventory_id}${getAccessToken()}`, params).then(res => res.data)
}


// 角色列表
export const getRoleList = params => {
    return axios.get(`${baseI}/roles${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 删除角色
export const deleteRole = role_id => {
    return axios.delete(`${baseI}/roles/${role_id}${getAccessToken()}`).then(res => res.data)
}
// 角色权限菜单
export const getPermissions = params => {
    return axios.get(`${baseI}/permissions${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 新增角色
export const addRoles = params => {
    return axios.post(`${baseI}/roles${getAccessToken()}`, params).then(res => res.data)
}
// 角色详情
export const getRolesDetail = (role_id, params) => {
    return axios.get(`${baseI}/roles/${role_id}${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 角色编辑
export const editRoles = (role_id, params) => {
    return axios.put(`${baseI}/roles/${role_id}${getAccessToken()}`, params).then(res => res.data)
}
// 获取全部菜单列表接口
export const getMenuLists = params => {
    return axios.get(`${baseI}/menus${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 库存预警列表
export const getWarningList = params => {
    return axios.get(`${baseI}/stocks_warning/skusList${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 预警设置列表
export const getDispose = params => {
    return axios.get(`${baseI}/stocks_warning${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 删除预警设置
export const deleteDispose = key => {
    return axios.delete(`${baseI}/stocks_warning/${key}${getAccessToken()}`).then(res => res.data)
}
// 新增预警设置
export const addDispose = params => {
    return axios.post(`${baseI}/stocks_warning${getAccessToken()}`, params).then(res => res.data)
}
// 编辑预警设置
export const editDispose = (key, params) => {
    return axios.put(`${baseI}/stocks_warning/${key}${getAccessToken()}`, params).then(res => res.data)
}


// 新增分类
export const addCategories = params => {
    return axios.post(`${baseI}/categories${getAccessToken()}`, params).then(res => res.data)
}
// 编辑分类
export const editCategories = (cat_id, params) => {
    return axios.put(`${baseI}/categories/${cat_id}${getAccessToken()}`, params).then(res => res.data)
}
// 删除分类
export const deleteCategories = cat_id => {
    return axios.delete(`${baseI}/categories/${cat_id}${getAccessToken()}`).then(res => res.data)
}
// 分类详情
export const detailCategories = cat_id => {
    return axios.get(`${baseI}/categories/${cat_id}${getAccessToken()}`).then(res => res.data)
}


// 操作日志
export const grtOperationLog = params => {
    return axios.get(`${baseI}/admin_logs${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 模块列表
export const getModules = params => {
    return axios.get(`${baseI}/admin_logs/modules${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 账号列表
export const accountList = params => {
    return axios.get(`${baseI}/users${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 修改密码
export const editPassword = (id, params) => {
    return axios.put(`${baseI}/users/updatePassword/${id}${getAccessToken()}`, params).then(res => res.data)
}
// 删除账号
export const deleteAccount = id => {
    return axios.delete(`${baseI}/users/${id}${getAccessToken()}`).then(res => res.data)
}
// 新增账号
export const addAccounts = params => {
    return axios.post(`${baseI}/users${getAccessToken()}`, params).then(res => res.data)
}
// 账号详情
export const detailAccount = (role_id, params) => {
    return axios.get(`${baseI}/users/${role_id}${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 编辑账号
export const editAccounts = (id, params) => {
    return axios.put(`${baseI}/users/${id}${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 获取线下售卖的分类列表
export const getOfflineClassList = params => {
    return axios.get(`${baseII}/categories${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 线下售卖分类删除
export const deleteOfflineCladd = cat_id => {
    return axios.delete(`${baseII}/categories/${cat_id}${getAccessToken()}`).then(res => res.data)
}
// 线下售卖分类编辑
export const editOfflineClass = (cat_id, params) => {
    return axios.post(`${baseII}/categories/${cat_id}${getAccessToken()}`, params).then(res => res.data)
}
// 新增线下售卖分类
export const addOfflineClass = params => {
    return axios.post(`${baseII}/categories${getAccessToken()}`, params).then(res => res.data)
}


// 新增线下售卖商品
export const addOfflineItem = (cat_id, params) => {
    return axios.post(`${baseII}/commodities/${cat_id}${getAccessToken()}`, params).then(res => res.data)
}
// 线下售卖分类商品详情
export const getDetailOffline = params => {
    return axios.get(`${baseII}/commodities${getAccessToken()}`, {params: params}).then(res => res.data)
}


//线下售卖订单列表
export const getOfflineOrderList = params => {
    return axios.get(`${baseII}/orders${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 添加商家备注
export const editOfflieMemo = (order_id, params) => {
    return axios.post(`${baseII}/orders/${order_id}${getAccessToken()}`, params).then(res => res.data)
}
// 线下售卖sku列表
export const getOfflineSkus = (cat_id, params) => {
    return axios.get(`${baseII}/commodities/skus/${cat_id}${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 获取地区数据
export const AreaData = () => {
    return axios.get('http://localhost:8081/static/region.json').then(res => res.data)
}
// 获取运费模板列表
export const getDlyList = params => {
    return axios.get(`${baseI}/freight${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 删除运费模板
export const deleteDly = rule_id => {
    return axios.delete(`${baseI}/freight/${rule_id}${getAccessToken()}`).then(res => res.data)
}
// 获取物流公司列表
export const getCorp = () => {
    return axios.get(`${baseI}/freight/corps${getAccessToken()}`).then(res => res.data)
}
// 运费模板的启用
export const onEnabled = (rule_id, params) => {
    return axios.get(`${baseI}/freight/enable/${rule_id}${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 新增运费模板
export const addDlys = params => {
    return axios.post(`${baseI}/freight${getAccessToken()}`, params).then(res => res.data)
}
// 编辑运费模板
export const editDlys = (rule_id, params) => {
    return axios.post(`${baseI}/freight/${rule_id}${getAccessToken()}`, params).then(res => res.data)
}
// 运费模板详情
export const dlyDetail = rule_id => {
    return axios.get(`${baseI}/freight/${rule_id}${getAccessToken()}`).then(res => res.data)
}


// 物料出库汇总
export const getOutstockList = params => {
    return axios.get(`${base}/outstocks/storeStatistic${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 物料出库明细
export const getOuststockDetail = params => {
    return axios.get(`${base}/outstocks/skuStatistic${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 店铺佣金列表
export const getBrolerageList = params => {
    return axios.get(`${base}/store_commission${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 新增店铺佣金
export const addBrolerage = params => {
    return axios.post(`${base}/store_commission${getAccessToken()}`, params).then(res => res.data)
}
// 编辑店铺佣金
export const editBrolerage = (group_id, params) => {
    return axios.post(`${base}/store_commission/${group_id}${getAccessToken()}`, params).then(res => res.data)
}
// 删除店铺佣金
export const removeBrolerage = group_id => {
    return axios.delete(`${base}/store_commission/${group_id}${getAccessToken()}`).then(res => res.data)
}


// 活动商品列表
export const getActivityItem = params => {
    return axios.get(`${base}/activities${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 活动商品删除
export const removeActivityItem = id => {
    return axios.delete(`${base}/activities/${id}${getAccessToken()}`).then(res => res.data)
}
// 添加活动商品
export const addActivityItem = params => {
    return axios.post(`${base}/activities${getAccessToken()}`, params).then(res => res.data)
}
// 修改活动商品
export const editActivityItem = (id, params) => {
    return axios.put(`${base}/activities/${id}${getAccessToken()}`, params).then(res => res.data)
}


// 销售订单成本统计
export const getOrderCost = params => {
    return axios.get(`${baseI}/finance/trades/orderCost${getAccessToken()}`, {params: params}).then(res => res.data)
}


// 形状列表
export const getShapeList = params => {
    return axios.get(`${baseI}/shape${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 删除形状
export const removeShape = shape_id => {
    return axios.delete(`${baseI}/shape/${shape_id}${getAccessToken()}`).then(res => res.data)
}
// 新增形状
export const addShapes = params => {
    return axios.post(`${baseI}/shape${getAccessToken()}`, params).then(res => res.data)
}
// 形状详情
export const shapeDetail = shape_id => {
    return axios.get(`${baseI}/shape/${shape_id}${getAccessToken()}`).then(res => res.data)
}
// 更新形状
export const editShape = (shape_id, params) => {
    return axios.put(`${baseI}/shape/${shape_id}${getAccessToken()}`, params).then(res => res.data)
}


// 包材列表
export const getMaterialsList = params => {
    return axios.get(`${baseI}/material${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 删除包材
export const removeMaterial = id => {
    return axios.delete(`${baseI}/material/${id}${getAccessToken()}`).then(res => res.data)
}
// 新增包材
export const addMaterial = params => {
    return axios.post(`${baseI}/material${getAccessToken()}`, params).then(res => res.data)
}
// 包材详情
export const materialDetail = id => {
    return axios.get(`${baseI}/material/${id}${getAccessToken()}`).then(res => res.data)
}
// 更新包材
export const editMaterial = (id, params) => {
    return axios.put(`${baseI}/material/${id}${getAccessToken()}`, params).then(res => res.data)
}
// sku简易数据
export const getSkuSimple = () => {
    return axios.get(`${baseI}/skus/simpleList${getAccessToken()}`).then(res => res.data)
}
// 形状简易数据
export const getShapeSimple = () => {
    return axios.get(`${baseI}/shape/simpleList${getAccessToken()}`).then(res => res.data)
}


// 包裹列表
export const getParcelList = params => {
    return axios.get(`${baseI}/package${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 包裹详情
export const parcelDetail = tid => {
    return axios.get(`${baseI}/package/${tid}${getAccessToken()}`).then(res => res.data)
}
// 包裹更新
export const editParcel = (tid, params) => {
    return axios.put(`${baseI}/package/${tid}${getAccessToken()}`, params).then(res => res.data)
}


// 需求列表
export const demandList = params => {
    return axios.get(`${baseI}/demand${getAccessToken()}`, {params: params}).then(res => res.data)
}
// 新增需求单
export const addDemand = params => {
    return axios.post(`${baseI}/demand${getAccessToken()}`, params).then(res => res.data)
}
// 编辑需求单
export const editDemand = (params, demand_id) => {
    return axios.put(`${baseI}/demand/${demand_id}${getAccessToken()}`, params).then(res => res.data)
}
// 需求单详情
export const demandDetail = demand_id => {
    return axios.get(`${baseI}/demand/${demand_id}${getAccessToken()}`).then(res => res.data)
}
// 需求单删除
export const removeDemand = demand_id => {
    return axios.delete(`${baseI}/demand/${demand_id}${getAccessToken()}`).then(res => res.data)
}
// 需求单生效
export const demandEffect = demand_id => {
    return axios.patch(`${baseI}/demand/${demand_id}/effective${getAccessToken()}`).then(res => res.data)
}
// 需求单确认
export const demandConfirm = demand_id => {
    return axios.patch(`${baseI}/demand/${demand_id}/confirm${getAccessToken()}`).then(res => res.data)
}
// 需求单完成
export const demandFinished = demand_id => {
    return axios.patch(`${baseI}/demand/${demand_id}/complete${getAccessToken()}`).then(res => res.data)
}


//新增菜单
export const addMenu = params => {
    return axios.post(`${baseI}/menus${getAccessToken()}`, params).then(res => res.data)
}
// 获取全部菜单
export const allMenu = () => {
    return axios.get(`${baseI}/menus${getAccessToken()}`).then(res => res.data)
}


//获取出库图表数据
export const getOutPutdata = params => {
    return axios.get(`${baseI}/outstocks/skusCountData${getAccessToken()}`,{params:params}).then(res => res.data);
}

// 获取销售单汇总列表
export const getOrderCount = params => {
    return axios.get(`${baseI}/trades_stat${getAccessToken()}`,{params:params}).then(res => res.data);
}

// 获取京仓仓库列表
export const getJdStoryList = params => {
    return axios.get(`${baseI}/eclp/warehouses${getAccessToken()}`,{params:params}).then(res => res.data);
}

// 获取京仓商品列
export const getJdGoodList = params => {
    return axios.get(`${baseI}/eclp/goods${getAccessToken()}`,{params:params}).then(res => res.data);
}

// 获取京仓库存列表
export const getJdGoodCount = params => {
    return axios.get(`${baseI}/eclp/stocks${getAccessToken()}`,{params:params}).then(res => res.data);
}