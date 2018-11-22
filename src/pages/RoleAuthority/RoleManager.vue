<template>
    <section>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="150px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="角色标识：">
                                    <el-input v-model="name" placeholder="请输入角色标识" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="角色名称：">
                                    <el-input v-model="label" placeholder="请输入角色名称" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getRolesList" :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button class='btnw' type="primary" @click='addRole' :size="size">新增角色</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table
                class="geFontSize_list"
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    label="操作"
                    min-width="100">
                <template slot-scope="scope">
                    <el-button type="text" :size="size" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" :size="size" @click="remove(scope.row)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="角色标识"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="label"
                    label="角色名称"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="created_at"
                    label="创建时间"
                    min-width="120">
            </el-table-column>
            <el-table-column prop="description" label="备注" min-width="170">
                <template slot-scope="props">
                    <elliptical :message="props.row.description"></elliptical>
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
    </section>
</template>
<script>
    import {getRoleList, deleteRole} from './../../api/api'
    export default{
        data (){
            return {
                name: "",
                label: "",
                total: 200,
                page: 1,
                per_page: 10,
                tableData: [],
                size: ""
            }
        },
        created (){
            this.size = this.$store.state.size;
            this.getRolesList()
        },
        methods: {
            remove(val){
                this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRole(val.id).then((res) => {
                        if (!res.error_code) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getRolesList()
                        } else {
                            this.$message({
                                type: 'error',
                                message: '删除失败!'
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            edit(val){
                this.$router.push({path: "/system/rolesauthes/roles/edit", query: {role_id: val.id}})
            },
            reLoad(){
                this.name = ""
                this.label = ""
            },
            addRole(){
                this.$router.replace('/system/rolesauthes/roles/add')
            },
            getRolesList(){
                var parm = {
                    name: this.name,
                    label: this.label,
                    per_page: this.per_page,
                    page: this.page,
                }
                getRoleList(parm).then((res) => {
                    this.tableData = res.data.roles;
                    this.total = res.data.totalCount;
                })
            },
            handleCurrentChange(val){
                this.page = val;
                this.getRolesList()
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getRolesList()
            },
        }
    }
</script>