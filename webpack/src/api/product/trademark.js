//引入封装好的axios
import request from '@/utils/request'

//获取品牌数据接口
export const reqTrademarkList = (page,limit) => request.get('/admin/product/baseTrademark'+ `/${page}/${limit}`)
//添加
export const reqAddTrademark = (data) => request.post('/admin/product/baseTrademark/save',data)
//修改
export const reqUpdateTrademark = (data) => request.put('/admin/product/baseTrademark/update',data)
//删除
export const reqDeleteTrademark = (id) => request.delete('/admin/product/baseTrademark/remove'+`/${id}`)