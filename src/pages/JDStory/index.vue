<template>
    <section>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'>筛选条件</el-col>
                <el-col :span="22">
                    <el-form :model="form" label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="商品名称：">
                                    <el-select v-model="name_array" multiple clearable placeholder="请选择" class="col" style="min-width: 230px"
                                               :size="size">
                                        <el-option
                                                v-for="item in name_list"
                                                :label="item.goodsName"
                                                :value="item.goodsNo"
                                                :key="item.goodsNo">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="仓库：">
                                    <el-select v-model="story_id" multiple clearable placeholder="请选择" class="col" style="min-width: 230px"
                                               :size="size">
                                        <el-option
                                                v-for="item in story_list"
                                                :label="item.warehouseName"
                                                :value="item.warehouseNo"
                                                :key="item.warehouseNo">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="日期：">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="valueI"
                                            type="datetimerange"
                                            align="right"
                                            placeholder="采购时间"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeI">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="getJdGoodCounts" :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reset' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-table
                v-loading="isLoading"
                border
                :data="tableData"
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column
                    prop="warehouse_name"
                    label="仓库名称"
                    min-width="240">
            </el-table-column>
            <el-table-column
                    prop="warehouse_no"
                    label="商品名称"
                    min-width="240">
            </el-table-column>
            <el-table-column
                    prop="start_stock"
                    label="期初结存"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="in_num"
                    label="本期收入"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="out_num"
                    label="本期发出"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="end_stock"
                    label="剩余库存"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="end_usable_num"
                    label="可用库存"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="stock_num_alert"
                    label="库存预警"
                    min-width="95">
            </el-table-column>
        </el-table>
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
    import {getJdStoryList,getJdGoodList,getJdGoodCount} from '../../api/api'
    export default{
        data () {
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
                name_array: [],
                name_list: [],
                story_list: [],
                valueI: [],
                story_id: [],
                form: {},
                tableData: [],
                total: 200,
                page: 1,
                per_page: 10,
                start_date: "",
                end_date: "",
                time_quantumII: "",
                isLoading: false,
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            this.getJdStory();
            this.getJdGood();
            this.getJdGoodCounts();
            this.addEventL();
        },
        methods: {
            addEventL(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.getJdGoodCounts();
                    }
                })
            },
            reset(){
                this.name_array = [];
                this.story_id = [];
                this.valueI = [];
                this.start_date = "";
                this.end_date = "";
                this.getJdGoodCounts();
            },
            getJdStory(){
                getJdStoryList().then(res=>{
                    this.story_list = res.data;
                })
            },
            getJdGood(){
                getJdGoodList().then(res=>{
                    this.name_list = res.data;
                })
            },
            getJdGoodCounts(){
                let params = {
                    start_date: this.start_date,
                    end_date: this.end_date,
                    warehouse_no: this.story_id,
                    goods_no: this.name_array,
                    page_no: this.page,
                    page_size: this.per_page,
                }
                getJdGoodCount(params).then(res=>{
                    this.tableData = res.data.stocks;
                    this.total = res.data.totalCount;
                })
            },
            timeChangeI(val){
                this.time_quantumII = val;
                if (this.time_quantumII) {
                    this.start_date = this.time_quantumII.split(" - ")[0];
                    this.end_date = this.time_quantumII.split(" - ")[1];
                } else {
                    this.start_date = "";
                    this.end_date = "";
                }
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getJdGoodCounts();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getJdGoodCounts();
                return;
            },

        }
    }
</script>