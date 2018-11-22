<template>
    <section>
        <div id="orderDetails" style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.confirm_status == '未确认'">未出库，未确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else-if="tableData.confirm_status == '已确认'">
                未出库，未确认 => 已出库，已确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else>未出库，未确认 => 失败</h3>
            <h3>入库信息</h3>
            <el-row>
                <el-col :span='8'>出库单号：{{tableData.outstock_bn}}</el-col>
                <el-col :span='8'>出库员：{{tableData.operator_name}}</el-col>
                <el-col :span='8'>创建时间：{{tableData.created_at}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>出库仓库：{{tableData.warehouse_name}}</el-col>
                <el-col :span='8'>出库状态：{{tableData.out_status}}</el-col>
                <el-col :span='8'>出库单执行状态：{{tableData.self_status}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>确认状态：{{tableData.confirm_status}}</el-col>
                <el-col :span='8'>出库类型：{{tableData.type_id}}</el-col>
                <el-col :span='8'>确认时间：<span
                        v-if="tableData.confirm_at!='0000-00-00 00:00:00'">{{tableData.confirm_at}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>出库部门：{{tableData.department}}</el-col>
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
                        label="出库数量"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="出库单价(元)"
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
            <el-button :plain="true" type="info" @click="prints" class="checks">打印出库单</el-button>
        </div>
    </section>
</template>

<script>
    import {getOutstocksDetail} from '../../api/api'
    export default{
        data() {
            return {
                tableData: [],
                supplier: [],
                url: ""
            }
        },
        created(){
            if (window.location.host == "testfonterp.kmjiu.com") {
                this.url = 'https://testfonterp.kmjiu.com';
            } else {
                this.url = 'https://fonterp.kmjiu.com';
            }
            getOutstocksDetail(this.$route.query.outstock_id).then((res) => {
                this.tableData = res.data
                switch (this.tableData.type_id) {
                    case 11:
                        this.tableData.type_id = "客送";
                        break;
                    case 10:
                        this.tableData.type_id = "盘亏出库";
                        break;
                    case 8:
                        this.tableData.type_id = "外卖门店配货";
                        break;
                    case 7:
                        this.tableData.type_id = "销售出库";
                        break;
                    case 6:
                        this.tableData.type_id = "其他出库";
                        break;
                    case 4:
                        this.tableData.type_id = "调拨出库";
                        break;
                    case 3:
                        this.tableData.type_id = "采购退货出库";
                        break;
                    case 12:
                        this.tableData.type_id = "品鉴";
                        break;
                    case 13:
                        this.tableData.type_id = "报损出库";
                        break;
                    case 14:
                        this.tableData.type_id = "餐饮店配货";
                        break;
                    case 15:
                        this.tableData.type_id = "借货出库";
                        break;
                }
                switch (this.tableData.confirm_status) {
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
                switch (this.tableData.out_status) {
                    case '0':
                        this.tableData.out_status = '未出库';
                        break;
                    case '1':
                        this.tableData.out_status = '已出库';
                        break;
                    default:
                        this.tableData.out_status = '失败';
                }
                switch (this.tableData.self_status) {
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
                switch(this.tableData.department){
                    case 1:
                        this.tableData.department = "技术部";
                        break;
                    case 2:
                        this.tableData.department = "设计部";
                        break;
                    case 3:
                        this.tableData.department = "电商一部";
                        break;
                    case 4:
                        this.tableData.department = "电商二部";
                        break;
                    case 5:
                        this.tableData.department = "电商三部";
                        break;
                    case 6:
                        this.tableData.department = "采购部";
                        break;
                    case 7:
                        this.tableData.department = "销售部";
                        break;
                    case 8:
                        this.tableData.department = "财务部";
                        break;
                    case 9:
                        this.tableData.department = "人事行政部";
                        break;
                    case 10:
                        this.tableData.department = "新媒体部";
                        break;
                    case 11:
                        this.tableData.department = "物流仓储";
                        break;
                    case 12:
                        this.tableData.department = "渠道部";
                        break;
                    case 13:
                        this.tableData.department = "运营部";
                        break;
                }
//                this.supplier = res.data.supplier
//                this.supplier.area = this.supplier.area.split(":")[0]
            })
        },
        methods: {
            props_valuesC(val){
                var str = '';
                if (val) {
                    for (var i = 0; i < val.props_values.length; i++) {
                        str = val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                    }
                    return str
                }
            },
            production_dateC(val){
                if (val.production_date == "0000-00-00") {
                    return "";
                } else {
                    return val.production_date;
                }
            },
            prints(){
                window.open(`${this.url}/outStock.html?${this.$route.query.outstock_id}?access_token=${sessionStorage.getItem('access_token')}`)
            },
            getback(){
                this.$router.push({
                    path: '/iostocks/outstocks/manager/list',
                    query: {criteria: this.$route.query.criteria}
                })
            }
        }
    }
</script>