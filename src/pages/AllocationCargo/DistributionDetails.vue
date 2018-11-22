<template>
	<section>
		<p style="line-height: 40px">
			<span class="offset">配送单编号：{{bn}}</span>
			<span class="offset">店铺名称：{{shopName}}</span>
			<span class="offset">收货人姓名：{{name}}</span>
			<span class="offset">收货人电话：{{phone}}</span>
			<span class="createTime">创建时间：{{createTime}}</span>
		</p>
		<!-- 表格 -->
		<el-table
				border
				:data="tableData"
				style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column
					prop="sku_id"
					label="物料编号"
					min-width="200">
			</el-table-column>
			<el-table-column
					prop="sku_title"
					label="物料名称"
					min-width="150">
			</el-table-column>
			<el-table-column
					label="缩略图"
					width="100">
				<template slot-scope="props">
					<img :src="props.row.default_image" style="width: 100%;">
				</template>
			</el-table-column>
			<el-table-column
					prop="sub_title"
					label="副标题"
					min-width="150">
			</el-table-column>
			<el-table-column
					:formatter='props_valuesC'
					prop="props_values"
					label="规格"
					min-width="150">
			</el-table-column>
			<el-table-column
					prop="unit"
					label="单位"
					min-width="95">
			</el-table-column>
			<el-table-column
					prop="num"
					label="数量"
					min-width="95">
			</el-table-column>
		</el-table>
		<div class="sign">
			<p>收货人签字：</p>
			<p>签收日期：</p>
		</div>
		<div style="clear: both"></div>
		<div class="signI">
			<el-button :plain="true" type="info" style="width:100px;vertical-align:top" @click="print">打印配送单</el-button>
			<el-button :plain="true" type="info" style="width:100px;vertical-align:top" @click="getback">返回</el-button>
		</div>
		<div style="display: none">
			<div id="printI">
				<p style="line-height: 40px">
					<span style="margin-right: 30px">配送单编号：{{bn}}</span>
					<span style="margin-right: 30px">店铺名称：{{shopName}}</span>
					<span style="margin-right: 30px">收货人姓名：{{name}}</span>
					<span style="margin-right: 30px">收货人电话：{{phone}}</span>
					<span style="margin-right: 30px">创建时间：{{createTime}}</span>
				</p>
				<table style="border-collapse:collapse;">
					<tr style="width: 500px;line-height: 30px">
						<th style="width: 150px;font-weight: normal">物料编号</th>
						<th style="width: 150px;font-weight: normal">物料名称</th>
						<th style="width: 150px;font-weight: normal">规格</th>
						<th style="width: 150px;font-weight: normal">单位</th>
						<th style="width: 150px;font-weight: normal">数量</th>
					</tr>
					<tr style="width: 500px;line-height: 30px" v-for="item in tableData">
						<th style="width: 150px;font-weight: normal">{{item.sku_id}}</th>
						<th style="width: 150px;font-weight: normal">{{item.sku_title}}</th>
						<th style="width: 150px;font-weight: normal">{{item.props_values}}</th>
						<th style="width: 150px;font-weight: normal">{{item.unit}}</th>
						<th style="width: 150px;font-weight: normal">{{item.num}}</th>
					</tr>
				</table>
				<div style="float: right;margin-right: 120px">
					<p>收货人签字：</p>
					<p>签收日期：</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
    import { getDetailsBlanks } from '../../api/api'
	export default{
		data() {
			return {
				tableData: [],
				bn:"",
				shopName: "",
				name: "",
				phone: "",
				createTime: "",
				url: "",
			}
		},
		created(){
            if (window.location.host == "testfonterp.kmjiu.com"){
                this.url = 'https://testfonterp.kmjiu.com';
            }else{
                this.url = 'https://fonterp.kmjiu.com';
            }
		    var parm = { ob_id:this.$route.query.ob_id }
			getDetailsBlanks(this.$route.query.ob_id,parm).then((res)=>{
                this.tableData = res.data.items;
		        this.bn = res.data.ob_bn;
                this.shopName = res.data.store.store_name;
                this.name = res.data.store.operater;
                this.phone = res.data.store.telephone;
                this.createTime = res.data.created_at;
            })
		},
		methods: {
			getback(){
                this.$router.push({path: '/waimai_stocks/od/lists',query:{criteria:this.$route.query.criteria}})
			},
			print(){
                window.open(`${this.url}/OrderBlanks.html?${this.$route.query.ob_id}?access_token=${sessionStorage.getItem('access_token')}`)
            },
            props_valuesC(val){
                var str = '';
                if(val.props_values){
                    for(var i = 0; i < val.props_values.length;i++){
                        str =  val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                    }
                    return str
                }
            },
        }
	}
</script>

<style>
	.createTime{
		float: right;
		margin-right: 20px
	}
	.offset{
		margin-left: 20px
	}
	.sign{
		float: right;
		margin-right: 120px
	}
	.signI{
		float: right;
		margin-right: 40px
	}
	.sign p{
		line-height: 40px;
	}
	.operate{
		float: right;
		margin-right: 40px
	}
</style>