<template>
    <section>
        <HS></HS>
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="物料标题：" class="hspace">
                                    <el-input v-model="sku_title" placeholder="请输入物料标题" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="起止时间：" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="value"
                                            type="datetimerange"
                                            align="right"
                                            placeholder="请选择下单时间范围"
                                            :picker-options="pickerOptions"
                                            @change="timeChange">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="负责人：" class="hspace">
                                    <el-input v-model="master" placeholder="请输入负责人" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="部门：" class="hspace">
                                    <el-select v-model="group" clearable placeholder="部门名称" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in groupList"
                                                :label="item.key"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="渠道名称：">
                                    <el-input v-model="channel_name" placeholder="请输入渠道名称" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class="cb">
                                <el-button type="primary" class='btnw' @click="getAorderes" :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" class='btnw' @click="unopen" :size="size">导出</el-button>
                    <div style="float: right;margin-right: 20px;">总数：{{count_nums}}</div>
                </el-col>
            </el-row>
            <el-table
                    v-loading="isLoading"
                    :data="tableData"
                    border
                    style="width: 100%"
                    class="geFontSize_list">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-table
                                v-loading="isLoading"
                                :data="props.row.channel"
                                border
                                style="width: 100%"
                                class="geFontSize_list">
                            <el-table-column
                                    prop="channel_id"
                                    label="渠道ID"
                                    min-width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="channel_name"
                                    label="渠道标题"
                                    min-width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="num"
                                    label="数量"
                                    min-width="120">
                            </el-table-column>
                        </el-table>
                    </template>

                </el-table-column>
                <el-table-column
                        prop="i"
                        label="序号"
                        min-width="80">
                </el-table-column>
                <el-table-column
                        prop="bn"
                        label="SKU编码"
                        min-width="140">
                </el-table-column>
                <el-table-column
                        width="80"
                        prop="cat_name"
                        label="类别">
                </el-table-column>
                <el-table-column
                        min-width="140"
                        prop="title"
                        label="存货名称">
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="prop_value"
                        label="包装规格">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="数量"
                        min-width="95">
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
        </div>
    </section>
</template>

<script>
    import {getOrderCount} from '../../api/api'
    export default{
        data(){
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
                channel_name: "",
                sku_title: "",
                value: "",
                start_date: "",
                end_date: "",
                time_quantum: "",
                group: "",
                groupList: [{key: '其他', value: 1}, {key: '渠道部', value: 2}, {key: '运营部', value: 3}, {key: '自然订单', value: 4}],
                master: "",
                tableData: [],
                count_nums: 0,
                total: 200,
                per_page: 10,
                page: 1,
                isLoading: false,
                size: this.$store.state.size
            }
        },
        created(){
            this.getAorderes()
        },
        methods: {
            getAorderes(){
                let params = {
                    page_size: this.per_page,
                    page_no: this.page,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    sku_title: this.sku_title,
                    group: this.group,
                    master: this.master,
                    channel_name: this.channel_name,
                }
                this.isLoading = true;
                getOrderCount(params).then(res => {
                    this.total = res.data.count;
                    this.count_nums = res.data.total;
                    this.isLoading = false;
                    this.tableData = res.data.lists;
                })
            },
            reLoad(){
                this.sku_title = "";
                this.value = "";
                this.channel_name = "";
                this.master = "";
                this.group = null;
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getAorderes();
            },
            handleCurrentChange(val){
                this.page = val;
                if (!this.total) {
                    return
                }
                this.getAorderes();
            },
            unopen(){
                let params = {
                    page_size: this.per_page,
                    page_no: this.page,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    sku_title: this.sku_title,
                    group: this.group,
                    master: this.master,
                    channel_name: this.channel_name,
                }
                let str = "";
                for (let key in params){
                    console.log(key)
                    str += `${key}=${params[key]}&`;
                }
                window.open(`https://duperp.kmjiu.com/api/v1/trades_stat/exportLists?access_token=${sessionStorage.getItem('access_token')}&${str}`)
            },
            timeChange(val){
                this.time_quantum = val;
                if (this.time_quantum) {
                    this.start_date = this.time_quantum.split(" - ")[0];
                    this.end_date = this.time_quantum.split(" - ")[1];
                } else {
                    this.start_date = "";
                    this.end_date = "";
                }
            }
        }
    }
</script>