<template>
    <section class='bg' id="gg">
        <div v-if='bool' class='mengban'></div>
        <div v-if='bool' class='show'>
            <input class="el-input__inner" style="width: 200px;display: inline-block" type="text" placeholder="物料名称" v-model="shop_name" v-on:keyup.13="getSkuListes">
            <el-cascader placeholder="物料分类" @change="handleItemChange" clearable v-model='cat_ids' :props="defaultProps" :options="optionsx" filterable>
            </el-cascader>
            <el-button type="primary" style='width: 150px' @click='getSkuListes'>查询</el-button>
            <div id="close" @click="hidden">×</div>
            <!--列表-->
            <el-table
                    :data="tableDataII"
                    border
                    height="500"
                    style="width: 100%;margin-top: 20px;">
                <el-table-column
                        label="操作"
                        min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click='addItemes(scope.$index)'>添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="物料名称"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        :formatter='props_valuesC'
                        prop="props_values"
                        label="规格"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="sku_store"
                        label="物料库存"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="barcode"
                        label="条码"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="bn"
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
            <div style='clear: both'></div>
            <div class=cen><el-button type="primary" style='width: 150px;' @click='hidden'>完成</el-button></div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;基本信息</h3>
            <el-row  class='bg' style="margin-top: 10px;">
                <el-col :span='21'>
                    <el-form label-width="120px" :rules="rules" :model="instockForm" ref="instockForm" style="width: 100%;">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="入库编号：" prop="instock_bn">
                                    <el-input v-model="instockForm.instock_bn" placeholder="请输入入库编号" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="入库仓库：">
                                    <el-select v-model="instockForm.warehouse_id" placeholder="请选择入库仓库" class="col">
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
                            <el-col :span="10">
                                <el-form-item label="入库日期：">
                                    <el-date-picker
                                            style="width: 70%;"
                                            v-model="in_stockDate"
                                            type="date"
                                            @change="setInDate"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="入库类型：">
                                    <el-select v-model="instockForm.clasee" placeholder="请选择入库类型" clearable style="width: 70%;">
                                        <el-option
                                                v-for="item in instock"
                                                :label="item.type_name"
                                                :value="item.type_id"
                                                :key="item.type_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="采购单号：" v-if="instockForm.clasee == 1">
                                    <el-select v-model="purchase_order" placeholder="请选择采购单号" clearable @change="purchse">
                                        <el-option
                                                v-for="item in purchasse"
                                                :label="item.po_bn"
                                                :value="item.po_id"
                                                :key="item.po_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="出库单号：" v-if="instockForm.clasee == 2">
                                    <el-select v-model="outstock_id" placeholder="请选择出库单号" clearable @change="outer">
                                        <el-option
                                                v-for="item in outstocks"
                                                :label="item.outstock_bn"
                                                :value="item.outstock_id"
                                                :key="item.outstock_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="借货出库单号：" v-if="instockForm.clasee == 16">
                                    <el-select v-model="outstock_ids" placeholder="请选择出库单号" clearable @change="setOutorder">
                                        <el-option
                                                v-for="item in outstock"
                                                :label="item.outstock_bn"
                                                :value="item.outstock_id"
                                                :key="item.outstock_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class='bg'>
                <el-col :span='22' :offset="1">
                    <div style='padding: 10px;padding-left: 0;'>
                        <el-button type="primary" style='width: 150px;' @click='show' v-if="instockForm.clasee != 1&&instockForm.clasee != 2&&instockForm.clasee != 16">选择物料</el-button>
                    </div>
                    <el-table
                            :data="tableDataI"
                            border
                            v-show="instockForm.clasee != 1&&instockForm.clasee != 2&&instockForm.clasee != 16"
                            height="500"
                            style="width: 100%;  margin-bottom: 20px">
                        <el-table-column
                                type="index"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                min-width="70">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click='removeItem(scope.$index)'>移除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="缩略图" width="100">
                            <template slot-scope="props">
                                <img :src="props.row.default_image" alt="" style="width:100%">
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="物料名称" width="150">
                        </el-table-column>
                        <el-table-column
                                :formatter='props_valuesC'
                                prop="props_values"
                                label="规格"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                label="单位"
                                prop="unit"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                label="重量(kg)"
                                prop="weight"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="sku_store"
                                label="物料库存"
                                min-width="95">
                        </el-table-column>
                        <el-table-column label="入库数量" width="100">
                            <template slot-scope="props">
                                <input v-model="props.row.num" style="width: 99%;" class="el-input__inner">
                            </template>
                        </el-table-column>
                        <el-table-column label="生产日期" width="200">
                            <template slot-scope="props">
                                <el-date-picker
                                        v-model="props.row.production_date"
                                        format="yyyy-MM-dd"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions"
                                        style="width: 90%;">
                                </el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column label="保质期" width="230">
                            <template slot-scope="props">
                                <el-input placeholder="请输入时间" style="width: 150px;" v-model="props.row.shelf_life">
                                    <el-select v-model="props.row.shelf_life_type" slot="prepend" placeholder="请选择" style="width: 60px;">
                                        <el-option label="年" value="y"></el-option>
                                        <el-option label="月" value="m"></el-option>
                                        <el-option label="日" value="d"></el-option>
                                    </el-select>
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bn" label="物料货号" width="150">
                        </el-table-column>
                        <el-table-column
                                prop="barcode"
                                label="条码"
                                min-width="150">
                        </el-table-column>
                    </el-table>
                    <el-table
                            v-show="instockForm.clasee == 1"
                            :data="optionsIV_items"
                            height="500"
                            border
                            style="width: 100%;  margin-bottom: 20px">
                        <el-table-column
                                prop="title"
                                label="物料名称"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                :formatter="props_valuesC"
                                prop="props_values"
                                label="规格"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                min-width="95"
                                prop="weight"
                                label="重量(kg)">
                        </el-table-column>
                        <el-table-column
                                prop="store"
                                label="物料库存"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="instock_num"
                                label="入库数量"
                                min-width="95">
                            <template slot-scope="scope">
                                <input v-model="scope.row.num" placeholder="请输入内容" style="width: 99%" class="el-input__inner">
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="start"
                                label="生产日期"
                                min-width="200">
                            <template slot-scope="props">
                                <el-date-picker
                                        style="width: 90%;"
                                        v-model="props.row.production_date"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions">
                                </el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop=""
                                label="保质期(天)"
                                min-width="230">
                            <template slot-scope="props">
                                <el-input placeholder="请输入时间" style="width: 150px;" v-model="props.row.shelf_life">
                                    <el-select v-model="props.row.shelf_life_type" slot="prepend" placeholder="请选择" style="width: 60px;">
                                        <el-option label="年" value="y"></el-option>
                                        <el-option label="月" value="m"></el-option>
                                        <el-option label="日" value="d"></el-option>
                                    </el-select>
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="barcode"
                                label="条码"
                                min-width="180">
                        </el-table-column>
                        <el-table-column
                                prop="bn"
                                label="货号"
                                min-width="180">
                        </el-table-column>
                    </el-table>
                    <el-table
                            v-show="instockForm.clasee == 2"
                            :data="optionsVI_items"
                            border
                            height="500"
                            style="width: 100%;  margin-bottom: 20px">
                        <el-table-column
                                prop="title"
                                label="物料名称"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                :formatter="props_valuesC"
                                prop="props_values"
                                label="规格"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                min-width="95"
                                prop="weight"
                                label="重量(kg)">
                        </el-table-column>
                        <el-table-column
                                prop="store"
                                label="物料库存"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="num"
                                label="入库数量"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="barcode"
                                label="条码"
                                min-width="180">
                        </el-table-column>
                        <el-table-column
                                prop="bn"
                                label="货号"
                                min-width="180">
                        </el-table-column>
                    </el-table>
                    <el-table
                            :data="outstock_data"
                            border
                            v-show="instockForm.clasee == 16"
                            height="500"
                            style="width: 100%;  margin-bottom: 20px">
                        <el-table-column
                                label="操作"
                                min-width="70">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click='removeItem(scope.$index)'>移除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="缩略图" width="100">
                            <template slot-scope="props">
                                <img :src="props.row.default_image" alt="" style="width:100%">
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="物料名称" width="150">
                        </el-table-column>
                        <el-table-column
                                :formatter='props_valuesC'
                                prop="props_values"
                                label="规格"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                prop="unit"
                                label="单位"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="weight"
                                label="重量(kg)"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="sku_store"
                                label="物料库存"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="num"
                                label="借贷数量"
                                min-width="95">
                        </el-table-column>
                        <el-table-column label="现入库数量" width="150">
                            <template slot-scope="props">
                                <input v-model="props.row.in_num" style="width: 99%;" class="el-input__inner">
                            </template>
                        </el-table-column>
                        <el-table-column label="生产日期" width="230">
                            <template slot-scope="props">
                                <el-date-picker
                                        v-model="props.row.production_date"
                                        format="yyyy-MM-dd"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions"
                                        class="startDay">
                                </el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column label="保质期" width="230">
                            <template slot-scope="props">
                                <el-input placeholder="请输入时间" style="width: 150px;" v-model="props.row.shelf_life">
                                    <el-select v-model="props.row.shelf_life_type" slot="prepend" style="width: 60px;">
                                        <el-option label="年" value="y"></el-option>
                                        <el-option label="月" value="m"></el-option>
                                        <el-option label="日" value="d"></el-option>
                                    </el-select>
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bn" label="物料货号" width="150">
                        </el-table-column>
                        <el-table-column
                                prop="barcode"
                                label="条码"
                                min-width="150">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;备注</h3>
            <el-row class="bg" style="padding: 20px;">
                <el-col :span="24">
                    <el-input
                            style='width: 100%;margin-bottom: 20px;'
                            :autosize="{ minRows: 4, maxRows: 8}"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="memo">
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-row class="bg" style='text-align: center;margin: 0;'>
            <el-button type="primary" style='width: 200px;margin: 20px;' @click='subMit'>保存</el-button>
            <el-button type="primary" style='width: 200px;margin: 20px;background:#FFF;color: black;border: 1px solid #ccc' @click='getback'>取消</el-button>
        </el-row>
    </section>
</template>
<script>
    import { getSkuList, editInstock, getInstocksDetail, getWareHousesList, getCategoriesList, getInstockType, getOutstocksList, getOutstocksDetail, getPurchasseList, PurchaseDetail} from '../../api/api'
    import {toDate, timestamp} from '../../api/geFunc'
    export default {
        data () {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7;
                    }
                },
                pickerOptionsI: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                filters: {
                    commodity_title: '',
                    cat_id: null
                },
                cat_id: '',
                cat_ids: [],
                instockForm: {
                    warehouse_id: '',
                    instock_bn:'',
                    clasee: "",
                    original_id: ""
                },
                listLoading: false,
                tableDataI:[],
                tableDataII: [],
                rules: {
                    instock_bn: [
                        { required: true, message: '请输入入库单自定义编号', trigger: 'blur' }
                    ]
                },
                cat_id: [],
                optionsx: [],
                defaultProps: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                page: 1,
                total: 1,
                per_page: 10,
                options: [],
                value: '',
                memo: "",
                instock: [],
                outstocks: [],
                purchasse: [],
                purchase_order: "",
                outstock_id: "",
                optionsVI_items: [],
                optionsIV_items: [],
                bool: false,
                shop_name: "",
                in_stockDate: "",
                in_date: "",
                outstock_data: [],
                outstock: [],
                outstock_ids: ""
            }
        },
        created () {
//            借货出库单号
            var OutstocksList = {
                type_id: 15,
                per_page: 999999,
                confirm_status: 2
            }
            getOutstocksList(OutstocksList).then((res)=>{
                this.outstock = res.data.outstockList
            })
//            采购单列表获取
            var purchasseList = {
                po_status: 2,
                per_page: 999999
            }
            getPurchasseList(purchasseList).then((res)=>{
                this.purchasse = res.data.storesList
            })
//            调拨出库单列表
            var OutstocksList = {
                type_id: 4,
                per_page: 999999,
//                confirm_status: 2
            }
            getOutstocksList(OutstocksList).then((res)=>{
                this.outstocks = res.data.outstockList
            })
//            出库类型列表
            var instockType = { io_type: "i" }
            getInstockType(instockType).then((res)=>{
                this.instock = res.data
            })
            .catch(e => {
                console.log(e);
            })
//            获取仓库列表
            getWareHousesList().then(res => {
                this.options = res.data.itemList
            })
            .catch(e => {
                console.log(e);
            });
//            获取分类列表
            getCategoriesList().then(res => {
                this.optionsx = res.data;
            })
            .catch(function(error) {
                console.log(error);
            });
//            获取入库单详情
            getInstocksDetail(this.$route.query.instock_id).then((res)=>{
                this.instockForm.instock_bn = res.data.instock_bn;
                this.instockForm.warehouse_id = res.data.warehouse_id;
                this.instockForm.original_id = res.data.original_id;
                this.instockForm.clasee = res.data.type_id;
                this.memo = res.data.memo;
                this.in_stockDate = res.data.in_date
                switch(res.data.type_id){
                    case 1:
                        this.optionsIV_items = res.data.items;
                        this.purchase_order = res.data.original_id;
                        for (let i = 0;i < this.optionsIV_items.length;i++){
                            this.$set(this.optionsIV_items[i],'shelf_life_type', "d");
                            this.$set(this.optionsIV_items[i],'production_date', timestamp((this.optionsIV_items[i].production_date)));
                        }
                        break;
                    case 2:
                        this.optionsVI_items = res.data.items;
                        this.outstock_id = res.data.original_id;
                        break;
                    case 16:
                        this.outstock_data = res.data.items;
                        this.outstock_ids = res.data.original_id;
                        for (let i = 0;i < this.outstock_data.length;i++){
                            this.$set(this.outstock_data[i],'shelf_life_type', "d");
                            this.$set(this.outstock_data[i],'production_date', timestamp((this.outstock_data[i].production_date)));

                        }
                        break;
                    default:
                        this.tableDataI = res.data.items;
                        for (let i = 0;i < this.tableDataI.length;i++){
                            this.$set(this.tableDataI[i],'sku_store', this.tableDataI[i].store);
                            this.$set(this.tableDataI[i],'shelf_life_type', "d");
                            this.$set(this.tableDataI[i],'production_date', timestamp((this.tableDataI[i].production_date)));
                        }
                        console.log(this.tableDataI);
                }
            })
            this.getSkuListes()
        },
        methods: {
            getback(){
                this.$router.push({path: '/iostocks/instocks/manager/list',query:{criteria: this.$route.query.criteria}})
            },
            setOutorder(){
                getOutstocksDetail(this.outstock_ids).then(res => {
                    this.outstock_data = res.data.items;
                    for (let i in this.outstock_data){
                        this.$set(this.outstock_data[i],'in_num', 0);
                        this.$set(this.outstock_data[i],'production_date', "");
                        this.$set(this.outstock_data[i],'shelf_life', "");
                        this.$set(this.outstock_data[i],'shelf_life_type', "");
                    }
                })
            },
            setInDate(val){
                this.in_date = val;
            },
            subMit(){
                let params = {
                    instock_bn: this.instockForm.instock_bn,
                    type_id: this.instockForm.clasee,
                    warehouse_id: this.instockForm.warehouse_id,
                    items: [],
                    memo: this.memo,
                    original_id: this.instockForm.original_id,
                    in_date: this.in_date
                }
                if (this.instockForm.clasee == 2) {
                    params.items = this.optionsVI_items;
                    params.original_id = this.outstock_id;
                } else if (this.instockForm.clasee == 1) {
                    params.original_id = this.purchase_order;
                    for (let j in this.optionsIV_items) {
                        params.items[j] = JSON.stringify({
                            sku_id: this.optionsIV_items[j].sku_id,
                            item_id: this.optionsIV_items[j].item_id,
                            bn: this.optionsIV_items[j].bn,
                            num: this.optionsIV_items[j].num,
                            price: this.optionsIV_items[j].price,
                            shelf_life: this.optionsIV_items[j].shelf_life,
                            shelf_life_type: this.optionsIV_items[j].shelf_life_type,
                            production_date: toDate(this.optionsIV_items[j].production_date)
                        })
                    }
                } else if (this.instockForm.clasee == 16) {
                    params.original_id = this.outstock_ids;
                    for (let j in this.outstock_data) {
                        params.items[j] = JSON.stringify({
                            sku_id: this.outstock_data[j].sku_id,
                            item_id: this.outstock_data[j].item_id,
                            bn: this.outstock_data[j].bn,
                            in_num: this.outstock_data[j].in_num,
                            num: this.outstock_data[j].num,
                            price: this.outstock_data[j].price,
                            shelf_life: this.outstock_data[j].shelf_life,
                            shelf_life_type: this.outstock_data[j].shelf_life_type,
                            production_date: toDate(this.outstock_data[j].production_date)
                        })
                    }
                } else {
                    for (let j in this.tableDataI) {
                        params.items[j] = JSON.stringify({
                            sku_id: this.tableDataI[j].sku_id,
                            item_id: this.tableDataI[j].item_id,
                            bn: this.tableDataI[j].bn,
                            num: this.tableDataI[j].num,
                            price: this.tableDataI[j].price,
                            shelf_life: this.tableDataI[j].shelf_life,
                            shelf_life_type: this.tableDataI[j].shelf_life_type,
                            production_date: toDate(this.tableDataI[j].production_date)
                        })
                    }
                }
                editInstock(this.$route.query.instock_id,params).then(res => {
                    if(res.error_code) {
                        this.$message.error(res.message)
                    } else {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.$router.replace('/iostocks/instocks/manager/list')
                    }
                }).catch(e => {
                    console.log(e);
                })
            },
            removeItem(index){
                this.tableDataII.unshift(this.tableDataI[index])
                this.tableDataI.splice(index,1)
            },
            addItemes(index){
                this.$set(this.tableDataII[index],'num', 1);
                this.$set(this.tableDataII[index],'production_date', "");
                this.$set(this.tableDataII[index],'shelf_life', "");
                this.$set(this.tableDataII[index],'shelf_life_type', "");
                this.tableDataI.push(this.tableDataII[index]);
                this.tableDataII.splice(index, 1);
            },
            getSkuListes(){
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    item_title: this.shop_name,
                    cat_id: this.cat_id,
                    noAllStore: 1
                }
                getSkuList(parm).then((res)=>{
                    this.tableDataII = res.data.skusList;
                    this.total= res.data.totalCount;
                    for(var i = 0;i < this.tableDataII.length;i++){
                        for (var j = 0;j < this.tableDataI.length;j++){
                            if (this.tableDataII[i].sku_id==this.tableDataI[j].sku_id){
                                this.tableDataII.splice(i,1)
                            }
                        }
                    }
                })

            },
            handleItemChange(val) {
                this.cat_id = val[this.cat_ids.length - 1]
            },
            props_valuesC(val){
                var str = '';
                if(val.props_values){
                    for(var i = 0; i < val.props_values.length;i++){
                        str =  val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                    }
                    return str
                }
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getSkuListes();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getSkuListes();
                return;
            },
            show(){
                $("#gg").css({overflow:"hidden",height:"810px"})
                this.bool = true;
            },
            hidden(){
                $("#gg").css({overflow:"",height:""})
                this.bool = false;
            },
            outer(){
                getOutstocksDetail(this.outstock_id).then((res)=>{
                    this.optionsVI_items = res.data.items
                })
            },
            purchse(){
                var parm = {
                    po_id: this.purchase_order
                }
                PurchaseDetail(this.purchase_order,parm).then((res)=>{
                    this.optionsIV_items = res.data.items;
                    for(var i in this.optionsIV_items){
                        this.$set(this.optionsIV_items[i],'start', "");
                        this.$set(this.optionsIV_items[i],'expiration', 0);
                        this.$set(this.optionsIV_items[i],'production_date', "");
                        this.$set(this.optionsIV_items[i],'shelf_life', "");
                        this.$set(this.optionsIV_items[i],'shelf_life_type', "");
                    }
                })
            },
        }
    }
</script>