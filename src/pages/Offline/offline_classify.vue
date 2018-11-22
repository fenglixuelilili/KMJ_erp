<template>
    <section>
        <HS></HS>
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'>
                    <span style='margin-left: 30px'>筛选条件</span>
                </el-col>
                <el-col :span="21">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="订单号：" class="hspace">
                                    <el-input v-model="order_bn" placeholder="请输入订单号" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="下单时间：" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="value"
                                            type="daterange"
                                            align="right"
                                            placeholder="本周"
                                            :picker-options="pickerOptions"
                                            @change="timeChange">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="价格体系：" class="hspace">
                                    <el-select v-model="price" clearable placeholder="订单状态" class="col" :size="size">
                                        <el-option
                                                v-for="item in prices"
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
                                <el-form-item label="订单状态：">
                                    <el-select v-model="statu" clearable placeholder="订单状态" class="col" :size="size">
                                        <el-option
                                                v-for="item in status"
                                                :label="item.label"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="支付方式：">
                                    <el-select v-model="payment" clearable placeholder="支付方式" class="col" :size="size">
                                        <el-option
                                                v-for="item in payments"
                                                :label="item.label"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getofflineOrderList" :size="size">查询
                                </el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-row>
            <el-col :span="24"
                    style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                <el-button type="primary" @click="educe" class="btnw" :size="size">导出</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table
                v-loading="isLoading"
                border
                :data="tableData"
                style="width: 100%;"
                class="geFontSize_list">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <table class="table_ geFontSize_list">
                        <tr class="title">
                            <th>条码</th>
                            <th>商品</th>
                            <th>原价</th>
                            <th>实际价格</th>
                            <th>数量</th>
                            <th>商品总价(元)</th>
                            <th>优惠</th>
                            <th>实付总额(元)</th>
                        </tr>
                        <tr v-for="val in props.row.html_tr" v-html="val.htmls"></tr>
                    </table>
                    <div>
                        <el-row style="margin-bottom: 15px;margin-top: 15px;">
                            <el-col :span="24">用户备注：{{props.row.user_memo}}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">商家备注：
                                <el-input class="col" v-model="props.row.memo"></el-input>
                                <el-button type="primary" size="small" style="margin-left: 10px;"
                                           @click="saveMemo(props.row)">保存
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="money"
                    label="实付总额"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    :formatter="statusC"
                    prop="status"
                    label="订单状态"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="oid"
                    label="订单号"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="created_at"
                    label="下单时间"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    :formatter="pay_type"
                    prop="pay_type"
                    label="支付方式"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    :formatter="purchaser_identity"
                    prop="purchaser_identity"
                    label="价格体系"
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
<style scoped>
    .table_ {
        width: 100%;
        border-left: 1px solid #eef1f6;
    }

    .table_ th {
        text-align: center !important;
    }

    .title th {
        padding: 0 10px;
    }
</style>
<script>
    import {getOfflineOrderList, editOfflieMemo} from './../../api/api'
    export default{
        data(){
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
                per_page: 10,
                page: 1,
                total: 100,
                payment: "",
                statu: "",
                price: "",
                value: "",
                order_bn: "",
                time_quantum: "",
                start_date: "",
                end_date: "",
                isLoading: false,
                prices: [{label: "全部", value: ""}, {label: "员工价", value: "1"}, {
                    label: "保税价",
                    value: "2"
                }, {label: "零售价", value: "3"}],
                payments: [{label: "全部", value: ""}, {label: "微信/支付宝", value: "2"}, {
                    label: "现金",
                    value: "1"
                }, {label: "刷卡", value: "3"}],
                status: [{label: "全部", value: ""}, {label: "待支付", value: "1"}, {
                    label: "已支付",
                    value: "2"
                }, {label: "已完成", value: "3"}],
                size: "",
                url: "",
            }
        },
        created(){
            this.size = this.$store.state.size;
            this.getofflineOrderList()
        },
        methods: {
            educe(){
                window.open(`${this.$store.state.urlBackstageEntity}/orders/exportLists?access_token=${sessionStorage.getItem('access_token')}&startTime=${this.start_date}&endTime=${this.end_date}&status=${this.statu}&oid=${this.order_bn}&purchaser_identity=${this.price}&pay_type=${this.payment}`)
            },
            getofflineOrderList(){
                var parm = {
                    page: this.page,
                    per_page: this.per_page,
                    startTime: this.start_date,
                    endTime: this.end_date,
                    status: this.statu,
                    oid: this.order_bn,
                    purchaser_identity: this.price,
                    pay_type: this.payment,
                }
                this.isLoading = true;
                getOfflineOrderList(parm).then((res) => {
                    this.isLoading = false;
                    this.tableData = res.data.data;
                    this.total = res.data.totalCount;
                    for (let i = 0; i < this.tableData.length; i++) {
                        let html_tr = [];
                        for (let j = 0; j < this.tableData[i].skus.length; j++) {
                            let skus = this.tableData[i].skus;
                            let htmles = {htmls: ""};
                            if (j == 0) {
                                htmles.htmls = `<td style="text-align: center;padding: 10px">${skus[j].barcode}</td><td style="text-align: center;padding: 10px">${skus[j].title}</td><td style="text-align: center;">${skus[j].orgin_price}</td><td style="text-align: center;">${skus[j].price}</td><td style="text-align: center;">${skus[j].num}</td><td style="text-align: center;" rowspan="${skus.length}">${this.tableData[i].order_sum}</td><td style="text-align: center;" rowspan="${skus.length}">${this.tableData[i].discount}</td><td style="text-align: center;" rowspan="${skus.length}">${this.tableData[i].money}</td>`
                            } else {
                                htmles.htmls = `<td style="text-align: center;padding: 10px">${skus[j].barcode}</td><td style="text-align: center;padding: 10px">${skus[j].title}</td><td style="text-align: center;">${skus[j].orgin_price}</td><td style="text-align: center;">${skus[j].price}</td><td style="text-align: center;">${skus[j].num}</td>`
                            }
                            html_tr.push(htmles)
                        }
                        this.tableData[i].html_tr = html_tr;
                    }
                })
            },
            reLoad(){
                this.payment = "";
                this.statu = "";
                this.price = "";
                this.value = "";
                this.order_bn = "";
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
            statusC(val){
                switch (val.status) {
                    case 1:
                        return "未支付";
                        break;
                    case 2:
                        return "已支付"
                        break;
                    case 3:
                        return "已完成"
                        break;
                }
            },
            purchaser_identity(val){
                switch (val.purchaser_identity) {
                    case 1:
                        return "员工价";
                        break;
                    case 2:
                        return "保税价"
                        break;
                    case 3:
                        return "零售价"
                        break;
                }
            },
            pay_type(val){
                switch (val.pay_type) {
                    case 1:
                        return "现金";
                        break;
                    case 2:
                        return "微信/支付宝"
                        break;
                    case 3:
                        return "刷卡"
                        break;
                }
            },
            saveMemo(val){
                var parm = {
                    memo: val.memo
                }
                editOfflieMemo(val.oid, parm).then((res) => {
                    if (!res.error_code) {
                        this.getofflineOrderList()
                    } else {
                        this.$message.error(res.message)
                    }
                })
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getofflineOrderList()
            },
            handleCurrentChange(val){
                this.page = val;
                this.getofflineOrderList()
            }
        }
    }
</script>