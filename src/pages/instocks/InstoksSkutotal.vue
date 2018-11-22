<style>
    .pt{
        padding-top: 20px;
    }
    .ptc{
        text-align: center;
        margin-top: -10px;
    }
    .cb{
        padding-bottom: 20px;
        text-align: center;
    }
</style>
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
                                    <el-input v-model="sku_title" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="入库时间" class="hspace">
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
                                <el-form-item label="生产日期" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="valueII"
                                            type="daterange"
                                            align="right"
                                            placeholder="选择日期"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeII">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="入库单号">
                                    <el-input v-model="instock_bn" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="入货仓库">
                                    <el-select v-model="warehouse_id" clearable placeholder="请选择仓库" class="col" :size="size">
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
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click='getInstockSku' :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reInstockSku' :size="size">重置</el-button>
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
        <!--表格-->
        <el-table
                v-loading="isLoading"
                border
                :data="tableData"
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column
                    prop="instock_bn"
                    label="入库单号"
                    width="180">
            </el-table-column>
            <el-table-column
                    label="缩略图"
                    width="100">
                <template slot-scope="props">
                    <img :src="props.row.default_image" style="width: 100%" v-if="props.row.default_image">
                </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="sku标题"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="sub_title"
                    label="副标题"
                    width="150">
            </el-table-column>
            <el-table-column
                    :formatter="prval"
                    prop="props_values"
                    label="规格"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="weight"
                    label="重量(kg)"
                    width="95">
            </el-table-column>
            <el-table-column
                    prop="unit"
                    label="单位"
                    width="75">
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="入库数量"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="warehouse_name"
                    label="入货仓库"
                    width="95">
            </el-table-column>
            <el-table-column
                    prop="production_date"
                    label="生产日期"
                    width="100">
            </el-table-column>
            <el-table-column
                    :formatter="production_dateC"
                    prop="production_date"
                    label="过期日期"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="shelf_life"
                    label="保质期(天)"
                    width="95">
            </el-table-column>
            <el-table-column
                    prop="created_at"
                    label="创建时间"
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
    import { getInstockskutotal, getWareHousesList } from '../../api/api'
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
                form: {},
                valueI: "",
                valueII: "",
                options: [],
                tableData: [],
                total: 200,
                page: 1,
                per_page: 20,
                sku_title: "",
                instock_start_date: "",
                instock_end_date: "",
                production_start_date: "",
                production_end_date: "",
                instock_bn: "",
                warehouse_id: "",
                time_quantumI: "",
                time_quantumII: "",
                isLoading: false,
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            this.getInstockSku();
            this.addEventL();
            getWareHousesList().then(res => {
                this.options = res.data.itemList
            })
        },
        methods:{
            addEventL(){
                var _this = this;
                $(window).keyup(function(event){
                    if(event.keyCode == 13){
                        _this.getInstockSku();
                    }
                })
            },
            educe(){
                window.open(`${this.$store.state.urlBackstageApi}/instocks/exportSkusTotal?access_token=${sessionStorage.getItem('access_token')}&warehouse_id=${this.warehouse_id}&instock_bn=${this.instock_bn}&production_end_date=${this.production_end_date}&sku_title=${this.sku_title}&instock_start_date=${this.instock_start_date}&instock_end_date=${this.instock_end_date}&production_start_date=${this.production_start_date}`)
            },
            production_dateC(row){
                if (row.production_date){
                    if (parseInt(row.shelf_life) > 0){
                        var timestamp = Date.parse(new Date(row.production_date));
                        var sl = parseInt(row.shelf_life)*24*60*60*1000;
                        var data = new Date();
                        data.setTime(sl + timestamp);
                        var str = data.toString();
                        str = str.replace(/ GMT.+$/, '');// Or str = str.substring(0, 24)
                        var d = new Date(str);
                        var a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
                        for(var i = 0, len = a.length; i < len; i ++) {
                            if(a[i] < 10) {
                                a[i] = '0' + a[i];
                            }
                        }
                        str = a[0] + '-' + a[1] + '-' + a[2];
                        return str
                    }
                }
            },
            prval(val){
                return val.props_values[0].prop_name + " " + val.props_values[0].prop_value
            },
            getInstockSku(){
                this.isLoading = true;
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    sku_title: this.sku_title,
                    instock_start_date: this.instock_start_date,
                    instock_end_date: this.instock_end_date,
                    production_start_date: this.production_start_date,
                    production_end_date: this.production_end_date,
                    instock_bn: this.instock_bn,
                    warehouse_id: this.warehouse_id,
                    sort_by: "updated_at",
                    sort_type: "DESC"
                }
                getInstockskutotal(parm).then((res)=>{
                    this.isLoading = false;
                    this.tableData = res.data.trades;
                    this.total = res.data.totalCount
                })
            },
            reInstockSku(){
                this.valueI = {};
                this.valueII = {};
                this.warehouse_id = "";
                this.sku_title = "";
                this.instock_bn = "";
            },
            timeChangeII(val){
                this.time_quantumI = val;
                if (this.time_quantumI) {
                    this.production_start_date = this.time_quantumI.split(" - ")[0]+" 00:00:00";
                    this.production_end_date = this.time_quantumI.split(" - ")[1]+" 23:59:59";
                }else{
                    this.production_start_date = "";
                    this.production_end_date = "";
                }
            },
            timeChangeI(val){
                this.time_quantumII = val;
                if (this.time_quantumII) {
                    this.instock_start_date = this.time_quantumII.split(" - ")[0]+" 00:00:00";
                    this.instock_end_date = this.time_quantumII.split(" - ")[1]+" 23:59:59";
                }else{
                    this.instock_start_date = "";
                    this.instock_end_date = "";
                }
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getInstockSku();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getInstockSku();
                return;
            }
        }
    }
</script>