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
                                <el-form-item label="订单号：" class="hspace">
                                    <el-input v-model="tids" placeholder="请输入" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="销售日期：" class="hspace">
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
                                <el-form-item label="sku标题：">
                                    <el-input v-model="sku_title" placeholder="请输入" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getDSinf" :size="size">查询</el-button>
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
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column
                    prop="shop_name"
                    label="来源店铺"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="tid"
                    label="订单号"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="sku_title"
                    label="SKU标题"
                    width="130">
            </el-table-column>
            <el-table-column
                    :formatter="props_valuesC"
                    prop="props_values"
                    label="规格"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="unit"
                    label="单位"
                    width="75">
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="数量"
                    width="75">
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="入库价"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="weight"
                    label="重量(kg)"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="barcode"
                    label="条码"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="bn"
                    label="货号"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="created_time"
                    label="销售日期"
                    min-width="100">
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
    import {getDSinfo} from "../../api/api"
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
                optionsI: [{platform: '饿了么', value: 'eleme'}, {platform: '百度外卖', value: 'bd'}, {
                    platform: '美团外卖',
                    value: 'meituan'
                }, {platform: '京东到家', value: 'jddj'}],
                val: 11,
                platform: "",
                tids: "",
                sku_title: "",
                isLoading: false,
                size: "",
                url_: ""
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
            this.getDSinf()
        },
        methods: {
            educe(){
                window.open(`${this.$store.state.urlBackstageApi}/finance/trades/itemsInfoBase/export?access_token=${sessionStorage.getItem('access_token')}&store_id=${this.store_id}&start_date=${this.start_date}&end_date=${this.end_date}&tid=${this.tids}&sku_title=${this.sku_title}`)
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
            reLoad(){
                this.value = "";
                this.store_id = "";
                this.tids = "";
                this.sku_title = "";
            },
            props_valuesC(val){
                if (val.props_values[0]) {
                    return val.props_values[0].prop_name + ' ' + val.props_values[0].prop_value
                }
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
                        return '所有';
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
            handleSizeChange(val){
                this.per_page = val;
                this.getDSinf();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getDSinf();
                return;
            },
            getDSinf(){
                this.isLoading = true;
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    store_id: this.store_id,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    tid: this.tids,
                    sku_title: this.sku_title
                };
                getDSinfo(parm).then((res) => {
                    this.isLoading = false;
                    this.total = res.data.tradesTotalCount;
                    this.tableData = res.data.itemsInfoList;
                })
            }
        }
    }
</script>