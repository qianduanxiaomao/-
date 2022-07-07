/* 
包含spu管理相关接口请求函数  SPU是上面一层
*/
import ajax from '@/utils/ajax'

export default {
    /* 
    获取销售属性列表
    GET /admin/product/baseSaleAttrList
    */
    getSaleAttrList() {
        return ajax.get('/admin/product/baseSaleAttrList')
    },

    /* 
    删除指定的SPU
    DELETE /admin/product/deleteSpu/{spuId}
    */
    remove(spuId) {
        return ajax.delete(`/admin/product/deleteSpu/${spuId}`)
    },

    /* 
    根据id获取SPU信息
    GET /admin/product/getSpuById/{spuId}
    spuList: 包含多个spu简单信息的数组
    spuInfo: 包含一个spu详细信息的对象
    */
    get(spuId) {
        return ajax.get(`/admin/product/getSpuById/${spuId}`)
    },

    /* 
    添加SPU详情信息
    POST /admin/product/saveSpuInfo
    POST /admin/product/updateSpuInfo
    */
    addUpdate(spuInfo) {
        // return ajax.post(`/admin/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`, spuInfo)
        return ajax({
            url: `/admin/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`,
            method: 'POST',
            data: spuInfo
        })
    },

    /* 
    GET /admin/product/{page}/{limit}
      query参数: category3Id
    */
    getList(page, limit, category3Id) {
        // return ajax.get(`/admin/product/${page}/${limit}`, {params: {category3Id}})

        return ajax({
            url: `/admin/product/${page}/${limit}`,
            method: 'GET',
            params: { category3Id }
        })
    },

    findSpuInfoByKeyword(keyword) {
        return ajax({
            url: `/admin/product/findSpuInfoByKeyword/${keyword}`,
            method: 'get'
        })
    }
}