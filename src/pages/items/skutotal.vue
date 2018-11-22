<template>
    <section>
        <div class="block">
            <el-row style="margin-top: 20px;">
                <el-col :span="2" class='ptc'>
                    <span style='margin-left: 30px'>筛选条件</span>
                </el-col>
                <el-col :span="22">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="sku标题：">
                                    <el-input v-model="skuTitle" placeholder="请输入SKU标题" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="日期：">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="value"
                                            type="daterange"
                                            placeholder="请选择日期范围"
                                            @change="show">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="仓库：">
                                    <el-select v-model="warehouse_id" class="col" clearable placeholder="请选择仓库"
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
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="供应商：">
                                    <el-select v-model="supplier" class="col" clearable placeholder="请选择供应商"
                                               :size="size" filterable>
                                        <el-option
                                                v-for="item in suppliers"
                                                :label="item.name"
                                                :value="item.supplier_id"
                                                :key="item.supplier_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class="btnw" @click="getSkutatol" :size="size">查询</el-button>
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
                <el-button type="primary" @click="gotoChartsAnalysis(1)" class="btnw" :size="size">出库酒款数据分析</el-button>
                <el-button type="primary" @click="gotoChartsAnalysis(2)" class="btnw" :size="size">出库配件数据分析</el-button>
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
                    prop="sku_id"
                    label="sku_id"
                    width="75">
            </el-table-column>
            <el-table-column label="缩略图" width="100">
                <template slot-scope="props">
                    <img :src="props.row.default_image" alt="" style="width:100%" v-if="props.row.default_image">
                </template>
            </el-table-column>
            <el-table-column
                    prop="supplier_name"
                    label="供应商名称"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="supply_day"
                    label="供应周期（天）"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="sku标题"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="cat_name"
                    label="物料分类"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="barcode"
                    label="条形码"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="start_sku_store"
                    label="期初结存"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="instock_nums"
                    label="本期收入"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="outstock_nums"
                    label="本期发出"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="end_sku_store"
                    label="期末结存"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="unit"
                    label="单位"
                    min-width="75">
            </el-table-column>
            <el-table-column
                    :formatter="formateProps"
                    prop="props_values"
                    label="规格"
                    min-width="120">
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page_no"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="per_page"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="paging">
        </el-pagination>
    </section>
</template>

<script>
    import {getSkutotal, getWareHousesList, getSuppliersList} from '../../api/api'
    export default{
        data(){
            return {
                time_quantum: "",
                value: "",
                warehouse_id: "",
                start_date: "",
                end_date: "",
                total: 20,
                page_no: 1,
                per_page: 20,
                options: [],
                tableData: [],
                skuTitle: "",
                isLoading: false,
                suppliers: [],
                supplier: "",
                size: ""
            }
        },
        created(){
            getSuppliersList().then(res => {
                this.suppliers = res.data.itemList
            })
            this.size = this.$store.state.size;
            this.getSkutatol();
            this.getStore();
            this.addEventL();
        },
        methods: {
            addEventL(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getSkutatol();
                    }
                })
            },
            educe(){
                window.open(`${this.$store.state.urlBackstageApi}/skus/storelogs/export?access_token=${sessionStorage.getItem('access_token')}&start_date=${this.start_date}&end_date=${this.end_date}&warehouse_id=${this.warehouse_id}&sku_title=${this.skuTitle}`)
            },
            reLoad(){
                this.value = "";
                this.skuTitle = "";
                this.warehouse_id = "";
            },
            getStore(){
                getWareHousesList().then((res) => {
                    this.options = res.data.itemList;
                })
            },
            show(val){
                this.time_quantum = val;
                if (this.time_quantum) {
                    this.start_date = this.time_quantum.split(" - ")[0]
                    this.end_date = this.time_quantum.split(" - ")[1]
                } else {
                    this.start_date = "";
                    this.end_date = "";
                }
            },
            getSkutatol(){
                this.isLoading = true;
                var that = this;
                var pram = {
                    page_no: this.page_no,
                    page_size: this.per_page,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    warehouse_id: this.warehouse_id,
                    sku_title: this.skuTitle,
                    supplier_id: this.supplier
                }
                getSkutotal(pram).then((res => {
                    this.isLoading = false;
                    that.tableData = res.data.skusList;
                    that.total = res.data.totalPage * this.per_page;
                }))
            },
            formateProps(row, column) {
                let str = ''
                for (let i in row.props_values) {
                    str += row.props_values[i].prop_name + ':' + row.props_values[i].prop_value + ' '
                }
                return str
            },
            handleCurrentChange(val){
                // 多少条
                this.page_no = val;
                this.getSkutatol()
            },
            handleSizeChange(val){
                // 第几页
                this.per_page = val;
                this.getSkutatol();
            },
            //跳转到出库物料分析
            gotoChartsAnalysis:function (type) {
                this.$router.push('/charts_analysis/output_data_chart?type='+type)
            }
        }
    }
</script>