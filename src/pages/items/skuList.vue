<template>
    <section>
        <HS></HS>
        <el-row style='margin-top: 20px;'>
            <el-col :span="2" class='ptc'>
                <span style='margin-left: 30px'>筛选条件</span>
            </el-col>
            <el-col :span="22">
                <el-form :model="filters" label-width="120px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="sku标题：" class="hspace">
                                <el-input v-model="filters.item_title" placeholder="请输入sku名称" class='col'
                                          :size="size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="sku货号：" class="hspace">
                                <el-input v-model="filters.sku_outer_id" placeholder="请输入sku货号" class='col'
                                          :size="size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="sku条码：" class="hspace">
                                <el-input v-model="filters.barcode" placeholder="请输入sku条码" class='col'
                                          :size="size"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="$store.state.isPackUp">
                        <el-col :span="8">
                            <el-form-item label="仓库：">
                                <el-select placeholder="请选择仓库" clearable v-model="whereHouse" class='col' :size="size">
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
                            <el-form-item label="物料分类：">
                                <el-cascader placeholder="物料分类" clearable class='col' v-model="cl" :size="size"
                                             @change="handleItemChange" :props="defaultProps" :options="classes"
                                             filterable>
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="sku库存：">
                                <el-input v-model="sku_store_min" style="width: 30%;" :size="size"></el-input>
                                <p style="width: 8%;text-align: center;display: inline-block;box-sizing: border-box">
                                    -</p>
                                <el-input v-model="sku_store_max" style="width: 30%;" :size="size"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="cb">
                        <el-col :span="24">
                            <el-button type="primary" v-on:click="getItems" class="btnw" :size="size">查询</el-button>
                            <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24"
                    style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                <el-button type="primary" @click="educe" class="btnw" :size="size">导出</el-button>
                <el-button type="primary" @click="handleAdd" class="btnw" :size="size">新增</el-button>
            </el-col>
        </el-row>
        <!--</el-col>-->
        <!-- 列表 -->
        <template>
            <el-table
                    v-loading="isLoading"
                    :data="items"
                    border
                    style="width: 100%"
                    class="geFontSize_list">
                <el-table-column
                        prop="title"
                        label="sku标题"
                        min-width="130">
                </el-table-column>
                <el-table-column label="缩略图" min-width="100">
                    <template slot-scope="props">
                        <img :src="props.row.default_image" alt="" style="width:100%" v-if="props.row.default_image">
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sub_title"
                        label="副标题"
                        min-width="130">
                </el-table-column>
                <el-table-column
                        prop="props_values"
                        label="规格"
                        :formatter="formateProps"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        min-width="85">
                </el-table-column>
                <el-table-column
                        prop="sku_store"
                        label="库存"
                        min-width="65">
                </el-table-column>
                <el-table-column prop="warehouse_name" label="所在仓库" min-width="170">
                    <template slot-scope="props">
                        <elliptical :message="props.row.warehouse_name" :length="8"></elliptical>
                    </template>
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
        </template>
        <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
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
    import {
        getItemsListPage,
        removeItem,
        editUser,
        addUser,
        getWareHousesList,
        getCategoriesList,
        getSkuList
    } from '../../api/api';
    import {checkLogin} from '../../api/checkLogin'
    export default {
        data() {
            return {
                filters: {
                    item_title: '',
                    item_outer_id: '',
                    sku_outer_id: '',
                    cat_id: "",
                    barcode: ""
                },
                items: [],
                total: 0,
                page: 1,
                per_page: 10,
                currentPage: 1,
                listLoading: false,
                options: [],
                classes: [],
                whereHouse: "",
                cl: [],
                defaultProps: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                skusList: [],
                isLoading: false,
                sku_store_min: "",
                sku_store_max: "",
                size: ""
            }
        },
        created() {
            this.size = this.$store.state.size;
            this.getItems();
            this.getStore();
            this.getClasses();
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
            educe(){
                window.open(`${this.$store.state.urlBackstageApi}/skus/exportLists?access_token=${sessionStorage.getItem('access_token')}&store_max=${this.sku_store_max}&store_min=${this.sku_store_min}&cat_id=${this.filters.cat_id}&sku_title=${this.filters.item_title}&warehouse_id=${this.whereHouse}&bn=${this.filters.sku_outer_id}&barcode=${this.filters.barcode}`)
            },
            reLoad(){
                this.filters.item_title = "";
                this.cl = [];
                this.whereHouse = "";
                this.filters.sku_outer_id = "";
                this.filters.barcode = "";
                this.filters.cat_id = "";
                this.sku_store_min = "";
                this.sku_store_max = "";
            },
            getStore(){
                getWareHousesList().then((res) => {
                    this.options = res.data.itemList;
                })
            },
            getClasses(){
                getCategoriesList().then((res) => {
                    this.classes = res.data;
                })
            },
            handleItemChange(val) {
                this.filters.cat_id = val[val.length - 1];
            },
            formatStore(row) {
                if (row.sku_store.length > 0) {
                    return row.sku_store[0].store;
                } else {
                    return 0
                }
            },
            formatIStore(row) {
                return row.item_store ? row.item_store.store : 0;
            },
            formateProps(row, column) {
                let str = ''
                for (let i in row.props_values) {
                    str += row.props_values[i].prop_name + ':' + row.props_values[i].prop_value + ' '
                }
                return str
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getItems();
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.getItems();
            },
            //获取物料列表
            getItems() {
                this.isLoading = true;
                let para = {
                    page: this.page,
                    per_page: this.per_page,
                    sku_title: this.filters.item_title,
                    bn: this.filters.sku_outer_id,
                    barcode: this.filters.barcode,
                    cat_id: this.filters.cat_id,
                    warehouse_id: this.whereHouse,
                    store_min: this.sku_store_min,
                    store_max: this.sku_store_max,
                };
                this.listLoading = true;
                NProgress.start();
                getSkuList(para).then((res) => {
                    this.isLoading = false;
                    checkLogin(res, this);
                    this.total = res.data.totalCount;
                    this.items = res.data.skusList;
                    this.listLoading = false;
                    NProgress.done();
                });
            },
            //显示新增界面
            handleAdd: function () {
                this.$router.replace('/items/manager/add')
            }
        }
    }
</script>