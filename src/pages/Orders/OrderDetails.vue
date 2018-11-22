<template>
	<section>
		<div id="orderDetails" style="padding: 10px 20px;box-sizing: border-box;">
			<h3 style="text-align:center;font-weight:normal" v-if="tableData.status == '待支付'">已下单，待付款</h3>
			<h3 style="text-align:center;font-weight:normal" v-if="tableData.status == '待发货'">已下单，待付款 => 已付款，待发货</h3>
			<h3 style="text-align:center;font-weight:normal" v-if="tableData.status == '待收货'">已下单，待付款 => 已付款，待发货 => 已发货</h3>
			<h3 style="text-align:center;font-weight:normal" v-if="tableData.status == '已完成'">已下单，待付款 => 已付款，待发货 => 已发货 => 已完成</h3>
			<h3 style="text-align:center;font-weight:normal" v-if="tableData.status == '系统已关闭订单'">已下单，待付款 => 系统已关闭订单</h3>
			<h3 style="text-align:center;font-weight:normal" v-if="tableData.status == '用户取消订单'">已下单，待付款 => 用户取消订单</h3>
			<h3>订单信息</h3>
			<p>外卖平台：{{tableData.source}}</p>
			<p>
				<span style="width:30%;display:inline-block">订单编号：{{tableData.tid}}</span>
				<span style="width:30%;display:inline-block">订单状态：{{tableData.status}}</span>
				<span style="width:30%;display:inline-block">下单时间：{{tableData.created_time}}</span>
			</p>
			<p>
				<span style="width:30%;display:inline-block" v-if="tableData.status == '待支付'">付款状态：未付款</span>
				<span style="width:30%;display:inline-block" v-else>付款状态：已付款</span>
				<span style="width:30%;display:inline-block">付款时间：{{tableData.payed_time}}</span>
				<span style="width:30%;display:inline-block">应付金额：{{tableData.payment}}</span>
			</p>
			<p>
				<span style="width:30%;display:inline-block">收件人：{{tableData.receiver_name}}</span>
				<span style="width:30%;display:inline-block">收件人电话：{{tableData.receiver_mobile}}</span>
				<span style="width:30%;display:inline-block">收货地址：{{tableData.receiver_address}}</span>
				<span style="width:30%;display:inline-block">实付金额：{{tableData.payed_fee}}</span>

			</p>
			<p v-if="tableData.stock_memo">异常原因：{{tableData.stock_memo}}</p>
			<p>备注：{{tableData.buyer_message}}</p>
		</div>
		<div style="text-align:center">
			<h3 style="text-align: left;margin: 10px 20px;">订单金额信息</h3>
			<el-table
			    :data="tableDatas"
			    border
			    style="width: 100%">
				<el-table-column
						prop="total_price"
						label="订单总价"
						min-width="100">
				</el-table-column>
				<el-table-column
						prop="discount_fee"
						label="优惠金额"
						min-width="100">
				</el-table-column>
				<el-table-column
						prop="post_fee"
						label="运费"
						min-width="100">
				</el-table-column>
				<el-table-column
						prop="payment"
						label="应付金额"
						min-width="95">
				</el-table-column>
				<el-table-column
						prop="platform_subsidy"
						label="使用红包"
						min-width="100">
				</el-table-column>
				<el-table-column
						prop="payed_fee"
						label="实付金额"
						min-width="95">
				</el-table-column>
				<el-table-column
						prop="commission_fee"
						label="佣金"
						min-width="95">
				</el-table-column>
				<el-table-column
						prop="received_fee"
						label="实际到账"
						min-width="95">
				</el-table-column>
			</el-table>
			<h3 style="text-align: left;margin: 10px 20px;">商品信息</h3>
			<el-table border :data="tableData.orders">
				<el-table-column label="商品名称" prop="title"  min-width="200"></el-table-column>
				<el-table-column label="数量" prop="num" min-width="100"></el-table-column>
				<el-table-column label="单价" prop="price" min-width="100"></el-table-column>
				<el-table-column label="金额合计" prop="totalPrice" min-width="100"></el-table-column>
			</el-table>
		</div>
		<div class="check-box">
			<el-button :plain="true" type="info" @click="retu" class="check">返回</el-button>
			<el-button :plain="true" type="info" @click="print" class="check">打印</el-button>
		</div>
	</section>
</template>

<script>
	import { orderDetails } from '../../api/api'
	export default{
		data() {
			return {
				tableData: {},
                tableDatas: [],
			}
		},
		created(){
			var parm = {order_id:this.$route.query.order_id};
			orderDetails(this.$route.query.order_id, parm).then((res) => {
				if (res.status_code == 404) {
					this.$message.error(res.message)
					return;
				}
				this.tableData = res.data;
				this.tableDatas = [res.data];
				switch (this.tableData.source){
					case 'eleme':
                        this.tableData.source = "饿了么";
                    	break;
                    case 'jddj':
                        this.tableData.source = "京东到家";
                        break;
                    case 'bd':
                        this.tableData.source = "百度外卖";
                        break;
                    case 'meituan':
                        this.tableData.source = "美团外卖";
                        break;
				}
                switch(this.tableData.status){
                    case 'WAIT_BUYER_PAY':
                        this.tableData.status = '待支付';
                        break;
                    case 'WAIT_SELLER_SEND_GOODS':
                        this.tableData.status = '待发货';
                        break;
                    case 'WAIT_BUYER_CONFIRM_GOODS':
                        this.tableData.status = '待收货';
                        break;
                    case 'TRADE_FINISHED':
                        this.tableData.status = '已完成';
                        break;
                    case 'TRADE_CLOSED_BY_BUYER':
                        this.tableData.status = '用户取消订单';
                        break;
                    case "TRADE_CLOSED_BY_SYSTEM":
                        this.tableData.status = '系统已关闭订单';
                        break;
                }
			})
		},
		methods: {
			retu(){
			    if (this.$route.query.normal == "y"){
					this.$router.push({path:"/waimaitrades/manager/list",query:{obj:this.$route.query.obj}});
                }else{
                    this.$router.push({path:"/waimaitrades/manager/error_list",query:{obj:this.$route.query.obj}});
                }
			},
			print(){
                window.open(`${this.$store.state.urlBackstage}/orders/print/${this.$route.query.order_id}?access_token=${sessionStorage.getItem('access_token')}`);
			}
		}
	}
</script>
