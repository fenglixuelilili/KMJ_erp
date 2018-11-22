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
                                <el-form-item label="入库单号：" prop="instock_bn">
                                    <el-input v-model="instockForm.instock_bn" placeholder="请输入入库编号" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="入库店铺：">
                                    <el-select v-model="instockForm.waimaistore_id" @change="clear" filterable clearable placeholder="请选择入库店铺" class="col">
                                        <el-option
                                                v-for="item in store"
                                                :label="item.store_name"
                                                :value="item.waimaistore_id"
                                                :key="item.waimaistore_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="入库类型：">
                                <el-col :span="18">
                                    <el-select v-model="instockForm.type_id" placeholder="请选择入库类型" clearable style="width: 30%;">
                                        <el-option
                                                v-for="item in instock"
                                                :label="item.type_name"
                                                :value="item.type_id"
                                                :key="item.type_id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-if="instockForm.type_id==1" v-model="purchase" @change="getAllDistribute" placeholder="请选择配送单号" filterable clearable style="width: 40%;">
                                        <el-option
                                                v-for="item in order"
                                                :label="item.ob_bn"
                                                :value="item.ob_id"
                                                :key="item.ob_id">
                                        </el-option>
                                    </el-select>
                                </el-col>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class='bg'>
                <el-col :span='22' :offset="1">
                    <div style='padding: 10px;padding-left: 0;'>
                        <el-button type="primary" style='width: 150px;' @click='show' v-if="instockForm.type_id!=1">选择物料</el-button>
                    </div>
                    <el-table
                            v-show="instockForm.type_id!=1"
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
                        <el-table-column label="入库数量" width="200">
                            <template slot-scope="props">
                                <el-input-number :min="1" :max="99999999999999" v-model="props.row.num" style="width: 99%;"></el-input-number>
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
                            empty-text="请选择配货单号"
                            v-show="instockForm.type_id==1"
                            :data="allocation"
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
                        <el-table-column
                                prop="sku_title"
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
                                prop="unit"
                                label="单位"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="sku_store"
                                label="物料库存"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                min-width="95"
                                label="配送数量">
                            <template slot-scope="scope">
                                <el-input v-model.number="scope.row.num" placeholder="请输入数量"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="weight"
                                label="重量(kg)"
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
            <el-button type="primary" style='width: 200px;margin: 20px;background:#FFF;color: black;border: 1px solid #ccc' @click='$router.replace("/waimai_stocks/instocks/lists")'>取消</el-button>
        </el-row>
    </section>
</template>
<script>
    import { getSkuList, getCategoriesList, getWinstockType, addWinstock, WstoreList, getOrderBlanks, getDetailsBlanks, getPredefined, WinstockDetail} from '../../api/api'
    export default {
        data () {
            return {
                cat_id: '',
                cat_id: [],
                cat_ids: [],
                defaultProps: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                optionsx: [],
                instockForm: {
                    waimaistore_id: '',
                    instock_bn:'',
                    type_id: ""
                },
                listLoading: false,
                tableDataI:[],
                tableDataII: [],
                rules: {
                    instock_bn: [
                        { required: true, message: '请输入入库单自定义编号', trigger: 'blur' }
                    ]
                },
                page: 1,
                total: 1,
                per_page: 20,
                store: [],
                value: '',
                memo: "",
                instock: [],
                bool: false,
                shop_name: "",
                order: [],
                purchase: "",
                allocation: [],
                bools: true
            }
        },
        created () {
            var parm = {
                module: "waimai_instocks"
            }
            getPredefined(parm).then((res)=>{
                this.instockForm.instock_bn = res.data.bn
            })
//            获取分类列表
            getCategoriesList().then(res => {
                this.optionsx = res.data;
            }).catch(function(error) {
                console.log(error);
            });

            var instockParm = {
                io_type: "i"
            }
            getWinstockType(instockParm).then((res)=>{
                this.instock = res.data
            })

            var storeParm = {
                per_page:99999
            }
            WstoreList(storeParm).then((res)=>{
                this.store = res.data.storesList;
            })
            getOrderBlanks(storeParm).then((res)=>{
                this.order = res.data.storesList;
            })

            if (this.$route.query.instock_id) {
                WinstockDetail(this.$route.query.instock_id).then((res)=>{
                    this.tableDataI = res.data.items;
                })
            }
            //获取sku列表
            this.getSkuListes();
        },
        methods: {
            clear(){
                var storeParm = {
                    per_page:99999,
                    waimaistore_id: this.instockForm.waimaistore_id
                }
                getOrderBlanks(storeParm).then((res)=>{
                    this.order = res.data.storesList;
                    if(res.data.storesList.length){
                        for (let i in res.data.storesList){
                            if (res.data.storesList[i].ob_id==this.purchase){
                                this.bools = false;
                            }
                        }
                    }else{
                        this.purchase = "";
                    }
                }).then(()=>{
                    if (this.bools){
                        this.purchase = "";
                    }else{
                        this.bools = true;
                    }
                })
            },
            getAllDistribute(){
                if (!this.purchase){return}
                var parm = {ob_id: this.purchase}
                getDetailsBlanks(this.purchase,parm).then((res)=>{
                    this.allocation = res.data.items
                    this.instockForm.waimaistore_id = res.data.store.waimaistore_id
                })
            },
            subMit(){
                let params = {
                    instock_bn: this.instockForm.instock_bn,
                    type_id: this.instockForm.type_id,
                    store_id: this.instockForm.waimaistore_id,
                    items: [],
                    memo: this.memo,
                    post_bn: this.purchase,
                }
                if (this.instockForm.type_id!=1){
                    for (let j in this.tableDataI) {
                        params.items[j] = JSON.stringify({
                            sku_id: this.tableDataI[j].sku_id,
                            item_id: this.tableDataI[j].item_id,
                            bn: this.tableDataI[j].bn,
                            num: this.tableDataI[j].num,
                        })
                    }
                }else{
                    params.items = this.allocation;
                }
                addWinstock(params).then((res)=>{
                    if(!res.error_code){
                        this.$message("保存成功")
                        this.$router.replace("/waimai_stocks/instocks/lists")
                    }else {
                        this.$message(res.message)
                    }
                })
            },
            removeItem(index){
                this.tableDataII.unshift(this.tableDataI[index])
                this.tableDataI.splice(index,1)
            },
            addItemes(index){
                this.tableDataII[index].num = 1;
                this.tableDataI.push(this.tableDataII[index])
                this.tableDataII.splice(index,1)
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
                    let skusList = res.data.skusList;
                    for (let i in skusList) {
                        skusList[i].num = 0;
                    }
                    this.total = res.data.totalCount;
                    this.tableDataII = skusList;
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
            }
        }
    }
</script>