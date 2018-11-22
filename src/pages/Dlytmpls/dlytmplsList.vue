<template>
    <section style="min-height: 400px;" v-loading="isLoading">
        <el-row>
            <el-col :span="24" style='border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 20px'>
                <el-button type="primary" size="small" @click="addDly" class="btnw">新增物流模板</el-button>
            </el-col>
        </el-row>
        <div class="box_" v-for="(item,index) in tableData">
            <div class="box_head">
                <h3>{{item.rule_name}}</h3>
                <el-button type="danger" size="mini" v-if="item.enabled==1" @click="open(item.rule_id)" style="background:#CCC;color: white;border: none">禁用中</el-button>
                <el-button type="primary" size="mini" v-if="item.enabled==2" @click="off(item.rule_id)">启用中</el-button>
                <el-button type="primary" size="mini" @click="edit(item.rule_id)">编辑</el-button>
                <el-button type="danger" size="mini" @click="remove(item.rule_id)">删除</el-button>
                <span style="float: right;margin: 5px 20px">最后更新时间：{{item.updated_at}}</span>
            </div>
            <table class="table_ el-table--border el-table" style="font-size: 12px;overflow: auto;">
                <tr class="title">
                    <th>物流公司</th>
                    <th>发货仓库</th>
                    <th>配送地址</th>
                    <th>首重重量（kg）</th>
                    <th>首重运费（元）</th>
                    <th>续重重量（kg）</th>
                    <th>续重运费（元）</th>
                    <th style="width: 180px;">备注</th>
                </tr>
                <tr v-for="val in item.html_tr" style="position:relative;" v-html="val.htmls" @mouseover="show(index)"></tr>
            </table>
        </div>
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
<style scoped>
    .box_{
        box-sizing: border-box;
        margin: 20px;

    }
    .box_ h3{
        display: inline-block;
        margin-right: 40px;
        /*width: 100px;*/
        margin-left: 20px;
        font-size: 12px;
    }
    .box_head{
        border: 1px solid #cccccc;
        border-bottom: none;
        padding: 10px 0 ;
    }
</style>
<script>
    import { getDlyList, deleteDly, onEnabled } from './../../api/api'
    export default{
        data () {
            return {
                tableData: [],
                page: 1,
                per_page: 10,
                total: 100,
                isLoading: false
            }
        },
        created(){
            if (this.$route.query.page){
                this.page = this.$route.query.page;
            }
            this.getDlyLists()
        },
        methods:{
            getDlyLists(){
                var parm = {
                    page: this.page,
                    per_page: this.per_page,
                    sort_by: 'updated_time',
                    sort_type: "desc"
                }
                this.isLoading = true;
                getDlyList(parm).then((res)=>{
                    this.tableData = res.data.freight;
                    this.total = res.data.totalCount;
                    for (let i = 0;i < this.tableData.length;i++){
                        let html_tr = [];
                        let address = JSON.parse(this.tableData[i].original2);
                        let htmles = {htmls:""};
                        htmles.htmls = `<td style="text-align: center;padding: 10px" rowspan="${ this.tableData[i].regions_rule.length + 1}">${this.tableData[i].corp_name}</td>
                                        <td style="text-align: center;padding: 10px" rowspan="${ this.tableData[i].regions_rule.length + 1}">${this.setWarehouse(this.tableData[i].ware_house)}</td>
                                        <td style="text-align: center;padding: 10px">全国</td>
                                        <td style="text-align: center;padding: 10px">${this.tableData[i].first_weight}</td>
                                        <td style="text-align: center;padding: 10px">${this.tableData[i].first_cost}</td>
                                        <td style="text-align: center;padding: 10px">${this.tableData[i].renew_weight}</td>
                                        <td style="text-align: center;padding: 10px">${this.tableData[i].renew_cost}</td>
                                        <td style="text-align: center;padding: 10px;" rowspan="${ this.tableData[i].regions_rule.length + 1}">
                                            <span class="mem">${this.memo(this.tableData[i].memo)}</span>
                                        </td>
                                        <div class="memos" style="display: none;position: absolute;max-width: 50%;bottom:50%;right:10px;z-index: 20;background:#000;color: white;border-radius: 10px;padding: 5px">${this.tableData[i].memo}</div>`

                        html_tr.push(htmles)
                        for (let j = 0;j < this.tableData[i].regions_rule.length;j++){
                            let regions_rule = this.tableData[i].regions_rule;
                            let htmles = {htmls:""};
                            htmles.htmls = `<td style="text-align: center;padding: 10px">${address[j].str}</td>
                                            <td style="text-align: center;padding: 10px">${regions_rule[j].first_weight}</td>
                                            <td style="text-align: center;padding: 10px">${regions_rule[j].first_cost}</td>
                                            <td style="text-align: center;padding: 10px">${regions_rule[j].renew_weight}</td>
                                            <td style="text-align: center;padding: 10px">${regions_rule[j].renew_cost}</td>`
                            html_tr.push(htmles)
                        }
                        this.tableData[i].html_tr = html_tr;
                    }
                    this.isLoading = false;
                })
            },
            show(index){
                $(`.mem:eq(${index})`).mouseout(function () {
                    $(`.memos:eq(${index})`).css({display: "none"})
                }).mouseover(function () {
                    if ($(`.mem:eq(${index})`)[0].innerText.length==13){
                        $(`.memos:eq(${index})`).css({display: "block"})
                    }
                })
            },
            memo(memo){
                let str = memo;
                if (str.length > 10){
                    return str.substring(0,10) + "...";
                }else {
                    return str;
                }
            },
            setWarehouse(val){
                var str = "";
                for (let i = 0;i < val.length;i++){
                    str += val[i].warehouse_name + " ";
                }
                return str;
            },
            remove(val){
                this.$confirm('确认删除该模板吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'right',
                    type: 'warning'
                }).then(() => {
                    deleteDly(val).then((res)=>{
                        if (!res.error_code){
                            this.$notify({
                                title: '通知',
                                message: "删除成功",
                                type: 'success'
                            });
                            this.getDlyLists()
                        }else {
                            this.$notify.error({
                                title: '错误',
                                message: res.message,
                            });
                        }
                    })
                }).catch(() => {
                    this.$message.info("已取消删除")
                });
            },
            addDly(){
                this.$router.replace('/warehouses/dlytmpls/manager/add')
            },
            edit(val){
                this.$router.push({path:"/warehouses/dlytmpls/manager/edit",query:{rule_id:val,page:this.page}})
            },
            off(val){
                var parm = {
                    enabled: 1
                }
                onEnabled(val,parm).then((res)=>{
                    if (!res.error_code){
                        this.$notify({
                            title: '通知',
                            message: "禁用成功",
                            type: 'success'
                        });
                        this.getDlyLists()
                    }else {
                        this.$notify.error({
                            title: '错误',
                            message: res.message,
                        });
                    }
                })
            },
            open(val){
                var parm = {
                    enabled: 2
                }
                onEnabled(val,parm).then((res)=>{
                    if (!res.error_code){
                        this.$notify({
                            title: '通知',
                            message: "启用成功",
                            type: 'success'
                        });
                        this.getDlyLists()
                    }else {
                        this.$notify.error({
                            title: '错误',
                            message: res.message,
                        });
                    }
                })
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getDlyLists();
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.getDlyLists();
            },
        }
    }
</script>