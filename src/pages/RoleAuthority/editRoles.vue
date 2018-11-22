<template>
    <div class="add-items" style="padding: 15px;">
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;菜单配置</h3>
            <div style="padding: 20px;">
                <el-row>
                    <el-col :span="24" >
                        <p style='margin-bottom: 20px;'>
                            <el-form labelWidth="120px">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="角色名称：" required>
                                            <el-input v-model="label" aria-required placeholder="例：外卖商品管理员"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="角色标识：" required>
                                            <el-input v-model="name" placeholder="例：waimai-manager"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </p>
                        <el-checkbox-group v-model="menuList" @change="checkLis">
                            <el-table
                                    :data="menu"
                                    stripe
                                    border
                                    style="width: 100%">
                                <el-table-column
                                        prop="label"
                                        label="一级菜单"
                                        min-width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="label"
                                        label="二级菜单"
                                        min-width="180">
                                    <template slot-scope="scope">
                                        <p v-for="item in scope.row.children" :key="item.id">{{item.label}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        width="700"
                                        prop="label"
                                        label="三级菜单">
                                    <template slot-scope="scope">
                                        <div v-for="item in scope.row.children" :key="item.id">
                                            <p v-for="val in item.children" :key="item.id" style="text-align: left;display: inline-block;margin-right: 20px;"><el-checkbox :label="val.id">{{val.label}}</el-checkbox></p>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-checkbox-group>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;权限配置</h3>
            <div style="padding: 20px;">
                <el-row>
                    <el-col :span="24" >
                        <el-checkbox-group v-model="permissionsList" @change="checkLis">
                            <div v-for="val in permissions" style="width: 33%;display: inline-block">
                                <el-checkbox :label="val.id">{{val.label}}</el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;备注</h3>
            <el-row style="padding: 20px;">
                <el-col :span="24">
                    <el-input
                            style='width: 100%;margin-bottom: 20px;'
                            :autosize="{ minRows: 4, maxRows: 8}"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="memo">
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="2">
            <el-col :span="24">
                <div class="grid-content bg-purple-light text-center">
                    <el-button type="primary" @click="onSubmit" class='btnw'>保存</el-button>
                    <el-button @click="$router.replace('/system/rolesauthes/roles/list')" class='btnw'>取消</el-button>
                </div>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    import { getPermissions, getMenuLists, editRoles, getRolesDetail } from '../../api/api'

    export default {
        data() {
            return {
                label: "",
                memo: "",
                name: "",
                permissions: [],
                menu: [],
                menuList: [],
                permissionsList: [],
            }
        },
        created(){
            var parm = {role_id: this.$route.query.role_id}
            getRolesDetail(this.$route.query.role_id,parm).then((res)=>{
                this.label = res.data.label;
                this.name = res.data.name;
                this.memo = res.data.description;
                for (let i = 0;i < res.data.menus.length;i++){
                    this.menuList.push(res.data.menus[i].id)
                }
                for (let i = 0;i < res.data.permissions.length;i++){
                    this.permissionsList.push(res.data.permissions[i].id)
                }
                console.log(res)
            })
            var parm = { per_page: 9999 }
            getPermissions(parm).then((res)=>{
                this.permissions = res.data.permissions
            })
            getMenuLists(parm).then((res)=>{
                this.menu = res.data
            })
        },
        methods: {
            checkLis(){

            },
            onSubmit() {
                var permissionsIds = "";
                for (let i in this.permissionsList){
                    if (i < this.permissionsList.length - 1){
                        permissionsIds += this.permissionsList[i] + ","
                    }else{
                        permissionsIds += this.permissionsList[i]
                    }
                }
                var menuIds = "";
                for (let i in this.menuList){
                    if (i < this.menuList.length - 1){
                        menuIds += this.menuList[i] + ","
                    }else{
                        menuIds += this.menuList[i]
                    }
                }
                var parm = {
                    name: this.name,
                    label: this.label,
                    description: this.memo,
                    menuIds: menuIds,
                    permissionsIds: permissionsIds,
                }
                editRoles(this.$route.query.role_id,parm).then((res)=>{
                    if (!res.error_code){
                        this.$message.info("保存成功！")
                        this.$router.replace('/system/rolesauthes/roles/list')
                    }else {
                        this.$message.error(res.message)
                    }
                })
            }
        }
    }

</script>
