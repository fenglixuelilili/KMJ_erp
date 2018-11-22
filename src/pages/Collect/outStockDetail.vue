<template>
    <section>
        <HS></HS>
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'>
                    <span style='margin-left: 30px'>筛选条件</span>
                </el-col>
                <el-col :span="21">
                    <el-form label-width="130px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="店铺名称：" class="hspace">
                                    <el-input v-model="shop_name" placeholder="店铺名称" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="来源平台：" class="hspace">
                                    <el-select v-model="platform" placeholder="来源平台" class="col" :size="size">
                                        <el-option
                                                v-for="item in platforms"
                                                :label="item.label"
                                                :value="item.val"
                                                :key="item.val">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="截止时间：" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="value"
                                            type="daterange"
                                            align="right"
                                            placeholder="请选择"
                                            :picker-options="pickerOptions"
                                            @change="timeChange">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="sku标题：">
                                    <el-input v-model="sku_titil" placeholder="sku标题" class="col"
                                              :size="size"></el-input>
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
                </el-col>
            </el-row>
        </div>
        <el-table
                class="geFontSize_list"
                border
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    prop="sku_name"
                    label="sku标题"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="store_name"
                    label="店铺名称"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="platform"
                    label="来源平台"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="应出库数量"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="outed"
                    label="实际出库数量"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="not_out"
                    label="未出库数量"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="out_date"
                    label="截止时间"
                    width="160">
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
<style scoped>

</style>
<script>
    import {getOuststockDetail} from '../../api/api'
    export default{
        data () {
            return {
                tableData: [],
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
                total: 0,
                page: 1,
                per_page: 10,
                sku_titil: "",
                shop_name: "",
                platform: "",
                platforms: [{label: "全部", val: ""}, {label: "京东平台", val: "jd"}, {
                    label: "快买酒",
                    val: "kmjiu"
                }, {label: "线下售卖", val: "underground"}, {label: "饿了么", val: "eleme"}, {
                    label: "京东到家",
                    val: "jddj"
                }, {label: "百度外卖", val: "bd"}, {label: "美团外卖", val: "meituan"},],
                value: "",
                time_quantum: "",
                start_date: "",
                end_date: "",
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            this.getList()
        },
        methods: {
            educe(){
                window.open(`${this.$store.state.urlBackstage}/outstocks/exportSkuStatistic?access_token=${sessionStorage.getItem('access_token')}&sku_name=${this.sku_titil}&store_name=${this.shop_name}&platform=${this.platform}&startDate=${this.start_date}&endDate=${this.end_date}`)
            },
            getList(){
                var parm = {
                    store_name: this.shop_name,
                    sku_name: this.sku_titil,
                    platform: this.platform,
                    startDate: this.start_date,
                    endDate: this.end_date,
                    page: this.page,
                    per_page: this.per_page,
                }
                getOuststockDetail(parm).then((res) => {
                    this.tableData = res.data.data;
                    this.total = res.data.totalCount;
                })
            },
            timeChange(val){
                this.time_quantum = val;
                if (this.time_quantum) {
                    this.start_date = this.time_quantum.split(" - ")[0] + " 00:00:00";
                    this.end_date = this.time_quantum.split(" - ")[1] + " 23:59:59";
                } else {
                    this.start_date = "";
                    this.end_date = "";
                }
            },
            reload(){
                this.shop_name = "";
                this.sku_titil = "";
                this.platform = "";
                this.value = [];
            },
            handleCurrentChange(val) {
                this.page = val;
            },
            handleSizeChange(val) {
                this.per_page = val;
            },
        }
    }
</script>