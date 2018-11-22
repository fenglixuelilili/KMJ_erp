<template>
    <section>
        <h3 class="title" style="margin-bottom: 0;">商品信息</h3>
        <div class="box">
            <p>商品标题：{{tableData.commodity_title}}</p>
            <p>销售平台：{{formatePlatform(tableData)}}</p>
            <p>销售货号：{{tableData.commodity_bn}}</p>
            <p>备注：{{tableData.memo}}</p>
        </div>
        <h3 class="title">物料信息</h3>
        <div class="box" style="padding-left: 52px;">
            <el-table
                    :data="tableData.commodity_skus"
                    border
                    empty-text="该物料下暂无sku信息">
                <el-table-column
                        prop="title"
                        label="物料标题"
                        min-width="180">
                </el-table-column>
                <el-table-column
                        prop="sub_itle"
                        label="物料副标题"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="销售数量"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="is_gift"
                        label="是否为赠品"
                        :formatter="formatGift"
                        width="120">
                </el-table-column>
                <el-table-column
                        :formatter="props_valuesC"
                        prop="props_values"
                        label="规格"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        width="75">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="store"
                        label="库存"
                        width="75">
                </el-table-column>
                <el-table-column
                        prop="barcode"
                        label="条码"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="bn"
                        label="货号"
                        min-width="180">
                </el-table-column>
            </el-table>
        </div>
        <div class="check-box">
            <el-button @click="getback" class="checks" type="primary">返回</el-button>
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
</style>
<script>
    export default{
        data () {
            return {
                tableData: []
            }
        },
        created(){
            this.tableData = this.$route.query.data;
        },
        methods:{
            getback(){
                this.$router.push({path: "/items/commodity/manager/list",query:{criteria: this.$route.query.criteria}})
            },
            props_valuesC(row){
                var str = "";
                for (let i in row.props_values){
                    str += row.props_values[i].prop_name + " " +  row.props_values[i].prop_value
                }
                return str
            },
            formatGift(row){
                return row.is_gift ? '是' : '否'
            },
            formatePlatform(row){
                let str = '',
                    platform = row.platform.split(','),
                    plength = 0;
                platform.length > 1 ? plength = platform.length - 1 : plength = 1;
                for(let i = 0;i < plength; i++) {
                    str += (platform[i] === 'jd' ? '京东' : (platform[i] === 'tm' ? '天猫' : '淘宝')) + ' '
                }
                return str
            },
        }
    }
</script>