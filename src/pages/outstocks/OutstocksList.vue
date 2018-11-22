<template>
    <section>
        <HS></HS>
        <!--工具条-->
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'>
                    <span style='margin-left: 30px'>筛选条件</span>
                </el-col>
                <el-col :span="21">
                    <el-form :model="filters" label-width="130px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="出库单号：" class="hspace">
                                    <el-input v-model="filters.outstock_bn" placeholder="出库单号" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出库仓库：" class="hspace">
                                    <el-select v-model="filters.warehouse_id" placeholder="出库仓库" class="col"
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
                                <el-form-item label="出库状态：" class="hspace">
                                    <el-select v-model="filters.out_status" placeholder="出库状态" class="col" :size="size">
                                        <el-option
                                                v-for="item in out_status"
                                                :label="item.label"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="出库类型：" class="hspace">
                                    <el-select v-model="filters.type_id" placeholder="出库类型" class="col" :size="size">
                                        <el-option
                                                v-for="item in types"
                                                :label="item.type_name"
                                                :value="item.type_id"
                                                :key="item.type_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!--<el-col :span="8">-->
                            <!--<el-form-item label="确认状态：" class="hspace">-->
                            <!--<el-select v-model="filters.confirm_status" placeholder="确认状态" class="col"-->
                            <!--:size="size">-->
                            <!--<el-option-->
                            <!--v-for="item in confirm_status"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value"-->
                            <!--:key="item.value">-->
                            <!--</el-option>-->
                            <!--</el-select>-->
                            <!--</el-form-item>-->
                            <!--</el-col>-->
                            <el-col :span="8">
                                <el-form-item label="出库部门：" class="hspace">
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
                            <el-col :span="8">
                                <el-form-item label="创建时间：" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="valueI"
                                            type="daterange"
                                            align="right"
                                            placeholder="请选择"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeI">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="确认时间：">
                                    <el-date-picker
                                            :size="size"
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
                            <el-col :span="8">
                                <el-form-item label="平台单号：">
                                    <el-input v-model="filters.platofrm_bn" placeholder="平台单号" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出库日期：">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="out_value"
                                            type="daterange"
                                            align="right"
                                            placeholder="请选择"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeIII">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="cb">
                            <el-col :span="24">
                                <el-button type="primary" @click="getItems" class="btnw" :size="size">查询</el-button>
                                <el-button type="primary" class="btnw" @click="reload" :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" @click="handleAdd" class="btnw" :size="size">新增</el-button>
                </el-col>
            </el-row>
        </div>
        <!--列表-->
        <template>
            <el-table :data="outstockList" highlight-current-row border v-loading="listLoading" style="width: 100%;"
                      class="geFontSize_list">
                <el-table-column type="expand" width="30">
                    <template slot-scope="props">
                        <el-table
                                class="geFontSize_list"
                                :data="props.row.items"
                                border
                                empty-text="该物料下暂无sku信息">
                            <el-table-column
                                    prop="sku_title"
                                    label="sku标题"
                                    min-width="150">
                            </el-table-column>
                            <el-table-column
                                    prop=""
                                    label="缩略图"
                                    min-width="100">
                                <template slot-scope="prop">
                                    <img :src="prop.row.default_image" style="width: 100%;" alt=""
                                         v-if="prop.row.default_image">
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sub_title"
                                    label="sku副标题"
                                    min-width="150">
                            </el-table-column>
                            <el-table-column
                                    :formatter="props_valuesC"
                                    prop="props_values"
                                    label="规格"
                                    min-width="150">
                            </el-table-column>
                            <el-table-column
                                    prop="num"
                                    label="出库数量"
                                    min-width="95">
                            </el-table-column>
                            <el-table-column
                                    prop="price"
                                    label="出库单价"
                                    min-width="95">
                            </el-table-column>
                            <el-table-column
                                    label="条码"
                                    min-width="120"
                                    prop="barcode">
                            </el-table-column>
                            <el-table-column
                                    label="货号"
                                    min-width="120"
                                    prop="bn">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="55">
                </el-table-column>
                <el-table-column inline-template label="操作" width="175">
                    <template>
                        <p style="margin: 5px 0;">
                            <el-button :size="sizeButton" @click="copy(row)">复制</el-button>
                            <el-button :size="sizeButton" @click="prints(row)">打印</el-button>
                            <el-button :size="sizeButton" @click="detail(row)">详情</el-button>
                        </p>
                        <p style="margin: 5px 0;">
                            <el-button :size="sizeButton" @click="handleEdit(row)" v-if="row.confirm_status == 1">编辑



                            </el-button>
                            <el-button type="primary" :size="sizeButton" @click="handleConfirm(row)"
                                       v-if="row.confirm_status == 1">确认



                            </el-button>
                            <el-button type="danger" :size="sizeButton" @click="handleDel(row)"
                                       v-if="row.confirm_status == 1">删除



                            </el-button>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="outstock_bn" label="出库单号" width="150">
                </el-table-column>
                <el-table-column prop="out_order_id" label="平台单号" width="150">
                </el-table-column>
                <el-table-column prop="warehouse_id" :formatter="formatWarehouse" label="出库仓库" width="95">
                </el-table-column>
                <el-table-column prop="type_id" :formatter="type_idC" label="出库类型" width="85">
                </el-table-column>
                <el-table-column prop="department" label="出库部门" width="85">
                </el-table-column>
                <el-table-column prop="out_date" label="出库日期" width="100">
                </el-table-column>
                <el-table-column label="出库状态" width="85">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.out_status == 0">未出库</el-tag>
                        <el-tag type="success" v-else-if="scope.row.out_status == 1">已出库</el-tag>
                        <el-tag type="danger" v-else>失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="出库单执行状态" width="130">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.self_status == 0">取消出库</el-tag>
                        <el-tag type="success" v-else-if="scope.row.self_status == 1">生效中</el-tag>
                        <el-tag type="danger" v-else>已关闭</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="确认状态" width="85">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.confirm_status == 0">无需确认</el-tag>
                        <el-tag type="danger" v-else-if="scope.row.confirm_status == 1">未确认</el-tag>
                        <el-tag type="success" v-else>已确认</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="created_at"
                        label="创建时间"
                        width="100">
                </el-table-column>
                <el-table-column prop="memo" label="备注" min-width="170">
                    <template slot-scope="props">
                        <elliptical :message="props.row.memo"></elliptical>
                    </template>
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
    import util from '../../common/util'
    import NProgress from 'nprogress'
    import {getOutstocksList, removeOutstock, confirmOutstock, getWareHousesList, getInstockType} from '../../api/api';
    import {checkLogin} from '../../api/checkLogin'
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
                created_start_date: "",
                created_end_date: "",
                confirmed_start_date: "",
                confirm_end_date: "",
                out_start_date: "",
                out_end_date: "",
                time_quantumI: "",
                time_quantumII: "",
                time_quantumIII: "",
                valueI: [],
                valueII: [],
                out_value: [],
                filters: {
                    outstock_bn: '',
                    out_status: '',
                    self_status: '',
                    confirm_status: '',
                    warehouse_id: '',
                    type_id: '',
                    platofrm_bn: ""
                },
                out_status: [
                    {
                        value: '0',
                        label: '未出库'
                    }, {
                        value: '1',
                        label: '已出库'
                    }, {
                        value: '2',
                        label: '失败'
                    }
                ],
                self_status: [
                    {
                        value: '0',
                        label: '取消出库'
                    }, {
                        value: '1',
                        label: '生效中'
                    }, {
                        value: '2',
                        label: '已关闭'
                    }],
                confirm_status: [
                    {
                        value: '0',
                        label: '无需确认'
                    }, {
                        value: '1',
                        label: '未确认'
                    }, {
                        value: '2',
                        label: '已确认'
                    }
                ],
                outstockList: [],
                listLoading: false,
                total: 0,
                page: 1,
                per_page: 10,
                warehouse: [],
                types: [],
                department: "",
                departments: [
                    {key: "技术部 ", val: 1},
                    {key: "设计部 ", val: 2},
                    {key: "运营部 ", val: 13},
                    {key: "采购部 ", val: 6},
                    {key: "销售部 ", val: 7},
                    {key: "财务部 ", val: 8},
                    {key: "人事行政部 ", val: 9},
                    {key: "新媒体部 ", val: 10},
                    {key: "物流仓储 ", val: 11},
                    {key: "渠道部 ", val: 12},
                ],
                size: "",
                sizeButton: "",
            }
        },
        created() {
            this.size = this.$store.state.size;
            this.sizeButton = this.$store.state.sizeButton;
            if (this.$route.query.criteria) {
                let criteria = this.$route.query.criteria;
                this.page = criteria.page;
                this.per_page = criteria.per_page;
                this.filters.outstock_bn = criteria.outstock_bn;
                this.filters.self_status = criteria.out_status;
                this.filters.confirm_status = criteria.confirm_status;
                this.filters.warehouse_id = criteria.warehouse_id;
                this.filters.type_id = criteria.type_id;
                this.confirm_end_date = criteria.confirm_end_date;
                this.created_start_date = criteria.created_start_date;
                this.created_end_date = criteria.created_end_date;
                this.filters.platofrm_bn = criteria.out_order_id;
                this.out_start_date = criteria.out_start_date;
                this.out_end_date = criteria.out_end_date;
                this.department = criteria.department;
            }
            var type = {io_type: 'o'};
            getInstockType(type).then((res) => {
                this.types = res.data
            })
            getWareHousesList().then(res => {
                this.warehouse = res.data.itemList
            }).catch(e => {
                console.log(e);
            })
            this.getItems();
            this.addEventL();
        },
        methods: {
            addEventL(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getItems();
                    }
                })
            },
            copy(val){
                this.$router.push({
                    path: '/iostocks/outstocks/manager/add',
                    query: {outstock_id: val.outstock_id, warehouse_id: val.warehouse_id}
                })
            },
            prints(val){
                window.open(`${this.$store.state.url}/outStock.html?${val.outstock_id}?access_token=${sessionStorage.getItem('access_token')}`)
            },
            detail(val){
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    outstock_bn: this.filters.outstock_bn,
                    out_status: this.filters.out_status,
                    self_status: this.filters.self_status,
                    confirm_status: this.filters.confirm_status,
                    warehouse_id: this.filters.warehouse_id,
                    type_id: this.filters.type_id,
                    confirm_start_date: this.confirmed_start_date,
                    confirm_end_date: this.confirm_end_date,
                    created_start_date: this.created_start_date,
                    created_end_date: this.created_end_date,
                    out_order_id: this.filters.platofrm_bn,
                    out_start_date: this.out_start_date,
                    out_end_date: this.out_end_date,
                    department: this.department
                }
                this.$router.push({
                    path: "/iostocks/outstocks/manager/detail",
                    query: {outstock_id: val.outstock_id, criteria: criteria}
                })
            },
            reload(){
                this.valueI = [];
                this.valueII = [];
                this.out_value = [];
                this.department = "";
                this.filters.outstock_bn = '';
                this.filters.platofrm_bn = '';
                this.filters.out_status = '';
                this.filters.self_status = '';
                this.filters.type_id = '';
                this.filters.confirm_status = '';
                this.filters.warehouse_id = ''
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
            timeChangeI(val){
                this.time_quantumI = val;
                if (this.time_quantumI) {
                    this.created_start_date = this.time_quantumI.split(" - ")[0] + " 00:00:00";
                    this.created_end_date = this.time_quantumI.split(" - ")[1] + " 23:59:59";
                } else {
                    this.created_start_date = "";
                    this.created_end_date = "";
                }
            },
            timeChangeII(val){
                this.time_quantumII = val;
                if (this.time_quantumII) {
                    this.confirmed_start_date = this.time_quantumII.split(" - ")[0] + " 00:00:00";
                    this.confirm_end_date = this.time_quantumII.split(" - ")[1] + " 23:59:59";
                } else {
                    this.confirmed_start_date = "";
                    this.confirm_end_date = "";
                }
            },
            timeChangeIII(val){
                this.time_quantumIII = val;
                if (this.time_quantumIII) {
                    this.out_start_date = this.time_quantumIII.split(" - ")[0] + " 00:00:00";
                    this.out_end_date = this.time_quantumIII.split(" - ")[1] + " 23:59:59";
                } else {
                    this.out_start_date = "";
                    this.out_end_date = "";
                }
            },
            formatWarehouse(row) {
                for (let i in this.warehouse) {
                    if (this.warehouse[i].warehouse_id == row.warehouse_id) {
                        return this.warehouse[i].warehouse_name
                    }
                }
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getItems();
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.getItems();
            },
            formatGift(row){
                return row.is_gift ? '是' : '不是'
            },
            type_idC(row){
                switch (row.type_id) {
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
            formatePlatform(row){
                let str = '',
                    platform = row.platform.split(','),
                    plength = 0;
                platform.length > 1 ? plength = platform.length - 1 : plength = 1;
                for (let i = 0; i < plength; i++) {
                    str += (platform[i] === 'jd' ? '京东' : (platform[i] === 'tm' ? '天猫' : '淘宝')) + ' '
                }
                return str
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getItems();
            },
            getItems() {
                let para = {
                    page: this.page,
                    per_page: this.per_page,
                    outstock_bn: this.filters.outstock_bn,
                    out_status: this.filters.out_status,
                    self_status: this.filters.self_status,
                    confirm_status: this.filters.confirm_status,
                    warehouse_id: this.filters.warehouse_id,
                    type_id: this.filters.type_id,
                    confirm_start_date: this.confirmed_start_date,
                    confirm_end_date: this.confirm_end_date,
                    created_start_date: this.created_start_date,
                    created_end_date: this.created_end_date,
                    out_order_id: this.filters.platofrm_bn,
                    sort_by: "updated_at",
                    sort_type: "DESC",
                    out_start_date: this.out_start_date,
                    out_end_date: this.out_end_date,
                    department: this.department
                };
                this.listLoading = true;
                NProgress.start();
                getOutstocksList(para).then((res) => {
                    checkLogin(res, this);
                    this.total = res.total;
                    this.outstockList = res.data.outstockList;
                    this.total = res.data.totalCount;
                    this.listLoading = false;
                    NProgress.done();
                });
            },
            //删除
            handleDel: function (row) {
                var that = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    that.listLoading = true;
                    NProgress.start();
                    removeOutstock(row.outstock_id).then((res) => {
                        checkLogin(res, this)
                        that.listLoading = false;
                        NProgress.done();
                        if (res.error_code) {
                            that.$message.error(res.message);
                        } else {
                            that.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }
                        that.getItems();
                    });
                }).catch(() => {

                });
            },
            //删除
            handleConfirm: function (row) {
                var that = this;
                this.$confirm('确定确认该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    that.listLoading = true;
                    NProgress.start();
                    let params = {
                        outstock_id: row.outstock_id
                    }
                    confirmOutstock(params).then((res) => {
                        checkLogin(res, this)
                        that.listLoading = false;
                        NProgress.done();
                        if (res.error_code) {
                            that.$message.error(res.message);
                        } else {
                            that.$message({
                                message: '确认成功',
                                type: 'success'
                            });
                        }
                        that.getItems();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (row) {
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    outstock_bn: this.filters.outstock_bn,
                    out_status: this.filters.out_status,
                    self_status: this.filters.self_status,
                    confirm_status: this.filters.confirm_status,
                    warehouse_id: this.filters.warehouse_id,
                    type_id: this.filters.type_id,
                    confirm_start_date: this.confirmed_start_date,
                    confirm_end_date: this.confirm_end_date,
                    created_start_date: this.created_start_date,
                    created_end_date: this.created_end_date,
                    out_order_id: this.filters.platofrm_bn,
                    out_start_date: this.out_start_date,
                    out_end_date: this.out_end_date,
                    department: this.department
                }
                this.$router.push({path: '/editoutstock', query: {outstock_id: row.outstock_id, criteria: criteria}})
            },
            handleAdd: function () {
                this.$router.replace('/iostocks/outstocks/manager/add')
            }
        }
    }
</script>

<style scoped>
</style>
