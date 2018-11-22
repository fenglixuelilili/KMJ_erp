<template>
    <section class='bg' id="gg">
        <div v-if='bool' class='mengban'></div>
        <div v-if='bool' class='show'>
            <el-input v-model="title" placeholder="商品名称" style='width: 200px'></el-input>
            <el-button type="primary" style='width: 150px' @click='getSkusList'>查询</el-button>
            <div id="close" @click="hidden">×</div>
            <!--列表-->
            <el-table
                    :data="tableDataII"
                    border
                    height="500"
                    style="width: 100%;margin-top: 20px;">
                <el-table-column
                        label="操作"
                        min-width="70">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click='addItemes(scope.$index)'>添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="store_name"
                        label="店铺名称"
                        min-width="150">
                </el-table-column>
            </el-table>
            <!--分页-->
            <template>
                <div class="block" style="padding:10px;padding-left:0;float: right">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="page"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="per_page"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </template>
            <div style='clear: both'></div>
            <div class=cen><el-button type="primary" style='width: 150px;' @click='hidden'>完成</el-button></div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;商品信息</h3>
            <el-row  class='bg' style="margin-top: 10px;">
                <el-col :span='21'>
                    <el-form label-width="120px" style="width: 100%;">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="正常佣金：" required>
                                    <el-input v-model="normal" placeholder="正常佣金" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="促销佣金：" required>
                                    <el-input v-model="brokerage" placeholder="促销佣金" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class='bg'>
                <el-col :span='22' :offset="1">
                    <div style='padding: 10px;padding-left: 0;'>
                        <el-button type="primary" style='width: 150px;' @click='show'>选择店铺</el-button>
                    </div>
                    <el-table
                            :data="tableDataI"
                            border
                            height="500"
                            style="width: 100%;  margin-bottom: 20px">
                        <el-table-column
                                label="操作"
                                min-width="70">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click='removeItem(scope.$index)'>移除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="store_name"
                                label="店铺名称"
                                min-width="150">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;备注</h3>
            <el-row class="bg" style="padding: 20px;">
                <el-col :span="24">
                    <el-input
                            style='width: 100%;margin-bottom: 20px;'
                            :autosize="{ minRows: 4, maxRows: 8}"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="memo">
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-row class="bg" style='text-align: center;margin: 0;'>
            <el-button type="primary" class="btnw" @click="subMit">保存</el-button>
            <el-button class="btnw" @click="getback">取消</el-button>
        </el-row>
    </section>
</template>

<script>
    import { WstoreList, addBrolerage } from '../../api/api'
    export default {
        data () {
            return {
                tableDataI: [],
                tableDataII: [],
                bool: false,
                title: "",
                memo: "",
                normal: "",
                brokerage: "",
                total: 200,
                page: 1,
                per_page: 10,
            }
        },
        created () {
            this.getSkusList();
        },
        methods: {
            getback(){
                this.$router.push({path:"/store_commission/list"})
            },
            subMit(){
                var parm = {
                    activity_commission: this.brokerage,
                    common_commission: this.normal,
                    commission_memo: this.memo,
                    storeIds: ""
                }
                let str = "";
                for (let i = 0;i < this.tableDataI.length;i++){
                    str += this.tableDataI[i].waimaistore_id + ","
                }
                parm.storeIds = str;
                addBrolerage(parm).then((res)=>{
                    if (!res.error_code){
                        this.$notify({
                            title: '成功',
                            message: '佣金设置成功',
                            type: 'success'
                        });
                        this.$router.push({path:"/store_commission/list"})
                    }else {
                        this.$notify({
                            title: '失败',
                            message: res.message,
                            type: 'error'
                        });
                    }
                })
            },
            getSkusList() {
                let parm = {
                    store_name: this.title,
                    page: this.page,
                    per_page: this.per_page
                };
                WstoreList(parm).then((res)=>{
                    this.tableDataII = res.data.storesList;
                    this.total = res.data.totalCount;
                    for(var i = 0;i < this.tableDataII.length;i++){
                        for (var j = 0;j < this.tableDataI.length;j++){
                            if (this.tableDataII[i].waimaistore_id==this.tableDataI[j].waimaistore_id){
                                this.tableDataII.splice(i,1)
                            }
                        }
                    }
                })
            },
            removeItem(index){
                this.tableDataII.unshift(this.tableDataI[index])
                this.tableDataI.splice(index,1)
            },
            addItemes(index){
                this.tableDataI.push(this.tableDataII[index])
                this.tableDataII.splice(index,1)
            },
            handleItemChange(val) {
                this.cat_id = val[this.cat_ids.length - 1]
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getSkusList();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getSkusList();
                return;
            },
            show(){
                $("#gg").css({overflow:"hidden",height:"810px"})
                this.bool = true;
            },
            hidden(){
                $("#gg").css({overflow:"",height:""})
                this.bool = false;
            }
        }
    }
</script>
