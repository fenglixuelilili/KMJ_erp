<template>
    <section>
        <HS></HS>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'>筛选条件</el-col>
                <el-col :span="22">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="sku标题：" class="hspace">
                                    <el-input v-model="sku_title" class="col" placeholder="请输入sku标题" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出库日期：" class="hspace">
                                    <el-date-picker
                                            class="col"
                                            :size="size"
                                            v-model="valueI"
                                            type="daterange"
                                            align="right"
                                            placeholder="昨天"
                                            :picker-options="pickerOptions"
                                            @change="timeChange">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出货仓库：" class="hspace">
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
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="出库类型：">
                                    <el-select v-model="type_id" placeholder="请选择出库类型" clearable class="col" :size="size">
                                        <el-option
                                                v-for="item in type"
                                                :label="item.type_name"
                                                :value="item.type_id"
                                                :key="item.type_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="销售平台：">
                                    <el-select v-model="platform" placeholder="请选择销售平台" clearable class="col" :size="size">
                                        <el-option
                                                v-for="item in platforms"
                                                :label="item.key"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出库部门：" class="hspace">
                                    <el-select v-model="department" clearable placeholder="请选择" class="col" :size="size">
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
                                <el-button type="primary" class='btnw' @click='getOutstockSku' :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reOutstockSku' :size="size">重置</el-button>
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
        <div style="position:relative;width: 100%;overflow: auto">
            <el-table
                    border
                    v-loading="isLoading"
                    :data="tableData"
                    style="width: 100%;"
                    class="geFontSize_list">
                <el-table-column
                        prop="sku_id"
                        label="sku_id"
                        min-width="120">
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
                        :formatter="props_valuesC"
                        prop="props_values"
                        label="规格"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        min-width="75">
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="出库数量"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="warehouse_name"
                        label="出货仓库"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="platform"
                        label="销售平台"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="type_name"
                        label="出库类型"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="department"
                        label="出库部门"
                        min-width="85">
                </el-table-column>
                <el-table-column
                        prop="out_date"
                        label="出库日期"
                        width="120">
                </el-table-column>
            </el-table>
        </div>
    </section>
</template>

<script>
    import {  getWareHousesList, getInstockType, getOutstockSkus } from '../../api/api'
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
                valueI: "",
                options: [],
                tableData: [],
                sku_title: "",
                outstock_start_date: "",
                outstock_end_date: "",
                instock_bn: "",
                warehouse_id: "",
                time_quantum: "",
                isLoading: false,
                type: [],
                type_id: "",
                platform: "",
                platforms: [{key:"全部",value:""},{key:"天猫",value:"天猫"},{key:"京东",value:"京东"},{key:"淘宝",value:"淘宝"},],
                department: "",
                departments: [
                    {key:"技术部 ",val:1},{key:"设计部 ",val:2},
                    {key:"运营部",val:13},{key:"采购部 ",val:6},
                    {key:"销售部 ",val:7},{key:"财务部 ",val:8},
                    {key:"人事行政部 ",val:9},{key:"新媒体部 ",val:10},
                    {key:"物流仓储 ",val:11},{key:"渠道部 ",val:12}
                ],
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            var date = new Date()
            date.setTime(date.getTime()-3600*1000*24*1)
            this.outstock_start_date = this.times(date.toString())+" 00:00:00";
            this.outstock_end_date = this.times(date.toString())+" 23:59:59";
            var instockType = { io_type: "o" }
            getInstockType(instockType).then((res)=>{
                this.type = res.data
            })
            getWareHousesList().then(res => {
                this.options = res.data.itemList
            })
            this.getOutstockSku();
            this.addEvent();
        },
        methods:{
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getOutstockSku();
                    }
                })
            },
            educe(){
                window.open(`${this.$store.state.urlBackstageApi}/outstocks/exportSkusCount?access_token=${sessionStorage.getItem('access_token')}&department=${this.department}&type_id=${this.type_id}&warehouse_id=${this.warehouse_id}&platform=${this.platform}&outstock_end_date=${this.outstock_end_date}&sku_title=${this.sku_title}&outstock_start_date=${this.outstock_start_date}`)
            },
            times(str){
                str = str.replace(/ GMT.+$/, '');// Or str = str.substring(0, 24)
                var d = new Date(str);
                var a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
                for(var i = 0, len = a.length; i < len; i ++) {
                    if(a[i] < 10) {
                        a[i] = '0' + a[i];
                    }
                }
                str = a[0] + '-' + a[1] + '-' + a[2];
                return str;
            },
            typeC(val){
                switch (val.type_id){
                    case 11:
                        return "客送";
                        break;
                    case 10:
                        return "盘亏出库";
                        break;
                    case 8:
                        return "外卖门店配货";
                        break;
                    case 7:
                        return "销售出库";
                        break;
                    case 6:
                        return "其他出库";
                        break;
                    case 4:
                        return "调拨出库";
                        break;
                    case 3:
                        return "采购退货出库";
                        break;
                    case 12:
                        return "品鉴";
                        break;
                    case 13:
                        return "报损出库";
                        break;
                    case 14:
                        return "餐饮店配货";
                        break;
                    case 15:
                        return "借货出库";
                        break;
                }
            },
            props_valuesC(val){
                var str = '';
                for(var i = 0; i < val.props_values.length;i++){
                    str =  val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                }
                return str
            },
            reOutstockSku(){
                this.valueI = {};
                this.warehouse_id = "";
                this.sku_title = "";
                this.instock_bn = "";
                this.platform = "";
                this.type_id = "";
                this.department = "";
            },
            getOutstockSku(){
                this.isLoading = true;
                var parm = {
                    per_page: 9999999,
                    sku_title: this.sku_title,
                    outstock_start_date: this.outstock_start_date,
                    outstock_end_date: this.outstock_end_date,
                    type_id: this.type_id,
                    platform: this.platform,
                    warehouse_id: this.warehouse_id,
                    department: this.department
                }
                getOutstockSkus(parm).then((res)=>{
                    this.isLoading = false;
                    this.total = res.data.totalCount;
                    this.tableData = res.data.trades;
                })
            },
            timeChange(val){
                this.time_quantum = val;
                if (this.time_quantum) {
                    this.outstock_start_date = this.time_quantum.split(" - ")[0]+" 00:00:00";
                    this.outstock_end_date = this.time_quantum.split(" - ")[1]+" 23:59:59";
                }else{
                    var date = new Date()
                    date.setTime(date.getTime()-3600*1000*24*1)
                    this.outstock_start_date = this.times(date.toString())+" 00:00:00";
                    this.outstock_end_date = this.times(date.toString())+" 23:59:59";
                }
            }
        }
    }
</script>