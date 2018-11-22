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
                                <el-form-item label="日期范围：" class="hspace">
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
                                <el-form-item label="店铺名称：" class="hspace">
                                    <el-select v-model="store_id" clearable placeholder="请选择店铺" filterable class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in options"
                                                :label="item.store_name"
                                                :value="item.waimaistore_id"
                                                :key="item.waimaistore_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="平台：" class="hspace">
                                    <el-select v-model="platform" clearable placeholder="请选择平台" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in optionsI"
                                                :label="item.platform"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="订单状态：" class="hspace">
                                    <el-select v-model="status" clearable placeholder="订单状态" class="col" :size="size">
                                        <el-option
                                                v-for="item in wstatus"
                                                :label="item.status"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="订单编号：" class="hspace">
                                    <el-input v-model="tid" placeholder="请输入内容" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="来源订单号：" class="hspace">
                                    <el-input v-model="out_order_id" placeholder="请输入内容" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="收货人：">
                                    <el-input v-model="receiver_name" placeholder="请输入内容" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="收货人电话：">
                                    <el-input v-model="receiver_mobile" placeholder="请输入内容" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getOrderLists" :size="size">查询
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
                    <el-button type="primary" @click="educe" class="btnw" :size="size">导出</el-button>
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
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table border :data="props.row.orders" class="geFontSize_list">
                        <el-table-column label="商品名称" prop="title" min-width="200"></el-table-column>
                        <el-table-column label="数量" prop="num" min-width="100"></el-table-column>
                        <el-table-column label="原价" prop="price" min-width="100"></el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="125">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="regain(scope.$index)" type="text" :size="size">恢复</el-button>
                    <el-button type="text" :size="size" @click="details(scope.$index)">详情</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="tid"
                    label="订单编号"
                    min-width="180">
            </el-table-column>
            <el-table-column
                    prop="out_order_id"
                    label="来源订单号"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="stock_memo"
                    label="异常原因"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="store_name"
                    label="卖出店铺名"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="source"
                    :formatter="platformC"
                    label="外卖平台"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="receiver_name"
                    label="收货人"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="receiver_mobile"
                    label="收货人电话"
                    min-width="125">
            </el-table-column>
            <el-table-column
                    prop="receiver_address"
                    label="收货地址"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="payment"
                    label="应付金额"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="payed_fee"
                    label="实付金额"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="status"
                    :formatter="statusC"
                    label="订单状态"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="created_time"
                    label="下单时间"
                    width="120">
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
    import {getanOrderList, storeList, regainOrder_W} from "../../api/api"
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
                per_page: 20,
                tableData: [],
                start_date: "",
                end_date: "",
                time_quantum: "",
                value: "",
                store_id: "",
                options: [],
                optionsI: [{platform: '饿了么', value: 'eleme'}, {platform: '百度外卖', value: 'bd'}, {
                    platform: '美团外卖',
                    value: 'meituan'
                }, {platform: '京东到家', value: 'jddj'}],
                platform: "",
                isLoading: false,
                wstatus: [{status: "全部", value: ""}, {status: "待支付", value: "WAIT_BUYER_PAY"}, {
                    status: "待发货",
                    value: "WAIT_SELLER_SEND_GOODS"
                }, {status: "待收货", value: "WAIT_BUYER_CONFIRM_GOODS"}, {
                    status: "已完成",
                    value: "TRADE_FINISHED"
                }, {status: "用户取消订单", value: "TRADE_CLOSED_BY_BUYER"}, {
                    status: "系统已关闭订单",
                    value: "TRADE_CLOSED_BY_SYSTEM"
                }],
                status: "",
                tid: "",
                out_order_id: "",
                receiver_name: "",
                receiver_mobile: "",
                size: "",
            }
        },
        created(){
            this.size = this.$store.state.size;
            if (this.$route.query.obj) {
                this.value = this.$route.query.obj.value;
                this.store_id = this.$route.query.obj.store_id;
                this.platform = this.$route.query.obj.platform;
                this.status = this.$route.query.obj.status;
                this.tid = this.$route.query.obj.tid;
                this.out_order_id = this.$route.query.obj.out_order_id;
                this.receiver_name = this.$route.query.obj.receiver_name;
                this.receiver_mobile = this.$route.query.obj.receiver_mobile;
            }
            var parm = {per_page: 99999};
            this.getOrderLists();
            this.addEvent();
            storeList(parm).then((res) => {
                this.options = res.data.storesList;
            })
        },
        methods: {
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getOrderLists();
                    }
                })
            },
            educe(){
                window.open(`${this.$store.state.urlBackstage}/orders/exportAbnorList?access_token=${sessionStorage.getItem('access_token')}&store_id=${this.store_id}&platform=${this.platform}&startTime=${this.start_date}&endTime=${this.end_date}`)
            },
            regain(index){
                regainOrder_W(this.tableData[index].tid).then((res) => {
                    this.$alert(res.message).then(() => {
                        this.getOrderLists()
                    })
                })
            },
            reLoad(){
                this.value = "";
                this.store_id = "";
                this.platform = "";
                this.status = "";
                this.tid = "";
                this.out_order_id = "";
                this.receiver_name = "";
                this.receiver_mobile = "";
            },
            statusC(val){
                switch (val.status) {
                    case 'WAIT_BUYER_PAY':
                        return '待支付';
                        break;
                    case 'WAIT_SELLER_SEND_GOODS':
                        return '待发货';
                        break;
                    case 'WAIT_BUYER_CONFIRM_GOODS':
                        return '待收货';
                        break;
                    case 'TRADE_FINISHED':
                        return '已完成';
                        break;
                    case 'TRADE_CLOSED_BY_BUYER':
                        return '用户取消订单';
                        break;
                    case "TRADE_CLOSED_BY_SYSTEM":
                        return '系统已关闭订单';
                        break;
                }
            },
            platformC(val){
                switch (val.source) {
                    case 'eleme':
                        return '饿了么';
                        break;
                    case 'bd':
                        return '百度外卖';
                        break;
                    case 'meituan':
                        return '美团外卖';
                        break;
                    case 'jddj':
                        return '京东到家';
                        break;
                }
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
            details(index){
                var obj = {
                    value: this.value,
                    store_id: this.store_id,
                    platform: this.platform,
                    status: this.status,
                    tid: this.tid,
                    out_order_id: this.out_order_id,
                    receiver_name: this.receiver_name,
                    receiver_mobile: this.receiver_mobile
                }
                this.$router.push({path: '/orderDetails', query: {order_id: this.tableData[index].tid, obj: obj}})
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getOrderLists();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getOrderLists();
                return;
            },
            getOrderLists(){
                this.isLoading = true;
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    store_id: this.store_id,
                    startTime: this.start_date,
                    endTime: this.end_date,
                    platform: this.platform,
                    sort_type: 'DESC',
                    sort_by: 'created_time',
                    out_order_id: this.out_order_id,
                    status: this.status,
                    receiver_name: this.receiver_name,
                    receiver_mobile: this.receiver_mobile,
                    orderId: this.out_order_id,
                    tid: this.tid,
                };
                getanOrderList(parm).then((res) => {
                    this.isLoading = false;
                    this.total = res.data.totalCount;
                    this.tableData = res.data.ordersList;
                })
            }
        }
    }
</script>