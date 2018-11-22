<template>
    <div class="add-items" style="padding: 15px;">
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;配置信息</h3>
            <div class="box box1">
                <p><span class="label"><span style="color: red"> * </span>包材名称：</span>
                    <el-input v-model="materialName"></el-input>
                </p>
                <p><span class="label">包材长度：</span>
                    <el-input v-model="materialHeight"></el-input>
                    cm

                </p>
                <p><span class="label">包材宽度：</span>
                    <el-input v-model="materialWidth"></el-input>
                    cm

                </p>
                <p><span class="label">包材高度：</span>
                    <el-input v-model="materialDepth"></el-input>
                    cm

                </p>
                <p><span class="label">包材体积/容量：</span>
                    <el-input v-model="materialVolume"></el-input>
                    cm^3/ml

                </p>
                <p><span class="label">包材重量：</span>
                    <el-input v-model="materialWeight"></el-input>
                    kg

                </p>
                <p><span class="label">包材对应物料：</span>
                    <el-select v-model="materialSku" filterable multiple placeholder="请选择">
                        <el-option
                                style="width: 290px"
                                v-for="item in sku_option"
                                :label="item.title"
                                :value="item.sku_id"
                                :key="item.sku_id">
                        </el-option>
                    </el-select>
                </p>
            </div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;包装计划</h3>
            <div class="box">
                <table class="table_ geFontSize_list table">
                    <tr class="title">
                        <th width="200px">计划</th>
                        <th width="200px">计划内操作</th>
                        <th max-width="200px">形状</th>
                        <th width="200px">数量</th>
                        <th width="200px">操作</th>
                    </tr>
                    <tr v-for="(item,index) in tds" style="text-align: center" :key="index">
                        <td :rowspan="item.rowspan" v-if="item.show">
                            {{parseInt(item.index) + 1}}

                        </td>
                        <td :rowspan="item.rowspan" v-if="item.show">
                            <el-button type="text" size="mini" @click="addSku(item.index)">新增形状</el-button>
                        </td>
                        <td>
                            <template>
                                <el-select v-model="item.shape" filterable clearable placeholder="请选择" :size="size">
                                    <el-option
                                            v-for="item in shapeList"
                                            :label="item.shape_name"
                                            :value="item.shape_id"
                                            :key="item.shape_id">
                                    </el-option>
                                </el-select>
                            </template>
                        </td>
                        <td style="width: 150px;">
                            <el-input style="width: 100%;" v-model="item.num" :size="size"></el-input>
                        </td>
                        <td>
                            <el-button type="text" size="mini" @click="remove(item)">删除</el-button>
                        </td>
                    </tr>
                </table>
                <el-button type="primary" @click="addPlan">新增计划</el-button>
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

<style scoped>
    .box1 {
        width: 580px;
        padding-bottom: 10px;
    }

    .box {
        min-height: 350px;
        padding: 20px;
        margin: 0 auto;
    }

    .box input {
        margin-right: 10px;
    }

    .label {
        width: 150px;
        text-align: right;
        display: inline-block;
        margin-bottom: 20px;
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
    import {addMaterial, materialDetail, editMaterial, getSkuSimple, getShapeSimple} from '../../api/api'
    export default {
        data() {
            return {
                size: this.$store.state.size,
                memo: "",
                shape: "",
                materialName: "",
                materialHeight: "",
                materialWidth: "",
                materialDepth: "",
                materialWeight: "",
                materialVolume: "",
                materialSku: [],
                sku_option: [],
                shapeList: [],
                html_tr: [],
                htmlTr: [],
                tds: []
            }
        },
        created(){
            this.htmlTr.push({names: "", plan: [{shape: "", num: ""}]})
            this.html_tr.push({names: "", plan: [{shape: "", num: ""}]})
            if (this.$route.query.material_id) {
                materialDetail(this.$route.query.material_id).then(res => {
                    this.materialName = res.data.name;
                    this.materialHeight = res.data.height;
                    this.materialWidth = res.data.width;
                    this.materialDepth = res.data.depth;
                    this.materialWeight = res.data.weight;
                    this.materialVolume = res.data.volume;
                    this.memo = res.data.memo;
                    for (let i in res.data.resources){
                        this.materialSku.push(res.data.resources[i].sku_id)
                    }
                    let html_obj = [];
                    for (let i in res.data.plans){
                        let obj = {names: "",plan: []}
                        let plan_index;
                        for (let j in res.data.plans[i]){
                            plan_index = {shape: res.data.plans[i][j].shape_id,num: res.data.plans[i][j].num}
                            obj.plan.push(plan_index);
                        }
                        html_obj.push(obj);
                    }
                    console.log(html_obj)
                    this.html_tr = this.htmlTr = html_obj;
                })
            }
            getSkuSimple().then(res => {
                this.sku_option = res.data;
            })
            getShapeSimple().then(res => {
                this.shapeList = res.data;
            })
        },
        watch: {
            html_tr: function () {
                let arr = [];
                for (let i in this.htmlTr) {
                    for (let j in this.htmlTr[i].plan) {
                        let obj = {};
                        this.$set(obj, 'rowspan', this.htmlTr[i].plan.length);
                        this.$set(obj, 'shape', this.htmlTr[i].plan[j].shape);
                        this.$set(obj, 'num', this.htmlTr[i].plan[j].num)
                        this.$set(obj, 'show', j == 0 ? true : false);
                        this.$set(obj, 'index', i);
                        this.$set(obj, 'myIndex', j);
                        arr.push(obj);
                    }
                }
                this.tds = arr
            },
            tds: {
                handler(newValue, oldValue) {
                    let arr = [];
                    for (let i in newValue) {
                        if (i == 0) {
                            arr.push({names: parseInt(i) + 1, plan: [{shape: newValue[i].shape, num: newValue[i].num}]})
                        } else {
                            if (newValue[i].index == newValue[i - 1].index) {
                                arr[newValue[i].index].plan.push({shape: newValue[i].shape, num: newValue[i].num})
                            } else {
                                arr.push({
                                    names: parseInt(i) + 1,
                                    plan: [{shape: newValue[i].shape, num: newValue[i].num}]
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
                if (this.html_tr[item.index].plan.length < 2) {
                    this.$confirm('是否删除该计划?', '提示', {
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
                    html_td.plan.splice(parseInt(item.myIndex), 1);
                    this.$set(this.htmlTr, parseInt(item.index), html_td);
                    this.$set(this.html_tr, parseInt(item.index), html_td);
                }
            },
            addSku(index){
                let obj = {shape: "", num: ""};
                let html_td = this.htmlTr[index];
                html_td.plan.push(obj)
                this.$set(this.htmlTr, index, html_td)
                this.$set(this.html_tr, index, html_td)
            },
            addPlan(){
                let obj = {names: "", plan: [{shape: "", num: ""}]};
                this.htmlTr.push(obj)
                this.html_tr.push(obj)
            },
            subMit(){
                let parm = {
                    name: this.materialName,
                    height: this.materialHeight,
                    width: this.materialWidth,
                    depth: this.materialDepth,
                    weight: this.materialWeight,
                    volume: this.materialVolume,
                    memo: this.memo,
                    plans: [],
                    skus: []
                }
                for (let i in this.materialSku){
                    parm.skus.push({sku_id: this.materialSku[i],num:1})
                }
                for (let i in this.htmlTr){
                    let arr = [];
                    for (let j in this.htmlTr[i].plan){
                        arr.push({shape_id:this.htmlTr[i].plan[j].shape,num:this.htmlTr[i].plan[j].num})
                    }
                    parm.plans.push(arr)
                }
                parm.skus = JSON.stringify(parm.skus);
                parm.plans = JSON.stringify(parm.plans);
                if (this.$route.query.material_id) {
                    editMaterial(this.$route.query.material_id, parm).then(res => {
                        if (!res.error_code) {
                            this.$message.success("修改成功");
                            this.$router.push({path: "/package/material/list"})
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                } else {
                    addMaterial(parm).then(res => {
                        if (!res.error_code) {
                            this.$message.success("保存成功");
                            this.$router.push({path: "/package/material/list"})
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                }
            },
            getback(){
                this.$router.push({path: "/package/material/list"})
            }
        }
    }
</script>
