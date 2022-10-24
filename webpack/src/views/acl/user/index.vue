<template>
    <div style="padding:30px">
        <div>
            <el-input style="width:180px;margin-right:10px" placeholder="用户名" v-model="searchObj.username"></el-input>
            <el-button type="primary" size="default" icon="el-icon-search" @click="getUserList(1)">查询</el-button>
            <el-button plain @click="remove">清空</el-button>
        </div>
        <div style="margin:20px 0">
            <el-button type="primary" size="default" @click="addUser">添加</el-button>
            <el-button type="danger" size="default" :disabled="xianshi" @click="revomveUsers">批量删除</el-button>
        </div>

        <el-table border style="width: 100%;margin:20px 0" :data="searchObj1.items" v-loading="loading"
            @selection-change="show">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column align="center" label="序号" width="80" type="index">
            </el-table-column>
            <el-table-column label="用户名" width="150" prop="username">
            </el-table-column>
            <el-table-column label="用户昵称" prop="nickName">
            </el-table-column>
            <el-table-column label="角色列表" prop="roleName">
            </el-table-column>
            <el-table-column label="创建时间" width="180" prop="gmtCreate">
            </el-table-column>
            <el-table-column label="更新时间" width="180" prop="gmtModified">
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="{row,$index}">
                    <el-tooltip content="分配角色" placement="top" effect="dark">
                        <el-button type="info" size="small" icon="el-icon-user-solid" @click="showAssignRole(row)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="修改角色" placement="top" effect="dark">
                        <el-button type="primary" size="small" icon="el-icon-edit" @click="updataUser(row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除角色" placement="top" effect="dark">
                        <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteUser(row.id)">
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination :page-sizes="[3, 6, 9]" :page-size="limit" :current-page="page"
            layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @size-change="handleSizeChange"
            @current-change="getUserList">
        </el-pagination>
        <!-- 添加或修改的对话框 -->
        <el-dialog :title="addObj.id ? '修改用户' : '添加用户'" :visible.sync="dialogFormVisible" width="50%">
            <el-form style="width:90%" label-width="100px" :model="addObj" ref="addObj">
                <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }]" prop="username">
                    <el-input autocomplete="off" v-model="addObj.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" :rules="[{ required: true, message: '请输入用户昵称', trigger: 'blur' },
                { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }]" prop="nickName">
                    <el-input v-model="addObj.nickName"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" v-show="addObj.id ? '' : this.flag = true" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]" prop="password">
                    <el-input v-model="addObj.password" show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('addObj')">取 消</el-button>
                <el-button type="primary" @click="getaAdd('addObj')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配角色的对话框 -->
        <el-dialog title="设置角色" :visible.sync="dialogRoleVisible" width="60%">
            <el-form ref="addObj" label-width="80px" size="normal" :model="addObj">
                <el-form-item label="用户名">
                    <el-input :disabled="true" v-model="addObj.username"></el-input>
                </el-form-item>
                <el-form-item label="角色列表">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group @change="handleCheckedCitiesChange" v-model="userRoleIds">
                        <el-checkbox v-for="roles in allRoles" :label="roles.id" :key="roles.id">{{ roles.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="checkAllUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
export default {
    name: 'User',
    data() {
        return {
            loading: true,//加载状态
            total: 0,//总条数
            page: 1,//当前第几页
            limit: 3,//每页几条数据
            searchObj: {//搜索
                username: '',//用户名
                nickName: '',//用户昵称
            },
            addObj: {//添加用户
                id: '',//修改用户需要的id值
                username: '',//用户名
                nickName: '',//用户昵称
                password: '',//用户密码
            },
            selectedIds: [],//删除全选
            xianshi: true,//删除按钮的禁用与不禁用状态
            flag: false,//用户密码的显示与隐藏
            searchObj1: {},//用户列表
            dialogFormVisible: false,//点击添加或修改的对话框
            dialogRoleVisible: false,//点击分配角色的对话框
            checkAll: false,//是否全选
            allRoles: [],//分配角色的所有选项
            userRoleIds: [],//用户角色的列表
            checkAll: false,//全选状态
            isIndeterminate: true//半选状态
        }
    },

    methods: {
        //获取列表数据的函数(搜索)
        async getUserList(page = 1) {
            // console.log(page)
            // 开启加载
            this.loading = true
            //整理参数
            this.page = page
            const { limit, searchObj } = this;
            //发请求
            let result = await this.$API.user.getPageList(page, limit, searchObj)
            if (result.code == 20000) {
                // 列表数据
                this.searchObj1 = result.data
                // 总条数
                this.total = result.data.total
            }
            this.loading = false
        },
        //右下角分页器下拉框点击事件
        handleSizeChange(limit) {
            this.limit = limit;
            this.getUserList()
        },
        //清空搜索列表
        remove() {
            this.searchObj.username = '',
                this.getUserList()
        },
        // 添加用户
        addUser() {
            this.dialogFormVisible = true
            this.addObj.username = '',
                this.addObj.nickName = '',
                this.addObj.password = '',
                this.addObj.id = ''
        },
        //添加或修改用户对话框点击确定的回调
        async addOrUpdateUser() {
            if (this.addObj.id) {
                await this.$API.user.update(this.addObj)
                this.getUserList()
                this.dialogFormVisible = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
            } else {
                await this.$API.user.add(this.addObj)
                this.getUserList()
                this.dialogFormVisible = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
            }
        },
        //添加或修改用户对话框取消
        cancel(formName) {
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        },
        //修改用户
        updataUser(row) {
            this.dialogFormVisible = true
            if (row.id) {
                this.addObj.id = row.id
                this.addObj.username = row.username
                this.addObj.nickName = row.nickName
            }
        },
        //点击分配角色按钮
        async showAssignRole(row) {
            this.addObj.username = row.username
            this.addObj.id = row.id
            let result = await this.$API.user.getRoles(row.id)
            this.allRoles = result.data.allRolesList
            this.userRoleIds = result.data.assignRoles.map(item => item.id)
            this.dialogRoleVisible = true
        },
        //点击删除条件按钮
        deleteUser(row) {

            // 删除按钮的提示框
            this.$confirm('您确定要删除当前数据嘛?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await this.$API.user.removeById(row)
                this.getUserList(this.page)
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
        //分配角色对话框中的全选按钮
        handleCheckAllChange(val) {
            if (val) {
                this.userRoleIds = this.allRoles.map(item => item.id)
                this.isIndeterminate = false;
            } else {
                this.userRoleIds = []
                this.isIndeterminate = false;
            }
        },
        //分配角色对话框中的单个按钮选择
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.allRoles.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.allRoles.length;
        },
        //全选删除按钮
        async revomveUsers() {
            this.$message({
                message: '删除成功',
                type: 'success'
            })
            this.getUserList()
        },
        //分配角色对话框的确定按钮
        async checkAllUser() {
            let userId = this.addObj.id
            let roleId = this.userRoleIds.join(',')
            let result = await this.$API.user.assignRoles(userId, roleId)
            if (result.code === 20000) {
                this.$message({
                    message: '分配成功',
                    type: 'success'
                }),
                    this.dialogRoleVisible = false
                this.getUserList(this.page)
            }
        },
        //删除按钮的禁用与不禁用判断
        show(selectedIds) {
            if (selectedIds.length) {
                this.xianshi = false
            } else {
                this.xianshi = true
            }
        },
        //点击确定按钮的表单验证
        getaAdd(addObj) {
            this.$refs[addObj].validate((valid) => {
                if (valid) {
                    this.addOrUpdateUser()
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
        this.getUserList();
    },
}
</script>

<style lang="scss" scoped>

</style>