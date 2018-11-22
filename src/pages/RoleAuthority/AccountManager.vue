<template>
    <section>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="150px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="用户名：">
                                    <el-input v-model="userName" placeholder="请输入用户名" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="真实姓名：">
                                    <el-input v-model="names" placeholder="请输入真实姓名" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getAccount" :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button class='btnw' type="primary" @click='addAccount' :size="size">新增账号</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table
                v-loading="isLoading"
                :data="tableData"
                border
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column
                    label="操作"
                    min-width="170">
                <template slot-scope="scope">
                    <el-button type="text" :size="size" @click="uppass(scope.row)">修改密码</el-button>
                    <el-button type="text" :size="size" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" :size="size" @click="remove(scope.row)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="用户名"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="real_name"
                    label="真实姓名"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    label="联系电话"
                    min-width="125">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="联系邮箱"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="roles"
                    label="角色"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="created_at"
                    label="创建时间"
                    width="100">
            </el-table-column>
            <el-table-column prop="memo" label="备注" min-width="170">
                <template slot-scope="props">
                    <elliptical :message="props.row.memo"></elliptical>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="per_page"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="paging">
        </el-pagination>
        <!--修改密码-->
        <el-dialog title="修改密码" v-model="uppassword">
            <el-form labelWidth="120px">
                <el-form-item label="密码" required>
                    <el-input v-model="password"></el-input>
                </el-form-item>
                <el-form-item label="重复密码" required>
                    <el-input v-model="repassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="savePassword">保 存</el-button>
                <el-button @click="uppassword = false">取 消</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
    import {accountList, editPassword, deleteAccount} from './../../api/api'
    export default{
        data (){
            return {
                userName: "",
                names: "",
                total: 100,
                per_page: 10,
                page: 1,
                tableData: [],
                isLoading: false,
                uppassword: false,
                password: "",
                repassword: "",
                id: "",
                size: "",
            }
        },
        created (){
            this.size = this.$store.state.size;
            this.getAccount()
        },
        methods: {
            reLoad(){
                this.userName = ""
                this.name = ""
            },
            edit(val){
                this.$router.push({path: "/system/rolesauthes/users/edit", query: {id: val.id}})
            },
            remove(val){
                this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteAccount(val.id).then((res) => {
                        if (!res.error_code) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getAccount();
                        } else {
                            this.$message.error(res.message)
                        }
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            uppass(val){
                this.uppassword = true;
                this.id = val.id;
            },
            savePassword(){
                var parm = {
                    id: this.id,
                    password: this.password,
                    re_password: this.repassword,
                }
                editPassword(this.id, parm).then((res) => {
                    if (!res.error_code) {
                        this.$message.info("保存成功！！！");
                        this.uppassword = false;
                    } else {
                        this.$message.error(res.message)
                    }
                })
            },
            addAccount(){
                this.$router.replace("/system/rolesauthes/users/add")
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getAccount()
            },
            handleCurrentChange(val){
                this.page = val;
                this.getAccount()
            },
            getAccount(){
                var parm = {
                    page: this.page,
                    per_page: this.per_page,
                    name: this.userName,
                    real_name: this.name,
                }
                this.isLoading = true;
                accountList(parm).then((res) => {
                    this.tableData = res.data.users;
                    this.total = res.data.totalCount;
                    this.isLoading = false;
                })
            }
        }
    }
</script>