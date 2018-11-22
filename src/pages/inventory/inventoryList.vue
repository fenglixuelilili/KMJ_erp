<template>
    <section>
        <HS></HS>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="150px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="完成时间：" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="value_finish"
                                            type="daterange"
                                            align="right"
                                            placeholder="选择日期范围"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeI">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="盘点单执行状态：" class="hspace">
                                    <el-select v-model="status" clearable placeholder="盘点单执行状态" filterable class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in options"
                                                :label="item.label"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="确认状态：" class="hspace">
                                    <el-select v-model="confirm_status" clearable placeholder="确认状态" filterable
                                               class="col" :size="size">
                                        <el-option
                                                v-for="item in optionsI"
                                                :label="item.label"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="盘点单号：">
                                    <el-input v-model="inventory_bn" placeholder="请输入" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="盘点员：">
                                    <el-input v-model="operator" placeholder="请输入" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getDSorder" :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button class='btnw' type="primary" @click='addInventory' :size="size">新增</el-button>
                    <el-button class='btnw' type="primary" @click='dialogVisible = true' :size="size">导入</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table
                v-loading="isLoading"
                border
                :data="tableData"
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column
                    label="操作"
                    width="140">
                <template slot-scope="scope">
                    <p>
                        <el-button type="text" :size="size" @click="effect(scope.row)" v-if="scope.row.status==0">生效
                        </el-button>
                        <el-button type="text" :size="size" @click="details(scope.row)">详情</el-button>
                        <el-button type="text" :size="size" @click="prints(scope.row)">打印</el-button>
                    </p>
                    <p>
                        <el-button type="text" :size="size" @click="derive(scope.row)"
                                   v-if="scope.row.confirm_status==2">导出
                        </el-button>
                        <el-button type="text" :size="size" @click="finished(scope.row)"
                                   v-if="scope.row.confirm_status==2">完成
                        </el-button>
                        <el-button type="text" :size="size" @click="remove(scope.row)" v-if="scope.row.status==0">删除
                        </el-button>
                        <el-button type="text" :size="size" @click="edit(scope.row)" v-if="scope.row.confirm_status==1">
                            编辑
                        </el-button>
                        <el-button type="text" :size="size" @click="confirm(scope.row)"
                                   v-if="scope.row.confirm_status==1">确认
                        </el-button>
                    </p>
                </template>
            </el-table-column>
            <el-table-column
                    prop="inventory_bn"
                    label="盘点单号"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="operator"
                    label="盘点员"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="warehouse_name"
                    label="盘点仓库"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    :formatter="statusC"
                    prop="status"
                    label="盘点单执行状态"
                    width="130">
            </el-table-column>
            <el-table-column
                    :formatter="confirm_statusC"
                    prop="confirm_status"
                    label="确认状态"
                    width="95">
            </el-table-column>
            <el-table-column
                    prop="stock_deadline"
                    label="库存截止时间"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="inventory_date"
                    label="盘点日期"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="finished_at"
                    label="完成时间"
                    width="100">
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
        <!-- 上传 -->
        <el-dialog title="导入" v-model="dialogVisible" :close-on-click-modal="false" top="5%" style="text-align: center">
            <el-upload
                    class="upload-demo"
                    drag
                    accept="application/vnd.ms-excel"
                    :on-success="success"
                    :on-error="error"
                    :action="action"
                    name="excel">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getIncentoryList,
        finishedIncentory,
        effectIncentory,
        confirmIncentory,
        deleteIncentory
    } from "../../api/api"
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
                total: 200,
                page: 1,
                per_page: 10,
                tableData: [],
                status: "",
                confirm_status: "",
                options: [{label: "全部", value: ""}, {label: "未生效", value: "0"}, {
                    label: "已生效",
                    value: "1"
                }, {label: "取消盘点", value: "2"}],
                optionsI: [{label: "全部", value: ""}, {label: "未确认", value: "1"}, {
                    label: "已确认",
                    value: "2"
                }, {label: "已完成", value: "3"}],
                value_finish: "",
                value_created: "",
                finished_start_date: "",
                finished_end_date: "",
                created_start_date: "",
                created_end_date: "",
                time_quantum: "",
                time_quantumI: "",
                isLoading: false,
                operator: "",
                inventory_bn: "",
                dialogVisible: false,
                action: "",
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            this.action = `${this.$store.state.urlBackstageApi}/inventories/importing?access_token=${sessionStorage.getItem('access_token')}`;
            if (this.$route.query.criteria) {
                let criteria = this.$route.query.criteria;
                this.page = criteria.page;
                this.per_page = criteria.per_page;
                this.finished_start_date = criteria.finished_start_date;
                this.finished_end_date = criteria.finished_end_date;
                this.status = criteria.status;
                this.confirm_status = criteria.confirm_status;
                this.operator = criteria.operator;
                this.inventory_bn = criteria.inventory_bn;
            }
            this.getDSorder();
            this.addEvent();
        },
        methods: {
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getDSorder();
                    }
                })
            },
            success(val){
                this.$message.info(val.message)
            },
            error(val){
                console.log(val)
            },
            finished(val){
                this.$confirm('请确认是否完成盘点', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    finishedIncentory(val.inventory_id).then((res) => {
                        if (res.error_code) {
                            this.$message({
                                type: 'info',
                                message: res.message
                            });
                        } else {
                            this.$message({
                                type: 'info',
                                message: "盘点已完成"
                            });
                            this.getDSorder()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            remove(val){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteIncentory(val.inventory_id).then((res) => {
                        if (res.error_code) {
                            this.$message({
                                type: 'info',
                                message: res.message
                            });
                        } else {
                            this.$message({
                                type: 'info',
                                message: "已删除"
                            });
                            this.getDSorder()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            confirm(val){
                this.$confirm('是否确认?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    confirmIncentory(val.inventory_id).then((res) => {
                        if (res.error_code) {
                            this.$message({
                                type: 'info',
                                message: res.message
                            });
                        } else {
                            this.$message({
                                type: 'info',
                                message: "已确认"
                            });
                            this.getDSorder()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消确认'
                    });
                });
            },
            effect(val){
                this.$confirm('请确认是否生效', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    effectIncentory(val.inventory_id).then((res) => {
                        if (res.error_code) {
                            this.$message({
                                type: 'info',
                                message: res.message
                            });
                        } else {
                            this.$message({
                                type: 'info',
                                message: "已生效"
                            });
                            this.getDSorder()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消生效'
                    });
                });
            },
            derive(val){
                window.open(`${this.$store.state.urlBackstageApi}/inventories/export/${val.inventory_id}?access_token=${sessionStorage.getItem('access_token')}&inventory_id=${val.inventory_id}`)
            },
            prints(val){
                window.open(`${this.$store.state.url}/inventory.html?${val.inventory_id}?access_token=${sessionStorage.getItem('access_token')}&inventory_id=${val.inventory_id}`)
            },
            edit(val){
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    finished_start_date: this.finished_start_date,
                    finished_end_date: this.finished_end_date,
                    status: this.status,
                    confirm_status: this.confirm_status,
                    operator: this.operator,
                    inventory_bn: this.inventory_bn,
                }
                this.$router.push({
                    path: "/warehouses/inventory/edit",
                    query: {inventory_id: val.inventory_id, criteria: criteria}
                })
            },
            details(val){
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    finished_start_date: this.finished_start_date,
                    finished_end_date: this.finished_end_date,
                    status: this.status,
                    confirm_status: this.confirm_status,
                    operator: this.operator,
                    inventory_bn: this.inventory_bn,
                }
                this.$router.push({
                    path: "/warehouses/inventory/detail",
                    query: {inventory_id: val.inventory_id, criteria: criteria}
                })
            },
            addInventory(){
                this.$router.replace('/warehouses/inventory/add')
            },
            confirm_statusC(val){
                switch (val.confirm_status) {
                    case '1':
                        return "未确认";
                        break;
                    case '2':
                        return "已确认";
                        break;
                    case '3':
                        return "已完成";
                        break;
                }
            },
            statusC(val){
                switch (val.status) {
                    case '0':
                        return "未生效";
                        break;
                    case '1':
                        return "已生效";
                        break;
                    case '2':
                        return "取消盘点";
                        break;
                }
            },
            reLoad(){
                this.value_finish = "";
                this.value_created = "";
                this.inventory_bn = "";
                this.operator = "";
                this.confirm_status = "";
                this.status = "";
            },
            getDSorder(){
                this.isLoading = true;
                var parm = {
                    page: this.page,
                    per_page: this.per_page,
                    sort_by: "updated_at",
                    sort_type: "DESC",
                    finished_start_date: this.finished_start_date,
                    finished_end_date: this.finished_end_date,
                    status: this.status,
                    confirm_status: this.confirm_status,
                    operator: this.operator,
                    inventory_bn: this.inventory_bn,
                }
                getIncentoryList(parm).then((res) => {
                    this.isLoading = false;
                    this.tableData = res.data.inventories;
                    this.total = res.data.totalCount;
                })
            },
            timeChangeI(val){
                this.time_quantumI = val;
                if (this.time_quantumI) {
                    this.finished_start_date = this.time_quantumI.split(" - ")[0] + " 00:00:00";
                    this.finished_end_date = this.time_quantumI.split(" - ")[1] + " 23:59:59"
                } else {
                    this.finished_start_date = "";
                    this.finished_end_date = "";
                }
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getDSorder();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getDSorder();
                return;
            },
        }
    }
</script>