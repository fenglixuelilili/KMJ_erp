<template>
    <section>
        <HS></HS>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="需求单号" class="hspace">
                                    <el-input v-model="demand_bn" placeholder="请输入需求单号"  class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="申请日期" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="demand_date"
                                            type="daterange"
                                            align="right"
                                            placeholder="选择日期范围"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeI">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <!--<el-col :span="8">-->
                                <!--<el-form-item label="完成日期" class="hspace">-->
                                    <!--<el-date-picker-->
                                            <!--class="col"-->
                                            <!--:size="size"-->
                                            <!--v-model="finished_date"-->
                                            <!--type="daterange"-->
                                            <!--align="right"-->
                                            <!--placeholder="选择日期范围"-->
                                            <!--:picker-options="pickerOptions"-->
                                            <!--@change="timeChangeII">-->
                                    <!--</el-date-picker>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <el-col :span="8">
                                <el-form-item label="申请人">
                                    <el-input v-model="proposer" placeholder="请输入申请人"  class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="生效状态">
                                    <el-select v-model="takeEffect_status" clearable placeholder="请选择" class="col" :size="size">
                                        <el-option
                                                v-for="item in takeEffect"
                                                :label="item.key"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="确认状态">
                                    <el-select v-model="confirm_status" clearable placeholder="请选择" class="col" :size="size">
                                        <el-option
                                                v-for="item in confirm"
                                                :label="item.key"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click='subMit' :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" class='btnw' @click='addDemands' :size="size">新增需求单</el-button>
                </el-col>
            </el-row>
        </div>
        <!--列表-->
        <el-table
                v-loading="isLoading"
                :data="tableData"
                border
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table style="width: 100%" :data="props.row.items" border class="geFontSize_list">
                        <el-table-column label="sku标题" prop="title">
                        </el-table-column>
                        <el-table-column label="副标题" prop="sub_title">
                        </el-table-column>
                        <el-table-column label="规格" prop="props_values">
                        </el-table-column>
                        <el-table-column label="单位" prop="unit">
                        </el-table-column>
                        <el-table-column label="重量" prop="weight">
                        </el-table-column>
                        <el-table-column label="物料库存" prop="store">
                        </el-table-column>
                        <el-table-column label="需求数量" prop="num">
                        </el-table-column>
                        <el-table-column label="条码" prop="barcode">
                        </el-table-column>
                        <el-table-column label="货号" prop="bn">
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
                    type="index"
                    width="55">
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="105">
                <template slot-scope="scope">
                    <p>
                        <el-button type="text" :size="size" @click="effect(scope.row)" v-if="scope.row.effective_status == 0">生效</el-button>
                        <el-button type="text" :size="size" @click="audit(scope.row)" v-if="scope.row.effective_status == 1&&scope.row.confirm_status == 0">确认</el-button>
                        <el-button type="text" :size="size" @click="finished(scope.row)" v-if="scope.row.confirm_status == 1">完成</el-button>
                        <el-button type="text" :size="size" @click='edit(scope.row)' v-if="scope.row.effective_status == 1||scope.row.confirm_status == 0">编辑</el-button>
                    </p>
                    <p>
                        <el-button type="text" :size="size" @click='prints(scope.row)'>打印</el-button>
                        <el-button type="text" :size="size" @click='remove(scope.row)' class="remove" v-if="scope.row.effective_status == 0">删除</el-button>
                    </p>
                </template>
            </el-table-column>
            <el-table-column
                    prop="demand_bn"
                    label="需求单号"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="department"
                    label="申请部门"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    prop="creator"
                    label="申请人"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="created_at"
                    label="申请时间"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="demand_date"
                    label="需求到货日期"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop="warehouse_name"
                    label="需求入库仓库"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    :formatter="effective_status"
                    prop="effective_status"
                    label="生效状态"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    :formatter="confirm_statu"
                    prop="confirm_status"
                    label="确认状态"
                    min-width="85">
            </el-table-column>
            <el-table-column
                    prop="effective_at"
                    label="生效时间"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="confirm_at"
                    label="确认时间"
                    min-width="100">
            </el-table-column>
            <el-table-column prop="memo" label="备注" min-width="170">
                <template slot-scope="props">
                    <elliptical :message="props.row.memo"></elliptical>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <template>
            <div class="block" style="padding:10px;padding-left:0;float: right">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="per_page"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </template>
    </section>
</template>

<script>
    import { demandList, removeDemand, demandEffect, demandConfirm, demandFinished } from '../../api/api'
    export default {
        data () {
            return {
                pickerOptions: this.$store.state.pickerOptions,
                isLoading: false,
                tableData: [],
                url: "",
                demand_bn: "",
                time_demand: "",
                time_finished: "",
                demand_date: [],
                finished_date: [],
                proposer: "",
                takeEffect_status: "",
                takeEffect: [{key:"全部",value:""},{key:"未生效",value:"0"},{key:"已生效",value:"1"},{key:"已完成",value:"2"},],
                confirm_status: "",
                confirm: [{key:"全部",value:""},{key:"未确认",value:"0"},{key:"已确认",value:"1"},{key:"已完成",value:"2"},],
                page: 1,
                per_page: 10,
                total: 100,
                size: this.$store.state.size
            }
        },
        created () {

            this.addEventL();
            this.subMit();
        },
        methods: {
            addEventL(){
                var _this = this;
                $(window).keyup(function(event){
                    if(event.keyCode == 13){
                        _this.subMit();
                    }
                })
            },
            subMit(){
                let parm = {
                    per_page: this.per_page,
                    page: this.page,
                    finish_start: this.finished_start_date,
                    finish_end: this.finished_end_date,
                    created_start: this.demand_start_date,
                    created_end: this.demand_end_date,
                    confirm_status: this.confirm_status,
                    effective_status: this.takeEffect_status,
                    demand_bn: this.demand_bn,
                    creator: this.proposer,
                    sort_type: "DESC",
                    sort_by: "updated_at"
                }
                this.isLoading = true;
                demandList(parm).then(res => {
                    this.isLoading = false;
                    this.tableData = res.data.data;
                    this.total = res.data.totalCount;
                })
            },
            finished(val){
                this.$confirm('确认需求单完成?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'right',
                    type: 'warning'
                }).then(() => {
                    let _this = this;
                    demandFinished(val.demand_id).then(res => {
                        if (!res.error_code){
                            _this.subMit();
                            _this.$message("需求单已完成");
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                }).catch((error) => {
                    console.error(error)
                });
            },
            prints(val){
                window.open(`${this.$store.state.url}/demand.html?${val.demand_id}?access_token=${sessionStorage.getItem('access_token')}`)
            },
            audit(val){
                this.$confirm('确认通过审核?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'right',
                    type: 'warning'
                }).then(() => {
                    let _this = this;
                    demandConfirm(val.demand_id).then(res => {
                        if (!res.error_code){
                            _this.subMit();
                            _this.$message("需求单已确认");
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                }).catch((error) => {
                    console.log(error)
                });
            },
            effect(val){
                this.$confirm('需求单生效生将进入审核流程?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'right',
                    type: 'warning'
                }).then(()=>{
                    let _this = this;
                    demandEffect(val.demand_id).then(res => {
                        if (!res.error_code){
                            _this.subMit();
                            _this.$message("需求单已生效");
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                })
            },
            addDemands(){
                this.$router.push({path:'/demand/manager/add'})
            },
            remove(val){
                var _this = this;
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'right',
                    type: 'warning'
                }).then(() => {
                    removeDemand(val.demand_id).then(res => {
                        if (!res.error_code){
                            _this.subMit();
                            _this.$message("删除成功");
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                }).catch((error) => {
                    console.log(error)
                });
            },
            edit(val){
                this.$router.push({path:"/demand/manager/edit",query:{demand_id: val.demand_id}});
            },
            detail(val){
                this.$router.push({path:"",query:{}});
            },
            effective_status(item){
                if (item.effective_status == 0){
                    return "未生效";
                }else if (item.effective_status == 1){
                    return "已生效";
                }else if (item.effective_status == 2){
                    return "取消盘点";
                }
            },
            confirm_statu(item){
                if (item.confirm_status == 0){
                    return "未确认";
                }else if (item.confirm_status == 1){
                    return "已确认";
                }else if (item.confirm_status == 2){
                    return "已完成";
                }
            },
            reLoad(){
                this.demand_date = [];
                this.finished_date = [];
                this.proposer = "";
                this.takeEffect_status = "";
                this.confirm_status = "";
                this.demand_bn = "";
            },
            timeChangeI(val){
                this.time_demand = val;
                if (this.time_demand) {
                    this.demand_start_date = this.time_demand.split(" - ")[0]+" 00:00:00";
                    this.demand_end_date = this.time_demand.split(" - ")[1]+" 23:59:59";
                }else{
                    this.demand_start_date = "";
                    this.demand_end_date = "";
                }
            },
            timeChangeII(val){
                this.time_finished = val;
                if (this.time_finished) {
                    this.finished_start_date = this.time_finished.split(" - ")[0]+" 00:00:00";
                    this.finished_end_date = this.time_finished.split(" - ")[1]+" 23:59:59";
                }else{
                    this.finished_start_date = "";
                    this.finished_end_date = "";
                }
            },
            handleSizeChange(val){
                this.per_page = val;
                this.subMit();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.subMit();
                return;
            },
        }
    }
</script>