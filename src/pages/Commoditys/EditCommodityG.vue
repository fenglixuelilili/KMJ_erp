<template>
    <section class='bg' id="gg">
        <div v-if='bool' class='mengban'></div>
        <div v-if='bool' class='show'>
            <el-input v-model="sku_title" placeholder="商品名称" style='width: 200px'></el-input>
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
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;商品信息</h3>
            <el-row  class='bg' style="margin-top: 10px;">
                <el-col :span='21'>
                    <el-form label-width="120px" :rules="rules" :model="commodityForm" ref="commodityForm" style="width: 100%;">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="商品标题：">
                                    <el-input v-model="item_name" class='col'></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="销售货号：">
                                    <el-input v-model="item_id" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="销售平台：">
                            <el-checkbox-group v-model="platform">
                                <el-checkbox label="京东到家" name="type"></el-checkbox>
                                <el-checkbox label="百度外卖" name="type"></el-checkbox>
                                <el-checkbox label="美团外卖" name="type"></el-checkbox>
                                <el-checkbox label="饿了么" name="type"></el-checkbox>
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
                                label="缩略图"
                                min-width="100">
                            <template slot-scope="prop">
                                <img :src="prop.row.default_image" style="width: 100%;" alt="">
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="sub_title"
                                label="sku副标题"
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
                        <!--<el-table-column-->
                                <!--prop="sku_store"-->
                                <!--label="物料库存"-->
                                <!--min-width="95">-->
                        <!--</el-table-column>-->
                        <el-table-column label="数量" width="95">
                            <template slot-scope="props">
                                <el-input v-model="props.row.num" style="width: 99%;"></el-input>
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
            <el-button class="btnw" @click="$router.replace('/waimaiitems/manager/lists')">取消</el-button>
        </el-row>
    </section>
</template>

<script>
    //    import { getSkuList, addCommodity, getCategoriesList } from '../../api/api'
    import { getItemsList, getItemsDetails, editItems} from '../../api/api'
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
                sku_title: "",
                options: [],
                total: 200,
                page: 1,
                per_page: 10,
                memo: "",
                item_name: "",
                item_id: "",
                platform: [],
            }
        },
        created () {
            var parmI = {
                item_id: this.$route.query.item_id
            }
            getItemsDetails(this.$route.query.item_id,parmI).then((res)=>{
                this.item_name = res.data.item_name;
                this.item_id = res.data.item_id;
                this.memo = res.data.memo;
                if (res.data.platform){
                    var arr = res.data.platform.split(',');
                    for (var i = 0;i < arr.length - 1;i++){
                        switch (arr[i]){
                            case 'bd':
                                this.platform.push("百度外卖");
                                break;
                            case 'jddj':
                                this.platform.push("京东到家");
                                break;
                            case 'meituan':
                                this.platform.push("美团外卖");
                                break;
                            case 'eleme':
                                this.platform.push("饿了么");
                                break;
                        }
                    }
                }
                this.tableDataI = res.data.skus;
            })
            this.getSkusList();
        },
        methods: {
            getSkusList() {
                var parm = {
                    warehouse_id: this.house,
                    page: this.page,
                    per_page: this.per_page,
                    sku_title: this.sku_title,
                }
                getItemsList(parm).then((res)=>{
                    this.tableDataII = res.data.skusList;
                    this.total = res.data.totalCount;
                    for(var i = 0;i < this.tableDataII.length;i++){
                        for (var j = 0;j < this.tableDataI.length;j++){
                            if (this.tableDataII[i].sku_id==this.tableDataI[j].sku_id){
                                this.tableDataII.splice(i,1)
                            }
                        }
                    }
                })
            },
            subMit(){
                if (this.item_id==""){
                    this.$notify.error({
                        title: '错误',
                        message: '请填写销售货号'
                    });
                    return;
                }
                var items = [];
                for (var i = 0;i < this.tableDataI.length;i++){
                    var obj = {};
                    obj.sku_id = this.tableDataI[i].sku_id;
                    obj.num = this.tableDataI[i].num;
                    items.push(obj);
                }
                var arr = "";
                for (var i = 0;i < this.platform.length;i++){
                    switch (this.platform[i]){
                        case "百度外卖":
                            arr += 'bd,';
                            break;
                        case "京东到家":
                            arr += 'jddj,';
                            break;
                        case "美团外卖":
                            arr += 'meituan,';
                            break;
                        case "饿了么":
                            arr += 'eleme,';
                            break;
                    }
                }
                var parm = {
                    item_id: this.item_id,
                    item_name: this.item_name,
                    skus: items,
                    platform: arr,
                    memo: this.memo
                }
                editItems(this.$route.query.item_id,parm).then((res)=>{
                    this.$notify.info({
                        message: res.message
                    });
                    if (res.status_code == 200){
                        this.$router.replace('/waimaiitems/manager/lists')
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
            handleItemChange(val) {
                this.cat_id = val[this.cat_ids.length - 1]
            },
            props_valuesC(val){
                var str = '';
                if (val.props_values){
                    for(var i = 0; i < val.props_values.length;i++){
                        str =  val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                    }
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
