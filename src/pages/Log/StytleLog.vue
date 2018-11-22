<template>
    <section>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="150px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="操作者：">
                                    <el-input v-model="name" placeholder="请输入用户名" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="操作时间：">
                                    <el-input v-model="name" placeholder="请输入真实姓名" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="操作类型：">
                                    <el-input v-model="name" placeholder="请输入真实姓名" class="col"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad'>重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    prop="date"
                    label="操作者"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    prop="created_at"
                    label="真实姓名"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="memo"
                    label="操作时间"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="memo"
                    label="操作类型"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="memo"
                    label="操作路径"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="memo"
                    label="操作IP"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="memo"
                    label="操作信息"
                    min-width="120">
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
    export default{
        data (){
            return {
                userName: "",
                name: "",
                tableData: []
            }
        },
        created (){

        },
        methods: {
            reLoad(){
                this.userName = ""
                this.name = ""
            },
            addAccount(){
                this.$router.replace()
            }
        }
    }
</script>