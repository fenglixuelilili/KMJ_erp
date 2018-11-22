<template>
    <section>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="120px" onsubmit="return false">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="包裹单号：" class="hspace">
                                    <el-input v-model="package_id" placeholder="请输入包材单号" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="订单号：" class="hspace">
                                    <el-input v-model="tid" placeholder="请输入订单号" class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <!--<el-col :span="8">-->
                                <!--<el-form-item label="来源店铺：" class="hspace">-->
                                    <!--<el-input placeholder="请输入来源店铺" class="col" :size="size"></el-input>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click="subMit" :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 0'>
                </el-col>
            </el-row>
        </div>
        <!-- 表格 -->
        <el-table
                v-loading="isLoading"
                border
                :data="tableData"
                style="width: 100%"
                class="geFontSize_list">
            <el-table-column type="expand" width="40">
                <template slot-scope="props">
                    <table class="table_">
                        <tr class="title">
                            <th>分单单号</th>
                            <th>包材名称</th>
                            <th>货号</th>
                            <th>商品</th>
                            <th>数量</th>
                        </tr>
                        <tr v-for="val in props.row.html_tr" v-html="val.htmls"></tr>
                    </table>
                </template>
            </el-table-column>
            <el-table-column
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="65">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="package_id"
                    label="包裹单号"
                    min-width="140">
            </el-table-column>
            <el-table-column
                    prop="source"
                    label="来源平台"
                    min-width="115">
            </el-table-column>
            <el-table-column
                    prop="tid"
                    label="订单号"
                    min-width="140">
            </el-table-column>
            <el-table-column
                    prop=""
                    :formatter="isFen"
                    label="是否分包"
                    min-width="95">
            </el-table-column>
            <el-table-column prop="memo" label="备注" min-width="170">
                <template slot-scope="props">
                    <elliptical :message="props.row.memo"></elliptical>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
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
<script>
    import {getParcelList} from "../../api/api"
    export default{
        data (){
            return {
                size: this.$store.state.size,
                isLoading: false,
                tableData: [],
                total: 100,
                page: 1,
                per_page: 10,
                package_id: "",
                tid: ""
            }
        },
        created(){
            this.subMit();
            this.addEvent();
        },
        methods: {
            addEvent(){
                var _this = this;
                $(window).keyup(function (event) {
                    if (event.keyCode == 13) {
                        _this.subMit();
                    }
                })
            },
            subMit(){
                let parm = {
                    package_id: this.package_id,
                    tid: this.tid
                }
                getParcelList(parm).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.totalCount;
                    for (let i in this.tableData){
                        let html_tr = [];
                        for (let j in this.tableData[i].packages){
                            for (let k in this.tableData[i].packages[j].skus){
                                let skus = this.tableData[i].packages[j].skus;
                                let htmles = {htmls: ""};
                                if (skus[k].barcode == null){
                                    skus[k].barcode = ""
                                }
                                if (k == 0) {
                                    htmles.htmls = `<td style="text-align: center;padding: 10px" rowspan="${skus.length}">${this.tableData[i].packages[j].package_id}</td>
                                                <td style="text-align: center;padding: 10px;" rowspan="${skus.length}">${this.tableData[i].packages[j].material.name}</td>
                                                <td style="text-align: center;">${skus[k].barcode}</td>
                                                <td style="text-align: center;">${skus[k].title}</td>
                                                <td style="text-align: center;">${skus[k].num}</td>`
                                } else {
                                    htmles.htmls = `<td style="text-align: center;padding: 10px">${skus[k].barcode}</td>
                                                <td style="text-align: center;padding: 10px">${skus[k].title}</td>
                                                <td style="text-align: center;">${skus[k].num}</td>`
                                }
                                html_tr.push(htmles)
                            }
                        }
                        this.tableData[i].html_tr = html_tr;
                    }
                })
            },
            reLoad(){
                this.tid = "";
                this.package_id = "";
            },
            handleSizeChange(val){
                this.per_page = val;
                this.subMit();
            },
            handleCurrentChange(val){
                this.page = val;
                this.subMit();
            },
            isFen(item){
                if (item.packages.length==1){
                    return "否";
                }else {
                    return "是";
                }
            },
            edit(item){
                this.$router.push({path: "/package/package/edit",query: {tid: item.tid}})
            }
        }
    }
</script>