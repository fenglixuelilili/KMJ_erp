<template>
    <section>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'>筛选条件</el-col>
                <el-col :span="22">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="sku标题：">
                                    <el-input v-model="sku_title" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="盘点日期：">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="value_inventory"
                                            type="daterange"
                                            align="right"
                                            placeholder="选择日期"
                                            :picker-options="pickerOptions"
                                            @change="timeChange">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="盘点单号：">
                                    <el-input v-model="inventory_bn" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click='getInventory' :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reInventory' :size="size">重置</el-button>
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
        <!--表格-->
        <el-table
                v-loading="isLoading"
                border
                :data="tableData"
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column
                    prop="inventory_bn"
                    label="盘点单号"
                    width="150">
            </el-table-column>
            <el-table-column
                    label="缩略图"
                    width="100">
                <template slot-scope="props">
                    <img :src="props.row.default_image" style="width: 100%;" v-if="props.row.default_image">
                </template>
            </el-table-column>
            <el-table-column
                    prop="sku_title"
                    label="sku标题"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="sub_title"
                    label="副标题"
                    width="150">
            </el-table-column>
            <el-table-column
                    :formatter="props_valuesC"
                    prop="props_values"
                    label="规格"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="weight"
                    label="重量(kg)"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="unit"
                    label="单位"
                    width="65">
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="截止库存"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="outstock_nums"
                    label="出库数量"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="instock_nums"
                    label="入库数量"
                    width="95">
            </el-table-column>
            <el-table-column
                    prop="end_num"
                    label="盘点库存"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="diff_num"
                    label="盘点差额"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="stock_deadline"
                    label="库存截止时间"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="inventory_date"
                    label="盘点日期"
                    width="100">
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
    import {incentorySkutotal} from '../../api/api'
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
                value_inventory: {},
                tableData: [],
                total: 1,
                page: 1,
                per_page: 20,
                sku_title: "",
                inventory_start_date: "",
                inventory_end_date: "",
                inventory_bn: "",
                time_quantum: "",
                isLoading: false,
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            this.getInventory();
            this.addEvent();
        },
        methods: {
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getInventory();
                    }
                })
            },
            educe(){
                window.open(`${this.$store.state.urlBackstageApi}/inventories/exportSkusList?access_token=${sessionStorage.getItem('access_token')}&inventory_bn=${this.inventory_bn}&inventory_end_date=${this.inventory_end_date}&sku_title=${this.sku_title}&inventory_start_date=${this.inventory_start_date}`)
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
            getInventory(){
                this.isLoading = true;
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    sku_title: this.sku_title,
                    inventory_end_date: this.inventory_end_date,
                    inventory_start_date: this.inventory_start_date,
                    inventory_bn: this.inventory_bn,
                    sort_by: "updated_at",
                    sort_type: "DESC"
                }
                incentorySkutotal(parm).then((res) => {
                    this.isLoading = false;
                    this.tableData = res.data.items;
                    this.total = res.data.totalCount
                })
            },
            reInventory(){
                this.value_inventory = {};
                this.sku_title = "";
                this.inventory_bn = "";
            },
            timeChange(val){
                this.time_quantum = val;
                if (this.time_quantum) {
                    this.inventory_start_date = this.time_quantum.split(" - ")[0] + " 00:00:00";
                    this.inventory_end_date = this.time_quantum.split(" - ")[1] + " 23:59:59";
                } else {
                    this.inventory_start_date = "";
                    this.inventory_end_date = "";
                }
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getInventory();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getInventory();
                return;
            }
        }
    }
</script>