import ajax from '@/utils/ajax'
export default {
    getAttrList: (category1Id, category2Id, category3Id) => ajax.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`),
    delete: (attrId) => ajax.delete(`/admin/product/deleteAttr/${attrId}`),
    addOrupdeta: (categoryObject) => ajax.post(`/admin/product/saveAttrInfo `, categoryObject)
}
/*
获取属性信息集合
GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
//根据某个ID删除某个属性
DELETE /admin/product/deleteAttr/{attrId}
getAttrValueList
//添加或者修改属性
POST /admin/product/saveAttrInfo
//根据ID删除某个平台属性(不用)
GET /admin/product/getAttrValueList/{attrId}
*/
