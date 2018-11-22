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
                                <el-form-item label="sku标题" class="hspace">
                                    <el-input v-model="sku_title" placeholder="请输入sku标题"  class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="需求差额：" class="hspace">
                                    <el-input v-model="demand_min" style="width: 30%;" :size="size"></el-input>
                                    <p style="width: 8%;text-align: center;display: inline-block;box-sizing: border-box">
                                        -
                                    </p>
                                    <el-input v-model="demand_max" style="width: 30%;" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="申请日期" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="demand_date"
                                            type="daterange"
                                            align="right"
                                            placeholder="选择日期范围"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeI">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="需求单号">
                                    <el-input v-model="demand_bn" placeholder="请输入需求单号" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click='subMit' :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
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
            <el-table-column
                    type="index"
                    width="95">
            </el-table-column>
            <el-table-column
                    prop="po_bn"
                    label="需求单号"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="operator_name"
                    label="sku标题"
                    min-width="120">
            </el-table-column>
            <el-table-column label="缩略图" width="100">
                <template scope="scope">
                    <img :src="props.row.default_image" alt="" style="width: 100%;" v-if="props.row.default_image">
                </template>
            </el-table-column>
            <el-table-column
                    prop="supplier_name"
                    label="副标题"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="invoice_type"
                    label="规格"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="po_status"
                    label="重量（kg）"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="check_status"
                    label="单位"
                    min-width="75">
            </el-table-column>
            <el-table-column
                    prop="created_at"
                    label="需求数量"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="check_at"
                    label="条码"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="memo"
                    label="货号"
                    min-width="120">
            </el-table-column>
        </el-table>
        <!--分页-->
        <template>
            <div class="block" style="padding:10px;padding-left:0;float: right">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="per_page"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </template>
    </section>
</template>

<script>
    import {  } from '../../api/api'
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
                            switch (strD.split(" ")[0]){
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
                            switch (strD.split(" ")[0]){
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
                            var num = parseInt(strD.split(' ')[2])-1;
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
                            var numN = parseInt(strD.split(' ')[2])-1;
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * num);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * numN);
                            start.setMonth(start.getMonth()-1);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                isLoading: false,
                tableData: [],
                demand_bn: "",
                sku_title: "",
                demand_min: "",
                demand_max: "",
                time_demand: "",
                demand_start_date: "",
                demand_end_date: "",
                demand_date: [],
                page: 1,
                per_page: 10,
                total: 100,
                size: ""
            }
        },
        created () {
            this.size = this.$store.state.size;
            this.addEventL();
        },
        methods: {
            addEventL(){
                var _this = this;
                $(window).keyup(function(event){
                    if(event.keyCode == 13){
                        _this.subMit();
                    }
                })
            },
            subMit(){
                let parm = {

                }
            },
            props_valuesC(val){
                var str = '';
                for(let i = 0; i < val.props_values.length;i++){
                    str =  val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                }
                return str;
            },
            reLoad(){
                this.demand_date = [];
                this.sku_title = "";
                this.demand_bn = "";
                this.demand_min = "";
                this.demand_max = "";
            },
            timeChangeI(val){
                this.time_demand = val;
                if (this.time_demand) {
                    this.demand_start_date = this.time_demand.split(" - ")[0]+" 00:00:00";
                    this.demand_end_date = this.time_demand.split(" - ")[1]+" 23:59:59";
                }else{
                    this.demand_start_date = "";
                    this.demand_end_date = "";
                }
            },
            handleSizeChange(val){
                this.per_page = val;
                this.subMit();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.subMit();
                return;
            },
        }
    }
</script>