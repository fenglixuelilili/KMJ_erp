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
                                <el-form-item label="日期范围：">
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
                                <el-form-item label="来源店铺：">
                                    <el-select v-model="store_id" clearable placeholder="来源店铺" filterable class="col"
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
                                <el-form-item label="来源平台：">
                                    <el-select v-model="platform" clearable placeholder="来源平台" class="col" :size="size">
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
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getWMAmounts" :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" class='btnw' @click="derive" :size="size">导出</el-button>
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
                    :formatter="platformC"
                    prop="platform"
                    label="来源平台"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="store_name"
                    label="来源店铺"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="orders"
                    label="销售订单数"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="total_fee"
                    label="销售总金额"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="product_cost"
                    label="产品成本"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="post_fee"
                    label="快递费"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="packing_cost"
                    label="包装费用"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="labor_cost"
                    label="人力成本"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="other_cost"
                    label="其他费用"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="advertising_cost"
                    label="推广费用"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="profits"
                    label="净毛利"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="startTime"
                    label="起始日期"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="endTime"
                    label="结束日期"
                    min-width="100">
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
    import {storeList, getWMAmount} from "../../api/api"
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
                tableData: [],
                start_date: "",
                end_date: "",
                time_quantum: "",
                value: "",
                store_id: "",
                options: [],
                optionsI: [{platform: "所有", value: ""}, {platform: '饿了么', value: 'eleme'}, {
                    platform: '百度外卖',
                    value: 'bd'
                }, {platform: '美团外卖', value: 'meituan'}, {platform: '京东到家', value: 'jddj'}],
                platform: "",
                isLoading: false,
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            var parm = {per_page: 99999};
            storeList(parm).then((res) => {
                this.options = res.data.storesList;
            })
            const EndD = new Date();
            const StartD = new Date();
            StartD.setTime(StartD.getTime() - 3600 * 1000 * 24 * 30);
            this.value = [StartD.toString(), EndD.toString()]
            this.start_date = this.timeC(StartD.toString())
            this.end_date = this.timeC(EndD.toString())
            this.getWMAmounts();
        },
        methods: {
            reLoad(){
                this.store_id = "";
                this.value = "";
                this.platform = "";
            },
            derive(){
                const nowDate = new Date();
                var Tarr = this.end_date.split("-");
                var date = new Date(parseInt(Tarr[0]), parseInt(Tarr[1]) - 1, parseInt(Tarr[2]), 0, 0, 0);
                if (nowDate.getTime() < date.getTime()) {
                    this.$notify.info({
                        message: '日期选择错误,请重新选择'
                    });
                    return;
                }
                window.open(`${this.$store.state.urlBackstage}/finance/exportOrderSum?access_token=${sessionStorage.getItem('access_token')}&store_id=${this.store_id}&startTime=${this.start_date}&endTime=${this.end_date}&platform=${this.platform}`)
            },
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
            platformC(val){
                switch (val.platform) {
                    case 'jddj':
                        return '京东到家';
                        break;
                    case 'bd':
                        return '百度外卖';
                        break;
                    case 'meituan':
                        return '美团外卖';
                        break;
                    case 'eleme':
                        return '饿了么';
                        break;
                    default:
                        return '所有'
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
            getWMAmounts(){
                this.isLoading = true;
                var parm = {
                    store_id: this.store_id,
                    startTime: this.start_date,
                    endTime: this.end_date,
                    platform: this.platform
                };
                getWMAmount(parm).then((res) => {
                    this.isLoading = false;
                    this.total = res.data.totalCount;
                    this.tableData = res.data;
                })
            }
        }
    }
</script>