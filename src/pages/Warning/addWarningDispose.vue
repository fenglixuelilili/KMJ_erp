<template>
    <div class="add-items" style="padding: 15px;">
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;配置信息</h3>
            <div style="padding: 200px 0">
                <el-row>
                    <el-col :span="24" class='cen'>
                        <p>最低库存预警数：<el-input v-model="value" placeholder="请输入"></el-input></p>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px;">
                    <el-col :span="24" class='cen'>
                        <p>&#8195;&#8195;&#8195;预警仓库：<el-select v-model="warehouse_id" multiple clearable placeholder="请选择仓库">
                            <el-option
                                    v-for="item in options"
                                    :label="item.warehouse_name"
                                    :value="item.warehouse_id"
                                    :key="item.warehouse_id">
                            </el-option>
                        </el-select>
                        </p>
                    </el-col>
                </el-row>
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
                    <el-button type="primary" @click="onSubmit" class='btnw'>保存</el-button>
                    <el-button @click="$router.replace('/iostocks/stockwarning/setting')" class='btnw'>取消</el-button>
                </div>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    import { getWareHousesList, addDispose, getDispose, editDispose } from '../../api/api'

    export default {
        data() {
            return {
                value: "",
                memo: "",
                warehouse_id: [],
                options: []
            }
        },
        created(){
            if (this.$route.query.key){
                var parm ={
                    key: this.$route.query.key
                }
                getDispose(parm).then((res)=>{
                    this.value = res.data[0].num;
                    this.warehouse_id = res.data[0].warehouseIds.split(",");
                    for (let i in this.warehouse_id){
                        this.warehouse_id[i] = parseInt(this.warehouse_id[i])
                    }
                    this.memo = res.data[0].content;
                })
            }
            getWareHousesList().then(res => {
                this.options = res.data.itemList
            })
        },
        methods: {
            onSubmit() {
                var warehouse_ids = "";
                for (let i = 0; i < this.warehouse_id.length;i++){
                    if (i < this.warehouse_id.length - 1){
                        warehouse_ids += this.warehouse_id[i] + ","
                    }else {
                        warehouse_ids += this.warehouse_id[i]
                    }
                }
                var parm = {
                    warehouse_ids: warehouse_ids,
                    num: this.value,
                    content: this.memo
                }
                if (!this.$route.query.key){
                    addDispose(parm).then((res)=>{
                        if (!res.error_code){
                            this.$message.info("保存成功！")
                            this.$router.replace('/iostocks/stockwarning/setting')
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                }else {
                    editDispose(this.$route.query.key,parm).then((res)=>{
                        if (!res.error_code){
                            this.$message.info("保存成功！")
                            this.$router.replace('/iostocks/stockwarning/setting')
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                }

            }
        }
    }

</script>
