<template>
    <section>
        <div id="orderDetails" style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.confirm_status == '未确认'">未出库，未确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else-if="tableData.confirm_status == '已确认'">
                未出库，未确认 => 已出库，已确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else-if="tableData.confirm_status == '无需确认'">
                未出库，未确认 => 已出库，无需确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else>未出库，未确认 => 失败</h3>
            <h3>出库信息</h3>
            <el-row>
                <el-col :span='8'>出库单号：{{tableData.outstock_bn}}</el-col>
                <el-col :span='8'>平台单号：{{tableData.tid}}</el-col>
                <el-col :span='8'>来源平台：{{platform}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>出库店铺：{{store.store_name}}</el-col>
                <el-col :span='8'>出库类型：{{tableData.type_id}}</el-col>
                <el-col :span='8'>创建日期：{{tableData.created_at}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>确认状态：{{tableData.confirm_status}}</el-col>
                <el-col :span='8'>确认时间：<span
                        v-if="tableData.confirm_at!='0000-00-00 00:00:00'">{{tableData.confirm_at}}</span></el-col>
                <el-col :span='8'>出库状态：{{tableData.out_status}}</el-col>
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
            <h3>店铺信息</h3>
            <el-row>
                <el-col :span='8'>店铺名称：{{store.store_name}}</el-col>
                <el-col :span='8'>店铺联系人：{{store.contacter}}</el-col>
                <el-col :span='8'>店铺电话：{{store.telephone}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>所在地区：{{store.area}}</el-col>
                <el-col :span='8'>详细地址：{{store.address}}</el-col>
            </el-row>
        </div>
        <div class="check-box">
            <el-button :plain="true" type="info" @click="getbacks" class="checks">返回</el-button>
            <el-button :plain="true" type="info" @click="prints" class="checks">打印出库单</el-button>
        </div>
    </section>
</template>

<script>
    import {WoutstockDetail} from '../../api/api'
    export default{
        data() {
            return {
                tableData: [],
                store: {},
                platform: "",
                url: ""
            }
        },
        created(){
            if (window.location.host == "testfonterp.kmjiu.com") {
                this.url = 'https://testfonterp.kmjiu.com';
            } else {
                this.url = 'https://fonterp.kmjiu.com';
            }
            WoutstockDetail(this.$route.query.outstock_id).then((res) => {
                this.tableData = res.data
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
                switch (this.tableData.type_id) {
                    case 6:
                        this.tableData.type_id = "其他出库";
                        break;
                    case 7:
                        this.tableData.type_id = "销售出库";
                        break;
                    case 10:
                        this.tableData.type_id = "盘亏出库";
                        break;
                }
                this.store = res.data.store;
                this.store.area = this.store.area.split(":")[0];
                if (!this.tableData.trade.source) {
                    this.tableData.trade.source = "";
                }
                switch (this.tableData.trade.source) {
                    case 'jddj':
                        this.platform = "京东到家";
                        break;
                    case 'bd':
                        this.platform = "百度外卖";
                        break;
                    case 'meituan':
                        this.platform = "美团外卖";
                        break;
                    case 'eleme':
                        this.platform = "饿了么";
                        break;
                }
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
            prints(){
                window.open(`${this.url}/W_outstock.html?${this.$route.query.outstock_id}?access_token=${sessionStorage.getItem('access_token')}`)
            },
            getbacks(){
                this.$router.push({
                    path: "/waimai_stocks/outstocks/lists",
                    query: {criteria: this.$route.query.criteria}
                })
            },
        }
    }
</script>