<template>
    <section>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="120px" onsubmit="return false">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="形状名称：" class="hspace">
                                    <el-input v-model="shapeName" placeholder="请输入形状名称" class="col" :size="size"></el-input>
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
                <el-col :span="24" style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" class='btnw' @click='addShape' :size="size">新增形状</el-button>
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
                    prop="shape_name"
                    label="形状名称"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="height"
                    label="形状长度(cm)"
                    min-width="115">
            </el-table-column>
            <el-table-column
                    prop="width"
                    label="形状宽度(cm)"
                    min-width="115">
            </el-table-column>
            <el-table-column
                    prop="depth"
                    label="形状高度(cm)"
                    min-width="115">
            </el-table-column>
            <el-table-column
                    prop="volume"
                    label="形状体积"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="weight"
                    label="形状重量(kg)"
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
<script>
    import { getShapeList,removeShape } from "../../api/api"
    export default{
        data (){
            return {
                tableData: [],
                isLoading: false,
                total: 100,
                page: 1,
                per_page: 10,
                shapeName: "",
                size: this.$store.state.size
            }
        },
        created(){
            this.subMit();
            this.addEvent();
        },
        methods:{
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
                    shape_name: this.shapeName,
                    page: this.page,
                    per_page: this.per_page
                }
                this.isLoading = true;
                getShapeList(parm).then(res => {
                    this.isLoading = false;
                    this.tableData = res.data.data;
                    this.total = res.data.totalCount;
                })
            },
            reLoad(){
                this.shapeName = "";
            },
            addShape(){
                this.$router.push({path: "/package/shape/add"})
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
                this.$router.push({path: "/package/shape/edit",query:{shape_id: val.shape_id}})
            },
            remove(val){
                this.$confirm('此操作将永久删除该形状, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'right',
                    type: 'warning'
                }).then(() => {
                    removeShape(val.shape_id).then(res => {
                        if (!res.error_code){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.subMit()
                        }else {
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