<template>
    <section>
        <HS></HS>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'>筛选条件</el-col>
                <el-col :span="22">
                    <el-form :model="form" label-width="80px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="sku标题" class="hspace">
                                    <el-input v-model="sku_title" class="col" placeholder="请输入sku标题"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出库时间" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="valueI"
                                            type="daterange"
                                            align="right"
                                            placeholder="选择日期"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeI">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出库单号" class="hspace">
                                    <el-input v-model="instock_bn" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="出货仓库">
                                    <el-select v-model="warehouse_id" clearable placeholder="请选择仓库" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in options"
                                                :label="item.warehouse_name"
                                                :value="item.warehouse_id"
                                                :key="item.warehouse_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出库部门" class="hspace">
                                    <el-select v-model="department" clearable placeholder="请选择" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in departments"
                                                :label="item.key"
                                                :value="item.val"
                                                :key="item.val">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click='getOutstockSku' :size="size">查询
                                </el-button>
                                <el-button type="primary" class='btnw' @click='reOutstockSku' :size="size">重置
                                </el-button>
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
        <div style="position:relative;width: 100%;overflow: auto">
            <el-table
                    id="tab"
                    border
                    v-loading="isLoading"
                    :data="tableData"
                    style="width: 100%;"
                    class="geFontSize_list">
                <el-table-column
                        prop="outstock_bn"
                        label="出库单号"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="source"
                        label="缩略图"
                        min-width="100">
                    <template slot-scope="props">
                        <img :src="props.row.default_image" style="width: 100%;" v-if="props.row.default_image">
                    </template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="sku标题"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="sub_title"
                        label="副标题"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        :formatter="prval"
                        prop="props_values"
                        label="规格"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        min-width="65">
                </el-table-column>
                <el-table-column
                        prop="confirm_at"
                        label="出库时间"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="出库数量"
                        width="85">
                </el-table-column>
                <el-table-column
                        prop="warehouse_name"
                        label="出货仓库"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="department"
                        label="出库部门"
                        min-width="85">
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
        </div>
        <!-- 分页 -->
        <el-pagination
                id="paging"
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
    import {getOutstockSkutotal, getWareHousesList} from '../../api/api'
    export default{
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
                form: {},
                valueI: "",
                options: [],
                tableData: [],
                total: 200,
                page: 1,
                per_page: 10,
                sku_title: "",
                outstock_start_date: "",
                outstock_end_date: "",
                instock_bn: "",
                warehouse_id: "",
                time_quantumII: "",
                isLoading: false,
                department: "",
                departments: [
                    {key: "技术部 ", val: 1}, {key: "设计部 ", val: 2},
                    {key: "运营部 ", val: 13}, {key: "采购部 ", val: 6},
                    {key: "销售部 ", val: 7}, {key: "财务部 ", val: 8},
                    {key: "人事行政部 ", val: 9}, {key: "新媒体部 ", val: 10},
                    {key: "物流仓储 ", val: 11},{key: "渠道部 ", val: 12}
                ],
                size: ""
            }
        },
        created(){
//            document.addEventListener('DOMMouseScroll',this.scrollFunc,false);
//            window.onmousewheel=document.onmousewheel=this.scrollFunc;
            this.size = this.$store.state.size;
            getWareHousesList().then(res => {
                this.options = res.data.itemList
            })
            this.getOutstockSku();
            this.addEvent();
        },
        methods: {
            //            scrollFunc(){
//                if($("#tab").offset().top <= 120){
//                    this.theight = $(window).height() - 180;
//                    $("#tab").css({position: 'fixed',top: '116px',left: "220px",width: $(".pt").width()})
//                    $("#paging").css({position: 'absolute',bottom: "20px",right: "10px"})
//                }
//            },
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getOutstockSku();
                    }
                })
            },
            educe(){
                window.open(`${this.$store.state.urlBackstageApi}/outstocks/exportSkusTotal?access_token=${sessionStorage.getItem('access_token')}&order_type=DESC&department=${this.department}&warehouse_id=${this.warehouse_id}&outstock_bn=${this.instock_bn}&outstock_end_date=${this.outstock_end_date}&sku_title=${this.sku_title}&outstock_start_date=${this.outstock_start_date}`)
            },
            prval(val){
                return val.props_values[0].prop_name + " " + val.props_values[0].prop_value
            },
            reOutstockSku(){
                this.valueI = {};
                this.warehouse_id = "";
                this.sku_title = "";
                this.instock_bn = "";
                this.department = "";
            },
            getOutstockSku(){
                this.isLoading = true;
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    sku_title: this.sku_title,
                    outstock_start_date: this.outstock_start_date,
                    outstock_end_date: this.outstock_end_date,
                    outstock_bn: this.instock_bn,
                    warehouse_id: this.warehouse_id,
                    department: this.department,
                    order_type: "DESC"
                }
                getOutstockSkutotal(parm).then((res) => {
                    this.isLoading = false;
                    this.tableData = res.data.trades
                    this.total = res.data.totalCount
                })
            },
            timeChangeI(val){
                this.time_quantumII = val;
                if (this.time_quantumII) {
                    this.outstock_start_date = this.time_quantumII.split(" - ")[0] + " 00:00:00";
                    this.outstock_end_date = this.time_quantumII.split(" - ")[1] + " 23:59:59";
                } else {
                    this.outstock_start_date = "";
                    this.outstock_end_date = "";
                }
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getOutstockSku();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getOutstockSku();
                return;
            }
        }
    }
</script>