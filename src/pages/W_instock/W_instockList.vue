<template>
    <section>
        <HS></HS>
        <!--工具条-->
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'>
                    <span style='margin-left: 30px'>筛选条件</span>
                </el-col>
                <el-col :span="21">
                    <el-form label-width="130px" :model="filters">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="入库单号：" class="hspace">
                                    <el-input v-model="filters.instock_bn" placeholder="入库单号" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="入库店铺：" class="hspace">
                                    <el-select v-model="filters.waimaistore_id" filterable clearable placeholder="入库店铺"
                                               class="col" :size="size">
                                        <el-option
                                                v-for="item in store"
                                                :label="item.store_name"
                                                :value="item.waimaistore_id"
                                                :key="item.waimaistore_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="入库状态：" class="hspace">
                                    <el-select v-model="filters.in_status" clearable placeholder="入库状态" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in in_status"
                                                :label="item.label"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="入库类型：" class="hspace">
                                    <el-select v-model="filters.instockType" clearable placeholder="入库类型" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in instockType"
                                                :label="item.type_name"
                                                :value="item.type_id"
                                                :key="item.type_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="确认状态：" class="hspace">
                                    <el-select v-model="filters.confirm_status" clearable placeholder="确认状态"
                                               class="col" :size="size">
                                        <el-option
                                                v-for="item in confirm_status"
                                                :label="item.label"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="创建时间：" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="valueI"
                                            type="daterange"
                                            align="right"
                                            placeholder="请选择"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeI">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="确认时间：">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="valueII"
                                            type="daterange"
                                            align="right"
                                            placeholder="请选择"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeII">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="配送单号：">
                                    <el-input v-model="filters.post_bn" placeholder="配送单号" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="cb">
                            <el-col :span="24">
                                <el-button type="primary" v-on:click="getItems" class="btnw" :size="size">查询</el-button>
                                <el-button type="primary" class="btnw" @click="reload" :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" @click="addInstockOdd" class="btnw" :size="size">新增</el-button>
                </el-col>
            </el-row>
        </div>
        <!--列表-->
        <template>
            <el-table :data="instockList" border highlight-current-row v-loading="listLoading" style="width: 100%;"
                      class="geFontSize_list">
                <el-table-column type="expand" width="30">
                    <template slot-scope="props">
                        <el-table
                                class="geFontSize_list"
                                :data="props.row.items"
                                border
                                empty-text="该物料下暂无sku信息">
                            <el-table-column
                                    prop="sku_title"
                                    label="sku标题"
                                    min-width="150">
                            </el-table-column>
                            <el-table-column
                                    label="缩略图"
                                    min-width="100">
                                <template slot-scope="prop">
                                    <img :src="prop.row.default_image" style="width: 100%;"
                                         v-if="prop.row.default_image">
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sub_title"
                                    label="sku副标题"
                                    min-width="150">
                            </el-table-column>
                            <el-table-column
                                    :formatter="props_valuesC"
                                    prop="props_values"
                                    label="规格"
                                    min-width="130">
                            </el-table-column>
                            <el-table-column
                                    prop="num"
                                    label="入库数量"
                                    min-width="85">
                            </el-table-column>
                            <el-table-column
                                    label="条码"
                                    min-width="120"
                                    prop="barcode">
                            </el-table-column>
                            <el-table-column
                                    label="货号"
                                    min-width="120"
                                    prop="bn">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="170">
                    <template>
                        <p style="margin: 5px 0">
                            <el-button size="mini" @click="copy(row)" v-if="row.type_id == 9">复制</el-button>
                            <el-button size="mini" @click="printInstock(row)">打印</el-button>
                            <el-button size="mini" @click="detail(row)">详情</el-button>
                        </p>
                        <p style="margin: 5px 0">
                            <el-button size="mini" @click="edit(row)" v-if="row.confirm_status == 1">编辑</el-button>
                            <el-button type="primary" size="mini" @click="confirm(row)"
                                       v-if="row.confirm_status == 1">确认
                            </el-button>
                            <el-button type="danger" size="mini" @click="remove(row)"
                                       v-if="row.confirm_status == 1">删除
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="instock_bn" label="入库单号" min-width="150">
                </el-table-column>
                <el-table-column prop="post_bn" label="配送单号" min-width="120">
                </el-table-column>
                <el-table-column prop="store_name" label="入库店铺" min-width="150">
                </el-table-column>
                <el-table-column label="入库类型" :formatter="instockTypes" width="85">
                </el-table-column>
                <el-table-column label="入库状态" min-width="85">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.in_status == 0">未入库</el-tag>
                        <el-tag type="success" v-else-if="scope.row.in_status == 1">已入库</el-tag>
                        <el-tag type="danger" v-else>失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="确认状态" min-width="100">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.confirm_status == 0">无需确认</el-tag>
                        <el-tag type="danger" v-else-if="scope.row.confirm_status == 1">未确认</el-tag>
                        <el-tag type="success" v-else>已确认</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="created_at"
                        label="创建时间"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="confirm_at"
                        label="确认时间"
                        width="100">
                    <template slot-scope="props">
                        <span v-if="props.row.confirm_at!='0000-00-00 00:00:00'">{{props.row.confirm_at}}</span>
                    </template>
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
    import {getWinstockType, WstoreList, getWinstockList, WdeleteInstock, WconfirmInstock} from '../../api/api';
    export default {
        data() {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = start.toString();
                            switch (strD.split(" ")[0]) {
                                case 'Mon':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
                                    break;
                                case 'Tue':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                                    break;
                                case 'Wed':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                                    break;
                                case 'Thu':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                                    break;
                                case 'Fri':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 4);
                                    break;
                                case 'Sat':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
                                    break;
                                case 'Sun':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                            }
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = end.toString();
                            switch (strD.split(" ")[0]) {
                                case 'Mon':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Tue':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Wed':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Thu':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 4);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Fri':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Sat':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Sun':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                            }
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = start.toString();
                            var num = parseInt(strD.split(' ')[2]) - 1;
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * num);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = start.toString();
                            var num = parseInt(strD.split(' ')[2]);
                            var numN = parseInt(strD.split(' ')[2]) - 1;
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * num);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * numN);
                            start.setMonth(start.getMonth() - 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                filters: {
                    instock_bn: '',
                    in_status: '',
                    confirm_status: '',
                    waimaistore_id: '',
                    instockType: "",
                    post_bn: ""
                },
                in_status: [
                    {
                        value: '0',
                        label: '未入库'
                    }, {
                        value: '1',
                        label: '已入库'
                    }, {
                        value: '2',
                        label: '失败'
                    }
                ],
                confirm_status: [
                    {
                        value: '0',
                        label: '无需确认'
                    }, {
                        value: '1',
                        label: '未确认'
                    }, {
                        value: '2',
                        label: '已确认'
                    }
                ],
                instockType: [],
                instockList: [{}],
                listLoading: false,
                total: 100,
                page: 1,
                per_page: 10,
                store: [],
                created_start_date: "",
                created_end_date: "",
                confirm_start_date: "",
                confirm_end_date: "",
                time_quantumI: "",
                time_quantumII: "",
                valueI: [],
                valueII: [],
                size: ""
            }
        },
        created() {
            this.size = this.$store.state.size;
            if (this.$route.query.criteria) {
                let criteria = this.$route.query.criteria;
                this.page = criteria.page;
                this.per_page = criteria.per_page;
                this.filters.instockType = criteria.type_id;
                this.filters.instock_bn = criteria.instock_bn;
                this.filters.in_status = criteria.in_status;
                this.filters.waimaistore_id = criteria.store_id;
                this.filters.post_bn = criteria.post_bn;
                this.filters.confirm_status = criteria.confirm_status;
                this.created_start_date = criteria.created_start_date;
                this.created_end_date = criteria.created_end_date;
                this.confirm_start_date = criteria.confirm_start_date;
                this.confirm_end_date = criteria.confirm_end_date;
            }
            var instockParm = {
                io_type: "i"
            }
            getWinstockType(instockParm).then((res) => {
                this.instockType = res.data
                console.log(this.instockType)
            })
            var storeParm = {
                per_page: 99999
            }
            WstoreList(storeParm).then((res) => {
                this.store = res.data.storesList;
            })
            this.getItems();
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
            printInstock(val){
                window.open(`${this.$store.state.url}/W_instock.html?${val.instock_id}?access_token=${sessionStorage.getItem('access_token')}`)
            },
            detail(val){
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    type_id: this.filters.instockType,
                    instock_bn: this.filters.instock_bn,
                    in_status: this.filters.in_status,
                    store_id: this.filters.waimaistore_id,
                    post_bn: this.filters.post_bn,
                    confirm_status: this.filters.confirm_status,
                    created_start_date: this.created_start_date,
                    created_end_date: this.created_end_date,
                    confirm_start_date: this.confirm_start_date,
                    confirm_end_date: this.confirm_end_date,
                }
                this.$router.push({
                    path: "/waimai_stocks/instocks/detail",
                    query: {instock_id: val.instock_id, criteria: criteria}
                })
            },
            copy(val){
                this.$router.push({path: "/waimai_stocks/instocks/add", query: {instock_id: val.instock_id}})
            },
            remove(val){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    WdeleteInstock(val.instock_id).then((res) => {
                        if (res.status_code == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getItems()
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.message
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            edit(val){
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    type_id: this.filters.instockType,
                    instock_bn: this.filters.instock_bn,
                    in_status: this.filters.in_status,
                    store_id: this.filters.waimaistore_id,
                    post_bn: this.filters.post_bn,
                    confirm_status: this.filters.confirm_status,
                    created_start_date: this.created_start_date,
                    created_end_date: this.created_end_date,
                    confirm_start_date: this.confirm_start_date,
                    confirm_end_date: this.confirm_end_date,
                }
                this.$router.push({
                    path: "/waimai_stocks/instocks/edit",
                    query: {instock_id: val.instock_id, criteria: criteria}
                })
            },
            confirm(val){
                this.$confirm('是否确认已完成入库?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var parm = {
                        instock_id: val.instock_id
                    }
                    WconfirmInstock(parm).then((res) => {
                        if (res.status_code == 200) {
                            this.$message({
                                type: 'success',
                                message: '确认成功'
                            });
                            this.getItems()
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.message
                            });
                        }
                    })
                })
            },
            instockTypes(val){
                switch (val.type_id) {
                    case 1:
                        return "配送入库";
                        break
                    case 9:
                        return "盘盈入库";
                        break
                }
            },
            addInstockOdd(){
                this.$router.replace("/waimai_stocks/instocks/add")
            },
            reload(){
                this.valueI = [];
                this.valueII = [];
                this.filters.instock_bn = '';
                this.filters.in_status = '';
                this.filters.confirm_status = '';
                this.filters.instockType = '';
                this.filters.waimaistore_id = '';
                this.filters.post_bn = "";
            },
            timeChangeI(val){
                this.time_quantumI = val;
                if (this.time_quantumI) {
                    this.created_start_date = this.time_quantumI.split(" - ")[0] + " 00:00:00";
                    this.created_end_date = this.time_quantumI.split(" - ")[1] + " 23:59:59";
                } else {
                    this.created_start_date = "";
                    this.created_end_date = "";
                }
            },
            timeChangeII(val){
                this.time_quantumII = val;
                if (this.time_quantumII) {
                    this.confirm_start_date = this.time_quantumII.split(" - ")[0] + " 00:00:00";
                    this.confirm_end_date = this.time_quantumII.split(" - ")[1] + " 23:59:59";
                } else {
                    this.confirm_start_date = "";
                    this.confirm_end_date = "";
                }
            },
            props_valuesC(row){
                var str = "";
                if (!row.props_values) {
                    return
                }
                for (let i in row.props_values) {
                    str += row.props_values[i].prop_name + " " + row.props_values[i].prop_value
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
            getItems() {
                this.listLoading = true;
                var parm = {
                    page: this.page,
                    per_page: this.per_page,
                    sort_by: "updated_at",
                    sort_type: "DESC",
                    type_id: this.filters.instockType,
                    instock_bn: this.filters.instock_bn,
                    in_status: this.filters.in_status,
                    store_id: this.filters.waimaistore_id,
                    post_bn: this.filters.post_bn,
                    confirm_status: this.filters.confirm_status,
                    created_start_date: this.created_start_date,
                    created_end_date: this.created_end_date,
                    confirm_start_date: this.confirm_start_date,
                    confirm_end_date: this.confirm_end_date,
                }
                getWinstockList(parm).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.totalCount;
                    this.instockList = res.data.instockList
                })
            }
        }
    }
</script>

<style scoped>
</style>
