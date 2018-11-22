<template>
    <section>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="120px" onsubmit="return false">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="包材名称：" class="hspace">
                                    <el-input v-model="materialsName" placeholder="请输入包材名称" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="subMit" :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" class='btnw' @click='addMaterials' :size="size">新增包材</el-button>
                </el-col>
            </el-row>
        </div>
        <!-- 表格 -->
        <el-table
                v-loading="isLoading"
                border
                :data="tableData"
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column type="expand" width="40">
                <template slot-scope="props">
                    <div>
                        <div v-for="(item,index) in props.row.plans">
                            <p class="plans">
                                包装计划 {{index}}： 可容纳
                            </p>
                            <p class="plans" style="margin-right: 15px;" v-for="(item,index_a) in props.row.plans[index]">
                                {{item.shape_name}} {{item.num}} 个
                            </p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="120">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click='edit(scope.row)'>编辑</el-button>
                    <el-button type="text" size="small" @click='remove(scope.row)' class="remove">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="包材名称"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop=""
                    label="包材对应物料"
                    min-width="170">
                <template slot-scope="props">
                    <elliptical :message="skuMatter(props.row)"></elliptical>
                </template>
            </el-table-column>
            <el-table-column
                    prop="height"
                    label="包材长度(cm)"
                    min-width="115">
            </el-table-column>
            <el-table-column
                    prop="width"
                    label="包材宽度(cm)"
                    min-width="115">
            </el-table-column>
            <el-table-column
                    prop="depth"
                    label="包材高度(cm)"
                    min-width="115">
            </el-table-column>
            <el-table-column
                    prop="volume"
                    label="包材容积"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="weight"
                    label="包材重量(kg)"
                    min-width="115">
            </el-table-column>
            <el-table-column prop="memo" label="备注" min-width="170">
                <template slot-scope="props">
                    <elliptical :message="props.row.memo"></elliptical>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
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
<style scoped>
    .plans{
        display: inline-block;
        font-size: 14px;
        line-height: 25px;
    }
    .plan{
        margin-right: 15px;
    }
</style>
<script>
    import {getMaterialsList, removeMaterial} from "../../api/api"
    export default{
        data (){
            return {
                tableData: [],
                isLoading: false,
                total: 100,
                page: 1,
                per_page: 10,
                materialsName: "",
                size: this.$store.state.size
            }
        },
        created(){
            this.subMit();
            this.addEvent();
        },
        methods: {
            skuMatter(item){
                let str = "";
                if (item.resources.length > 0) {
                    for (let i in item.resources) {
                        if (i == 0) {
                            str += item.resources[i].title
                        } else {
                            str += "，" + item.resources[i].title
                        }
                    }
                }

                return str;
            },
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.subMit();
                    }
                })
            },
            subMit(){
                let parm = {
                    name: this.materialsName,
                    page: this.page,
                    per_page: this.per_page
                }
                this.isLoading = true;
                getMaterialsList(parm).then(res => {
                    this.isLoading = false;
                    this.tableData = res.data.data;
                    this.total = res.data.totalCount;
                })
            },
            reLoad(){
                this.materialsName = "";
            },
            addMaterials(){
                this.$router.push({path: "/package/material/add"})
            },
            handleSizeChange(val){
                this.per_page = val;
                this.subMit();
            },
            handleCurrentChange(val){
                this.page = val;
                this.subMit();
            },
            edit(val){
                this.$router.push({path: "/package/material/edit", query: {material_id: val.material_id}})
            },
            remove(val){
                this.$confirm('此操作将永久删除该包材, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'right',
                    type: 'warning'
                }).then(() => {
                    removeMaterial(val.material_id).then(res => {
                        if (!res.error_code) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.subMit()
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                }).catch((error) => {
                    console.log(error)
                });
            }
        }
    }
</script>