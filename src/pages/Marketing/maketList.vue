<template>
    <section>
        <HS></HS>
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'>
                    <span style='margin-left: 30px'>筛选条件</span>
                </el-col>
                <el-col :span="21">
                    <el-form label-width="130px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="商品标题：" class="hspace">
                                    <el-input v-model="title" placeholder="商品标题" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="促销平台：" class="hspace">
                                    <el-select v-model="platform" placeholder="促销平台" class="col" :size="size">
                                        <el-option
                                                v-for="item in platforms"
                                                :label="item.label"
                                                :value="item.val"
                                                :key="item.val">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="销售货号：" class="hspace">
                                    <el-input v-model="bn" placeholder="销售货号" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="促销状态：">
                                    <el-select v-model="status" placeholder="促销状态" class="col" :size="size">
                                        <el-option
                                                v-for="item in statu"
                                                :label="item.label"
                                                :value="item.val"
                                                :key="item.val">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="cb">
                            <el-col :span="24">
                                <el-button type="primary" @click="getList" class="btnw" :size="size">查询</el-button>
                                <el-button type="primary" class="btnw" @click="reload" :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" class="btn_addBox">
                    <el-button type="primary" @click="$router.replace('/waimaiitems/activity/add')" class="btnw"
                               :size="size">
                        新增促销商品


                    </el-button>
                </el-col>
            </el-row>
        </div>
        <el-table
                v-loading="isLoading"
                border
                :data="tableData"
                style="width: 100%;"
                class="geFontSize_list">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table border :data="props.row.skus" class="geFontSize_list">
                        <el-table-column label="物料标题" prop="title" min-width="200"></el-table-column>
                        <el-table-column label="物料副标题" prop="sub_title" min-width="100"></el-table-column>
                        <el-table-column label="销售数量" prop="num" min-width="100"></el-table-column>
                        <el-table-column :formatter="props_valuesC" label="规格" prop="price"
                                         min-width="100"></el-table-column>
                        <el-table-column label="单位" prop="unit" min-width="100"></el-table-column>
                        <el-table-column label="重量（kg）" prop="weight" min-width="100"></el-table-column>
                        <el-table-column label="条码" prop="barcode" min-width="100"></el-table-column>
                        <el-table-column label="货号" prop="bn" min-width="100"></el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="100">
                <template slot-scope="scope">
                    <el-button type="text" :size="size" @click="edit(scope.row)" v-if="scope.row.status==1">编辑

                    </el-button>
                    <el-button type="text" :size="size" @click="remove(scope.row)" style="color: red"
                               v-if="scope.row.status==1">删除

                    </el-button>
                    <el-button type="text" :size="size" @click="finished(scope.row)" style="color: #999999"
                               >结束

                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="item_name"
                    label="商品标题"
                    min-width="140">
            </el-table-column>
            <el-table-column
                    :formatter="platformCheck"
                    prop="platform"
                    label="促销平台"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="store"
                    label="促销店铺"
                    min-width="170">
                <template slot-scope="props">
                    <elliptical :message="storeCheck(props.row)"></elliptical>
                </template>
            </el-table-column>
            <el-table-column
                    prop="item_id"
                    label="销售货号"
                    min-width="140">
            </el-table-column>
            <el-table-column
                    :formatter="statusCheck"
                    prop="activity_status"
                    label="促销状态"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    :formatter="dates"
                    label="促销日期"
                    width="154">
            </el-table-column>
            <el-table-column prop="memo" label="备注" min-width="170">
                <template slot-scope="props">
                    <elliptical :message="props.row.memo"></elliptical>
                </template>
            </el-table-column>
        </el-table>
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
    import {getActivityItem, removeActivityItem, editActivityItem} from '../../api/api'
    import {toDate} from "../../api/geFunc"
    export default{
        data () {
            return {
                tableData: [],
                total: 0,
                page: 1,
                per_page: 10,
                title: "",
                status: "",
                platform: "",
                bn: "",
                platforms: [{label: "全部", val: ""}, {label: "饿了么", val: "eleme"}, {
                    label: "京东到家",
                    val: "jddj"
                }, {label: "百度外卖", val: "bd"}, {label: "美团外卖", val: "meituan"}],
                statu: [{label: "全部", val: ""}, {label: "未开始", val: "1"}, {label: "进行中", val: "2"}, {
                    label: "已结束",
                    val: "3"
                }],
                isLoading: false,
                size: "",
                store_length: 0
            }
        },
        created(){
            this.size = this.$store.state.size;
            if (this.$route.query.criteria) {
                this.page = this.$route.query.criteria.page;
                this.per_page = this.$route.query.criteria.per_page;
                this.title = this.$route.query.criteria.title;
                this.platform = this.$route.query.criteria.platform;
                this.status = this.$route.query.criteria.status;
                this.bn = this.$route.query.criteria.bn;
            }
            this.getList();
            this.addEvent();
        },
        methods: {
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getList();
                    }
                })
            },
            dates(row){
                return row.activity_start + "-" + row.activity_end;
            },
            statusCheck(row){
                switch (row.status) {
                    case 1:
                        return "未开始";
                        break;
                    case 2:
                        return "进行中";
                        break;
                    case 3:
                        return "已结束";
                        break;
                }
            },
            platformCheck(row){
                let arr = row.platform.split(",");
                let str = "";
                for (let i = 0; i < arr.length; i++) {
                    switch (arr[i]) {
                        case "jddj":
                            str += "京东到家 ";
                            break;
                        case "eleme":
                            str += "饿了么 ";
                            break;
                        case "meituan":
                            str += "美团外卖 ";
                            break;
                        case "bd":
                            str += "百度外卖 ";
                            break;
                    }
                }
                return str;
            },
            storeCheck(row){
                let str = "";
                if (row.stores.length == this.store_length) {
                    return str = "全部";
                } else {
                    for (let i = 0; i < row.stores.length; i++) {
                        if (i == row.stores.length - 1) {
                            str += row.stores[i].store_name;
                        } else {
                            str += row.stores[i].store_name + "，";
                        }
                    }
                    return str;
                }
            },
            getList(){
                let parm = {
                    per_page: this.per_page,
                    page: this.page,
                    sort_by: "updated",
                    sort_type: "DESC",
                    item_name: this.title,
                    platform: this.platform,
                    item_id: this.bn,
                    activity_status: this.status
                }
                this.isLoading = true;
                getActivityItem(parm).then((res) => {
                    this.isLoading = false;
                    this.store_length = res.data.stores;
                    this.tableData = res.data.data;
                    this.total = res.data.totalCount;
                })
            },
            reload(){
                this.title = "";
                this.platform = "";
                this.status = "";
                this.bn = "";
            },
            remove(val){
                this.$confirm('此操作将永久删除该设置, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'right',
                    type: 'warning'
                }).then(() => {
                    removeActivityItem(val.id).then((res) => {
                        if (!res.error_code) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getList();
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                }).catch(() => {

                });
            },
            edit(val){
                let criteria = {
                    page: this.page,
                    per_page: this.per_page,
                    title: this.title,
                    platform: this.platform,
                    status: this.status,
                    bn: this.bn,
                }
                this.$router.push({path: "/waimaiitems/activity/edit", query: {data: val, criteria: criteria}})
            },
            finished(val){
                this.$confirm('此操作将提前结束活动, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'right',
                    type: 'warning'
                }).then(() => {
                    let parm = {
                        activity_start: val.activity_start,
                        activity_end: toDate(),
                        platform: val.platform,
                        memo: val.memo,
                        stores: JSON.stringify(val.stores)
                    }
                    editActivityItem(val.id, parm).then((res) => {
                        if (!res.error_code) {
                            this.$message({
                                message: '活动已结束',
                                type: 'success'
                            });
                            this.getList();
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                }).catch(() => {

                });
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.getList();
            },
            props_valuesC(val){
                var str = '';
                for (var i = 0; i < val.props_values.length; i++) {
                    str = val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' ';
                }
                return str;
            },
        }
    }
</script>