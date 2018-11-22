<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="filters.cat_level" placeholder="请选择分类级别">
						<el-option
							v-for="item in options"
							:label="item.label"
							:value="item.value"
							:key="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<!-- <el-col :span="24" class="toolbar">
			<el-tree :data="categories" :props="defaultProps" accordion></el-tree>
		</el-col> -->

		<template>
			<el-table :data="categories" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="cat_name" label="分类名称" width="150" sortable>
				</el-table-column>
				<el-table-column prop="cat_id" label="分类id" width="100" sortable>
				</el-table-column>
				<el-table-column prop="level" label="分类级别" :formatter="formatLevel" width="120">
				</el-table-column>
				<el-table-column prop="created_at" label="创建日期" width="200" sortable>
				</el-table-column>
				<el-table-column prop="updated_at" label="修改日期" min-width="200" sortable>
				</el-table-column>
			</el-table>
		</template>
	</section>
</template>
<script>
	import { getCategoriesList } from '../../api/api';
	import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					cat_level: ''
				},
				options: [{
					value: '1',
					label: '一级'
				}, {
					value: '2',
					label: '二级'
				}, {
					value: '3',
					label: '三级'
				}],
				loading: false,
				categories: [],
				defaultProps: {
					children: 'children',
					label: 'cat_name'
				}
			}
		},
		methods: {
			formatLevel: function (row, column) {
				return row.level == 1 ? '一级' : row.level == 2 ? '二级' : '三级';
			},
			//获取用户列表
			getUser: function () {
				let params = {
					cat_level: this.filters.cat_level
				};
				this.loading = true;
				NProgress.start();
				getCategoriesList(params).then((res) => {
					this.categories = res.data;
					this.loading = false;
					NProgress.done();
				});
			}
		},
		mounted() {
			this.getUser();
		}
	};
</script>

<style scoped>

</style>
