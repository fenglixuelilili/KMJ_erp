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
                    <template scope="scope">
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
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="需求到货日期">
                                    <el-date-picker
                                            style="width: 70%"
                                            v-model="finished_date"
                                            align="right"
                                            type="date"
                                            placeholder="选择日期"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeI">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="申请日期" required>
                                    <el-date-picker
                                            style="width: 70%"
                                            v-model="demand_date"
                                            align="right"
                                            type="date"
                                            placeholder="选择日期"
                                            :picker-options="pickerOptions"
                                            @change="timeChangeII">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="需求入库仓库">
                                    <el-select v-model="warehouse_id" clearable placeholder="需求入库仓库" class="col">
                                        <el-option
                                                v-for="item in warehouse"
                                                :label="item.warehouse_name"
                                                :value="item.warehouse_id">
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
                            style="width: 100%;  margin-bottom: 20px">
                        <el-table-column
                                label="操作"
                                min-width="70">
                            <template scope="scope">
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
                                prop="sku_store"
                                label="物料库存"
                                min-width="75">
                        </el-table-column>
                        <el-table-column label="需求数量" width="95">
                            <template scope="props">
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
            <el-button class="btnw" @click="">取消</el-button>
        </el-row>
    </section>
</template>

<script>
    import { getItemsList, getWareHousesList} from '../../api/api'
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
                total: 200,
                page: 1,
                per_page: 10,
                memo: "",
                section: "",
                demand_bn: "",
                demand_date: "",
                finished_date: "",
                sections: [{key:"技术部",value:"0"}],
                section: "",
                warehouse: [],
                warehouse_id: "",

            }
        },
        created () {
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
                    warehouse_id: this.house,
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

            },
            timeChangeI(val){
                console.log(val)
            },
            timeChangeII(val){
                console.log(val)
            },
            removeItem(index){
                this.tableDataII.unshift(this.tableDataI[index])
                this.tableDataI.splice(index,1)
            },
            addItemes(index){
                this.tableDataII[index].num = 1;
                this.tableDataI.push(this.tableDataII[index])
                this.tableDataII.splice(index,1)
            },
            handleItemChange(val) {
                this.cat_id = val[this.cat_ids.length - 1]
            },
            props_valuesC(val){
                var str = '';
                for(var i = 0; i < val.props_values.length;i++){
                    str =  val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                }
                return str;
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
            }
        }
    }
</script>
