<template>
	<section>
		<p style="margin-left:10px;line-height: 40px">店铺名称：{{form.store_name}}</p>
		<template>
			<el-table
		    :data="platforms"
		    border
		    style="width: 100%"
		    id="platform">
				<el-table-column
			      prop="platform"
			      label="平台"
			      :span="4">
			    </el-table-column>
				<el-table-column
			      prop="name"
			      label="线上店铺名"
			      :span="4">
			    </el-table-column>
			    <el-table-column
			      prop="status"
			      label="状态"
			      :span="4">
			    </el-table-column>
			    <el-table-column
				label="操作"
				:span="4">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="bind(scope.$index)" v-if="scope.row.status=='未绑定'">绑定已开通店铺</el-button>
						<el-button type="text" size="small" @click="unbind(scope.$index)" v-if="scope.row.status=='已绑定'">解除绑定</el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>
	</section>
</template>

<script>
	import { storeDetails, unbindStore } from '../../api/api'
	export default{
		data(){
			return{
				form: {},
				shopName: "",
				platforms:[
					{platform:'百度外卖',status:"",name:""},
					{platform:'美团外卖',status:"",name:""},
					{platform:'京东到家',status:"",name:""},
					{platform:'饿了么',status:"",name:""}
				],
				platform: null
			}
		},
		created(){
		    this.getDeta()
		},
		methods:{
		    getDeta(){
                storeDetails(this.$route.query.store_id).then((res) => {
                    this.form = res.data;
                    if (res.data.bdstore_id == 0) {
                        this.platforms[0].status = "未绑定";
                    }else{
                        this.platforms[0].status = "已绑定";
                        this.platforms[0].name = res.data.bd_store.name;
                    }
                    if (res.data.meituanstore_id == 0) {
                        this.platforms[1].status = "未绑定"
                    }else{
                        this.platforms[1].status = "已绑定"
                        this.platforms[1].name = res.data.meituan_store.name;
                    }
                    if (res.data.jddjstore_id == 0) {
                        this.platforms[2].status = "未绑定"
                    }else{
                        this.platforms[2].status = "已绑定"
                        this.platforms[2].name = res.data.jddj_store.stationName;
                    }
                    if (res.data.elemestore_id == 0) {
                        this.platforms[3].status = "未绑定"
                    }else{
                        this.platforms[3].status = "已绑定"
                        this.platforms[3].name = res.data.eleme_store.restaurant_name;
                    }
                })
            },
			bind(index){
				switch(index){
					case 0: 
						this.platform = 'bd'
					break;
					case 1: 
						this.platform = 'meituan'
					break;
					case 2: 
						this.platform = 'jddj'
					break;
					case 3: 
						this.platform = 'eleme'
					break;
				}
				this.$router.push({path:"/bindShops",query:{platform: this.platform,store_id:this.form.waimaistore_id}})
			},
            unbind(index){
                switch(index){
                    case 0:
                        var parm = { bdstore_id: this.form.bdstore_id}
                        break;
                    case 1:
                        var parm = { meituanstore_id: this.form.meituanstore_id}
                        break;
                    case 2:
                        var parm = { jddjstore_id: this.form.jddjstore_id}
                        break;
                    case 3:
                        var parm = { elemestore_id: this.form.elemestore_id}
                        break;
                }
                unbindStore(this.$route.query.store_id,parm).then((res)=>{
					if (!res.error_code){
					    this.platforms = [
                            {platform:'百度外卖',status:"",name:""},
                            {platform:'美团外卖',status:"",name:""},
                            {platform:'京东到家',status:"",name:""},
                            {platform:'饿了么',status:"",name:""}
                        ],
						this.$notify.info({
							message: "解绑成功"
						});
					    this.getDeta()
					}else {
                        this.$notify.info({
                            message: res.message
                        });
					}
				})
			}
		}
	}
</script>

<style>
</style>