<template>
    <section class='bg' id="gg">
        <div v-if='bool' class='mengban'></div>
        <div v-if='bool' class='show'>
            <input class="el-input__inner" style="width: 200px;display: inline-block" type="text" placeholder="物料名称"
                   v-model="shop_name" v-on:keyup.13="getSkuListes">
            <el-cascader placeholder="物料分类" @change="handleItemChange" clearable v-model='cat_ids' :props="defaultProps"
                         :options="optionsx" filterable>
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
            <div class=cen>
                <el-button type="primary" style='width: 150px;' @click='hidden'>完成</el-button>
            </div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;基本信息</h3>
            <el-row class='bg' style="margin-top: 10px;">
                <el-col :span='21'>
                    <el-form label-width="120px" :rules="rules" :model="outstockForm" ref="outstockForm"
                             style="width: 100%;">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="出库编号：" prop="outstock_bn">
                                    <el-input v-model="outstockForm.outstock_bn" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出库仓库：">
                                    <el-select v-model="outstockForm.warehouse_id" clearable placeholder="请选择"
                                               @change="btnS" class="col">
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
                                <el-form-item label="出库类型：">
                                    <el-select v-model="outstockForm.type_id" placeholder="请选择出库类型" clearable
                                               class="col">
                                        <el-option
                                                v-for="item in instock"
                                                :label="item.type_name"
                                                :value="item.type_id"
                                                :key="item.type_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="出库日期：">
                                    <el-date-picker
                                            class="col"
                                            v-model="val_outDate"
                                            type="date"
                                            @change="setOutDate"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" v-if="outstockForm.type_id==4">
                                <el-form-item label="入库仓库：">
                                    <el-select v-model="outstockForm.original_id" clearable placeholder="请选择"
                                               class="col">
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
                                <el-form-item label="出库部门：">
                                    <el-select v-model="department" clearable placeholder="请选择" class="col">
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
                    </el-form>
                </el-col>
            </el-row>
            <el-row class='bg'>
                <el-col :span='22' :offset="1">
                    <div style='padding: 10px;padding-left: 0;'>
                        <el-button type="primary" style='width: 150px;' @click='show' v-if="outstockForm.warehouse_id">
                            选择物料
                        </el-button>
                    </div>
                    <el-table
                            :empty-text="text"
                            :data="tableDataI"
                            border
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
                        <el-table-column prop="title" label="物料名称" width="200">
                        </el-table-column>
                        <el-table-column
                                :formatter='props_valuesC'
                                prop="props_values"
                                label="规格"
                                min-width="120">
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
                                prop="store"
                                label="物料库存"
                                min-width="95">
                        </el-table-column>
                        <el-table-column label="出库数量" width="200">
                            <template slot-scope="props">
                                <el-input-number :min="0" :max="9999999" v-model="props.row.num"
                                                 style="width: 99%;"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column label="出库单价" width="95">
                            <template slot-scope="props">
                                <el-input v-model="props.row.price" style="width: 99%;"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="运费(选填)" width="120">
                            <template slot-scope="props">
                                <el-input v-model="props.row.post_fee" style="width: 99%;"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bn" label="物料货号" width="150">
                        </el-table-column>
                        <el-table-column prop="barcode" label="条码" min-width="180">
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
            <el-button type="primary"
                       style='width: 200px;margin: 20px;background:#FFF;color: black;border: 1px solid #ccc'
                       @click="getback">取消
            </el-button>
        </el-row>
    </section>
</template>
<script>
    import {
        getSkuList,
        getWareHousesList,
        getOutstocksDetail,
        editOutstock,
        getCategoriesList,
        getInstockType
    } from '../../api/api'
    export default {
        data() {
            return {
                filters: {
                    commodity_title: '',
                    cat_id: null,
                    bn: ""
                },
                outstockForm: {
                    warehouse_id: '',
                    outstock_bn: '',
                    type_id: '',
                    clasee: "",
                    original_id: ""
                },
                listLoading: false,
                tableDataI: [{}],
                tableDataII: [],
                rules: {
                    outstock_bn: [
                        {required: true, message: '请输入出库单自定义编号', trigger: 'blur'}
                    ]
                },
                cat_id: [],
                cat_ids: [],
                optionsx: [],
                defaultProps: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                page: 1,
                per_page: 10,
                total: 1,
                options: [],
                value: '',
                text: "请选择仓库",
                memo: "",
                bool: false,
                shop_name: "",
                instock: [],
                bools: false,
                val_outDate: "",
                out_date: "",
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                department: "",
                departments: [
                    {key:"技术部 ",val:1},{key:"设计部 ",val:2},
                    {key:"运营部 ",val:13},{key:"采购部 ",val:6},
                    {key:"销售部 ",val:7},{key:"财务部 ",val:8},
                    {key:"人事行政部 ",val:9},{key:"新媒体部 ",val:10},
                    {key:"物流仓储 ",val:11},{key: "渠道部 ", val: 12}
                ],
            }
        },
        computed: {
            production_date: function () {
                for (var i = 0; i < this.tableDataI.length; i++) {
                    this.production_date[i].push("");
                }
            },
        },
        created () {
//            出库类型列表
            var instockType = {io_type: "o"}
            getInstockType(instockType).then((res) => {
                this.instock = res.data;
            })
//            获取仓库列表
            getWareHousesList().then(res => {
                this.options = res.data.itemList
            }).catch(e => {
                console.log(e);
            });
//            获取分类列表
            getCategoriesList().then(res => {
                this.optionsx = res.data;
            }).catch(function (error) {
                console.log(error);
            });
//            获取出库单详情
            getOutstocksDetail(this.$route.query.outstock_id).then(res => {
                this.outstockForm.outstock_bn = res.data.outstock_bn;
                this.outstockForm.warehouse_id = res.data.warehouse_id;
                this.outstockForm.original_id = parseInt(res.data.original_id);
                this.outstockForm.type_id = res.data.type_id;
                this.department = res.data.department;
                this.memo = res.data.memo;
                this.tableDataI = res.data.items;
                if (res.data.out_date != "0000-00-00"){
                    this.val_outDate = res.data.out_date;
                }
            })
        },
        methods: {
            getback(){
                this.$router.push({
                    path: "/iostocks/outstocks/manager/list",
                    query: {criteria: this.$route.query.criteria}
                })
            },
            setOutDate(val){
                this.out_date = val
            },
            btnS(){
                if (this.bools) {
                    this.tableDataI = [];
                }
                if (this.outstockForm.warehouse_id) {
                    this.getSkuListes()
                    this.bools = true;
                    this.text = "请选择物料"
                } else {
                    this.text = "请选择仓库"
                }
            },
            subMit(){
                let params = {
                    outstock_bn: this.outstockForm.outstock_bn,
                    type_id: this.outstockForm.type_id,
                    warehouse_id: this.outstockForm.warehouse_id,
                    original_id: this.outstockForm.original_id,
                    department: this.department,
                    items: [],
                    memo: this.memo,
                    out_date: this.out_date
                }
                for (let j in this.tableDataI) {
                    params.items[j] = JSON.stringify({
                        sku_id: this.tableDataI[j].sku_id,
                        item_id: this.tableDataI[j].item_id,
                        bn: this.tableDataI[j].bn,
                        num: this.tableDataI[j].num,
                        price: this.tableDataI[j].price,
                        post_fee: this.tableDataI[j].post_fee
                    })
                }
                editOutstock(this.$route.query.outstock_id, params).then(res => {
                    if (res.error_code) {
                        this.$message.error(res.message)
                    } else {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.$router.replace('/iostocks/outstocks/manager/list')
                    }
                }).catch(e => {
                    console.log(e);
                })
            },
            removeItem(index){
                this.tableDataII.unshift(this.tableDataI[index])
                this.tableDataI.splice(index, 1)
            },
            addItemes(index){
                this.tableDataII[index].num = 1;
                this.tableDataII[index].post_fee = 0;
                this.tableDataI.push(this.tableDataII[index]);
                this.tableDataII.splice(index, 1);
            },
            getSkuListes(){
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    item_title: this.shop_name,
                    cat_id: this.cat_id,
                    warehouse_id: this.outstockForm.warehouse_id,
                    noAllStore: 1
                }
                getSkuList(parm).then((res) => {
                    this.tableDataII = res.data.skusList;
                    this.total = res.data.totalCount;
                    for (var i = 0; i < this.tableDataII.length; i++) {
                        for (var j = 0; j < this.tableDataI.length; j++) {
                            if (this.tableDataII[i].sku_id == this.tableDataI[j].sku_id) {
                                this.tableDataII.splice(i, 1)
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
                if (val.props_values) {
                    for (var i = 0; i < val.props_values.length; i++) {
                        str = val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
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
                $("#gg").css({overflow: "hidden", height: "810px"})
                this.bool = true;
            },
            hidden(){
                $("#gg").css({overflow: "", height: ""})
                this.bool = false;
            }
        }
    }
</script>