import ajax from '@/utils/ajax'
export default {
    getCategory1: () => ajax.get('/admin/product/getCategory1'),
    getCategory2: category1Id => ajax.get(`/admin/product/getCategory2/${category1Id}`),
    getCategory3: category2Id => ajax.get(`/admin/product/getCategory3/${category2Id}`)
}
// 三级分类请求
/*
getCategory1
/admin/product/getCategory1
getCategory2
GET /admin/product/getCategory2/{category1Id}
getCategory3
GET /admin/product/getCategory3/{category2Id}


 */
