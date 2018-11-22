<template>
    <div class="add-items" style="padding: 15px;">
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;配置信息</h3>
            <div class="box">
                <p><span class="label"><span style="color: red"> * </span>形状名称：</span><el-input v-model="shapeName"></el-input></p>
                <p><span class="label">形状长度：</span><el-input v-model="shapeHeight"></el-input> cm</p>
                <p><span class="label">形状宽度：</span><el-input v-model="shapeWidth"></el-input> cm</p>
                <p><span class="label">形状高度：</span><el-input v-model="shapeDepth"></el-input> cm</p>
                <p><span class="label">形状体积/容量：</span><el-input v-model="shapeVolume"></el-input> cm^3/ml</p>
                <p><span class="label">形状重量：</span><el-input v-model="shapeWeight"></el-input> kg</p>
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
    .box{
        min-height: 350px;
        padding-top: 20px;
        text-align: left;
        width: 550px;
        margin: 0 auto;
    }
    .box input{
        margin-right: 10px;
    }
    .label{
        width: 150px;
        text-align: right;
        display: inline-block;
        margin-bottom: 20px;
        margin-right: 10px;
    }
</style>
<script>
    import { addShapes, shapeDetail, editShape } from '../../api/api'
    export default {
        data() {
            return {
                size: this.$store.state.size,
                memo: "",
                shapeName: "",
                shapeHeight: "",
                shapeWidth: "",
                shapeDepth: "",
                shapeWeight: "",
                shapeVolume: "",
            }
        },
        created(){
            if (this.$route.query.shape_id){
                shapeDetail(this.$route.query.shape_id).then(res => {
                    this.shapeName = res.data.shape_name;
                    this.shapeHeight = res.data.height;
                    this.shapeWidth = res.data.width;
                    this.shapeDepth = res.data.depth;
                    this.shapeWeight = res.data.weight;
                    this.shapeVolume = res.data.volume;
                    this.memo = res.data.memo;
                })
            }
        },
        methods: {
            subMit(){
                let parm = {
                    shape_name: this.shapeName,
                    height: this.shapeHeight,
                    width: this.shapeWidth,
                    depth: this.shapeDepth,
                    weight: this.shapeWeight,
                    volume: this.shapeVolume,
                    memo: this.memo
                }
                if (this.$route.query.shape_id){
                    editShape(this.$route.query.shape_id,parm).then(res => {
                        if (!res.error_code){
                            this.$message.success("修改成功");
                            this.$router.push({path:"/package/shape/list"})
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                }else {
                    addShapes(parm).then(res => {
                        if (!res.error_code){
                            this.$message.success("保存成功");
                            this.$router.push({path:"/package/shape/list"})
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                }
            },
            getback(){
                this.$router.push({path:"/package/shape/list"})
            }
        }
    }
</script>
