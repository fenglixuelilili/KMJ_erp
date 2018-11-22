<template>
    <section>
        <div id="orderDetails" style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.status=='WAIT_BUYER_PAY'">已下单，待付款</h3>
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.status=='WAIT_SELLER_SEND_GOODS'">已下单，待付款 => 已支付，待发货</h3>
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.status=='TRADE_CLOSED_BY_SYSTEM'">已下单，待付款 => 系统取消订单</h3>
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.status=='TRADE_CLOSED_BY_BUYER'">已下单，待付款 => 用户取消订单</h3>
            <h4 style="text-align:center;font-weight:normal" v-if="tableData.status=='TRADE_CLOSED_BY_SYSTEM'">取消原因：{{tableData.cancel_reason}}</h4>
            <h4 style="text-align:center;font-weight:normal" v-if="tableData.status=='TRADE_CLOSED_BY_BUYER'">取消原因：{{tableData.cancel_reason}}</h4>
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.status=='WAIT_BUYER_CONFIRM_GOODS'">已下单，待付款 => 已支付，待发货 => 已发货，待收货</h3>
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.status=='TRADE_FINISHED'">已下单，待付款 => 已支付，待发货 => 已发货，待收货 => 已完成</h3>
            <h3>订单信息 <span style="font-weight: normal">订单来源：{{tableData.store_name}}</span></h3>
            <h4>收货人信息</h4>
            <el-row>
                <el-col :span='8'>姓名：{{tableData.receiver_name}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>手机：{{tableData.receiver_mobile}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>邮编：{{tableData.receiver_zip}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='16'>收货地区：{{tableData.receiver_area | delNumber}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='16'>收货地址：{{tableData.receiver_address}}</el-col>
            </el-row>
            <h4>发票信息</h4>
            <el-row>
                <el-col :span="8">发票类型：{{tableData.invoice_type}}</el-col>
                <el-col :span="8">发票内容：{{tableData.invoice_main}}</el-col>
                <el-col :span="8">发票抬头：{{tableData.invoice_name}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="24">用户备注：{{tableData.buyer_message}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="24">商家备注：{{tableData.vender_remark}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="24">添加商家备注：
                    <el-input v-model="momo" placeholder="" class="col"></el-input>
                    <el-button type="primary" @click="dialogTableVisible=true">保存</el-button>
                </el-col>
            </el-row>
            <el-dialog title="备注信息" v-model="dialogTableVisible">
                <div style="margin-bottom: 10px;">
                    <el-radio class="radio" v-model="radio" label="1">全部修改</el-radio>
                    <el-radio class="radio" v-model="radio" label="2">追加至原有备注后</el-radio>
                </div>
                <el-row>
                    <el-col :span="24" style="text-align: center;padding-top: 10px;">
                        <el-button type="primary" @click="addMemo">确认添加</el-button>
                        <el-button type="primary" @click="dialogTableVisible=false">取消操作</el-button>
                    </el-col>
                </el-row>
            </el-dialog>
            <h3 v-if="ab">异常原因</h3>
            <p v-if="ab">{{statusInfo}}</p>
        </div>
        <div style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3>物料信息</h3>
            <div class="box">
                <table class="geFontSize_list el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
                    <tr class="el-table__header table_head">
                        <th>货号</th>
                        <th>商品</th>
                        <th class="geWidth_small">单价</th>
                        <th class="geWidth_small">数量</th>
                        <th class="geWidth_big">销售货号</th>
                        <th class="geWidth_small">优惠</th>
                        <th class="geWidth_big">商品总价(元)</th>
                        <th class="geWidth_big">运费(元)</th>
                        <th class="geWidth_big">实付总额(元)</th>
                    </tr>
                    <tr v-for="val in tableData.html_tr" v-html="val.htmls"></tr>
                </table>
            </div>
        </div>
        <div style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3>快递信息</h3>
            <el-row>
                <el-col :span='24'>配送方式：{{tableData.dlycorp_type}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='24'>快递公司：{{tableData.logi_name}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='24'>快递单号：{{tableData.logi_no}}</el-col>
            </el-row>
            <h3>物流信息</h3>
            <!--<p>{{statusInfo}}</p>-->
            <p v-if="typeof (tableData.delivery_info)=='object'">{{tableData.delivery_info.context}}</p>
            <el-row v-if="typeof (tableData.delivery_info)=='array'">
                <el-table
                        :data="tableData.delivery_info"
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="ftime"
                            label="操作时间"
                            min-width="180">
                    </el-table-column>
                    <el-table-column
                            prop="context"
                            label="物流日志"
                            min-width="180">
                    </el-table-column>
                </el-table>
            </el-row>
            <div class="check-box">
                <el-button v-if="$route.query.e" :plain="true" type="info" @click="$router.replace('/trades/manager/error')" class="checks">返回</el-button>
                <el-button v-else-if="$route.query.h" :plain="true" type="info" @click="$router.replace('/trades/manager/history')" class="checks">返回</el-button>
                <el-button v-else :plain="true" type="info" @click="$router.replace('/trades/manager/list')" class="checks">返回</el-button>
            </div>
        </div>
    </section>
</template>
<style scoped>
    .box{
        width: 100%;
        overflow-x: auto;
    }
    .table_head th{
        text-align: center;
        border-top: 1px solid #dfe6ec;
        box-sizing: content-box;
    }
    .table_head th:first-child{
        min-width: 150px;
        border-top: none;
    }
    .table_head th:nth-child(2){
        min-width: 170px;
    }
    .geWidth_small{
        min-width: 75px;
    }
    .geWidth_big{
        min-width: 100px;
    }
</style>
<script>
    import { getOrderDe, editMemo } from '../../api/api'
    export default{
        data(){
            return {
                tableData: [],
                momo: "",
                ab: "",
                statusInfo: "",
                dialogTableVisible: false,
                radio: "1"
            }
        },
        created(){
            this.ab = this.$route.query.ab;
            getOrderDe(this.$route.query.tid).then((res)=>{
                this.tableData = res.data;
                    let html_tr = [];
                    for (let j = 0;j < this.tableData.orders.items.length;j++){
                        let skus = this.tableData.orders.items;
                        let htmles = {htmls:""};
                        if (j == 0){
                            htmles.htmls = `<td style="text-align: center;padding: 10px">${skus[j].oid}</td>
                                                <td style="text-align: center;padding: 10px;">${skus[j].title}</td>
                                                <td style="text-align: center;">${skus[j].price}</td>
                                                <td style="text-align: center;">${skus[j].num}</td>
                                                <td style="text-align: center;">${skus[j].outer_sku_id}</td>
                                                <td style="text-align: center;" rowspan="${skus.length}">${this.tableData.orders.discount_fee}</td>
                                                <td style="text-align: center;" rowspan="${skus.length}">${this.tableData.orders.total_fee}</td>
                                                <td style="text-align: center;" rowspan="${skus.length}">${this.tableData.orders.post_fee}</td>
                                                <td style="text-align: center;" rowspan="${skus.length}">${this.tableData.orders.payment}</td>`
                        }else {
                            htmles.htmls = `<td style="text-align: center;padding: 10px">${skus[j].oid}</td>
                                                <td style="text-align: center;padding: 10px">${skus[j].title}</td>
                                                <td style="text-align: center;">${skus[j].price}</td>
                                                <td style="text-align: center;">${skus[j].num}</td>
                                                <td style="text-align: center;">${skus[j].outer_sku_id}</td>`
                        }
                        html_tr.push(htmles)
                    }
                    this.tableData.html_tr = html_tr;
                switch (this.tableData.stock_status){
                    case 1:
                        this.statusInfo = '正常';
                        break;
                    case 2:
                        this.statusInfo = '商品库存不足';
                        break;
                    case 3:
                        this.statusInfo = '无法解析订单商品 ';
                        break;
                    case 99:
                        this.statusInfo = '其他异常';
                        break;
                }
            })
        },
        methods: {
            addMemo(){
                var parm = {
                    update_type: this.radio,
                    vender_remark: this.momo,
                    tids: this.$route.query.tid
                }
                editMemo(parm).then((res)=>{
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            if(res.status_code == 200){
                                this.dialogTableVisible = false;
                                this.momo = ""
                                getOrderDe(this.$route.query.tid).then((res)=>{
                                    this.tableData = res.data;
                                    this.tableData.orders = [this.tableData.orders]
                                    switch (this.tableData.stock_status){
                                        case 1:
                                            this.statusInfo = '正常';
                                            break;
                                        case 2:
                                            this.statusInfo = '商品库存不足';
                                            break;
                                        case 3:
                                            this.statusInfo = '无法解析订单商品 ';
                                            break;
                                        case 99:
                                            this.statusInfo = '其他异常';
                                            break;
                                    }
                                })
                            }
                        }
                    });
                })
            },
        },
        filters:{
            delNumber: function (value) {
                if (value){
                    let arr = [];
                    arr = value.split(":");
                    return arr[0];
                }
            }
        }
    }
</script>
