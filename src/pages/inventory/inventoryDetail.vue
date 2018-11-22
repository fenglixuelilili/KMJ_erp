<template>
    <section>
        <div id="orderDetails" style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.status == '未生效'">未生效，未确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else-if="tableData.status == '已生效'&&tableData.confirm_status == '未确认'">未生效，未确认 => 生效中，未确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else-if="tableData.confirm_status == '已确认'">未生效，未确认 => 生效中，未确认 => 生效中，已确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else-if="tableData.confirm_status == '已完成'">未生效，未确认 => 生效中，未确认 => 生效中，已确认 => 生效中，已完成</h3>
            <h3 style="text-align:center;font-weight:normal" v-else>未出库，未确认 => 失败</h3>
            <h3>盘点信息</h3>
            <el-row>
                <el-col :span='8'>盘点单号：{{tableData.inventory_bn}}</el-col>
                <el-col :span='8'>盘点员：{{tableData.operator}}</el-col>
                <el-col :span='8'>库存截止时间：{{tableData.stock_deadline}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>确认状态：{{tableData.confirm_status}}</el-col>
                <el-col :span='8'>盘点仓库：{{warehouse.warehouse_name}}</el-col>
                <el-col :span='8'>盘点单执行状态：{{tableData.status}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>完成时间：<span v-if="tableData.confirm_at!='0000-00-00 00:00:00'">{{tableData.finished_at}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>备注信息：{{tableData.memo}}</el-col>
            </el-row>
        </div>
        <div style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3>物料信息</h3>
            <el-table
                    border
                    :data="tableData.items"
                    style="width: 100%">
                <el-table-column
                        label="缩略图"
                        width="100">
                    <template slot-scope="props">
                        <img :src="props.row.default_image">
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sku_title"
                        label="sku标题"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="sub_title"
                        label="副标题"
                        width="150">
                </el-table-column>
                <el-table-column
                        :formatter="props_valuesC"
                        prop="props_values"
                        label="规格"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        width="75">
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="截止库存"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="outstock_nums"
                        label="出库数量"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="instock_nums"
                        label="入库数量"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="end_num"
                        label="盘点库存"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="diff_num"
                        label="盘点差额"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="barcode"
                        label="条码"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="bn"
                        label="货号"
                        width="180">
                </el-table-column>
            </el-table>

        </div>
        <div style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3>仓库信息</h3>
            <el-row>
                <el-col :span='8'>仓库名称：{{warehouse.warehouse_name}}</el-col>
                <el-col :span='8'>仓库编号：{{warehouse.warehouse_number}}</el-col>
                <el-col :span='8'>仓库负责人：{{warehouse.manager}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>所在地区：{{warehouse.area}}</el-col>
                <el-col :span='8'>详细地址：{{warehouse.address}}</el-col>
            </el-row>
        </div>
        <div class="check-box">
            <el-button :plain="true" type="info" @click="getback" class="checks">返回</el-button>
            <el-button :plain="true" type="info" @click="prints" class="checks">打印盘点单</el-button>
        </div>
    </section>
</template>

<script>
    import { IncentoryDetail } from '../../api/api'
    export default{
        data() {
            return {
                tableData: [],
                warehouse: [],
                urlp: ""
            }
        },
        created(){
            if (window.location.host == "testfonterp.kmjiu.com"){
                this.urlp = 'https://testfonterp.kmjiu.com';
            }else{
                this.urlp = 'https://fonterp.kmjiu.com';
            }
            var parm ={inventory_id: this.$route.query.inventory_id };
            IncentoryDetail(this.$route.query.inventory_id,parm).then((res)=>{
                this.tableData = res.data;
                this.warehouse = res.data.warehouse[0];
                this.warehouse.area = this.warehouse.area.split(":")[0]
                switch ( this.tableData.confirm_status){
                    case '0':
                        this.tableData.confirm_status = '无需确认';
                        break;
                    case '1':
                        this.tableData.confirm_status = '未确认';
                        break;
                    case '2':
                        this.tableData.confirm_status = '已确认';
                        break;
                    case '3':
                        this.tableData.confirm_status = '已完成';
                        break;
                }
                switch ( this.tableData.status){
                    case '0':
                        this.tableData.status = '未生效';
                        break;
                    case '1':
                        this.tableData.status = '已生效';
                        break;
                    default:
                        this.tableData.status = '取消盘点';
                }
            })
        },
        methods: {
            props_valuesC(val){
                var str = '';
                if (val){
                    for(var i = 0; i < val.props_values.length;i++){
                        str =  val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                    }
                    return str
                }
            },
            production_dateC(val){
                if(val.production_date == "0000-00-00"){
                    return "";
                } else {
                    return val.production_date;
                }
            },
            prints(){
                window.open(`${this.urlp}/inventory.html?${this.$route.query.inventory_id}?access_token=${sessionStorage.getItem('access_token')}&inventory_id=${this.$route.query.inventory_id}`)
            },
            getback(){
                this.$router.push({path: '/warehouses/inventory/list',query:{criteria:this.$route.query.criteria}})
            }
        }
    }
</script>