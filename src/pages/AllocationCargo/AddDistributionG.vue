<template>
    <section class='bg' id="gg">
        <div v-if='bool' class='mengban'></div>
        <div v-if='bool' class='show'>
            <el-input v-model="shop_name" placeholder="在售商品名称" style='width: 200px'></el-input>
            <el-cascader placeholder="物料分类" @change="handleItemChange" v-model='cat_ids' clearable :props="defaultProps" :options="optionsx" filterable>
            </el-cascader>
            <el-button type="primary" style='width: 150px' @click='getBlanks'>查询</el-button>
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
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;配货单信息</h3>
            <el-row  class='bg' style="margin-top: 10px;">
                <el-col :span='21'>
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="配送单号：">
                                    <el-input v-model="ob_bn" placeholder="请输入单号" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="配送日期：">
                                    <el-date-picker
                                            class="col"
                                            v-model="start_dates"
                                            type="date"
                                            placeholder="请输入配送日期"
                                            @change="change">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="收货店铺：">
                                    <el-select v-model="shop" filterable clearable placeholder="请选择店铺" class="col">
                                        <el-option
                                                v-for="item in options"
                                                :label="item.store_name"
                                                :value="item.waimaistore_id"
                                                :key="item.waimaistore_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                       <el-row>
                           <el-col :span="8">
                               <el-form-item label="出货仓库：">
                                   <el-select v-model="house" filterable clearable placeholder="请选择仓库" @change="clearT" class="col">
                                       <el-option
                                               v-for="item in optionsI"
                                               :label="item.warehouse_name"
                                               :value="item.warehouse_id"
                                               :key="item.warehouse_id">
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
                    <div style='padding: 10px;padding-left: 0;' v-if="house">
                        <el-button type="primary" style='width: 150px;' @click='show'>选择物料</el-button>
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
        <el-row class="bg" style='text-align: center;margin: 0;'>
            <el-button type="primary" style='width: 200px;margin: 20px;' @click='subMit'>保存</el-button>
            <el-button type="primary" style='width: 200px;margin: 20px;background:#FFF;color: black;border: 1px solid #ccc' @click='re'>取消</el-button>
        </el-row>
    </section>
</template>

<script>
    import { storeList, addDetailsBlanks, getwarehouse, getItemsList, getCategoriesList, getPredefined, getDetailsBlanks} from '../../api/api'
    export default {
        data () {
            return {
                defaultProps: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                cat_id: '',
                cat_ids: [],
                form: {
                    supplier_id: "",
                    people: "",
                    po_bn: "",
                },
                tableDataI: [],
                tableDataII: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                bool: false,
                shop_name: "",
                optionsx: [],
                total: 200,
                page: 1,
                per_page: 20,
                transit: [],
                shop: "",
                house: "",
                options: [],
                optionsI: [],
                num: null,
                ob_bn: "",
                start_date: "",
                start_dates: "",
                operator: "",
                text: '请选择仓库',
                bol: true
            }
        },
        created () {
            var parm = {
                module: "waimai_order_blanks"
            }
            getPredefined(parm).then((res)=>{
                this.ob_bn = res.data.bn
            })
            getCategoriesList().then(res => {
                this.optionsx = res.data;
            }).catch(e => {
                console.log(e);
            });
            var parm = {per_page:99999};
            storeList(parm).then((res)=>{
                this.options = res.data.storesList;
            })
            getwarehouse(parm).then((res)=>{
                this.optionsI = res.data.itemList;
            })
            if (this.$route.query.ob_id){
                let parms = { ob_id:this.$route.query.ob_id }
                getDetailsBlanks(this.$route.query.ob_id,parms).then((res)=>{
                    this.tableDataI = res.data.items;
                    for (let i = 0;i < this.tableDataI.length;i++){
                        this.tableDataI[i].sku_store = NaN;
                        this.tableDataI[i].title = this.tableDataI[i].sku_title
                    }
                })
            }
        },
        methods:{
            clearT(){
                this.cat_id = "";
                if (this.bol){
                    this.bol = false;
                    let parm = {
                        warehouse_id: this.house,
                        per_page: 999999,
                        noAllStore: 1
                    }
                    if (this.house){
                        getItemsList(parm).then((res)=>{
                            let list = res.data.skusList;
                            let num = 0;
                            for(var i = 0;i < list.length;i++){
                                for (var j = 0;j < this.tableDataI.length;j++){
                                    if (list[i].sku_id == this.tableDataI[j].sku_id){
                                        ++num;
                                        this.$set(this.tableDataI[j],"sku_store",list[i].sku_store);
                                    }
                                }
                            }
                            if (num != this.tableDataI.length){
                                this.tableDataI = [];
                            }else {
                                this.tableDataI.push()
                            }
                        })
                    }
                }else {
                    this.tableDataI = [];
                }
                this.getBlanks();
            },
            change(val){
                this.start_date = val;
            },
            re(){
                this.$router.replace('/waimai_stocks/od/lists')
            },
            subMit(){
                var items = [];
                for (var i = 0;i < this.tableDataI.length;i++){
                    var obj = {};
                    obj.sku_id = this.tableDataI[i].sku_id;
                    obj.item_id = this.tableDataI[i].item_id;
                    obj.num = this.tableDataI[i].num;
                    items.push(obj);
                }
                var parm = {
                    ob_bn: this.ob_bn,
                    warehouse_id: this.house,
                    waimaistore_id: this.shop,
                    start_date: this.start_date,
                    operator: this.operator,
                    items: items
                }
                addDetailsBlanks(parm).then((res)=>{
                    this.$notify.info({
                        message: res.message
                    });
                    if (res.status_code == 200){
                        this.$router.replace('/waimai_stocks/od/lists')
                    }
                })
            },
            removeItem(index){
                this.tableDataII.unshift(this.tableDataI[index])
                this.tableDataI.splice(index,1)
            },
            addItemes(index){
                this.$set(this.tableDataII[index],"num",1)
                this.tableDataI.push(this.tableDataII[index])
                this.tableDataII.splice(index,1)
            },
            getBlanks(){
                var parm = {
                    warehouse_id: this.house,
                    page: this.page,
                    per_page: this.per_page,
                    item_title: this.shop_name,
                    cat_id: this.cat_id,
                    noAllStore: 1
                }
                if(this.house){
                    this.text = "请选择物料"
                    getItemsList(parm).then((res)=>{
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
                }

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
                this.getBlanks();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getBlanks();
                return;
            },
            show(){
                $("#gg").css({overflow:"hidden",height:"810px"})
                this.bool = true;
            },
            hidden(){
                $("#gg").css({overflow:"",height:""})
                this.bool = false;
                this.shop_name = "";
                this.cat_ids = [];
            }
        }
    }
</script>