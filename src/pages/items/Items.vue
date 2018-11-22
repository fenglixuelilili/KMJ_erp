<template>
    <section>
        <HS></HS>
        <!--工具条-->
        <el-row style="margin-top: 20px;">
            <el-col :span="2" class='ptc'>
                <span style='margin-left: 30px'>筛选条件</span>
            </el-col>
            <el-col :span="22">
                <el-form :model="filters" label-width="120px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="物料标题：" class="hspace">
                                <el-input v-model="filters.item_title" placeholder="请输入物料标题" class="col" :size="size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物料编号：" class="hspace">
                                <el-input v-model="filters.item_outer_id" placeholder="请输入物料编号" class="col" :size="size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物料条码：" class="hspace">
                                <el-input v-model="filters.barcode" placeholder="请输入物料条码" class="col":size="size"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row  v-if="$store.state.isPackUp">
                        <el-col :span="8">
                            <el-form-item label="物料分类：">
                                <el-cascader class="col" placeholder="请选择物料分类" clearable v-model="cl" :size="size"
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
                    <el-row>
                        <el-col :span="24" class='cb'>
                            <el-button type="primary" class="btnw" @click="getItems" :size="size">查询</el-button>
                            <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24"
                    style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                <el-button type="primary" class="btnw" @click="handleAdd" :size="size">新增</el-button>
            </el-col>
        </el-row>
        <!--列表-->
        <template>
            <el-table :data="items" border highlight-current-row v-loading="listLoading" style="width: 100%;" class="geFontSize_list">
                <el-table-column type="expand" width="30">
                    <template slot-scope="props">
                        <el-table
                                :data="props.row.skus"
                                border
                                empty-text="该物料下暂无sku信息"
                                style="width: 100%"
                                class="geFontSize_list">
                            <el-table-column
                                    prop="title"
                                    label="sku标题"
                                    min-width="150">
                            </el-table-column>
                            <el-table-column
                                    prop="sub_title"
                                    label="副标题"
                                    min-width="150">
                            </el-table-column>
                            <el-table-column
                                    prop="props_values"
                                    :formatter="formateProps"
                                    label="规格"
                                    min-width="130">
                            </el-table-column>
                            <el-table-column
                                    prop="weight"
                                    label="重量(kg)"
                                    min-width="95">
                            </el-table-column>
                            <el-table-column
                                    prop="store"
                                    :formatter="formatStore"
                                    label="库存"
                                    min-width="95">
                            </el-table-column>
                            <el-table-column
                                    prop="barcode"
                                    label="条码"
                                    min-width="150">
                            </el-table-column>
                            <el-table-column
                                    prop="bn"
                                    label="货号"
                                    min-width="150">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="170">
					<span>
						<el-button size="mini" @click="detail(row)">详情</el-button>
						<el-button size="mini" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="mini" @click="handleDel(row)">删除</el-button>
					</span>
                </el-table-column>
                <el-table-column prop="title" label="物料标题" min-width="120">
                </el-table-column>
                <el-table-column prop="sub_title" label="物料副标题" min-width="120">
                </el-table-column>
                <el-table-column prop="unit" label="单位" width="65">
                </el-table-column>
                <el-table-column prop="store" label="库存" width="75">
                </el-table-column>
                <el-table-column prop="outer_id" label="物料编号" min-width="150">
                </el-table-column>
                <el-table-column prop="barcode" label="物料条码" min-width="150">
                </el-table-column>
                <el-table-column prop="category.cat_name" label="物料分类" width="90">
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
    import {getItemsListPage, removeItem, getWareHousesList, getCategoriesList} from '../../api/api';
    import {checkLogin} from '../../api/checkLogin'
    export default {
        data() {
            return {
                filters: {
                    item_title: '',
                    item_outer_id: '',
                    barcode: '',
                    cat_id: null
                },
                Theight: 600,
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
                sku_store_min: "",
                sku_store_max: "",
                size: ""
            }
        },
        watch: {
            items: function () {
                if (this.items.length <= 0) {
                    this.Theight = 300;
                } else {
                    this.Theight = 600;
                }
            }
        },
        created() {
            this.size = this.$store.state.size;
            if (this.$route.query.criteria) {
                let criteria = this.$route.query.criteria;
                this.page = criteria.page;
                this.per_page = criteria.per_page;
                this.filters.item_title = criteria.item_title;
                this.filters.item_outer_id = criteria.item_outer_id;
                this.filters.barcode = criteria.barcode;
                this.filters.cat_id = criteria.cat_id;
                this.whereHouse = criteria.warehouse_id;
                this.sku_store_min = criteria.store_min;
                this.sku_store_max = criteria.store_max;
            }
            this.getItems();
            this.getStore();
            this.getClasses();
            this.addEvent();
        },
        methods: {
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getItems();
                    }
                })
            },
            detail(val){
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    item_title: this.filters.item_title,
                    item_outer_id: this.filters.item_outer_id,
                    barcode: this.filters.barcode,
                    cat_id: this.filters.cat_id,
                    warehouse_id: this.whereHouse,
                    sort_type: "DESC",
                    sort_by: "item_id",
                    store_min: this.sku_store_min,
                    store_max: this.sku_store_max,
                }
                this.$router.push({path: "/items/manager/detail", query: {data: val, criteria: criteria}})
            },
            reLoad(){
                this.filters.item_title = "";
                this.cl = [];
                this.whereHouse = "";
                this.filters.item_outer_id = "";
                this.filters.sku_outer_id = "";
                this.filters.cat_id = null;
                this.filters.barcode = "";
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
                let para = {
                    page: this.page,
                    per_page: this.per_page,
                    item_title: this.filters.item_title,
                    item_outer_id: this.filters.item_outer_id,
                    barcode: this.filters.barcode,
                    cat_id: this.filters.cat_id,
                    warehouse_id: this.whereHouse,
                    sort_type: "DESC",
                    sort_by: "item_id",
                    store_min: this.sku_store_min,
                    store_max: this.sku_store_max,
                };
                this.listLoading = true;
                NProgress.start();
                getItemsListPage(para).then((res) => {
//					checkLogin(res, this);
                    this.total = res.data.totalCount;
                    this.items = res.data.itemList;
                    this.listLoading = false;
                    NProgress.done();
                });
            },
            //删除
            handleDel: function (row) {
                var that = this;
                if (row.store) {
                    this.$message.error("该物料存在库存，不允许被删除")
                    return;
                }
                this.$confirm('删除物料后，该物料下的所有sku信息也将被删除，请谨慎操作?', '提示', {
                    type: 'warning'
                }).then(() => {
                    that.listLoading = true;
                    NProgress.start();
                    removeItem(row.item_id).then((res) => {
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
            //显示新增界面
            handleAdd: function () {
                this.$router.replace('/items/manager/add')
            },
            handleEdit: function (row) {
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    item_title: this.filters.item_title,
                    item_outer_id: this.filters.item_outer_id,
                    barcode: this.filters.barcode,
                    cat_id: this.filters.cat_id,
                    warehouse_id: this.whereHouse,
                    sort_type: "DESC",
                    sort_by: "item_id",
                    store_min: this.sku_store_min,
                    store_max: this.sku_store_max,
                }
                this.$router.push({path: '/edititem', query: {item_id: row.item_id, criteria: criteria}})
            }
        }
    }
</script>

