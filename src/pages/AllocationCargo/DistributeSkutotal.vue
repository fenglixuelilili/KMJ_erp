<template>
    <section>
        <!--工具条-->
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'>
                    <span style='margin-left: 30px'>筛选条件</span>
                </el-col>
                <el-col :span="21">
                    <el-form label-width="130px" :model="filters">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="配送单号：" class="hspace">
                                    <el-input v-model="filters.po_bn" placeholder="配送单号" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="sku标题：" class="hspace">
                                    <el-input v-model="filters.sku_title" placeholder="sku标题" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="配送日期：" class="hspace" :size="size">
                                    <el-date-picker
                                            class="col"
                                            v-model="valueII"
                                            type="daterange"
                                            align="right"
                                            placeholder="请选择"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeII">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="配送仓库：">
                                    <el-select v-model="filters.warehouse" clearable placeholder="配送仓库" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in warehouse"
                                                :label="item.warehouse_name"
                                                :value="item.warehouse_id"
                                                :key="item.warehouse_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="收货店铺：">
                                    <el-select v-model="filters.waimaistore_id" filterable clearable placeholder="配送店铺"
                                               class="col" :size="size">
                                        <el-option
                                                v-for="item in store"
                                                :label="item.store_name"
                                                :value="item.waimaistore_id"
                                                :key="item.waimaistore_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="cb">
                            <el-col :span="24">
                                <el-button type="primary" v-on:click="getItems" class="btnw" :size="size">查询</el-button>
                                <el-button type="primary" class="btnw" @click="reload" :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-row>
            <el-col :span="24" style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                <el-button type="primary" @click="educe" class="btnw" :size="size">导出</el-button>
            </el-col>
        </el-row>
        <!--列表-->
        <template>
            <el-table
                    v-loading="isLoading"
                    border
                    :data="tableData"
                    style="width: 100%"
                    class="geFontSize_list">
                <el-table-column
                        prop="ob_bn"
                        label="配送单号"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="warehouse_name"
                        label="配送仓库"
                        min-width="85">
                </el-table-column>
                <el-table-column
                        prop="store_name"
                        label="收货店铺"
                        min-width="100">
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="sku标题"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        label="缩略图"
                        width="100">
                    <template slot-scope="props">
                        <img :src="props.row.item.default_image" style="width: 100%;"
                             v-if="props.row.item.default_image">
                    </template>
                </el-table-column>
                <el-table-column
                        label="副标题"
                        min-width="150">
                    <template slot-scope="props">
                        <span>{{props.row.item.sub_title}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="配送数量"
                        min-width="85">
                </el-table-column>
                <el-table-column
                        prop="start_date"
                        label="配送日期"
                        min-width="100">
                </el-table-column>
                <el-table-column
                        :formatter="props_valuesC"
                        prop="props_values"
                        label="规格"
                        min-width="130">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        min-width="85">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        min-width="75">
                    <template slot-scope="props">
                        <span>{{props.row.item.unit}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="barcode"
                        label="条码"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="bn"
                        label="货号"
                        min-width="150">
                </el-table-column>
            </el-table>
        </template>
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
    import {WstoreList, getwarehouse, blanksSkutotal} from '../../api/api';
    export default {
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
                filters: {
                    po_bn: '',
                    sku_title: '',
                    waimaistore_id: '',
                    po_status: '',
                    warehouse: '',
                },
                po_status: [{label: "全部", value: ""}, {label: "已创建配货单", value: "0"}, {
                    label: "等待出库",
                    value: "1"
                }, {label: "配送中", value: "2"}, {label: "已收货", value: "3"}],
                tableData: [],
                isLoading: false,
                total: 100,
                page: 1,
                per_page: 10,
                po_start_date: "",
                po_end_date: "",
                start_date: "",
                end_date: "",
                time_quantumII: "",
                valueII: [],
                warehouse: [],
                store: [],
                size: ""
            }
        },
        created() {
            this.size = this.$store.state.size;
            this.getItems();
            this.addEvent();
            var storeParm = {
                per_page: 99999
            }
            WstoreList(storeParm).then((res) => {
                this.store = res.data.storesList;
            })

            getwarehouse(storeParm).then((res) => {
                this.warehouse = res.data.itemList;
            })
        },
        methods: {
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getItems();
                    }
                })
            },
            educe(){
                window.open(`${this.$store.state.urlBackstage}/order_blanks/exportSkusTotal?access_token=${sessionStorage.getItem('access_token')}&start_date_min=${this.po_start_date}&start_date_max=${this.po_end_date}&sku_title=${this.filters.sku_title}&ob_bn=${this.filters.po_bn}&store_id=${this.filters.waimaistore_id}&warehouse_id=${this.filters.warehouse}&ob_status=${this.filters.po_status}`)
            },
            reload(){
                this.valueII = [];
                this.filters.po_bn = '';
                this.filters.sku_title = '';
                this.filters.waimaistore_id = '';
                this.filters.warehouse = '';
                this.filters.po_status = '';
            },
            timeChangeII(val){
                this.time_quantumII = val;
                if (this.time_quantumII) {
                    this.po_start_date = this.time_quantumII.split(" - ")[0] + " 00:00:00";
                    this.po_end_date = this.time_quantumII.split(" - ")[1] + " 23:59:59";
                } else {
                    this.po_start_date = "";
                    this.po_end_date = "";
                }
            },
            props_valuesC(row){
                var str = "";
                if (!row.props_values) {
                    return
                }
                for (let i in row.props_values) {
                    str += row.props_values[i].prop_name + " " + row.props_values[i].prop_value
                }
                return str
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getItems();
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.getItems();
            },
            getItems(){
                this.isLoading = true;
                var parm = {
                    sku_title: this.filters.sku_title,
                    ob_bn: this.filters.po_bn,
                    store_id: this.filters.waimaistore_id,
                    warehouse_id: this.filters.warehouse,
                    ob_status: this.filters.po_status,
                    start_date_min: this.po_start_date,
                    start_date_max: this.po_end_date,
                    page: this.page,
                    per_page: this.per_page
                }
                blanksSkutotal(parm).then((res) => {
                    this.tableData = res.data.data
                    this.isLoading = false
                    this.total = res.data.totalCount
                })
            }
        }
    }
</script>
