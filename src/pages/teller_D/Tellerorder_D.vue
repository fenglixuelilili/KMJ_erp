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
                                <el-form-item label="销售时间：" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="value"
                                            type="daterange"
                                            align="right"
                                            placeholder="选择日期范围"
                                            :picker-options="pickerOptions"
                                            @change="timeChange">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="收款时间：" class="hspace">
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
                                <el-form-item label="来源店铺：" class="hspace">
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
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="来源平台：">
                                    <el-select v-model="platform" clearable placeholder="请选择平台" filterable class="col"
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
                            <el-col :span="8">
                                <el-form-item label="订单号：">
                                    <el-input v-model="tids" placeholder="请输入" class="col" :size="size"></el-input>
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
                    <el-button class='btnw' type="primary" @click='educe' :size="size">导出</el-button>
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
                    prop="shop_name"
                    label="来源店铺"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    :formatter="source"
                    prop="source"
                    label="来源平台"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="receiver_name"
                    label="收货人"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="tid"
                    label="订单号"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="total_fee"
                    label="销售总价"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="discount_fee"
                    label="优惠金额"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="payed_fee"
                    label="实收金额"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="post_fee"
                    label="快递邮费"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="package_fee"
                    label="包装费用"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="created_time"
                    label="销售日期"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="payed_time"
                    label="收款日期"
                    width="100">
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
    import {getDSorders} from "../../api/api"
    export default{
        data() {
            return {
                form: {},
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
                start_date: "",
                end_date: "",
                time_quantum: "",
                value: "",
                store_id: "",
                options: [{store_name: "快买酒官方旗舰店", waimaistore_id: 1}],
                optionsI: [{platform: '所有', value: ''}, {platform: '京东', value: 'jd'}, {
                    platform: '天猫',
                    value: 'tmall'
                }, {platform: '淘宝', value: 'taobao'}],
                val: 11,
                platform: "",
                tids: "",
                valueI: "",
                time_quantumI: "",
                payed_start_date: "",
                payed_end_date: "",
                isLoading: false,
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            const EndD = new Date();
            const StartD = new Date();
            StartD.setTime(StartD.getTime() - 3600 * 1000 * 24 * 30);
            this.value = [StartD.toString(), EndD.toString()]
            this.start_date = this.timeC(StartD.toString())
            this.end_date = this.timeC(EndD.toString())
            this.getDSorder()
        },
        methods: {
            timeC(str){
                str = str.replace(/ GMT.+$/, '');// Or str = str.substring(0, 24)
                var d = new Date(str);
                var a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
                for (var i = 0, len = a.length; i < len; i++) {
                    if (a[i] < 10) {
                        a[i] = '0' + a[i];
                    }
                }
                str = a[0] + '-' + a[1] + '-' + a[2] + ' ' + a[3] + ':' + a[4] + ':' + a[5];
                return str;
            },
            reLoad(){
                this.store_id = "";
                this.value = "";
                this.platform = "";
                this.tids = "";
                this.valueI = "";
            },
            educe(){
                const nowDate = new Date();
                var Tarr = this.end_date.split("-");
                var date = new Date(parseInt(Tarr[0]), parseInt(Tarr[1]) - 1, parseInt(Tarr[2]), 0, 0, 0);
                if (nowDate.getTime() < date.getTime()) {
                    this.$notify.info({
                        message: '日期选择错误,请重新选择'
                    });
                    return;
                }
                window.open(`${this.$store.state.urlBackstageApi}/finance/trades/lists/export?access_token=${sessionStorage.getItem('access_token')}&payed_end_date=${this.payed_end_date}&payed_start_date=${this.payed_start_date}&source=${this.platform}&tid=${this.tids}&shop_id=${this.store_id}&start_date=${this.start_date}&end_date=${this.end_date}`)
            },
            getDSorder(){
                this.isLoading = true;
                var parm = {
                    shop_id: this.store_id,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    page: this.page,
                    per_page: this.per_page,
                    source: this.platform,
                    tid: this.tids,
                    payed_start_date: this.payed_start_date,
                    payed_end_date: this.payed_end_date,
                    sort_by: "created_time",
                    sort_type: "DESC"
                }
                getDSorders(parm).then((res) => {
                    this.isLoading = false;
                    this.tableData = res.data.trades;
                    this.total = res.data.totalCount;
                })
            },
            source(val){
                switch (val.source) {
                    case 'jd':
                        return "京东";
                        break;
                    case 'tmall':
                        return "天猫";
                        break;
                    case 'taobao':
                        return "淘宝";
                        break;
                    default:
                        "所有"
                }
            },
            timeChange(val){
                this.time_quantum = val;
                if (this.time_quantum) {
                    this.start_date = this.time_quantum.split(" - ")[0] + " 00:00:00";
                    this.end_date = this.time_quantum.split(" - ")[1] + " 23:59:59"
                } else {
                    this.start_date = "";
                    this.end_date = "";
                }
            },
            timeChangeI(val){
                this.time_quantumI = val;
                if (this.time_quantumI) {
                    this.payed_start_date = this.time_quantumI.split(" - ")[0] + " 00:00:00";
                    this.payed_end_date = this.time_quantumI.split(" - ")[1] + " 23:59:59"
                } else {
                    this.payed_start_date = "";
                    this.payed_end_date = "";
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