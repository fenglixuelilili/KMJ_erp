<template>
    <section class='bg' id="gg">
        <div v-if='bool' class='mengban'></div>
        <div v-if='bool' class='show'>
            <el-input v-model="shop_name" placeholder="物料名称" style='width: 200px'></el-input>
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
                        label="期末结存"
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
                <el-button style="margin:10px;margin-left: 0;" @click="addAll"  type="primary">全部添加</el-button>
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
                    <el-form label-width="140px" :rules="rules" :model="outstockForm" ref="outstockForm" style="width: 100%;">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="盘点单号：" prop="inventory_bn">
                                    <el-input v-model="outstockForm.inventory_bn" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="盘点仓库：" prop="warehouse_id">
                                    <el-select v-model="outstockForm.warehouse_id" clearable placeholder="请选择" @change="btnS" class="col">
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
                                <el-form-item label="盘点员：" prop="operator">
                                    <el-input v-model="outstockForm.operator" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="盘点日期：" required>
                                    <el-date-picker
                                            class="col"
                                            v-model="outstockForm.inventory_date"
                                            type="date"
                                            @change="setInventoryDate"
                                            placeholder="选择日期"
                                            :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="库存截止时间：" required>
                                    <el-date-picker
                                            class="col"
                                            v-model="outstockForm.stock_deadline"
                                            @change="setStockDeadline"
                                            type="datetime"
                                            placeholder="选择日期时间">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class='bg'>
                <el-col :span='22' :offset="1">
                    <div style='padding: 10px;padding-left: 0;'>
                        <el-button type="primary" style='width: 150px;' @click='show' v-if="outstockForm.warehouse_id">选择物料</el-button>
                    </div>
                    <el-table
                            :empty-text="text"
                            :data="tableDataI"
                            border
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
                                prop="sku_store"
                                label="期末结存"
                                min-width="95">
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
            <el-row class="bg" style="padding-top: 20px;">
                <el-col :span="22" :offset="1">
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
            <el-button type="primary" class="btnw" @click='subMit'>保存</el-button>
            <el-button class="btnw" @click='$router.replace("/warehouses/inventory/list")'>取消</el-button>
        </el-row>
    </section>
</template>
<script>
    import { getSkuList, getWareHousesList, getCategoriesList, addIncentory, getPredefined } from '../../api/api'
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
                    inventory_bn: '',
                    operator: '',
                    inventory_date: '',
                    stock_deadline: '',
                },
                inventory_date: "",
                stock_deadline: "",
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                listLoading: false,
                tableDataI:[],
                tableDataII: [],
                rules: {
                    inventory_bn: [{ required: true, message: '请输入盘点单号', trigger: 'blur' }],
                    warehouse_id: [{ required: true, message: '请选择盘点仓库', trigger: 'blur' }],
                    operator: [{ required: true, message: '请添加盘点员', trigger: 'blur' }]
                },
                cat_id: [],
                cat_ids: [],
                optionsx: [],
                defaultProps: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                page: 1,
                per_page: 20,
                total: 1,
                options: [],
                value: '',
                text: "请选择仓库",
                memo: "",
                bool: false,
                shop_name: "",
            }
        },
        created () {
            var parm = {
                module: "inventories"
            }
            getPredefined(parm).then((res)=>{
                this.outstockForm.inventory_bn = res.data.bn
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
            }).catch(function(error) {
                console.log(error);
            });
        },
        methods: {
            setInventoryDate(val){
                this.inventory_date = val;
            },
            setStockDeadline(val){
                this.stock_deadline = val;
            },
            btnS(){
                this.tableDataI = [];
                this.cat_ids = [];
                this.cat_id = "";
                this.shop_name = "";
                if(this.outstockForm.warehouse_id) {
                    this.getSkuListes()
                    this.text = "请选择物料"
                }else{
                    this.text = "请选择仓库"
                }
            },
            subMit(){
                let params = {
                    inventory_bn: this.outstockForm.inventory_bn,
                    warehouse_id: this.outstockForm.warehouse_id,
                    operator: this.outstockForm.operator,
                    inventory_date: this.inventory_date,
                    stock_deadline: this.stock_deadline,
                    items: this.tableDataI,
                    memo: this.memo,
                }
                for (let key in params){
                    if (params[key]==""){
                        if (key!="memo"){
                            var str = "";
                            switch (key){
                                case 'inventory_bn':
                                    str = "盘点单号";
                                    break;
                                case 'warehouse_id':
                                    str = "盘点仓库";
                                    break;
                                case 'operator':
                                    str = "盘点员";
                                    break;
                                case 'inventory_date':
                                    str = "盘点日期";
                                    break;
                                case 'stock_deadline':
                                    str = "库存截止时间";
                                    break;
                                case 'items':
                                    str = "盘点物料";
                                    break;
                            }
                            this.$notify.error({
                                title: '错误',
                                message: str+"不能为空"
                            });
                            return;
                        }
                    }
                }
                addIncentory(params).then((res)=>{
                    if (res.error_code){
                        this.$message(res.message);
                    }else {
                        this.$message("添加成功");
                        this.$router.replace('/warehouses/inventory/list')
                    }
                })
            },
            removeItem(index){
                this.tableDataII.unshift(this.tableDataI[index])
                this.tableDataI.splice(index,1)
            },
            addItemes(index){
                this.tableDataI.push(this.tableDataII[index])
                this.tableDataII.splice(index,1)
            },
            addAll(){
                var parm = {
                    per_page: 999999,
                    item_title: this.shop_name,
                    cat_id: this.cat_id,
                    warehouse_id: this.outstockForm.warehouse_id,
                    noAllStore: 1
                }
                getSkuList(parm).then((res)=>{
                    this.tableDataI = res.data.skusList;
                    for(var i = 0;i < this.tableDataII.length;i++){
                        for (var j = 0;j < this.tableDataI.length;j++){
                            if (this.tableDataII[i].sku_id==this.tableDataI[j].sku_id){
                                this.tableDataII.splice(i,1)
                            }
                        }
                    }
                })
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
                for(var i = 0; i < val.props_values.length;i++){
                    str =  val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                }
                return str
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
            }
        }
    }
</script>