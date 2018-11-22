<template>
    <section class='bg' id="gg">
        <div v-if='bool' class='mengban'></div>
        <div v-if='bool' class='show'>
            <el-input v-model="sku_title" placeholder="商品名称" style='width: 200px'></el-input>
            <el-button type="primary" style='width: 150px' @click='getSkusList'>查询</el-button>
            <div id="close" @click="hidden">×</div>
            <!--列表-->
            <el-table
                    :data="tableDataII"
                    border
                    height="500"
                    style="width: 100%;margin-top: 20px;">
                <el-table-column
                        label="操作"
                        min-width="70">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click='addItemes(scope.$index)'>添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="物料名称"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        :formatter='props_valuesC'
                        prop="props_values"
                        label="规格"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        min-width="75">
                </el-table-column>
                <el-table-column
                        prop="sku_store"
                        label="物料库存"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="barcode"
                        label="条码"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="bn"
                        label="货号"
                        min-width="120">
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
            <div style='clear: both'></div>
            <div class=cen><el-button type="primary" style='width: 150px;' @click='hidden'>完成</el-button></div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;商品信息</h3>
            <el-row  class='bg' style="margin-top: 10px;">
                <el-col :span='21'>
                    <el-form label-width="120px" style="width: 100%;">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="需求单号：" required>
                                    <el-input v-model="demand_bn" class='col'></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="申请部门：" required>
                                    <el-select v-model="section" clearable placeholder="请选择申请部门" class="col">
                                        <el-option
                                                v-for="item in sections"
                                                :label="item.key"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="需求到货日期：">
                                    <el-date-picker
                                            style="width: 70%"
                                            v-model="finished_date"
                                            align="right"
                                            type="date"
                                            placeholder="选择日期"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeII">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <!--<el-col :span="10">-->
                                <!--<el-form-item label="申请日期" required>-->
                                    <!--<el-date-picker-->
                                            <!--style="width: 70%"-->
                                            <!--v-model="demand_date"-->
                                            <!--align="right"-->
                                            <!--type="date"-->
                                            <!--placeholder="选择日期"-->
                                            <!--:picker-options="pickerOptions"-->
                                            <!--@change="timeChangeI">-->
                                    <!--</el-date-picker>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <el-col :span="10">
                                <el-form-item label="需求入库仓库：">
                                    <el-select v-model="warehouse_id" clearable placeholder="需求入库仓库" class="col">
                                        <el-option
                                                v-for="item in warehouse"
                                                :label="item.warehouse_name"
                                                :value="item.warehouse_id"
                                                :key="item.warehouse_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class='bg'>
                <el-col :span='22' :offset="1">
                    <div style='padding: 10px;padding-left: 0;'>
                        <el-button type="primary" style='width: 150px;' @click='show'>选择物料</el-button>
                    </div>
                    <el-table
                            :data="tableDataI"
                            border
                            height="500"
                            style="width: 100%;  margin-bottom: 20px"
                            class="geFontSize_list">
                        <el-table-column
                                label="操作"
                                min-width="70">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click='removeItem(scope.$index)'>移除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="title"
                                label="物料名称"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                :formatter='props_valuesC'
                                prop="props_values"
                                label="规格"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                prop="weight"
                                label="重量(kg)"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="unit"
                                label="单位"
                                min-width="75">
                        </el-table-column>
                        <el-table-column
                                :formatter='store'
                                prop="sku_store"
                                label="物料库存"
                                min-width="85">
                        </el-table-column>
                        <el-table-column label="需求数量" width="95">
                            <template slot-scope="props">
                                <el-input v-model="props.row.num" style="width: 99%;"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="barcode"
                                label="条码"
                                min-width="180">
                        </el-table-column>
                        <el-table-column
                                prop="bn"
                                label="货号"
                                min-width="180">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;备注</h3>
            <el-row class="bg" style="padding: 20px;">
                <el-col :span="24">
                    <el-input
                            style='width: 100%;margin-bottom: 20px;'
                            :autosize="{ minRows: 4, maxRows: 8}"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="memo">
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-row class="bg" style='text-align: center;margin: 0;'>
            <el-button type="primary" class="btnw" @click="subMit">保存</el-button>
            <el-button class="btnw" @click="getBack">取消</el-button>
        </el-row>
    </section>
</template>

<script>
    import { getItemsList, getWareHousesList, addDemand, editDemand, demandDetail} from '../../api/api'
    export default {
        data () {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                tableDataI: [],
                tableDataII: [],
                bool: false,
                total: 100,
                page: 1,
                per_page: 10,
                memo: "",
                demand_bn: "",
                demand_date: "",
                time_demand: "",
                finished_date: "",
                time_finished: "",
                sections: [
                    {key:"技术部",value:"1"},{key:"设计部",value:"2"},
                    {key:"运营部",value:"13"},{key:"采购部",value:"6"},
                    {key:"销售部",value:"7"},{key:"财务部",value:"8"},
                    {key:"人事行政部",value:"9"},{key:"新媒体部",value:"10"},
                    {key:"物流仓储",value:"11"}
                ],
                section: "",
                warehouse: [],
                warehouse_id: "",
                sku_title: "",

            }
        },
        created () {
            if (this.$route.query.demand_id){
                demandDetail(this.$route.query.demand_id).then(res => {
                    this.memo = res.data.memo;
                    this.demand_bn = res.data.demand_bn;
                    this.warehouse_id = res.data.warehouse_id;
                    this.finished_date = res.data.demand_date;
                    this.tableDataI = res.data.items;
                    for (let i in this.sections){
                        if (this.sections[i].key == res.data.department){
                            this.section = this.sections[i].value;
                        }
                    }
                })
            }
            getWareHousesList().then(res => {
                this.warehouse = res.data.itemList
            }).catch(e => {
                console.log(e);
            })
            this.getSkusList();
        },
        methods: {
            getSkusList() {
                var parm = {
//                    warehouse_id: this.house,
                    page: this.page,
                    per_page: this.per_page,
                    sku_title: this.sku_title,
                }
                getItemsList(parm).then((res)=>{
                    this.tableDataII = res.data.skusList;
                    this.total = res.data.totalCount;
                    for(var i = 0;i < this.tableDataII.length;i++){
                        for (var j = 0;j < this.tableDataI.length;j++){
                            if (this.tableDataII[i].sku_id==this.tableDataI[j].sku_id){
                                this.tableDataII.splice(i,1)
                            }
                        }
                    }
                })
            },
            subMit(){
                let parm = {
                    demand_bn: this.demand_bn,
                    warehouse_id: this.warehouse_id,
                    demand_date: this.finished_date,
                    memo: this.memo,
                    department: parseInt(this.section),
                    items: [],
                }
                let arr = [];
                for (let i in this.tableDataI){
                    let obj = {};
                    obj.sku_id = this.tableDataI[i].sku_id;
                    obj.num = parseInt(this.tableDataI[i].num);
                    arr.push(obj)
                }
                parm.items = JSON.stringify(arr);
                if (this.$route.query.demand_id){
                    editDemand(parm,this.$route.query.demand_id).then(res => {
                        if (!res.error_code){
                            this.$message("编辑成功");
                            this.$router.push({path:"/demand/manager/list"})
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                }else {
                    addDemand(parm).then(res => {
                        if (!res.error_code){
                            this.$message("新增需求单成功");
                            this.$router.push({path:"/demand/manager/list"})
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                }
            },
            timeChangeI(val){
                this.time_demand = val;
            },
            timeChangeII(val){
                this.time_finished = val;
            },
            removeItem(index){
                this.tableDataII.unshift(this.tableDataI[index])
                this.tableDataI.splice(index,1)
            },
            addItemes(index){
                this.$set(this.tableDataII[index],"num",1)
                this.tableDataI.push(this.tableDataII[index])
                this.tableDataII.splice(index,1)
            },
            handleItemChange(val) {
                this.cat_id = val[this.cat_ids.length - 1]
            },
            props_valuesC(val){
                var str = '';
                if (typeof val.props_values == "string"){return val.props_values}
                for(var i = 0; i < val.props_values.length;i++){
                    str =  val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                }
                return str;
            },
            store(val){
                if (val.store){
                    return val.store
                }else {
                    return val.sku_store
                }
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getSkusList();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getSkusList();
                return;
            },
            show(){
                $("#gg").css({overflow:"hidden",height:"810px"})
                this.bool = true;
            },
            hidden(){
                $("#gg").css({overflow:"",height:""})
                this.bool = false;
            },
            getBack(){
                this.$router.push({path: "/demand/manager/list"})
            }
        }
    }
</script>
