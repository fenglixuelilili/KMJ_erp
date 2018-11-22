<template>
	<section style="background:#f6f6f6;padding: 20px;">
		<div class="shadow" style="padding-bottom: 20px;">
			<h3 class="info"><span class="el-icon-edit"></span>&#8195;店铺信息</h3>
			<el-form label-width="100px" :model="form" style="width:400px;margin:20px auto 0">
				<el-form-item label="用户名">
					<span v-if="form.mobile">{{form.mobile}}</span>
					<el-input v-else v-model="phone" type="text" placeholder='请输入用户名'></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="password" type="password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码">
					<el-input v-model="re_password" type="password"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-light text-center">
					<el-button @click="subMit" type="primary" v-if='form.mobile' class="btnw">修改</el-button>
					<el-button @click="subMitI" type="primary" v-else class="btnw">保存</el-button>
					<el-button @click="getback" class="btnw">取消</el-button>
				</div>
			</el-col>
		</el-row>
	</section>
</template>

<script>
	import { getManager, editManager, addManager } from '../../api/api'
	export default{
		data(){
			return {
				form:{},
				password: "",
				re_password: "",
				phone: ""
			}
		},
		created(){
			getManager(this.$route.query.store_id).then((res)=>{
				this.form = res.data
			})
		},
		methods:{
			subMit(){
				if (this.password != this.re_password) {
					this.$message.error("两次输入的密码不一致")
					return
				}
				var parm = {
					store_id: this.$route.query.store_id,
					user_id: this.form.id,
					password: this.password,
					re_password: this.re_password
				}
				editManager(this.$route.query.store_id,parm).then((res)=>{
				    if (res.status_code == 200){
                        this.$notify.info({
                            message: '修改成功'
                        });
                        this.$router.replace('/waimaistores/manager/list')
					}else {
                        this.$notify.info({
                            message: res.message
                        });
					}
				})
			},
            subMitI(){
				var parm = {
                    store_id: this.$route.query.store_id,
                    mobile: this.phone,
                    password: this.password,
                    re_password: this.re_password
				}
                addManager(this.$route.query.store_id,parm).then((res)=>{
                    this.$notify.info({
                        message: res.message
                    });
                    if (res.status_code == 200){
                        this.$router.replace('/waimaistores/manager/list')
					}
				})
			},
            getback(){
                this.$router.push({path: '/waimaistores/manager/list',query:{criteria: this.$route.query.criteria}})
            }
		}
	}
</script>