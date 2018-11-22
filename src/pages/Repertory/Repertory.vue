<template>
    <section>
        <HS></HS>
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="物料名称：" class="hspace">
                                    <el-input v-model="sku_title" placeholder="请输入物料名称" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="日期范围：" class="hspace">
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
                                <el-form-item label="店铺名称：" class="hspace">
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
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="物料条码：">
                                    <el-input v-model="barcode" placeholder="请输入" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="物料货号：">
                                    <el-input v-model="bn" placeholder="请输入" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getRepetory" :size="size">查询</el-button>
                                <el-button :plain="true" type="info" class='btnw' @click='reLoad' :size="size">重置
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" @click="educe" class="btnw" :size="size">导出</el-button>
                    <el-button type="primary" @click="educe_store" class="btnw" :size="size">导出店铺库存</el-button>
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
                    prop="title"
                    label="物料名称"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    :formatter="props_valuesC"
                    prop="props_values"
                    label="规格"
                    min-width="140">
            </el-table-column>
            <el-table-column
                    prop="unit"
                    label="单位"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="weight"
                    label="重量（kg）"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    prop="before"
                    label="期初结存"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="in"
                    label="本期收入"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="out"
                    label="本期支出"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="after"
                    label="期末结存"
                    min-width="95">
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
    import {storeList, getStock, getOutIn} from '../../api/api'
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
                page: 1,
                per_page: 10,
                total: 200,
                sku_title: "",
                isLoading: false,
                barcode: "",
                bn: "",
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            this.getRepetory();
            this.addEvent();
            var parm = {per_page: 99999};
            storeList(parm).then((res) => {
                this.options = res.data.storesList;
            })
        },
        methods: {
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getRepetory();
                    }
                })
            },
            educe(){
                window.open(`${this.$store.state.urlBackstage}/exportPeriodStock?access_token=${sessionStorage.getItem('access_token')}&bn=${this.bn}&bar_code=${this.barcode}&store_id=${this.wareshop_id}&startTime=${this.start_date}&endTime=${this.end_date}&sku_name=${this.sku_title}`)
            },
            educe_store(){
                window.open(`${this.$store.state.urlBackstage}/stock/export?access_token=${sessionStorage.getItem('access_token')}&bn=${this.bn}&bar_code=${this.barcode}&store_id=${this.wareshop_id}&startTime=${this.start_date}&endTime=${this.end_date}&sku_name=${this.sku_title}`)
            },
            props_valuesC(row){
                var str = "";
                if (!row.props_values) {
                    return
                }
                for (let i in row.props_values) {
                    str += row.props_values[i].prop_name + " " + row.props_values[i].prop_value
                }
                return str;
            },
            reLoad(){
                this.value = "";
                this.sku_title = "";
                this.wareshop_id = "";
                this.bn = "";
                this.bar_code = "";
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
            },
            getRepetory(){
                this.isLoading = true;
                var parmI = {
                    per_page: this.per_page,
                    page: this.page,
                    store_id: this.wareshop_id,
                    startTime: this.start_date,
                    endTime: this.end_date,
                    sku_name: this.sku_title,
                    bn: this.bn,
                    bar_code: this.barcode,
                }
                getOutIn(parmI).then((res) => {
                    this.isLoading = false;
                    this.total = res.data.totalCount;
                    this.tableData = res.data.data;
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
            }
        }
    }
</script>