<template>
    <div>
        <el-table v-loading="isloading" :data="permissionList" :expand-row-keys="expandKeys" row-key="id" border>
            <el-table-column label="名称" prop="name">

            </el-table-column>
            <el-table-column label="权限值" prop="code">
            </el-table-column>
            <el-table-column label="跳转权限值" prop="toCode">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" size="default" icon="el-icon-plus" @click="toAddPermission(row)"
                        :title="getAddTitle(row.level)" :disabled="row.level === 4"></el-button>
                    <el-button type="primary" size="default" icon="el-icon-edit" :disabled="row.level === 1"
                        @click="toUpdatePermission(row)" :title="row.level === 4 ? '修改功能' : '修改菜单'"></el-button>
                    <el-button type="danger" size="default" icon="el-icon-delete" :disabled="row.level === 1"
                        @click="deletePermissionList(row.id)" title="删除">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :visible.sync="dialogPermissionVisible" :title="dialogTitle" @close="resetData">

            <el-form ref="permission" :model="permission" :rules="permissionRules" label-width="120px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="permission.name" />
                </el-form-item>

                <el-form-item label="功能权限值" prop="code">
                    <el-input v-model="permission.code" />
                </el-form-item>

                <el-form-item label="跳转路由权限值" prop="toCode" v-if="permission.level === 4">
                    <el-input v-model="permission.toCode" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetData">取 消</el-button>
                <el-button type="primary" @click="addOrUpdatePermission">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Permission',
    data() {
        return {
            isloading: false,//加载状态
            permissionList: {},//所有数据
            dialogPermissionVisible: false,//是否显示菜单权限
            permission: { // 要操作的菜单权限对象
                level: 0,
                name: '',
                code: '',
                toCode: ''
            },
        }
    },
    methods: {
        //获取列表数据
        async upPermissionList() {
            this.isloading = true
            let result = await this.$API.permission.getPermissionList()
            console.log(result);
            this.permissionList = result.data.children
            //获取分支数据
            this.expandKeys = [this.permissionList[0].id]
            this.isloading = false
        },
        //删除
        async deletePermissionList(row) {
            await this.$API.permission.removePermission(row)
            this.$message({
                message: '删除成功',
                type: 'success'
            })
            this.upPermissionList()
        },
        //根据等级判断弹框标题
        getAddTitle(level) {
            if (level === 1 || level === 2) {
                return '添加菜单'
            } else if (level === 3) {
                return '添加功能'
            }
        },
        //添加权限
        toAddPermission(row) {
            this.dialogPermissionVisible = true
            this.permission.pid = row.id
            this.permission.level = row.level + 1
            this.permission.type = this.permission.level === 4 ? 2 : 1
        },
        //添加或修改的内容
        toUpdatePermission(row) {
            this.dialogPermissionVisible = true
            this.permission = { ...row }
            this.permission.type = this.permission.level === 4 ? 2 : 1
        },
        //添加或修改的dialog的确定按钮
        addOrUpdatePermission() {
            this.$refs.permission.validate(async valid => {
                if (valid) {
                    const { permission } = this
                    const { id } = permission
                    const result = await this.$API.permission[id ? 'updatePermission' : 'addPermission'](permission)
                    this.$message.success(result.message || `${id ? '修改' : '添加'}成功!`)
                    this.resetData()
                    this.upPermissionList()
                }
            })
        },
        //添加或修改的dialog的取消按钮
        resetData() {
            this.dialogPermissionVisible = false
            this.permission = {
                level: 0,
                name: '',
                code: '',
                toCode: ''
            }
        }
    },
    computed: {
        //动态计算渲染弹框的表单内容
        dialogTitle() {
            const { id, level } = this.permission
            if (id) {
                return level === 4 ? '修改功能' : '修改菜单'
            } else {
                return level === 4 ? '添加功能' : '添加菜单'
            }
        }
    },
    mounted() {
        this.upPermissionList()
    },
}
</script>

<style lang="scss" scoped>

</style>