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
                                    <el-select v-model="store_id" placeholder="请选择店铺" clearable filterable class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in optionsI"
                                                :label="item.store_name"
                                                :value="item.waimaistore_id"
                                                :key="item.waimaistore_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="平台：" class="hspace">
                                    <el-select v-model="platform" placeholder="请选择平台" clearable class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in options"
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
                                <el-form-item label="订单状态：">
                                    <el-select v-model="status" placeholder="" clearable class="col" :size="size">
                                        <el-option
                                                v-for="item in statu"
                                                :label="item.label"
                                                :value="item.val"
                                                :key="item.val">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getStatistic" :size="size">查询</el-button>
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
            <el-table-column
                    prop="store_name"
                    label="店铺名称"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="订单状态"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="source"
                    :formatter="platformC"
                    label="外卖平台"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="orders"
                    label="订单数量"
                    min-width="85">
            </el-table-column>
            <!--<el-table-column-->
            <!--prop="is_activity"-->
            <!--:formatter="isActivity"-->
            <!--label="促销订单"-->
            <!--min-width="120">-->
            <!--</el-table-column>-->
            <el-table-column
                    prop="total_price"
                    label="订单总价"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="discount_fee"
                    label="优惠金额"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="post_fee"
                    label="运费"
                    min-width="70">
            </el-table-column>
            <el-table-column
                    prop="payment"
                    label="应付金额"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="platform_subsidy"
                    label="使用红包"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="payed_fee"
                    label="实付金额"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="commission_fee"
                    label="佣金"
                    min-width="75">
            </el-table-column>
            <el-table-column
                    prop="received_fee"
                    label="实际到账"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="store_commission"
                    label="店铺总佣金"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    prop="activity_commission"
                    label="店铺促销佣金"
                    min-width="120">
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
    import {getStatistics, storeList} from '../../api/api'
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
                options: [{platform: '饿了么', value: 'eleme'}, {platform: '百度外卖', value: 'bd'}, {
                    platform: '美团外卖',
                    value: 'meituan'
                }, {platform: '京东到家', value: 'jddj'}],
                optionsI: [],
                platform: '',
                store_id: '',
                page: 1,
                total: 200,
                per_page: 20,
                isLoading: false,
                size: "",
                status: "",
                statu: [{label: "全部", val: ""}, {label: "待支付", val: "WAIT_BUYER_PAY"}, {
                    label: "待发货",
                    val: "WAIT_SELLER_SEND_GOODS"
                }, {label: "待收货", val: "WAIT_BUYER_CONFIRM_GOODS"}, {
                    label: "完成",
                    val: "TRADE_FINISHED"
                }, {label: "用户取消订单", val: "TRADE_CLOSED_BY_BUYER"}, {label: "系统取消订单", val: "TRADE_CLOSED_BY_SYSTEM"}]
            }
        },
        created(){
            this.size = this.$store.state.size;
            var parm = {per_page: 99999};
            this.getStatistic();
            storeList(parm).then((res) => {
                this.optionsI = res.data.storesList;
            })
        },
        methods: {
            isActivity(row){
                if (row.is_activity == 1) {
                    return "非促销订单"
                } else {
                    return "促销订单"
                }
            },
            educe(){
                window.open(`${this.$store.state.urlBackstage}/statistic/exportStoreFinance?access_token=${sessionStorage.getItem('access_token')}&store_id=${this.store_id}&platform=${this.platform}&startTime=${this.start_date}&endTime=${this.end_date}`)
            },
            reLoad(){
                this.value = "";
                this.store_id = "";
                this.platform = "";
                this.status = "";
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
            handleCurrentChange(val){
                this.page = val;
                this.getStatistic();
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getStatistic();
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
            getStatistic(){
                this.isLoading = true;
                var parm = {
                    store_id: this.store_id,
                    platform: this.platform,
                    per_page: this.per_page,
                    page: this.page,
                    startTime: this.start_date,
                    endTime: this.end_date,
                    status: this.status
                };
                getStatistics(parm).then((res) => {
                    this.isLoading = false;
                    this.tableData = res.data.data;
                    this.total = res.data.totalCount;
                })
            }
        }
    }
</script>