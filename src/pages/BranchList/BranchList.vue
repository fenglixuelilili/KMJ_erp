<template>
    <section>
        <HS></HS>
        <template>
            <div class='pt'>
                <el-row>
                    <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                    <el-col :span="22">
                        <el-form label-width="150px">
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="店铺名称：" class="hspace">
                                        <el-select v-model="store_name" clearable placeholder="请选择店铺" filterable
                                                   class="col" :size="size">
                                            <el-option
                                                    v-for="item in options"
                                                    :key="item.store_id"
                                                    :label="item.store_name"
                                                    :value="item.store_name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="联系人：" class="hspace">
                                        <el-input v-model="contacter" placeholder="请输入" class="col"
                                                  :size="size"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="地推负责人：" class="hspace">
                                        <el-input v-model="marketers" placeholder="请输入" class="col"
                                                  :size="size"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row v-if="$store.state.isPackUp">
                                <el-col :span="8">
                                    <el-form-item label="运营负责人：">
                                        <el-input v-model="operater" placeholder="请输入" class="col"
                                                  :size="size"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="创建时间：">
                                        <el-date-picker
                                                :size="size"
                                                class="col"
                                                v-model="value_creted"
                                                type="daterange"
                                                align="right"
                                                placeholder="选择日期范围"
                                                :picker-options="pickerOptions"
                                                @change="timeChange">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24" class='cb'>
                                    <el-button type="primary" class='btnw' @click="inquire" :size="size">查询</el-button>
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
                        <el-button class='btnw' type="primary" @click="addBranch" :size="size">新增</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table
                    v-loading="isLoading"
                    :data="table"
                    border
                    style="width: 100%"
                    class="geFontSize_list">
                <el-table-column
                        label="操作"
                        min-width="120"
                        id="operate">
                    <template slot-scope="scope">
                        <el-button type="text" :size="size" @click="edit(scope.$index)">编辑</el-button>
                        <el-button type="text" :size="size" @click="dredge(scope.$index)">开通外卖平台</el-button>
                        <el-button type="text" :size="size" @click="userInfo(scope.$index)">分店用户设置</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="store_name"
                        label="快买酒店铺名"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="business_license"
                        label="店铺真实名称"
                        min-width="150">
                </el-table-column>
                <el-table-column prop="address" label="地址" min-width="170">
                    <template slot-scope="props">
                        <elliptical :message="props.row.address" :length="10"></elliptical>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="contacter"
                        label="联系人"
                        min-width="85">
                </el-table-column>
                <el-table-column
                        prop="telephone"
                        label="联系电话"
                        min-width="115">
                </el-table-column>
                <el-table-column
                        prop="marketers"
                        label="地推负责人"
                        min-width="110">
                </el-table-column>
                <el-table-column
                        prop="operater"
                        label="运营负责人"
                        min-width="110">
                </el-table-column>
                <el-table-column
                        prop="platform"
                        label="已开通平台"
                        min-width="110">
                </el-table-column>
                <el-table-column
                        prop="created_at"
                        label="创建时间"
                        width="100">
                </el-table-column>
            </el-table>
        </template>
        <!-- 分页 -->
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
    import {storeList, WstoreList} from '../../api/api'
    export default{
        data (){
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
                table: [],
                total: 20,
                page: 1,
                per_page: 10,
                options: [],
                store_name: "",
                isLoading: false,
                value_creted: "",
                time_quantum: "",
                created_start_date: "",
                created_end_date: "",
                contacter: "",
                marketers: "",
                operater: "",
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            if (this.$route.query.criteria) {
                let criteria = this.$route.query.criteria;
                this.per_page = criteria.per_page;
                this.page = criteria.page;
                this.store_name = criteria.store_name;
                this.contacter = criteria.contacter;
                this.marketers = criteria.marketers;
                this.operater = criteria.operater;
                this.created_start_date = criteria.created_at_min;
                this.created_end_date = criteria.created_at_max;
            }
            this.getStoreList();
            var parm = {per_page: 99999};
            WstoreList(parm).then((res) => {
                this.options = res.data.storesList;
            })
            this.addEvent();
        },
        methods: {
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getStoreList();
                    }
                })
            },
            educe(){
                window.open(`${this.$store.state.urlBackstage}/stores/exportLists?access_token=${sessionStorage.getItem('access_token')}&store_name=${this.store_name}&contacter=${this.contacter}&marketers=${this.marketers}&operater=${this.operater}&created_at_min=${this.created_start_date}&created_at_max=${this.created_end_date}`)
            },
            timeChange(val){
                this.time_quantum = val;
                if (this.time_quantum) {
                    this.created_start_date = this.time_quantum.split(" - ")[0] + " 00:00:00";
                    this.created_end_date = this.time_quantum.split(" - ")[1] + " 23:59:59"
                } else {
                    this.created_start_date = "";
                    this.created_end_date = "";
                }
            },
            reLoad(){
                this.store_name = "";
                this.value_creted = "";
                this.contacter = "";
                this.marketers = "";
                this.operater = "";
            },
            inquire(){
                this.getStoreList();
            },
            addBranch(){
                this.$router.replace('/waimaistores/manager/add')
            },
            edit(index){
                let criteria = {
                    per_page: this.per_page,
                    page: this.page,
                    store_name: this.store_name,
                    contacter: this.contacter,
                    marketers: this.marketers,
                    operater: this.operater,
                    created_at_min: this.created_start_date,
                    created_at_max: this.created_end_date,
                }
                this.$router.push({
                    path: "/editBranch",
                    query: {store_id: this.table[index].waimaistore_id, criteria: criteria}
                })
            },
            dredge(index){
                this.$router.push({path: "/delivery", query: {store_id: this.table[index].waimaistore_id}})
            },
            userInfo(index){
                let criteria = {
                    per_page: this.per_page,
                    page: this.page,
                    store_name: this.store_name,
                    contacter: this.contacter,
                    marketers: this.marketers,
                    operater: this.operater,
                    created_at_min: this.created_start_date,
                    created_at_max: this.created_end_date,
                }
                this.$router.push({
                    path: "/userInfo",
                    query: {store_id: this.table[index].waimaistore_id, criteria: criteria}
                })
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.getStoreList();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getStoreList();
            },
            getStoreList(){
                this.isLoading = true;
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    sort_type: 'DESC',
                    sort_by: 'created_at',
                    store_name: this.store_name,
                    contacter: this.contacter,
                    marketers: this.marketers,
                    operater: this.operater,
                    created_at_min: this.created_start_date,
                    created_at_max: this.created_end_date,
                }
                storeList(parm).then((res) => {
                    this.isLoading = false;
                    this.total = res.data.totalCount;
                    this.table = res.data.storesList;
                    for (var i = 0; i < this.table.length; i++) {
                        this.table[i].platform = "";
                        if (this.table[i].bdstore_id != 0) {
                            this.table[i].platform = "百度外卖  "
                        }
                        if (this.table[i].meituanstore_id != 0) {
                            this.table[i].platform += "美团外卖  "
                        }
                        if (this.table[i].jddjstore_id != 0) {
                            this.table[i].platform += "京东到家  "
                        }
                        if (this.table[i].elemestore_id != 0) {
                            this.table[i].platform += "饿了么  "
                        }
                    }
                });
            }
        }
    }
</script>