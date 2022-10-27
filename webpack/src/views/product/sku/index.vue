<template>
    <div>
        <el-table border stripe v-loading="isLoading" :data="skuList" style="margin:20px 0">
            <el-table-column label="序号" type="index" width="80px" align="center">
            </el-table-column>

            <el-table-column label="名称" prop="skuName">
            </el-table-column>

            <el-table-column label="描述" prop="skuDesc">
            </el-table-column>


            <el-table-column label="默认图片" width="150px">
                <template slot-scope="{row,$index}">
                    <img :src="row.skuDefaultImg" style="width:100px;height:100px">
                </template>
            </el-table-column>

            <el-table-column label="重量（KG）" prop="weight">
            </el-table-column>

            <el-table-column label="价格（元）" prop="price" width="100px">
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="{row,$index}">
                    <el-button size="small" @click="changeSale(row)"
                        :icon="row.isSale == 0 ? 'el-icon-top' : 'el-icon-bottom'" :type="row.isSale == 0 ? 'success' : 'info'">
                    </el-button>
                    <el-button type="warning" size="small" icon="el-icon-edit" @click="alter"></el-button>
                    <el-button type="info" size="small" icon="el-icon-setting" @click="look(row.id)"></el-button>
                    <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteSkuList(row.id)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination style="text-align:center" :page-sizes="[3, 6, 9]" :page-size="limit"
            layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @size-change="handleSizeChange"
            @current-change="getSkuList" :current-page="page">
        </el-pagination>
        <!-- 抽屉 -->
        <el-drawer :visible.sync="drawer" :with-header="false" :data="lookList" size="50%">
            <el-row>
                <el-col :span="5">名称</el-col>
                <el-col :span="16">{{lookList.skuName}}</el-col>
            </el-row>

            <el-row>
                <el-col :span="5">描述</el-col>
                <el-col :span="16">{{lookList.skuDesc}}</el-col>
            </el-row>

            <el-row>
                <el-col :span="5">价格</el-col>
                <el-col :span="16">{{lookList.price}}</el-col>
            </el-row>

            <el-row>
                <el-col :span="5">平台属性</el-col>
                    <el-tag  :span="16"  v-for="value in lookList.skuAttrValueList" :key="value.id">{{value.attrId+ '-' +value.valueId}}</el-tag>
                    
            </el-row>

            <el-row>
                <el-col :span="5">销售属性</el-col>
                    <el-tag v-for="value in lookList.skuSaleAttrValueList" :key="value.id">{{value.id+ '-' +value.saleAttrValueId}}</el-tag>
                    
            </el-row>

            <el-row>
                <el-col :span="5">商品图片</el-col>
                <el-col :span="16"><img :src="lookList.skuDefaultImg" style="width:400px;height:400px"></el-col>
            </el-row>
            
        </el-drawer>
    </div>
</template>

<script>
import { reqSkuList, reqdeleteSkuList, reqDownSkuList, reqUpSkuList, reqGetSkuById } from '@/api/product/sku'
export default {
    name: 'Sku',
    data() {
        return {
            isLoading: false,//加载状态
            page: 1,//第几页
            limit: 3,//每页几条数据
            skuList: {},//所有数据
            total: 0,//总数据
            drawer: false,//抽屉开关
            lookList:{},//查看详情抽屉框
        }
    },
    methods: {
        //获取首页数据
        async getSkuList(page = 1) {
            this.page = page
            this.isLoading = true
            let result = await reqSkuList(this.page, this.limit)
            this.total = result.data.total
            this.skuList = result.data.records
            this.isLoading = false
        },
        //分页器右下角
        handleSizeChange(limit) {
            this.limit = limit
            this.getSkuList()
        },
        //删除
        async deleteSkuList(row) {
            await reqdeleteSkuList(row)
            this.$message({
                message:'删除成功',
                type:'success'
            })
            this.getSkuList()
        },
        //查看详情
        async look(id) {
            this.drawer = true
            let result = await reqGetSkuById(id)
            console.log(result);
            this.lookList = result.data
        },
        //修改
        alter() {
            this.$message({
                message: '功能开发中',
            })
        },
        //判断上下架
        async changeSale(row) {
            if (row.isSale == 0) {
            this.isLoading = true
            row.isSale = 1
            await reqUpSkuList(row.id)
            this.isLoading = false
            this.$message({
                message:'下架成功',
                type:'success'
            })
            } else {
                this.isLoading = true
            row.isSale = 0
            await reqDownSkuList(row.id)
            this.isLoading = false
            this.$message({
                message:'上架成功',
                type:'success'
            })
            }
        },
        
    },
    mounted() {
        this.getSkuList()
    },
}
</script>

<style lang="scss" scoped>

</style>