<template>
    <section>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="150px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="预警仓库：">
                                    <el-select v-model="warehouse_id" clearable placeholder="请选择预警仓库" class="col" :size="size">
                                        <el-option
                                                v-for="item in options"
                                                :label="item.warehouse_name"
                                                :value="item.warehouse_id"
                                                :key="item.warehouse_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getWarningLists" :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button class='btnw'  type="primary" @click='addWarning' :size="size">新增预警</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table
                :data="tableData"
                border
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column
                    label="操作"
                    min-width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="最低库存预警数"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="warehouseNames"
                    label="预警仓库"
                    min-width="120">
            </el-table-column>
            <el-table-column prop="content" label="备注" min-width="170">
                <template slot-scope="props">
                    <elliptical :message="props.row.content"></elliptical>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
    import { getDispose, getWareHousesList, deleteDispose } from './../../api/api'
    export default{
        data (){
            return {
                warehouse_id: [],
                tableData: [],
                options: [],
                size: ""
            }
        },
        created (){
            this.size = this.$store.state.size;
            getWareHousesList().then(res => {
                this.options = res.data.itemList
            })
            this.getWarningLists()
        },
        methods: {
            remove(val){
                this.$confirm('此操作将永久删除该设置, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteDispose(val.key).then((res)=>{
                        if (!res.error_code){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getWarningLists();
                        }else{
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
                this.$router.push({path: "/iostocks/stockwarning/add",query: {key: val.key}})
            },
            reLoad(){
                this.warehouse_id = []
            },
            addWarning(){
                this.$router.replace('/iostocks/stockwarning/add')
            },
            getWarningLists(){
                var parm = {
                    warehouse_id: this.warehouse_id,
                    per_page: this.per_page,
                    page: this.page,
                }
                getDispose(parm).then((res)=>{
                    this.tableData = res.data;
                    this.total = res.data.totalCount;
                })
            }
        }
    }
</script>