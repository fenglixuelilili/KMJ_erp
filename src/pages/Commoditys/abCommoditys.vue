<template>
    <section>
        <el-table
                v-loading="isLoading"
                :data="tableData"
                border
                class="geFontSize_list"
                style="width: 100%">
            <el-table-column
                    min-width="100"
                    prop="sku_id"
                    label="sku_id">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="platform"
                    label="平台"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    min-width="150"
                    prop="shopName"
                    label="商品名">
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
    import { getAbnormal } from './../../api/api'
    export default{
        data(){
            return {
                tableData:[],
                isLoading: false
            }
        },
        created(){
            this.isLoading = true;
            getAbnormal().then((res)=>{
                this.isLoading = false;
                this.tableData = res.data;
            })
        }
    }
</script>