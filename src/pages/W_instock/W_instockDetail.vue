<template>
    <section>
        <div id="orderDetails" style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.confirm_status == '未确认'">未入库，未确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else-if="tableData.confirm_status == '已确认'">
                未入库，未确认 => 已入库，已确认</h3>
            <h3 style="text-align:center;font-weight:normal" v-else>未入库，未确认 => 失败</h3>
            <h3>入库信息</h3>
            <el-row>
                <el-col :span='8'>入库单号：{{tableData.instock_bn}}</el-col>
                <el-col :span='8'>配送单号：{{tableData.post_bn}}</el-col>
                <el-col :span='8'>创建日期：{{tableData.created_at}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>入库店铺：{{store.store_name}}</el-col>
                <el-col :span='8'>入库类型：{{tableData.type_id}}</el-col>
                <el-col :span='8'>人库状态：{{tableData.in_status}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>确认状态：{{tableData.confirm_status}}</el-col>
                <el-col :span='8'>确认时间：<span
                        v-if="tableData.confirm_at!='0000-00-00 00:00:00'">{{tableData.confirm_at}}</span></el-col>
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
            <el-button :plain="true" type="info" @click="getback" class="checks">返回</el-button>
            <el-button :plain="true" type="info" @click="prints" class="checks">打印人库单</el-button>
        </div>
    </section>
</template>

<script>
    import {WinstockDetail} from '../../api/api'
    export default{
        data() {
            return {
                tableData: [],
                store: {},
                url: ""
            }
        },
        created(){
            if (window.location.host == "testfonterp.kmjiu.com") {
                this.url = 'https://testfonterp.kmjiu.com';
            } else {
                this.url = 'https://fonterp.kmjiu.com';
            }
            WinstockDetail(this.$route.query.instock_id).then((res) => {
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
                switch (this.tableData.in_status) {
                    case '0':
                        this.tableData.in_status = '未入库';
                        break;
                    case '1':
                        this.tableData.in_status = '已人库';
                        break;
                    default:
                        this.tableData.in_status = '失败';
                }
                switch (this.tableData.type_id) {
                    case 1:
                        this.tableData.type_id = "配送入库";
                        break;
                    case 9:
                        this.tableData.type_id = "盘盈入库";
                        break;
                }
                this.store = res.data.store;
                this.store.area = this.store.area.split(":")[0];
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
                window.open(`${this.url}/W_instock.html?${this.$route.query.instock_id}?access_token=${sessionStorage.getItem('access_token')}`)
            },
            getback(){
                this.$router.push({
                    path: "/waimai_stocks/instocks/lists",
                    query: {criteria: this.$route.query.criteria}
                })
            },
        }
    }
</script>