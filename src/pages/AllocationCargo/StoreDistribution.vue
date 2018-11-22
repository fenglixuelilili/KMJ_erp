<template>
    <section>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="配货日期：">
                                    <el-date-picker
                                            class="col"
                                            :size="size"
                                            v-model="value"
                                            type="daterange"
                                            align="right"
                                            placeholder="请选择配货日期范围"
                                            :picker-options="pickerOptions"
                                            @change="timeChange">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="店铺名称：">
                                    <el-select v-model="wareshop_id" clearable placeholder="请选择店铺" filterable
                                               class="col" :size="size">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.waimaistore_id"
                                                :label="item.store_name"
                                                :value="item.waimaistore_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" class='cb'>
                    <el-button type="primary" class='btnw' @click="getRepetory" :size="size">查询</el-button>
                    <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" class='btnw' @click="addBlanks" :size="size">新增配货单</el-button>
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
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="175">
                <template slot-scope="scope">
                    <p>
                        <el-button type="text" :size="size" v-if="scope.row.ob_status<2" @click="edit(scope.$index)">
                            编辑
                        </el-button>
                        <el-button type="text" :size="size" v-if="scope.row.ob_status<2" @click="remove(scope.$index)">
                            删除
                        </el-button>
                        <el-button type="text" :size="size" @click="takeOver(scope.row)" v-if="scope.row.ob_status==2">
                            已收货
                        </el-button>
                    </p>
                    <p>
                        <el-button type="text" :size="size" @click="copy(scope.row)">复制</el-button>
                        <el-button type="text" :size="size" @click="details(scope.$index)">详情</el-button>
                        <el-button type="text" :size="size" @click="prints(scope.row)">打印配送单</el-button>
                    </p>
                </template>
            </el-table-column>
            <el-table-column
                    prop="ob_bn"
                    label="配送单编号"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    label="店铺名称"
                    min-width="150">
                <template slot-scope="scope"><span v-if='scope.row.store'>{{scope.row.store.store_name}}</span></template>
            </el-table-column>
            <el-table-column
                    label="配送地址"
                    min-width="170">
                <template slot-scope="scope">
                    <elliptical v-if='scope.row.store' :message="scope.row.store.store_address"></elliptical>
                </template>
            </el-table-column>
            <el-table-column
                    prop="created_at"
                    label="创建时间"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="start_date"
                    label="配货日期"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="ob_status"
                    :formatter="status"
                    label="状态"
                    min-width="85">
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
    import {storeList, getOrderBlanks, removeBlanks, confirmPuchase, ReceivingBlanks} from '../../api/api'
    export default{
        data() {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = start.toString();
                            switch (strD.split(" ")[0]) {
                                case 'Mon':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
                                    break;
                                case 'Tue':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                                    break;
                                case 'Wed':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                                    break;
                                case 'Thu':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                                    break;
                                case 'Fri':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 4);
                                    break;
                                case 'Sat':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
                                    break;
                                case 'Sun':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                            }
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = end.toString();
                            switch (strD.split(" ")[0]) {
                                case 'Mon':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Tue':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Wed':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Thu':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 4);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Fri':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Sat':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Sun':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                            }
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = start.toString();
                            var num = parseInt(strD.split(' ')[2]) - 1;
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * num);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = start.toString();
                            var num = parseInt(strD.split(' ')[2]);
                            var numN = parseInt(strD.split(' ')[2]) - 1;
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * num);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * numN);
                            start.setMonth(start.getMonth() - 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                tableData: [],
                start_date: "",
                end_date: "",
                time_quantum: "",
                value: "",
                wareshop_id: "",
                options: [],
                per_page: 10,
                page: 1,
                total: 200,
                isLoading: false,
                size: "",
            }
        },
        created(){
            this.size = this.$store.state.size;
            if (this.$route.query.criteria) {
                let criteria = this.$route.query.criteria;
                this.per_page = criteria.per_page;
                this.page = criteria.page;
                this.wareshop_id = criteria.waimaistore_id;
                this.start_date = criteria.start_date;
                this.end_date = criteria.end_date;
            }
            this.getRepetory();
            this.addEvents();
            var parm = {per_page: 99999};
            storeList(parm).then((res) => {
                this.options = res.data.storesList;
            })
        },
        methods: {
            addEvents(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getRepetory();
                    }
                })
            },
            copy(val){
                this.$router.push({path: "/waimai_stocks/od/add", query: {ob_id: val.ob_id}})
            },
            takeOver(val){
                this.$confirm('请确认是否已收货?', '提示', {
                    type: 'warning'
                }).then(() => {
                    var parm = {ob_id: val.ob_id}
                    ReceivingBlanks(val.ob_id, parm).then((res) => {
                        if (res.error_code) {
                            this.$message.error(res.message);
                        } else {
                            this.$message({
                                message: '确认已收货',
                                type: 'success'
                            });
                            this.getRepetory()
                        }
                    })
                }).catch(() => {

                });
            },
            reLoad(){
                this.value = "";
                this.wareshop_id = "";
            },
            prints(val){
                window.open(`${this.$store.state.url}/OrderBlanks.html?${val.ob_id}?access_token=${sessionStorage.getItem('access_token')}`)
            },
            edit(index){
                let criteria = {
                    per_page: this.per_page,
                    page: this.page,
                    waimaistore_id: this.wareshop_id,
                    start_date: this.start_date,
                    end_date: this.end_date,
                }
                this.$router.push({
                    path: "/editDistribution",
                    query: {ob_id: this.tableData[index].ob_id, criteria: criteria}
                })
            },
            addBlanks(){
                this.$router.push({path: "/waimai_stocks/od/add"})
            },
            details(index){
                let criteria = {
                    per_page: this.per_page,
                    page: this.page,
                    waimaistore_id: this.wareshop_id,
                    start_date: this.start_date,
                    end_date: this.end_date,
                }
                this.$router.push({
                    path: '/distributionDetails',
                    query: {ob_id: this.tableData[index].ob_id, criteria: criteria}
                })
            },
            status(val){
                switch (val.ob_status) {
                    case '0':
                        return '已创建配货单';
                        break;
                    case '1':
                        return '等待出库';
                        break;
                    case '2':
                        return '配送中';
                        break;
                    case '3':
                        return '已收货';
                        break;
                }
            },
            getRepetory(){
                this.isLoading = true;
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    waimaistore_id: this.wareshop_id,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    sort_by: "updated_at",
                    sort_type: "DESC"
                }
                getOrderBlanks(parm).then((res) => {
                    this.isLoading = false;
                    this.total = res.data.totalCount;
                    this.tableData = res.data.storesList;
                })
            },
            timeChange(val){
                this.time_quantum = val;
                if (this.time_quantum) {
                    this.start_date = this.time_quantum.split(" - ")[0] + ' 00:00:00';
                    this.end_date = this.time_quantum.split(" - ")[1] + ' 23:59:59';
                } else {
                    this.start_date = "";
                    this.end_date = "";
                }
            },
            remove(index){
                var parm = {
                    ob_id: this.tableData[index].ob_id
                }
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeBlanks(this.tableData[index].ob_id, parm).then((res) => {
                        if (res.status_code == 200) {
                            this.$notify.info({
                                message: '删除成功'
                            });
                            this.getRepetory();
                        } else {
                            this.$notify.info({
                                message: '删除失败'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getRepetory();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getRepetory();
                return;
            }
        }
    }
</script>