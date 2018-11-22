<template>
    <section class='bg' id="gg">
        <div v-if='bool' class='mengban'></div>
        <div v-if='bool' class='show'>
            <el-input v-model="shop_name" placeholder="在售商品名称" style='width: 200px'></el-input>
            <el-cascader placeholder="物料分类" @change="handleItemChange" v-model='cat_ids' :props="defaultProps" :options="options" clearable filterable>
            </el-cascader>
            <el-button type="primary" style='width: 150px' @click='getSkusList'>查询</el-button>
            <div id="close" @click="hidden">×</div>
            <!--列表-->
            <el-table
                    :data="tableDataII"
                    border
                    height="500"
                    style="width: 100%;margin-top: 20px;">
                <el-table-column
                        label="操作"
                        min-width="70">
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
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        min-width="75">
                </el-table-column>
                <el-table-column
                        prop="sku_store"
                        label="物料库存"
                        min-width="95">
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
                    <el-form label-width="120px" :rules="rules" :model="commodityForm" ref="commodityForm" style="width: 100%;">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="商品标题" prop="commodity_title">
                                    <el-input v-model="commodityForm.commodity_title" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="销售货号" prop="commodity_bn">
                                    <el-input v-model="commodityForm.commodity_bn" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="销售平台" prop="platform">
                            <el-checkbox-group v-model="commodityForm.platform">
                                <el-checkbox label="京东" name="type"></el-checkbox>
                                <el-checkbox label="淘宝" name="type"></el-checkbox>
                                <el-checkbox label="天猫" name="type"></el-checkbox>
                                <el-checkbox label="快买酒商城" name="type"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class='bg'>
                <el-col :span='22' :offset="1">
                    <div style='padding: 10px;padding-left: 0;'>
                        <el-button type="primary" style='width: 150px;' @click='show'>选择物料</el-button>
                    </div>
                    <el-table
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
                        <el-table-column
                                prop="title"
                                label="物料名称"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                :formatter='props_valuesC'
                                prop="props_values"
                                label="规格"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                prop="weight"
                                label="重量(kg)"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="unit"
                                label="单位"
                                min-width="75">
                        </el-table-column>
                        <el-table-column label="销售数量" width="200">
                            <template slot-scope="props">
                                <el-input-number :min="1" :max="9999" v-model="props.row.num" style="width: 99%;"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否为赠品" width="120">
                            <template slot-scope="props">
                                <el-switch v-model="props.row.is_gift" on-text="" off-text=""></el-switch>
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
            <el-button type="primary" class="btnw" @click="subMit">保存</el-button>
            <el-button type="primary" class="btnw" @click="$router.replace('/items/commodity/manager/list')">取消</el-button>
        </el-row>
    </section>
</template>

<script>
    import { getPredefined, getSkuList, addCommodity, getCategoriesList } from '../../api/api'
    export default {
        data () {
            return {
                defaultProps: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                cat_id: '',
                cat_ids: [],
                commodityForm: {
                    commodity_title:'',
                    commodity_bn: '',
                    platform: [],
                },
                rules: {
                    commodity_title: [
                        { required: true, message: '请输入商品标题', trigger: 'blur' }
                    ],
                    commodity_bn: [
                        { required: true, message: '请输入销售货号', trigger: 'blur' }
                    ],
                    platform: [
                        { type: 'array', required: true, message: '请至少选择一个平台', trigger: 'change' }
                    ]
                },
                tableDataI: [],
                tableDataII: [],
                num: 1,
                radio: "",
                textarea: "",
                bool: false,
                shop_name: "",
                options: [],
                total: 200,
                page: 1,
                per_page: 10,
                memo: ""
            }
        },
        created () {
            var parm = {
                module: "commodities"
            }
            getPredefined(parm).then((res)=>{
                this.commodityForm.commodity_bn = res.data.bn
            })
            this.getSkusList();
            let that = this;
            getCategoriesList()
                .then(function(response) {
                    that.options = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        methods: {
            getSkusList() {
                let params = {
                    item_title: this.shop_name,
                        cat_id: this.cat_id,
                        page: this.page,
                        per_page: this.per_page
                    },
                    that = this;
                getSkuList(params)
                    .then(res => {
                        let skusList = res.data.skusList;
                        for (let i in skusList) {
                            skusList[i].num = 0;
                            skusList[i].is_gift = false;
                        }
                        that.tableDataII = skusList
                        that.total = res.data.totalCount;
                        for(var i = 0;i < this.tableDataII.length;i++){
                            for (var j = 0;j < this.tableDataI.length;j++){
                                if (this.tableDataII[i].sku_id==this.tableDataI[j].sku_id){
                                    this.tableDataII.splice(i,1)
                                }
                            }
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },
            subMit(){
                let parm = {
                    commodity_title: this.commodityForm.commodity_title,
                    commodity_bn: this.commodityForm.commodity_bn,
                    platform: '',
                    items: [],
                    memo: this.memo
                }
                for (let i = 0; i < this.commodityForm.platform.length; i++) {
//                    parm.platform += (this.commodityForm.platform[i] === '京东' ? 'jd' : this.commodityForm.platform[i] === "天猫" ? "tm" : "tb") + ',';
                    parm.platform += (this.commodityForm.platform[i] === '京东' ? 'jd' : this.commodityForm.platform[i] === "天猫" ? "tm" : this.commodityForm.platform[i] === "快买酒商城" ? "kmjiu" : "tb" ) + ',';
                }
                for (let j in this.tableDataI) {
                    parm.items[j] = JSON.stringify({
                        sku_id: this.tableDataI[j].sku_id,
                        num: this.tableDataI[j].num,
                        is_gift: this.tableDataI[j].is_gift ? 1 : 0
                    })
                }
                addCommodity(parm).then((res)=>{
                    if(res.error_code) {
                        this.$message.error(res.message)
                    } else {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.$router.replace('/items/commodity/manager/list')
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
                if(this.tableDataI.length > 0){
                    for (let i in this.tableDataI){
                        this.tableDataI[i].num = 1;
                        this.tableDataI[i].post_fee = 0;
                    }
                }
                console.log(this.tableDataI)
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
                this.getSkusList();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getSkusList();
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
