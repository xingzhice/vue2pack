<template>
    <div>
        <el-button type="primary" size="default" icon="el-icon-plus" style="" @click="updataTrademark" v-if="$hasBP('btn.Trademark.add')">添加
        </el-button>
        <el-table border style="width: 100%;margin:20px 0" :data="records" v-loading="loading">
            <el-table-column align="center" label="序号" width="80" type="index">
            </el-table-column>
            <el-table-column label="品牌名称" prop="tmName">
            </el-table-column>
            <el-table-column label="品牌LOGO">
                <template slot-scope="{row,$index}">
                    <img :src="row.logoUrl" width="100px" height="70px">
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{row,$index}">
                    <el-button type="warning" size="small" icon="el-icon-edit" @click="updataTrademark(row)">修改
                    </el-button>
                    <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteTrademark(row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination style="text-align:center" :page-sizes="[3, 6, 9]" :page-size="limit"
            layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @size-change="handleSizeChange"
            @current-change="getTrademarkList" :current-page="pag">
        </el-pagination>

        <!-- dialog点击添加显示页面 -->
        <el-dialog :title="tmFrom.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
            <el-form style="padding:0 20px" ref="tmFrom" :model="tmFrom" label-width="100px" >
                <el-form-item label="品牌名称" prop="tmName" :rules="[ { required: true, message: '请输入品牌名称', trigger: 'blur' },
                { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }]">
                    <el-input style="width:550px" v-model="tmFrom.tmName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" style="margin-top:30px">
                    <!-- 上传图片的样式 -->
                    <el-upload class="avatar-uploader" action="/dev-api/admin/product/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p class="Name">只能上传jpg/png文件，且不超过50kb</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('tmFrom')">取 消</el-button>
                <el-button type="primary" @click="getaAdd('tmFrom')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { reqTrademarkList, reqAddTrademark, reqUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
export default {
    name: 'Trademark',
    data() {
        return {
            loading: true,//加载状态
            records: [],//展示当前页的品牌列表数据
            page: 1,//当前页
            limit: 3,//每页几条数据
            total: 0,//总数量
            dialogFormVisible: false,//定义dialog显示
            //收集到的表单数据
            tmFrom: {
                id: '',//表单数据的ID
                tmName: '',//收集到的品牌名称
                logoUrl: '',//收集到的图片地址
            }
        }
    },
    methods: {
        //获取品牌的接口
        async getTrademarkList(parger = 1) {
            this.loading = true
            //整理参数
            this.page = parger;
            const { limit, page } = this;
            //发送请求
            let result = await reqTrademarkList(page, limit)
            if (result.code == 200) {
                //每一页品牌的数据
                this.records = result.data.records;
                //总条数
                this.total = result.data.total
            }
            this.loading = false
        },
        //分页器下拉框点击的回调
        handleSizeChange(limit) {
            this.limit = limit
            this.getTrademarkList()
        },

        // 上传图片的方法
        handleAvatarSuccess(res, file) {
            //收集图片地址
            this.tmFrom.logoUrl = res.data;
        },
        //上传图片的限制事件
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式 o!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB o!');
            }
            return isJPG && isLt2M;
        },
        //添加或修改数据
        updataTrademark(row) {
            this.dialogFormVisible = true
            if (row.id) {
                //点击修改按钮，获取内容
                this.tmFrom.id = row.id
                this.tmFrom.tmName = row.tmName
                this.tmFrom.logoUrl = row.logoUrl
            } else {
                //点击添加按钮，清空内容
                this.tmFrom.id = ''
                this.tmFrom.tmName = ''
                this.tmFrom.logoUrl = ''
            }
        },
        //点击确定按钮
        async addOrUpdateList() {
            this.dialogFormVisible = false
            if (this.tmFrom.id) {
                try {
                    await reqUpdateTrademark(this.tmFrom)
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    this.getTrademarkList(this.page)
                } catch (error) {
                    this.$message({
                        message: '修改失败',
                        type: 'error'
                    })
                }
            } else {
                try {
                    await reqAddTrademark(this.tmFrom)
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.getTrademarkList(this.page = 1)
                } catch (error) {
                    this.$message({
                        message: '添加失败',
                        type: 'error'
                    })
                }
            }
        },
        //点击取消按钮
        cancel(formName){
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        },
        //删除按钮的回调
        deleteTrademark(row) {
            // 删除按钮的提示框
            this.$confirm('您确定要删除当前数据嘛?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await reqDeleteTrademark(row)
                if (this.page === Math.ceil(this.total / this.limit)) {
                    if (this.records.length - 1 === 0) {
                        this.page = parseInt(this.total / this.limit)
                    }
                }
                this.getTrademarkList(this.page)

                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });


        },
        //点击确定按钮的表单验证
        getaAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addOrUpdateList()
          } else {
            this.$message({
                        message: '请输入正确格式',
                        type: 'error'
                    })
            return false;
          }
        });
      },
    },
    mounted() {
        this.getTrademarkList()
    },

}

</script>

<style lang="scss" scoped>
//上传图片框的样式
.avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.el-icon-plus.avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
}

.Name {
    font-size: 12px;
    color: #606266;
}

.el-form-item__error {
    color: blue !important;
    font-size: 12px;
    line-height: 1;
    padding-top: 10px;
    position: absolute;
    top: 100%;
    left: 75px;
}
</style>