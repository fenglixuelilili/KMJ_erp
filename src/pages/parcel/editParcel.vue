<template>
    <div class="add-items" style="padding: 15px;" v-if="show">
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;订单信息</h3>
            <div class="box">
                <p class="tid">订单号：{{this.$route.query.tid}}</p>
                <el-table
                        border
                        :data="tableData"
                        style="width: 100%"
                        class="geFontSize_list">
                    <el-table-column
                            type="index"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="sku_id"
                            label="sku_id"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="titles"
                            label="商品名称"
                            min-width="150">
                    </el-table-column>
                    <el-table-column
                            prop="num"
                            label="数量"
                            min-width="100">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;分包计划</h3>
            <div class="box">
                <table class="geFontSize_list table">
                    <tr class="title">
                        <th width="200px">包裹</th>
                        <th width="200px">包裹内操作</th>
                        <th width="200px">包材名称</th>
                        <th max-width="200px">自定义商品</th>
                        <th width="200px">数量</th>
                        <th width="200px">操作</th>
                    </tr>
                    <tr v-for="(item,index) in tds" style="text-align: center" :key="index">
                        <td :rowspan="item.rowspan" v-if="item.show">
                            {{parseInt(item.index) + 1}}
                        </td>
                        <td :rowspan="item.rowspan" v-if="item.show">
                            <el-button type="text" size="mini" @click="addSku(item.index)">新增商品</el-button>
                        </td>
                        <td class="tds" :rowspan="item.rowspan" v-if="item.show">
                            <el-select v-model="item.material_id" filterable clearable placeholder="请选择">
                                <el-option
                                        v-for="item in materialList"
                                        :label="item.name"
                                        :value="item.material_id"
                                        :key="item.material_id">
                                </el-option>
                            </el-select>
                        </td>
                        <td class="tds">
                            <el-select v-model="item.sku_id" filterable clearable placeholder="请选择">
                                <el-option
                                        v-for="item in tableData"
                                        :label="item.titles"
                                        :value="item.sku_id"
                                        :key="item.sku_id">
                                </el-option>
                            </el-select>
                        </td>
                        <td style="width: 150px;">
                            <el-input style="width: 100%;" v-model="item.num" :size="size"></el-input>
                        </td>
                        <td>
                            <el-button type="text" size="mini" @click="remove(item)">删除</el-button>
                        </td>
                    </tr>
                </table>
                <el-button type="primary" @click="addPlan">新增包裹</el-button>
            </div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;备注</h3>
            <el-row style="padding: 20px;">
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
        <el-row :gutter="2">
            <el-col :span="24">
                <div class="grid-content bg-purple-light text-center">
                    <el-button type="primary" class='btnw' @click="subMit">保存</el-button>
                    <el-button class='btnw' @click="getback">取消</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<style>
    .tds .el-input {
        width: 150px !important;
    }
</style>
<style scoped>
    .tid{
        line-height: 30px;
    }

    .box {
        min-height: 350px;
        padding: 20px;
        margin: 0 auto;
    }

    .box input {
        margin-right: 10px;
    }

    .table {
        width: 100%;
        margin-bottom: 20px;
    }

    .table th {
        border: 1px solid #dfe6ec;
        padding: 10px 18px;
    }

    .table td {
        border: 1px solid #dfe6ec;
        background: white;
        vertical-align: middle;
        padding: 0px 18px;
        height: 37px;
    }
</style>
<script>
    import {editParcel, parcelDetail, getSkuSimple, getMaterialsList} from '../../api/api'
    export default {
        data() {
            return {
                size: this.$store.state.size,
                memo: "",
                sku_option: [],
                materialList: [],
                html_tr: [],
                htmlTr: [],
                tds: [],
                tableData: [],
                show: true
            }
        },
        created(){
            parcelDetail(this.$route.query.tid).then(res => {
                if (res.error_code){
                    this.$message.error(res.message);
                    this.show = false;
                    return;
                }
                this.tableData = res.data.skus;
                this.memo = res.data.memo;
                for (let i in res.data.packages){
                    this.htmlTr.push({names: "", material_id: res.data.packages[i].material.material_id, skus: res.data.packages[i].skus})
                    this.html_tr.push({names: "", material_id: res.data.packages[i].material.material_id, skus: res.data.packages[i].skus})
                }
            })
            getSkuSimple().then(res => {
                this.sku_option = res.data;
            })
            getMaterialsList().then(res => {
                this.materialList = res.data.data;
            })
        },
        watch: {
            html_tr: function () {
                let arr = [];
                for (let i in this.htmlTr) {
                    for (let j in this.htmlTr[i].skus) {
                        let obj = {};
                        this.$set(obj, 'rowspan', this.htmlTr[i].skus.length);
                        this.$set(obj, 'material_id', this.htmlTr[i].material_id);
                        this.$set(obj, 'sku_id', this.htmlTr[i].skus[j].sku_id);
                        this.$set(obj, 'num', this.htmlTr[i].skus[j].num)
                        this.$set(obj, 'show', j == 0 ? true : false);
                        this.$set(obj, 'index', i);
                        this.$set(obj, 'myIndex', j);
                        arr.push(obj);
                    }
                }
                this.tds = arr;
            },
            tds: {
                handler(newValue, oldValue) {
                    let arr = [];
                    for (let i in newValue) {
                        if (i == 0) {
                            arr.push({
                                names: parseInt(i) + 1,
                                material_id: newValue[i].material_id,
                                skus: [{sku_id: newValue[i].sku_id, num: newValue[i].num}]
                            })
                        } else {
                            if (newValue[i].index == newValue[i - 1].index) {
                                arr[newValue[i].index].skus.push({sku_id: newValue[i].sku_id, num: newValue[i].num})
                            } else {
                                arr.push({
                                    names: parseInt(i) + 1,
                                    material_id: newValue[i].material_id,
                                    skus: [{sku_id: newValue[i].sku_id, num: newValue[i].num}]
                                })
                            }
                        }
                    }
                    this.htmlTr = arr;
                },
                deep: true
            }
        },
        methods: {
            remove(item){
                if (this.html_tr[item.index].skus.length < 2) {
                    this.$confirm('是否删除该包裹?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'right',
                        type: 'warning'
                    }).then(() => {
                        this.htmlTr.splice(item.index, 1)
                        this.html_tr.splice(item.index, 1)
                    }).catch((error) => {
                        console.log(error)
                    });
                } else {
                    let html_td = this.htmlTr[parseInt(item.index)];
                    html_td.skus.splice(parseInt(item.myIndex), 1);
                    this.$set(this.htmlTr, parseInt(item.index), html_td);
                    this.$set(this.html_tr, parseInt(item.index), html_td);
                }
            },
            addSku(index){
                let obj = {sku_id: "", num: ""};
                let html_td = this.htmlTr[index];
                html_td.skus.push(obj)
                this.$set(this.htmlTr, index, html_td)
                this.$set(this.html_tr, index, html_td)
            },
            addPlan(){
                let obj = {names: "", skus: [{sku_id: "", num: ""}]};
                this.htmlTr.push(obj)
                this.html_tr.push(obj)
            },
            subMit(){
                let parm = {
                    packages: this.htmlTr,
                    memo: this.memo
                }
                let arr = [];
                let arr_sku = [];
                for (let i in this.tableData){
                    arr_sku.push(this.tableData[i])
                }
                for (let i in this.htmlTr){
                    arr = arr.concat(this.htmlTr[i].skus)
                }
                for (let i in arr_sku){
                    for (let j in arr){
                        if (arr_sku[i].sku_id == arr[j].sku_id&&arr_sku[i].num == arr[j].num){
                            arr_sku.splice(i,1);
                        }
                    }
                }
                if (arr_sku.length>0){
                    this.$message.error(arr_sku[0].titles + "没有加入包裹,请重新编辑")
                }
                editParcel(this.$route.query.tid,parm).then(res => {
                    if (!res.error_code){
                        this.$message("编辑成功")
                        this.$router.push({path: "/parcelList"})
                    }
                })
            },
            getback(){
                this.$router.push({path: "/parcelList"})
            }
        }
    }
</script>
