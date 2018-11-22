<template>
    <section>
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'>
                    <span style='margin-left: 30px'>筛选条件</span>
                </el-col>
                <el-row :span="22">
                    <el-form label-width="120px" onsubmit="return false;">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="分类名称：">
                                    <el-input v-model="classify_name" placeholder="请输入分类名称"
                                              @keyup.enter="getclassifyList" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getclassifyList" :size="size">查询
                                </el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-row>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" @click="add" class="btnw" :size="size">新增分类</el-button>
                </el-col>
            </el-row>
            <el-table
                    v-loading="isLoading"
                    border
                    :data="tableData"
                    style="width: 100%"
                    class="geFontSize_list">
                <el-table-column
                        label="操作"
                        min-width="170">
                    <template slot-scope="scope">
                        <el-button type="text" :size="size" @click="manager(scope.row)">商品管理</el-button>
                        <el-button type="text" :size="size" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="text" :size="size" @click="remove(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="分类名称"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="order"
                        label="排序"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="updated_at"
                        label="最后编辑时间"
                        min-width="150">
                </el-table-column>
            </el-table>
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
            <el-dialog title="编辑分类" v-model="edit_bool">
                <el-form labelWidth="100px" style="width: 400px;margin: 0 auto">
                    <el-form-item label="分类名称">
                        <el-input v-model="edit_classifyName" class="col"></el-input>
                    </el-form-item>
                    <el-form-item label="分类顺序">
                        <el-input v-model="edit_classifyOrder" class="col"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="edit_finished">确 定</el-button>
                    <el-button @click="edit_bool = false">取 消</el-button>
                </span>
            </el-dialog>
            <el-dialog title="新增分类" v-model="add_bool">
                <el-form labelWidth="100px" style="width: 400px;margin: 0 auto">
                    <el-form-item label="分类名称">
                        <el-input v-model="classifyName" class="col"></el-input>
                    </el-form-item>
                    <el-form-item label="分类顺序">
                        <el-input v-model="classifyOrder" class="col"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="add_finished">确 定</el-button>
                    <el-button @click="add_bool = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </section>
</template>
<script>
    import {getOfflineClassList, deleteOfflineCladd, editOfflineClass, addOfflineClass} from './../../api/api'
    export default {
        data(){
            return {
                tableData: [],
                classify_name: "",
                isLoading: false,
                page: 1,
                per_page: 10,
                total: 100,
                edit_bool: false,
                add_bool: false,
                classifyName: "",
                classifyOrder: "",
                edit_classifyName: "",
                edit_classifyOrder: "",
                array: [],
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            this.getclassifyList()
        },
        watch: {
            classifyOrder: function () {
                if (parseFloat(this.classifyOrder) < 0) {
                    this.classifyOrder = 0
                }
            },
            classifyName: function () {
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.classifyName == this.tableData[i].name) {
                        this.$message("命名不能重复！！！")
                        this.classifyName = "";
                    }
                }
            },
            edit_classifyOrder: function () {
                if (parseFloat(this.edit_classifyOrder) < 0) {
                    this.edit_classifyOrder = 0
                }
            },
            edit_classifyName: function () {
                for (let i = 0; i < this.array.length; i++) {
                    if (this.edit_classifyName == this.array[i].name) {
                        this.$message("命名不能重复！！！")
                        this.edit_classifyName = "";
                    }
                }
            },
        },
        methods: {
            setArrays(){
                for (let i = 0; i < this.tableData.length; i++) {
                    this.array[i] = this.tableData[i]
                }
                for (let i = 0; i < this.array.length; i++) {
                    if (this.edit_classifyName == this.array[i].name) {
                        this.array.splice(i, 1)
                    }
                }
            },
            reLoad(){
                this.classify_name = "";
            },
            getclassifyList(){
                var parm = {
                    page: this.page,
                    per_page: this.per_page,
                    name: this.classify_name
                }
                this.isLoading = false;
                getOfflineClassList(parm).then((res) => {
                    this.tableData = res.data.data
                    this.total = res.data.totalCount
                })

            },
            manager(val){
                this.$router.push({path: "/itemManager", query: {cat_id: val.cat_id}})
            },
            edit(val){
                this.edit_classifyName = val.name;
                this.edit_classifyOrder = val.order;
                this.edit_bool = true;
                this.edit_cat_id = val.cat_id;
                this.setArrays();
            },
            add(){
                this.add_bool = true;
            },
            remove(val){
                this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    deleteOfflineCladd(val.cat_id).then((res) => {
                        if (!res.error_code) {
                            this.$message({
                                type: "success",
                                message: "删除成功"
                            })
                            this.getclassifyList()
                        } else {
                            this.$message({
                                type: "error",
                                message: res.message
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
            edit_finished(){
                var parm = {
                    name: this.edit_classifyName,
                    order: this.edit_classifyOrder,
                }
                if (this.edit_classifyOrder == "") {
                    this.$message({
                        type: "error",
                        message: "排序不能为空"
                    })
                    return;
                }
                if (isNaN(parseFloat(this.edit_classifyOrder))) {
                    this.$message({
                        type: "error",
                        message: "排序只接受数字,请重新输入"
                    })
                    return;
                }
                editOfflineClass(this.edit_cat_id, parm).then((res) => {
                    if (!res.error_code) {
                        this.$message({
                            type: "success",
                            message: "编辑成功"
                        })
                        this.edit_bool = false;
                        this.getclassifyList()
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message
                        })
                    }
                })
            },
            add_finished(){
                var parm = {
                    name: this.classifyName,
                    order: this.classifyOrder
                }
                if (this.classifyOrder == "") {
                    this.$message({
                        type: "error",
                        message: "排序不能为空"
                    })
                    return;
                }
                if (isNaN(parseFloat(this.classifyOrder))) {
                    this.$message({
                        type: "error",
                        message: "排序只接受数字,请重新输入"
                    })
                    return;
                }
                addOfflineClass(parm).then((res) => {
                    if (!res.error_code) {
                        this.$message({
                            type: "success",
                            message: "保存成功"
                        })
                        this.add_bool = false;
                        this.classifyName = "";
                        this.classifyOrder = "";
                        this.getclassifyList()
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message
                        })
                    }
                })
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getclassifyList()
            },
            handleCurrentChange(val){
                this.page = val;
                this.getclassifyList()
            }
        }
    }
</script>