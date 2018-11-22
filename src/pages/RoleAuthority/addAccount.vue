<template>
    <div class="add-items" style="padding: 15px;">
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;账号信息</h3>
            <div style="display: flex;margin-top: 20px;">
                <div style="flex-grow: 1;width: 1px;"></div>
                <div style="flex-grow: 2;width: 1px;">
                    <el-form label-width="100px" style="width: 60%;">
                        <el-form-item label="用户名：" required>
                            <el-input v-model="userName" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="真实姓名：" required>
                            <el-input v-model="names" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="密码：" required v-if="bool">
                            <el-input v-model="password" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="重复密码：" required v-if="bool">
                            <el-input v-model="repassword" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="联系邮箱：" required>
                            <el-input v-model="postbox" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话：">
                            <el-input v-model="telephone" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="flex-grow: 1;width: 1px;"></div>
            </div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;选择角色</h3>
            <p style="padding: 30px 20px">
                <el-radio-group v-model="radio" v-for="val in role" :key="val.id">
                    <el-radio :label="val.id" style="margin-right: 20px;">{{val.label}}</el-radio>
                </el-radio-group>
            </p>
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
                    <el-button @click="$router.replace('/system/rolesauthes/users/list')" class='btnw'>取消</el-button>
                </div>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    import { addAccounts, getRoleList, detailAccount, editAccounts } from '../../api/api'

    export default {
        data() {
            return {
                memo: "",
                radio: "",
                telephone: "",
                repassword: "",
                password: "",
                userName: "",
                names: "",
                postbox: "",
                role: [],
                bool: true
            }
        },
        created(){
            var parm = {per_page:9999}
            getRoleList(parm).then((res)=>{
                this.role = res.data.roles
            })
            if (this.$route.query.id){
                this.bool = false
                var parm = {
                    id: this.$route.query.id
                }
                detailAccount(this.$route.query.id,parm).then((res)=>{
                    var info = res.data;
                    this.userName = info.name;
                    this.names = info.real_name;
                    this.postbox = info.email;
                    this.telephone = info.mobile;
                    this.password = info.password;
                    this.repassword = info.re_password;
                    this.memo = info.memo;
                    this.radio = info.role_id;
                })
            }
        },
        methods: {
            onSubmit() {
                var parm = {
                    name: this.userName,
                    real_name: this.names,
                    email: this.postbox,
                    mobile: this.telephone,
                    memo: this.memo,
                    role_id: this.radio,
                    password: this.password,
                    re_password: this.repassword,
                }
                if (!this.$route.query.id){
                    addAccounts(parm).then((res)=>{
                        if (!res.error_code){
                            this.$message.info(res.message);
                            this.$router.replace("/system/rolesauthes/users/list")
                        }else{
                            this.$message.error(res.message);
                        }
                    })
                }else {
                    var parms = {
                        name: this.userName,
                        real_name: this.names,
                        email: this.postbox,
                        mobile: this.telephone,
                        memo: this.memo,
                        role_id: this.radio
                    }
                    editAccounts(this.$route.query.id,parms).then((res)=>{
                        if (!res.error_code){
                            this.$message("修改成功");
                            this.$router.replace("/system/rolesauthes/users/list")
                        }else{
                            this.$message.error(res.message);
                        }
                    })
                }
            }
        }
    }

</script>
