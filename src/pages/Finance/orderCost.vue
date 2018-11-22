<template>
    <section>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="sku名称：" class="hspace">
                                    <el-input v-model="sku_title" placeholder="请输入sku名称" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="来源平台：">
                                    <el-select v-model="platform" clearable placeholder="来源平台" filterable class="col" :size="size">
                                        <el-option
                                                v-for="item in platform_option"
                                                :label="item.key"
                                                :value="item.val"
                                                :key="item.key">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="统计日期：">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="value"
                                            type="daterange"
                                            align="right"
                                            placeholder="选择统计日期范围"
                                            :picker-options="pickerOptions"
                                            @change="timeChange">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="subMit" :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" class='btnw' @click='educe' :size="size">导出</el-button>
                </el-col>
            </el-row>
        </div>
        <!-- 表格 -->
        <el-table
                v-loading="isLoading"
                border
                :data="tableData"
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column
                    prop="platform"
                    label="平台"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="sku名称"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="barcode"
                    label="sku编码"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="props_values"
                    label="规格"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop="weight"
                    label="重量"
                    min-width="75">
            </el-table-column>
            <el-table-column
                    prop="unit"
                    label="单位"
                    min-width="75">
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="数量"
                    min-width="75">
            </el-table-column>
            <el-table-column
                    prop="sale_price"
                    label="销售单价"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="sale_fee"
                    label="销售总价"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="cost_price"
                    label="成本均价"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="cost_fee"
                    label="成本总价"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="received_fee"
                    label="实际到账"
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
    import { getOrderCost } from '../../api/api'
    export default{
        data (){
            return {
                pickerOptions: this.$store.state.pickerOptions,
                tableData: [],
                total: 100,
                page: 1,
                per_page: 10,
                size: this.$store.state.size,
                sku_title: "",
                startTime: "",
                endTime: "",
                timeStr: "",
                value: "",
                platform_option: [{key:"全部",val:""},{key:"京东",val:"jd"},{key:"天猫",val:"tm"},{key:"快买酒",val:"kmjiu"}],
                platform: "",
                isLoading: false
            }
        },
        created(){
            this.addEvent();
            this.subMit();
        },
        methods:{
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.subMit();
                    }
                })
            },
            reLoad(){
                this.sku_title = "";
                this.value = "";
                this.platform = "";
            },
            subMit(){
                let parm = {
                    page: this.page,
                    per_page: this.per_page,
                    sku_title: this.sku_title,
                    platform: this.platform,
                    startTime: this.startTime,
                    endTime: this.endTime,
                }
                this.isLoading = true;
                getOrderCost(parm).then(res => {
                    this.isLoading = false;
                    this.tableData = res.data.data;
                    this.total = res.data.totalCount;
                })
            },
            educe(){
                window.open(`${this.$store.state.urlBackstageApi}/finance/trades/exportOrderCost?access_token=${sessionStorage.getItem('access_token')}&sku_title=${this.sku_title}&platform=${this.platform}&startTime=${this.startTime}&endTime=${this.endTime}`)
            },
            timeChange(val){
                this.timeStr = val;
                if (this.timeStr) {
                    this.startTime = this.timeStr.split(" - ")[0] + " 00:00:00";
                    this.endTime = this.timeStr.split(" - ")[1] + " 23:59:59"
                } else {
                    this.startTime = "";
                    this.endTime = "";
                }
            },
            handleSizeChange(val){
                this.per_page = val;
                this.subMit();
            },
            handleCurrentChange(val){
                this.page = val;
                this.subMit();
            }
        }
    }
</script>