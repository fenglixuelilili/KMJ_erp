<template>
    <section>
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'>
                    <span style='margin-left: 30px'>筛选条件</span>
                </el-col>
                <el-col :span="21">
                    <el-form label-width="130px" onsubmit="return false">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="店铺名称：">
                                    <el-input v-model="title" placeholder="店铺名称" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="cb">
                            <el-col :span="24">
                                <el-button type="primary" v-on:click="getList" class="btnw" :size="size">查询</el-button>
                                <el-button type="primary" class="btnw" @click="reload" :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" @click="educe" class="btnw" :size="size">导出</el-button>
                    <el-button type="primary" @click="add" class="btnw" :size="size">新增</el-button>
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
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="102">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="edit(scope.row)" type="text" :size="size">编辑</el-button>
                    <el-button @click="remove(scope.row)" type="text" :size="size" style="color:red;">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="common_commission"
                    label="正常佣金"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="activity_commission"
                    label="促销佣金"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="stores"
                    label="店铺名"
                    min-width="130">
                <template slot-scope="props">
                    <elliptical :message="stores(props.row)"></elliptical>
                </template>
            </el-table-column>
            <el-table-column prop="memo" label="备注" min-width="170">
                <template slot-scope="props">
                    <elliptical :message="props.row.commission_memo"></elliptical>
                </template>
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
    </section>
</template>
<script>
    import {getBrolerageList, removeBrolerage} from "../../api/api"
    export default{
        data () {
            return {
                title: "",
                tableData: [],
                total: 0,
                page: 1,
                per_page: 10,
                isLoading: false,
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            if (this.$route.query.criteria) {
                let criteria = this.$route.query.criteria;
                this.title = criteria.store_name;
                this.page = criteria.page;
                this.per_page = criteria.per_page;
            }
            this.getList();
            this.addEvent();
        },
        methods: {
            educe(){
                window.open(`${this.$store.state.urlBackstage}/store_commission/exportLists?access_token=${sessionStorage.getItem('access_token')}&store_name=${this.title}`)
            },
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getList();
                    }
                })
            },
            remove(val){
                this.$confirm('此操作将永久删除该设置, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'right',
                    type: 'warning'
                }).then(() => {
                    removeBrolerage(val.commission_group).then((res) => {
                        if (!res.error_code) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getList();
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                }).catch(() => {

                });
            },
            edit(val){
                let criteria = {
                    store_name: this.title,
                    per_page: this.per_page,
                    page: this.page,
                }
                this.$router.push({path: "/store_commission/edit", query: {data: val, criteria: criteria}})
            },
            add(){
                this.$router.replace("/store_commission/add")
            },
            reload(){
                this.title = "";
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.getList()
            },
            stores(val){
                let str = "";
                if (val.stores.length > 0) {
                    for (let i = 0; i < val.stores.length; i++) {
                        str += val.stores[i].store_name + "，";
                    }
                    return str;
                }
            },
            getList(){
                let parm = {
                    store_name: this.title,
                    per_page: this.per_page,
                    page: this.page,
                }
                this.isLoading = true;
                getBrolerageList(parm).then((res) => {
                    this.isLoading = false;
                    this.tableData = res.data.data;
                    this.total = res.data.totalCount;
                })
            }
        }
    }
</script>