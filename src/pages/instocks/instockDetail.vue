<template>
    <section>
        <div id="orderDetails" style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.confirm_status == '未确认'">未入库，未确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else-if="tableData.confirm_status == '已确认'">未入库，未确认 => 已入库，已确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else>未入库，未确认 => 失败</h3>
            <h3>入库信息</h3>
            <el-row>
                <el-col :span='8'>入库单号：{{tableData.instock_bn}}</el-col>
                <el-col :span='8'>入库员：{{tableData.operator_name}}</el-col>
                <el-col :span='8'>创建时间：{{tableData.created_at}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>入库仓库：{{tableData.warehouse_name}}</el-col>
                <el-col :span='8'>入库状态：{{tableData.in_status}}</el-col>
                <el-col :span='8'>入库单执行状态：{{tableData.self_status}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>确认状态：{{tableData.confirm_status}}</el-col>
                <el-col :span='8'>入库类型：{{tableData.type_id}}</el-col>
                <el-col :span='8'>确认日期：<span v-if="tableData.confirm_at!='0000-00-00 00:00:00'">{{tableData.confirm_at}}</span></el-col>
            </el-row>
            <el-row v-if="this.tableData.type_id != '采购入库'&&this.tableData.original_id">
                <el-col :span="8">出库单号：{{outDetail.outstock_bn}}</el-col>
                <el-col :span="8">出货仓库：{{outDetail.warehouse_name}}</el-col>
            </el-row>
            <el-row v-if="this.tableData.type_id == '采购入库'">
                <el-col :span="8">采购单号：{{bn}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>备注信息：{{tableData.memo}}</el-col>
            </el-row>
        </div>
        <div style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3>物料信息</h3>
            <el-table
                    :data="tableData.items"
                    border
                    style="width: 100%">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="sku标题"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        label="缩略图"
                        width="120">
                    <template slot-scope="props">
                        <img :src="props.row.default_image" alt="" style="width:100%">
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sub_title"
                        label="副标题"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        :formatter='props_valuesC'
                        prop="props_values"
                        label="规格"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="入库数量"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="入库单价(元)"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        :formatter='production_dateC'
                        prop="production_date"
                        label="生产日期"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="shelf_life"
                        label="保质期(天)"
                        min-width="140">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量"
                        min-width="120">
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
        </div>
        <div style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3>仓库信息</h3>
            <el-row>
                <el-col :span='8'>仓库名称：{{tableData.warehouse_name}}</el-col>
                <el-col :span='8'>仓库编号：{{tableData.warehouse_number}}</el-col>
                <el-col :span='8'>仓库负责人：{{tableData.manager}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>所在地区：{{tableData.area}}</el-col>
                <el-col :span='8'>详细地址：{{tableData.address}}</el-col>
            </el-row>
        </div>
        <div class="check-box">
            <el-button :plain="true" type="info" @click="getback" class="checks">返回</el-button>
            <el-button :plain="true" type="info" @click="prints" class="checks">打印入库单</el-button>
        </div>
    </section>
</template>

<script>
    import { getInstocksDetail, getOutstocksDetail, PurchaseDetail } from '../../api/api'
    export default{
        data() {
            return {
                tableData: [],
                supplier: [],
                url: "",
                bn: "",
                outDetail: {}
            }
        },
        created(){
            if (window.location.host == "testfonterp.kmjiu.com"){
                this.url = 'https://testfonterp.kmjiu.com';
            }else{
                this.url = 'https://fonterp.kmjiu.com';
            }
            getInstocksDetail(this.$route.query.instock_id).then((res)=>{
                this.tableData = res.data
                switch ( this.tableData.type_id){
                    case 1:
                        this.tableData.type_id = "采购入库";
                        break;
                    case 2:
                        this.tableData.type_id = "调拨入库";
                        break;
                    case 9:
                        this.tableData.type_id = "盘盈出库";
                        break;
                    case 5:
                        this.tableData.type_id = "直接入库";
                        break;
                    case 16:
                        this.tableData.type_id = "归还入库";
                        break;
                    case 18:
                        this.tableData.type_id = "冲抵入库";
                        break;
                    case 19:
                        this.tableData.type_id = "退货入库";
                        break;
                }
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
                }
                switch ( this.tableData.in_status){
                    case '0':
                        this.tableData.in_status = '未入库';
                        break;
                    case '1':
                        this.tableData.in_status = '已入库';
                        break;
                    default:
                        this.tableData.in_status = '失败';
                }
                switch ( this.tableData.self_status){
                    case '0':
                        this.tableData.self_status = '取消入库 ';
                        break;
                    case '1':
                        this.tableData.self_status = '生效中';
                        break;
                    case '2':
                        this.tableData.self_status = '已关闭';
                        break;
                }
                getOutstocksDetail(this.tableData.original_id).then((res)=>{
                    this.outDetail = res.data;
                    console.log(this.outDetail)
                })
                var parm = {po_id:this.tableData.original_id}
                PurchaseDetail(this.tableData.original_id,parm).then((res)=>{
                    this.bn = res.data.po_bn
                })
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
                window.open(`${this.url}/inStock.html?${this.$route.query.instock_id}?access_token=${sessionStorage.getItem('access_token')}`)
            },
            getback(){
                this.$router.push({path: '/iostocks/instocks/manager/list',query:{criteria: this.$route.query.criteria}})
            }
        }
    }
</script>