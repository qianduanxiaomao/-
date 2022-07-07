import ajax from '@/utils/ajax'
export default {
    getPageList: (page, limit) => ajax.get(`/admin/product/baseTrademark/${page}/${limit}`),
    removeTrademark: id => ajax.delete(`/admin/product/baseTrademark/remove/${id}`),
    addOrUpdateTrademark: trandemark => {
        if (trandemark.id) ajax.put('/admin/product/baseTrademark/update', trandemark)
        else ajax.post(`/admin/product/baseTrademark/save`, trandemark)
    },
    getList: () => ajax.get('/admin/product/baseTrademark/getTrademarkList')
}
/*
删除BaseTrademark
/admin/product/baseTrademark/remove/{id}
新增BaseTrademark
POST /admin/product/baseTrademark/save
修改BaseTrademark
PUT /admin/product/baseTrademark/update
分页列表
GET /admin/product/baseTrademark/{page}/{limit}
*/