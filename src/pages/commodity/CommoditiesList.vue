<template>
    <section>
        <!--工具条-->
        <el-row style='margin-top: 20px;'>
            <el-col :span="2" class='ptc'>
                <span style='margin-left: 30px'>筛选条件</span>
            </el-col>
            <el-col :span="22" class="toolbar">
                <el-form label-width="120px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="商品标题：">
                                <el-input v-model="filters.commodity_title" placeholder="请输入商品标题" class="col"
                                          :size="size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="销售平台：">
                                <el-select v-model="platform" placeholder="请选择" class="col" :size="size">
                                    <el-option
                                            v-for="item in options"
                                            :label="item.key"
                                            :value="item.value"
                                            :key="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="销售货号：">
                                <el-input v-model="bn" placeholder="请输入销售货号" class="col" :size="size"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="cb">
                        <el-col :span="24">
                            <el-button type="primary" @click.prevent="getItems" class="btnw" :size="size">查询</el-button>
                            <el-button type="primary" class="btnw" @click="reload" :size="size">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24"
                    style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                <el-button type="primary" @click.prevent="handleAdd" class="btnw" :size="size">新增</el-button>
            </el-col>
        </el-row>

        <!--列表-->
        <template>
            <el-table :data="commodities" highlight-current-row border v-loading="listLoading" style="width: 100%;"
                      class="geFontSize_list">
                <el-table-column type="expand" width="30">
                    <template slot-scope="props">
                        <el-table
                                class="geFontSize_list"
                                :data="props.row.commodity_skus"
                                border
                                empty-text="该物料下暂无sku信息">
                            <el-table-column
                                    prop="title"
                                    label="物料标题"
                                    width="150">
                            </el-table-column>
                            <el-table-column
                                    prop="sub_itle"
                                    label="物料副标题"
                                    width="150">
                            </el-table-column>
                            <el-table-column
                                    prop="num"
                                    label="销售数量"
                                    width="85">
                            </el-table-column>
                            <el-table-column
                                    prop="is_gift"
                                    label="是否为赠品"
                                    :formatter="formatGift"
                                    width="105">
                            </el-table-column>
                            <el-table-column
                                    :formatter="props_valuesC"
                                    prop="props_values"
                                    label="规格"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="unit"
                                    label="单位"
                                    width="65">
                            </el-table-column>
                            <el-table-column
                                    prop="weight"
                                    label="重量(kg)"
                                    width="95">
                            </el-table-column>
                            <el-table-column
                                    prop="store"
                                    label="库存"
                                    width="75">
                            </el-table-column>
                            <el-table-column
                                    prop="barcode"
                                    label="条码"
                                    width="150">
                            </el-table-column>
                            <el-table-column
                                    prop="bn"
                                    label="货号"
                                    width="150">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="55">
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="170">
					<span>
						<el-button size="mini" @click="detail(row)">详情</el-button>
						<el-button size="mini" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="mini" @click="handleDel(row)">删除</el-button>
					</span>
                </el-table-column>
                <el-table-column prop="commodity_title" label="商品标题" min-width="220">
                </el-table-column>
                <el-table-column prop="platform" label="销售平台" :formatter="formatePlatform" min-width="85">
                </el-table-column>
                <el-table-column prop="store" label="库存" min-width="75">
                </el-table-column>
                <el-table-column prop="commodity_bn" label="销售货号" min-width="150">
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

        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="editForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/util'
    import NProgress from 'nprogress'
    import {getCommoditiesList, removeCommodity} from '../../api/api';
    import {checkLogin} from '../../api/checkLogin'

    export default {
        data() {
            return {
                filters: {
                    commodity_title: ''
                },
                commodities: [],
                listLoading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '编辑',//编辑界面标题
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },
                total: 0,
                page: 1,
                per_page: 10,
                editLoading: false,
                btnEditText: '提 交',
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                options: [{key: "全部", value: ""}, {key: "天猫", value: "tm"}, {key: "淘宝", value: "tb"}, {key: "京东", value: "jd"}, {key: "快买酒商城", value: "kmjiu"}],
                platform: "",
                bn: "",
                size: "",
                sizeButton: "",
            }
        },
        created() {
            this.size = this.$store.state.size;
            this.sizeButton = this.$store.state.sizeButton;
            if (this.$route.query.criteria) {
                let criteria = this.$route.query.criteria;
                this.page = criteria.page;
                this.per_page = criteria.per_page;
                this.filters.commodity_title = criteria.commodity_title;
                this.platform = criteria.platform;
                this.bn = criteria.commodity_bn;
            }
            this.getItems();
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
            reload(){
                this.bn = "";
                this.platform = "";
                this.filters.commodity_title = "";
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getItems();
                this.right()
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.getItems();
                this.right()
            },
            formatGift(row){
                return row.is_gift ? '是' : '否'
            },
            props_valuesC(row){
                var str = "";
                for (let i in row.props_values) {
                    str += row.props_values[i].prop_name + " " + row.props_values[i].prop_value
                }
                return str
            },
            formatePlatform(row){
                let str = '',
                    platform = row.platform.split(','),
                    plength = 0;
                platform.length > 1 ? plength = platform.length - 1 : plength = 1;
                for (let i = 0; i < plength; i++) {
                    str += (platform[i] === 'jd' ? '京东' : (platform[i] === 'tm' ? '天猫' : (platform[i] === "kmjiu" ? "快买酒商城" : '淘宝'))) + ' '
                }
                return str
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getItems();
            },
            getItems() {
                let para = {
                    page: this.page,
                    per_page: this.per_page,
                    commodity_title: this.filters.commodity_title,
                    platform: this.platform,
                    commodity_bn: this.bn,
                    sort_type: "DESC",
                    sort_by: "updated_at"
                };
                this.listLoading = true;
                NProgress.start();
                getCommoditiesList(para).then((res) => {
                    checkLogin(res);
                    this.total = res.total;
                    this.commodities = res.data.instockList;
                    this.total = res.data.totalCount;
                    this.listLoading = false;
                    NProgress.done();
                });
            },
            handleDel: function (row) {
                var that = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    that.listLoading = true;
                    NProgress.start();
                    console.log(111111);
                    removeCommodity(row.commodity_id).then((res) => {
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
            handleEdit: function (row) {
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    commodity_title: this.filters.commodity_title,
                    platform: this.platform,
                    commodity_bn: this.bn,
                }
                this.$router.push({
                    path: '/editcommodities',
                    query: {commodity_id: row.commodity_id, criteria: criteria}
                })
            },
            handleAdd: function () {
                this.$router.replace('/items/commodity/manager/add')
            },
            detail(val){
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    commodity_title: this.filters.commodity_title,
                    platform: this.platform,
                    commodity_bn: this.bn,
                }
                this.$router.push({path: "/items/commodity/manager/detail", query: {data: val, criteria: criteria}})
            }
        }
    }
</script>
<style scoped>
</style>
