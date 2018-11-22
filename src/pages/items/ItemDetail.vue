<template>
    <section>
        <h3 class="title" style="margin-bottom: 0;">商品信息</h3>
        <div class="box">
            <div class="flex_box">
                <p>物料标题：{{tableData.title}}</p>
            </div>
            <div class="flex_box">
                <p>物料副标题：{{tableData.sub_title}}</p>
            </div>
            <div class="flex_box">
                <p>物料编号：{{tableData.outer_id}}</p>
                <p>单位：{{tableData.unit}}</p>
            </div>
            <div class="flex_box">
                <p>物料条码：{{tableData.barcode}}</p>
                <p>物料分类：{{tableData.category.cat_name}}</p>
            </div>
            <div class="flex_box">
                <p style="word-wrap:break-word; word-break:normal;">{{memo}}</p>
            </div>
        </div>
        <h3 class="title">物料信息</h3>
        <div class="box" style="padding-left: 52px;">
            <el-table
                    :data="tableData.skus"
                    border
                    empty-text="该物料下暂无sku信息"
                    style="width: 100%">
                <el-table-column
                        prop="title"
                        label="sku标题"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="sub_title"
                        label="副标题"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="props_values"
                        :formatter="props_valuesC"
                        label="规格"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="sku_store"
                        :formatter="formatStore"
                        label="库存"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="barcode"
                        label="条码"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="bn"
                        label="货号"
                        min-width="150">
                </el-table-column>
            </el-table>
        </div>
        <div class="check-box">
            <el-button @click="getback" type="primary" class="checks">返回</el-button>
        </div>
    </section>
</template>
<style scoped>
    .title{
        margin: 20px;
    }
    .box{
        padding: 20px;
        padding-top: 0;
    }
    .box p{
        font-size: 16px;
        line-height: 50px;
        text-indent: 32px;
    }
    .flex_box{
        display: flex;
        width: 100%;
    }
    .flex_box p{
        width: 1px;
        flex-grow: 1;
    }
</style>
<script>
    export default{
        data () {
            return {
                tableData: [],
                memo: ""
            }
        },
        created(){
            this.tableData = this.$route.query.data;
            this.memo = "备注：" + this.tableData.memo;
        },
        methods:{
            getback(){
                this.$router.push({path: "/items/manager/list",query:{criteria: this.$route.query.criteria}})
            },
            props_valuesC(row){
                var str = "";
                for (let i in row.props_values){
                    str += row.props_values[i].prop_name + " " +  row.props_values[i].prop_value
                }
                return str
            },
            formatStore(row) {
                if (row.sku_store.length > 0) {
                    return row.sku_store[0].store;
                }else{
                    return 0
                }
            },
        }
    }
</script>