<template>
    <section>
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'>
                    <span style='margin-left: 30px'>筛选条件</span>
                </el-col>
                <el-col :span="21">
                    <el-form label-width="130px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="sku名称：" class="hspace">
                                    <el-input v-model="sku_name" placeholder="sku名称" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="来源平台：" class="hspace">
                                    <el-select v-model="platform" placeholder="来源平台" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in $store.state.platform"
                                                :label="item.key"
                                                :value="item.val"
                                                :key="item.val">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="统计日期：" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="value"
                                            type="daterange"
                                            align="right"
                                            placeholder="统计日期"
                                            :picker-options="$store.state.pickerOptions"
                                            @change="timeChange">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="cb">
                            <el-col :span="24">
                                <el-button type="primary" @click="subMit" class="btnw" :size="size">查询</el-button>
                                <el-button type="primary" class="btnw" @click="reload" :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" @click="educe" class="btnw" :size="size">导出</el-button>
                    <el-button class='btnw' type="primary" @click='dialogVisible = true' :size="size">导入</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table
                class="geFontSize_list"
                :data="tableData"
                border
                empty-text="">
            <el-table-column
                    prop="platform"
                    label="来源平台"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="sku名称"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop="barcode"
                    label="sku编码"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop="props_values"
                    label="规格"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop="weight"
                    label="重量(kg)"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="unit"
                    label="单位"
                    min-width="75">
            </el-table-column>
            <el-table-column
                    label="数量"
                    min-width="75"
                    prop="num">
            </el-table-column>
            <el-table-column
                    label="销售单价"
                    min-width="85"
                    prop="price">
            </el-table-column>
            <el-table-column
                    label="销售总价"
                    min-width="85"
                    prop="price_sum">
            </el-table-column>
            <el-table-column
                    label="成本均价"
                    min-width="85"
                    prop="cost_price">
            </el-table-column>
            <el-table-column
                    label="成本总价"
                    min-width="85"
                    prop="cost_price_sum">
            </el-table-column>
            <el-table-column
                    label="平台佣金"
                    min-width="85"
                    prop="commission">
            </el-table-column>
            <el-table-column
                    label="实际到账"
                    min-width="85"
                    prop="received">
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
        <!-- 上传 -->
        <el-dialog title="导入" v-model="dialogVisible" :close-on-click-modal="false" top="5%" style="text-align: center">
            <el-upload
                    class="upload-demo"
                    drag
                    accept="application/vnd.ms-excel,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    :on-success="success"
                    :on-error="error"
                    :action="action"
                    name="excel">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-dialog>
    </section>
</template>
<script>
    import {getOrderStatistics} from "../../api/api"
    export default {
        data () {
            return {
                tableData: [],
                sku_name: "",
                page: 1,
                per_page: 10,
                total: 100,
                time_quantum: "",
                start_date: "",
                end_date: "",
                value: "",
                size: "",
                platform: "",
                action: "",
                dialogVisible: false,
            }
        },
        created(){
            this.action = `${this.$store.state.urlBackstage}/finance/import/jddj?access_token=${sessionStorage.getItem('access_token')}`;
            this.size = this.$store.state.size;
            this.subMit();
            this.addEvent();
        },
        methods: {
            success(val){
                this.$message.info(val.message)
            },
            error(val){
                console.log(val)
            },
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.subMit();
                    }
                })
            },
            timeChange(val){
                this.time_quantum = val;
                if (this.time_quantum) {
                    this.start_date = this.time_quantum.split(" - ")[0] + " 00:00:00";
                    this.end_date = this.time_quantum.split(" - ")[1] + " 23:59:59";
                } else {
                    this.start_date = "";
                    this.end_date = "";
                }
            },
            educe(){
                window.open(`${this.$store.state.urlBackstage}/statistic/exportOrderCost?access_token=${sessionStorage.getItem('access_token')}&endTime=${this.end_date}&startTime=${this.start_date}&platform=${this.platform}&title=${this.sku_name}`)
            },
            reload(){
                this.sku_name = "";
                this.platform = "";
                this.value = "";
                this.start_date = "";
                this.end_date = "";
            },
            subMit(){
                let parm = {
                    page: this.page,
                    per_page: this.per_page,
                    title: this.sku_name,
                    platform: this.platform,
                    startTime: this.start_date,
                    endTime: this.end_date,
                }
                getOrderStatistics(parm).then((res) => {
                    this.tableData = res.data.data;
                    this.total = res.data.totalCount;
                })
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
                this.subMit();
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.subMit();
            },
        }
    }
</script>