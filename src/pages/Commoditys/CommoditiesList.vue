<template>
    <section>
        <!--工具条-->
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'>
                    <span style='margin-left: 30px'>筛选条件</span>
                </el-col>
                <el-col :span="21">
                    <el-form label-width="130px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="商品名称：">
                                    <el-input v-model="names" placeholder="商品名称" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="销售货号：">
                                    <el-input v-model="item_id" placeholder="销售货号" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="销售平台：">
                                    <el-select v-model="platform" clearable placeholder="销售平台" class="col" :size="size">
                                        <el-option
                                                v-for="item in platforms"
                                                :label="item.platform"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="cb">
                            <el-col :span="24">
                                <el-button type="primary" @click.prevent="getItems" class="btnw" :size="size">查询

                                </el-button>
                                <el-button type="primary" @click="reload" class="btnw" :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" class="btnw" @click="add" :size="size">新增</el-button>
                </el-col>
            </el-row>
        </div>
        <!--列表-->
        <el-table
                v-loading="isLoading"
                border
                :data="tableData"
                style="width: 100%"
                class="geFontSize_list ">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table
                            class="geFontSize_list "
                            :data="props.row.skus"
                            style="width: 100%">
                        <el-table-column
                                prop="title"
                                label="物料名称"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                label="缩略图"
                                min-width="100">
                            <template slot-scope="prop">
                                <img :src="prop.row.default_image" style="width: 100%;" alt=""
                                     v-if="prop.row.default_image">
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="sku_title"
                                label="sku副标题"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                :formatter="props_valuesC"
                                prop="props_values"
                                label="规格"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                prop="num"
                                label="数量"
                                min-width="75">
                        </el-table-column>
                        <el-table-column
                                min-width="75"
                                prop="unit"
                                label="单位">
                        </el-table-column>
                        <el-table-column
                                min-width="85"
                                prop="weight"
                                label="重量(kg)">
                        </el-table-column>
                        <el-table-column
                                min-width="120"
                                prop="barcode"
                                label="条码">
                        </el-table-column>
                        <el-table-column
                                min-width="120"
                                prop="bn"
                                label="货号">
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="95">
                <template slot-scope="scope">
                    <el-button type="text" :size="size" @click="edit(scope.$index)">编辑</el-button>
                    <el-button type="text" :size="size" @click="remove(scope.$index)" style="color: red">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="item_name"
                    label="商品名称"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop="item_id"
                    label="销售货号"
                    min-width="95">
            </el-table-column>
            <el-table-column
                    min-width="90"
                    prop="platform"
                    :formatter="platformC"
                    label="销售平台">
            </el-table-column>
            <el-table-column prop="memo" label="备注" min-width="170">
                <template slot-scope="props">
                    <elliptical :message="props.row.memo"></elliptical>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="per_page"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="paging">
        </el-pagination>
    </section>
</template>

<script>
    import {getItemList, deleteItems} from '../../api/api';
    export default {
        data() {
            return {
                tableData: [],
                commodities: [],
                total: 0,
                page: 1,
                listLoading: false,
                total: 0,
                page: 1,
                per_page: 10,
                names: "",
                isLoading: false,
                platform: "",
                item_id: "",
                platforms: [{platform: '所有', value: ''}, {platform: '饿了么', value: 'eleme'}, {
                    platform: '百度外卖',
                    value: 'bd'
                }, {platform: '美团外卖', value: 'meituan'}, {platform: '京东到家', value: 'jddj'},],
                size: ""
            }
        },
        created() {
            this.size = this.$store.state.size;
            this.getItems();
        },
        methods: {
            props_valuesC(row){
                var str = "";
                if (!row.props_values) {
                    return
                }
                for (let i in row.props_values) {
                    str += row.props_values[i].prop_name + " " + row.props_values[i].prop_value
                }
                return str
            },
            reload(){
                this.item_id = "";
                this.platform = "";
                this.names = "";
            },
            add(){
                this.$router.replace('/waimaiitems/manager/add')
            },
            platformC(val){
                if (!val.platform) {
                    return;
                }
                var pf = val.platform;
                var arr = pf.split(',');
                var str = "";
                for (var i = 0; i < arr.length; i++) {
                    switch (arr[i]) {
                        case "bd":
                            str += "百度外卖 "
                            break;
                        case "jddj":
                            str += "京东到家 "
                            break;
                        case "eleme":
                            str += "饿了么 "
                            break;
                        case "meituan":
                            str += "美团外卖 "
                            break;
                    }
                }
                return str;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getItems();
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.getItems();
            },
            getItems(){
                this.isLoading = true;
                let parm = {
                    page: this.page,
                    per_page: this.per_page,
                    item_name: this.names,
                    sort_type: 'DESC',
                    sort_by: 'created_at',
                    item_id: this.item_id,
                    platform: this.platform,
                };
                getItemList(parm).then((res) => {
                    this.isLoading = false;
                    this.total = res.data.totalCount;
                    this.tableData = res.data.data;
                })
            },
            //删除
            remove(index){
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteItems(this.tableData[index].item_id).then((res) => {
                        if (res.status_code == 200) {
                            this.getItems();
                        }else {
                            this.$message.error(res.message);
                        }
                    })
                });
            },
            //显示编辑界面
            edit(index){
                this.$router.push({path: '/items/commodity/edits', query: {item_id: this.tableData[index].item_id}})
            },
            //同步数据
            sync(){

            }
        }
    }
</script>
