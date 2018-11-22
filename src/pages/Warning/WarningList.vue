<template>
    <section>
        <HS></HS>
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'>筛选条件</el-col>
                <el-col :span="22">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="sku标题：" class="hspace">
                                    <el-input v-model="sku_title" class="col" :size="size"
                                              placeholder="请输入sku标题"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="sku货号：" class="hspace">
                                    <el-input v-model="bn" class="col" :size="size" placeholder="请输入sku货号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="sku条码：" class="hspace">
                                    <el-input v-model="barcode" class="col" :size="size"
                                              placeholder="请输入sku条码"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="所在仓库：">
                                    <el-select v-model="warehouse_id" clearable placeholder="请选择仓库" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in options"
                                                :label="item.warehouse_name"
                                                :value="item.warehouse_id"
                                                :key="item.warehouse_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="物料分类：">
                                    <el-cascader placeholder="物料分类" class="col" :size="size" @change="handleItemChange"
                                                 clearable v-model='cat_ids' :props="defaultProps" :options="optionsx"
                                                 filterable>
                                    </el-cascader>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" class='btnw' @click='getWarningLists' :size="size">查询
                                </el-button>
                                <el-button type="primary" class='btnw' @click='reOutstockSku' :size="size">重置
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-row>
            <el-col :span="24"
                    style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                <el-button type="primary" @click="educe" class="btnw" :size="size">导出</el-button>
            </el-col>
        </el-row>
        <div style="position:relative;width: 100%;overflow: auto">
            <el-table
                    border
                    v-loading="isLoading"
                    :data="tableData"
                    style="width: 100%;"
                    class="geFontSize_list">
                <el-table-column
                        prop="title"
                        label="sku标题"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="source"
                        label="缩略图"
                        min-width="100">
                    <template slot-scope="props">
                        <img :src="props.row.default_image" style="width: 100%;" v-if="props.row.default_image">
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sub_title"
                        label="副标题"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        :formatter="props_valuesC"
                        prop="props_values"
                        label="规格"
                        min-width="130">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        min-width="70">
                </el-table-column>
                <el-table-column
                        prop="store"
                        label="库存"
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="warehouse_name"
                        label="所在仓库"
                        min-width="100">
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
        <!-- 分页 -->
        <el-pagination
                id="paging"
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
    import {getWareHousesList, getCategoriesList, getWarningList} from '../../api/api'
    export default{
        data () {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = start.toString();
                            switch (strD.split(" ")[0]) {
                                case 'Mon':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
                                    break;
                                case 'Tue':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                                    break;
                                case 'Wed':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                                    break;
                                case 'Thu':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                                    break;
                                case 'Fri':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 4);
                                    break;
                                case 'Sat':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
                                    break;
                                case 'Sun':
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                            }
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = end.toString();
                            switch (strD.split(" ")[0]) {
                                case 'Mon':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Tue':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Wed':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Thu':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 4);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Fri':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Sat':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                                case 'Sun':
                                    end.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                                    break;
                            }
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = start.toString();
                            var num = parseInt(strD.split(' ')[2]) - 1;
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * num);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            var strD = start.toString();
                            var num = parseInt(strD.split(' ')[2]);
                            var numN = parseInt(strD.split(' ')[2]) - 1;
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * num);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * numN);
                            start.setMonth(start.getMonth() - 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                options: [],
                tableData: [],
                total: 100,
                page: 1,
                per_page: 10,
                sku_title: "",
                bn: "",
                barcode: "",
                warehouse_id: "",
                time_quantum: "",
                isLoading: false,
                cat_id: "",
                cat_ids: [],
                optionsx: [],
                defaultProps: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                size: ""
            }
        },
        created(){
            this.size = this.$store.state.size;
            getCategoriesList().then(res => {
                this.optionsx = res.data;
            }).catch(function (error) {
                console.log(error);
            });
            getWareHousesList().then(res => {
                this.options = res.data.itemList
            }).catch(function (error) {
                console.log(error);
            });
            this.getWarningLists()
        },
        methods: {
            educe(){
                window.open(`${this.$store.state.urlBackstageApi}/stocks_warning/exportSkusList?access_token=${sessionStorage.getItem('access_token')}&warehouse_id=${this.warehouse_id}&bn=${this.bn}&barcode=${this.barcode}&cat_id=${this.cat_id}&sku_title=${this.sku_title}`)
            },
            handleItemChange(val){
                this.cat_id = val[this.cat_ids.length - 1]
            },
            props_valuesC(val){
                var str = '';
                for (var i = 0; i < val.props_values.length; i++) {
                    str = val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                }
                return str
            },
            reOutstockSku(){
                this.warehouse_id = "";
                this.sku_title = "";
                this.bn = "";
                this.cat_id = "";
                this.barcode = "";
                this.cat_ids = [];
            },
            getWarningLists(){
                this.isLoading = true;
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    bn: this.bn,
                    barcode: this.barcode,
                    cat_id: this.cat_id,
                    sku_title: this.sku_title,
                    warehouse_id: this.warehouse_id
                }
                getWarningList(parm).then((res) => {
                    this.isLoading = false;
                    this.total = res.data.count;
                    this.tableData = res.data.skusList;
                })
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getWarningLists();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getWarningLists();
                return;
            }
        }
    }
</script>