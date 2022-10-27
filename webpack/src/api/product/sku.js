//axios
import request from '@/utils/request'

//首页信息
export const reqSkuList = (page,limit)=> request.get('/admin/product/list'+`/${page}/${limit}`)
//删除
export const reqdeleteSkuList = (skuId) =>request.delete('/admin/product/deleteSku'+`/${skuId}`)
//下架
export const reqDownSkuList = (skuId) => request.get('/admin/product/cancelSale'+`/${skuId}`)
//上架
export const reqUpSkuList = (skuId) =>request.get('/admin/product/onSale'+`/${skuId}`)
//查看详情的抽屉内容
export const reqGetSkuById = (skuId) =>request.get('/admin/product/getSkuById'+`/${skuId}`)