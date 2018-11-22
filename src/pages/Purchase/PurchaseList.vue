<template>
    <section>
        <HS></HS>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form :model="form" label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="创建时间" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="valueI"
                                            type="daterange"
                                            align="right"
                                            placeholder="选择日期范围"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeI">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="确认时间" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="valueII"
                                            type="daterange"
                                            align="right"
                                            placeholder="选择日期范围"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeII">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="确认状态" class="hspace">
                                    <el-select v-model="statusII" clearable placeholder="请选择" class="col" :size="size">
                                        <el-option
                                                v-for="item in optionsII"
                                                :label="item.key"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="供应商">
                                    <el-select v-model="suppleier" clearable placeholder="请选择" class="col" :size="size">
                                        <el-option
                                                v-for="item in optionsIV"
                                                :label="item.name"
                                                :value="item.supplier_id"
                                                :key="item.supplier_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="发票类型">
                                    <el-select v-model="statusIII" clearable placeholder="请选择" class="col" :size="size">
                                        <el-option
                                                v-for="item in optionsIII"
                                                :label="item.key"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="采购单号">
                                    <el-input v-model="po_bn" placeholder="请输入采购单号" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click='getPurchasseL' :size="size">查询


                                </el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" class='btnw' @click='addPurch' :size="size">新增采购单</el-button>
                </el-col>
            </el-row>
        </div>
        <!--列表-->
        <el-table
                v-loading="isLoading"
                :data="tableData"
                border
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table sum-text="合计" :summary-method="addUp" show-summary id="scroll_bottom"
                              :data="props.row.items" border class="geFontSize_list">
                        <el-table-column label="缩略图" prop="x" width="100">
                            <template slot-scope="scope">
                                <img :src="props.row.default_image" alt="" style="width: 100%;"
                                     v-if="props.row.default_image">
                            </template>
                        </el-table-column>
                        <el-table-column label="sku标题" prop="title">
                        </el-table-column>
                        <el-table-column label="副标题" prop="sub_title">
                        </el-table-column>
                        <el-table-column label="规格" prop="props_values" :formatter='props_valuesC'>
                        </el-table-column>
                        <el-table-column label="单位" prop="unit" width="70">
                        </el-table-column>
                        <el-table-column label="采购数量" prop="num" width="85">
                        </el-table-column>
                        <el-table-column label="采购单价(元)" prop="price" width="110">
                        </el-table-column>
                        <el-table-column label="运费" prop="post_fee" width="70">
                        </el-table-column>
                        <el-table-column label="采购单品总价" prop="" :formatter='adduct' width="120">
                        </el-table-column>
                        <el-table-column label="实际入库数量" prop="instock_num" width="120">
                        </el-table-column>
                        <el-table-column label="条码" prop="barcode">
                        </el-table-column>
                        <el-table-column label="货号" prop="bn">
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
                    type="index"
                    width="55">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="150">
                <template slot-scope="scope">
                    <p>
                        <el-button type="text" :size="size" v-if='scope.row.po_status=="1"'
                                   @click="effect(scope.$index)">生效


                        </el-button>
                        <el-button type="text" :size="size" v-if='scope.row.check_status=="1"&&scope.row.po_status=="2"'
                                   @click="audit(scope.$index)">确认


                        </el-button>
                        <el-button type="text" :size="size" v-if='scope.row.po_status!="4"&&scope.row.check_status=="2"'
                                   @click="gameover(scope.row)">完成


                        </el-button>
                        <el-button type="text" :size="size" v-if='scope.row.check_status=="1"'
                                   @click='editPurchase(scope.$index)'>编辑


                        </el-button>
                        <el-button type="text" :size="size" v-if='scope.row.po_status=="1"' @click='remove(scope.row)'>删除


                        </el-button>
                    </p>
                    <p>
                        <el-button type="text" :size="size" @click='printsp(scope.row)'>打印申请表</el-button>
                    </p>
                    <p>
                        <el-button type="text" :size="size" @click='purchase(scope.$index)'>详情</el-button>
                        <el-button type="text" :size="size" @click='prints(scope.row)'>打印收货单</el-button>
                    </p>
                </template>
            </el-table-column>
            <el-table-column
                    prop="po_bn"
                    label="采购单号"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="operator_name"
                    label="采购员"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="supplier_name"
                    label="供应商"
                    min-width="105">
            </el-table-column>
            <el-table-column
                    :formatter='invoice_typeC'
                    prop="invoice_type"
                    label="发票类型"
                    width="100">
            </el-table-column>
            <el-table-column
                    :formatter='po_statusC'
                    prop="po_status"
                    label="采购单执行状态"
                    width="125">
            </el-table-column>
            <el-table-column
                    :formatter='check_statusC'
                    prop="check_status"
                    label="确认状态"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="created_at"
                    label="创建时间"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="check_at"
                    label="确认时间"
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
    </section>
</template>
<script>
    import {
        getPurchasseList,
        deletePurchasse,
        getSuppliersList,
        purchaseEffect,
        auditPurchase,
        confirmPuchase
    } from '../../api/api'
    export default {
        data () {
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
                optionsI: [{key: '取消采购', value: 3}, {key: '生效中', value: 2}, {key: '未生效', value: 1}, {
                    key: '已完成',
                    value: 4
                }],
                optionsII: [{key: '已确认', value: 2}, {key: '未确认', value: 1}, {key: '已入库', value: 3}],
                optionsIII: [{key: '没有发票', value: 1}, {key: '普通发票（纸质）', value: 4}, {
                    key: '增值税发票(6%税率)',
                    value: 2
                }, {key: '增值税发票(17%税率)', value: 3}],
                optionsIV: [],
                valueI: {},
                valueII: {},
                statusI: "",
                statusII: "",
                statusIII: "",
                time_quantumI: "",
                time_quantumII: "",
                tableData: [],
                total: 100,
                page: 1,
                per_page: 10,
                form: {},
                po_bn: "",
                start_date: "",
                end_date: "",
                suppleier: "",
                checked_end_date: "",
                checked_start_date: "",
                isLoading: false,
                size: "",
            }
        },
        created () {
            this.size = this.$store.state.size;
            if (this.$route.query.criteria) {
                let criteria = this.$route.query.criteria;
                this.page = criteria.page;
                this.per_page = criteria.per_page;
                this.po_bn = criteria.po_bn;
                this.start_date = criteria.start_date;
                this.end_date = criteria.end_date;
                this.statusII = criteria.check_status;
                this.statusIII = criteria.invoice_type;
                this.statusI = criteria.po_status;
                this.suppleier = criteria.supplier_id;
                this.checked_start_date = criteria.checked_start_date;
                this.checked_end_date = criteria.checked_end_date;
            }
            this.getPurchasseL();
            this.addEventL();
            var parm = {
                per_page: 99999
            }
            getSuppliersList(parm).then(res => {
                this.optionsIV = res.data.itemList
            })
        },
        methods: {
            addUp(val){
                let num = 0;
                for (let i = 0; i < val.data.length; i++) {
                    num += parseFloat(this.adduct(val.data[i]));
                }
                num = num.toFixed(2);
                return ["", "", "", "", "", "", "", "", "", "合计总价", num, ""];
            },
            addEventL(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getPurchasseL();
                    }
                })
            },
            gameover(val){
                this.$confirm('确认采购单完成?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    confirmPuchase(val.po_id).then((res) => {
                        if (res.status_code == 200) {
                            this.$message({
                                type: 'success',
                                message: '采购单已完成!'
                            });
                            this.getPurchasseL()
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.message
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            prints(val){
                window.open(`${this.$store.state.url}/purchase.html?${val.po_id}?access_token=${sessionStorage.getItem('access_token')}`)
            },
            printsp(val){
                window.open(`${this.$store.state.url}/purch.html?${val.po_id}?access_token=${sessionStorage.getItem('access_token')}`)
            },
            audit(index){
                this.$confirm('确认审核?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var parm = {
                        po_id: this.tableData[index].po_id
                    }
                    auditPurchase(this.tableData[index].po_id, parm).then((res) => {
                        if (res.status_code == 200) {
                            this.$message({
                                type: 'success',
                                message: '审核成功!'
                            });
                            this.getPurchasseL()
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.message
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审核'
                    });
                });
            },
            effect(index){
                this.$confirm('采购单生效生将进入审核流程?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var parm = {
                        po_id: this.tableData[index].po_id
                    }
                    purchaseEffect(this.tableData[index].po_id, parm).then((res) => {
                        if (res.status_code == 200) {
                            this.$message({
                                type: 'success',
                                message: '生效成功'
                            });
                            this.getPurchasseL()
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.message
                            });
                        }

                    })
                })
            },
            addPurch(){
                this.$router.replace('/purchase/orders/manager/add')
            },
            purchase(index){
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    po_bn: this.po_bn,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    check_status: this.statusII,
                    invoice_type: this.statusIII,
                    po_status: this.statusI,
                    supplier_id: this.suppleier,
                    checked_start_date: this.checked_start_date,
                    checked_end_date: this.checked_end_date
                }
                this.$router.push({path: '/purchase', query: {po_id: this.tableData[index].po_id, criteria: criteria}})
            },
            editPurchase(index){
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    po_bn: this.po_bn,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    check_status: this.statusII,
                    invoice_type: this.statusIII,
                    po_status: this.statusI,
                    supplier_id: this.suppleier,
                    checked_start_date: this.checked_start_date,
                    checked_end_date: this.checked_end_date
                }
                this.$router.push({
                    path: '/editPurchase',
                    query: {po_id: this.tableData[index].po_id, criteria: criteria}
                })
            },
            remove(val){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePurchasse(val.po_id).then((res) => {
                        if (res.status_code == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getPurchasseL()
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.message
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
            adduct(val){
                let num = 0;
                num = parseFloat(val.num) * parseFloat(val.price) + parseFloat(val.post_fee);
                return num.toFixed(2);
            },
            po_statusC(val){
                switch (val.po_status) {
                    case '1':
                        return '已新建';
                        break;
                    case '2':
                        return '已生效';
                        break;
                    case '3':
                        return '采购退货';
                        break;
                    case '4':
                        return '采购完成';
                        break;
                }
            },
            check_statusC(val){
                switch (val.check_status) {
                    case '1':
                        return '未确认';
                        break;
                    case '2':
                        return '已确认';
                        break;
                    default:
                        return '未确认'
                }
            },
            invoice_typeC(val){
                switch (val.invoice_type) {
                    case 1:
                        return '没有发票';
                        break;
                    case 2:
                        return '增值税发票（6%）';
                        break;
                    case 3:
                        return '增值税发票（17%）';
                        break;
                    case 4:
                        return '普通发票';
                        break;
                }
            },
            props_valuesC(val){
                return val.props_values[0].prop_name + ' ' + val.props_values[0].prop_value
            },
            getPurchasseL(){
                this.isLoading = true;
                var parm = {
                    page: this.page,
                    per_page: this.per_page,
                    sort_type: 'DESC',
                    sort_by: 'created_at',
                    po_bn: this.po_bn,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    check_status: this.statusII,
                    invoice_type: this.statusIII,
                    po_status: this.statusI,
                    supplier_id: this.suppleier,
                    checked_start_date: this.checked_start_date,
                    checked_end_date: this.checked_end_date
                }
                getPurchasseList(parm).then((res) => {
                    this.isLoading = false;
                    this.total = res.data.totalCount;
                    this.tableData = res.data.storesList;
                })
            },
            reLoad(){
                this.statusI = "";
                this.statusII = "";
                this.statusIII = "";
                this.valueI = {};
                this.valueII = {};
                this.suppleier = "";
                this.po_bn = "";
            },
            timeChangeI(val){
                this.time_quantumI = val;
                if (this.time_quantumI) {
                    this.start_date = this.time_quantumI.split(" - ")[0] + " 00:00:00";
                    this.end_date = this.time_quantumI.split(" - ")[1] + " 23:59:59";
                } else {
                    this.start_date = "";
                    this.end_date = "";
                }
            },
            timeChangeII(val){
                this.time_quantumII = val;
                if (this.time_quantumII) {
                    this.checked_start_date = this.time_quantumII.split(" - ")[0] + " 00:00:00";
                    this.checked_end_date = this.time_quantumII.split(" - ")[1] + " 23:59:59";
                } else {
                    this.checked_start_date = "";
                    this.checked_end_date = "";
                }
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getPurchasseL();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getPurchasseL();
                return;
            },
        }
    }
</script>