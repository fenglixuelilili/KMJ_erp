<template>
    <section class='bg' id="gg">
        <div v-if='bool' class='mengban'></div>
        <div v-if='bool' class='show'>
            <el-input v-model="shop_name" placeholder="物料名称" style='width: 200px'></el-input>
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
                <el-table-column prop="title" label="物料名称" min-width="150">
                </el-table-column>
                <el-table-column prop="sub_title" label="物料副标题" width="150">
                </el-table-column>
                <el-table-column prop="unit" label="单位" width="75">
                </el-table-column>
                <el-table-column prop="sku_store" label="库存" width="95">
                </el-table-column>
                <el-table-column prop="bn" label="物料货号" width="150">
                </el-table-column>
                <el-table-column prop="barcode" label="物料条码" width="150">
                </el-table-column>
                <el-table-column prop="memo" show-overflow-tooltip label="备注" min-width="180">
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
                        <el-table-column label="缩略图" width="100">
                            <template slot-scope="props">
                                <img :src="props.row.default_image" alt="" style="width:100%">
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="物料名称" min-width="150">
                        </el-table-column>
                        <el-table-column prop="sub_title" label="物料副标题" width="150">
                        </el-table-column>
                        <el-table-column prop="unit" label="单位" width="75">
                        </el-table-column>
                        <el-table-column prop="sku_store" label="库存" width="95">
                        </el-table-column>
                        <el-table-column label="零售价" min-width="95">
                            <template slot-scope="props">
                                <el-input v-model="props.row.retail_price" style="width: 99%;"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="保税价" width="95">
                            <template slot-scope="props">
                                <el-input v-model="props.row.bonded_price" style="width: 99%;"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="员工价" width="120">
                            <template slot-scope="props">
                                <el-input v-model="props.row.inside_price" style="width: 99%;"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bn" label="物料货号" width="150">
                        </el-table-column>
                        <el-table-column prop="barcode" label="物料条码" width="150">
                        </el-table-column>
                        <el-table-column prop="memo" show-overflow-tooltip label="备注" min-width="180">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <el-row class="bg" style='text-align: center;margin: 0;'>
            <el-button type="primary" style='width: 200px;margin: 20px;' @click='subMit'>保存</el-button>
            <el-button @click='$router.replace("/entity/categories/manage")' class="btnw">取消</el-button>
        </el-row>
    </section>
</template>
<script>
    import {getOfflineSkus, getCategoriesList, addOfflineItem, getDetailOffline} from "./../../api/api"
    export default{
        data(){
            return {
                tableDataI: [],
                tableDataII: [],
                bool: false,
                shop_name: "",
                cat_ids: [],
                cat_id: "",
                optionsx: [],
                defaultProps: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                per_page: 10,
                page: 1,
                total: 100,
            }
        },
        created(){
            getCategoriesList().then(res => {
                this.optionsx = res.data;
            }).catch(function (error) {
                console.log(error);
            });
            var parm = {
                cat_id: this.$route.query.cat_id,
                per_page: 9999
            }
            getDetailOffline(parm).then((res) => {
                this.tableDataI = res.data.data;
                for (let i = 0; i < this.tableDataI.length; i++) {
                    this.tableDataI[i].sku_store = this.tableDataI[i].stock
                }
            })
            this.getSkuListes();
        },
        methods: {
            subMit(){
                var parm = {
                    skus: []
                };
                for (let i = 0; i < this.tableDataI.length; i++) {
                    var obj = {};
                    obj.sku_id = this.tableDataI[i].sku_id;
                    obj.inside_price = this.tableDataI[i].inside_price;
                    obj.bonded_price = this.tableDataI[i].bonded_price;
                    obj.retail_price = this.tableDataI[i].retail_price;
                    for (let key in obj) {
                        if (obj[key]) {

                        } else {
                            this.$message.error("保税件，零售价，员工价皆不能为空")
                            return
                        }
                    }
                    parm.skus.push(obj)
                }
                parm.skus = JSON.stringify(parm.skus)
                addOfflineItem(this.$route.query.cat_id, parm).then((res) => {
                    console.log(res)
                    if (!res.error_code) {
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                        this.$router.replace("/entity/categories/manage")
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: res.message
                        });
                    }
                })
            },
            getSkuListes(){
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    item_title: this.shop_name,
                    cat_id: this.cat_id,
                    warehouse_id: 23,
                    noAllStore: 1
                }
                getOfflineSkus(this.$route.query.cat_id,parm).then((res) => {
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
            formatIStore(row) {
                return row.item_store ? row.item_store.store : 0;
            },
            props_valuesC(val){
                var str = '';
                for (var i = 0; i < val.props_values.length; i++) {
                    str = val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                }
                return str
            },
            removeItem(index){
                this.tableDataII.unshift(this.tableDataI[index])
                this.tableDataI.splice(index, 1)
            },
            addItemes(index){
                this.tableDataII[index].retail_price = 0;
                this.tableDataII[index].bonded_price = 0;
                this.tableDataII[index].inside_price = 0;
                this.tableDataI.push(this.tableDataII[index]);
                this.tableDataII.splice(index, 1);
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
            handleItemChange(val) {
                this.cat_id = val[this.cat_ids.length - 1]
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
