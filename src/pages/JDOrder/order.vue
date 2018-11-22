<template>
    <section>
        <HS></HS>
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="22">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="  订单号：" class="hspace">
                                    <el-input v-model="order_id" placeholder="请输入订单号" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="下单时间：" class="hspace">
                                    <el-date-picker
                                            :size="size"
                                            class="col"
                                            v-model="value"
                                            type="daterange"
                                            align="right"
                                            placeholder="请选择下单时间范围"
                                            :picker-options="pickerOptions"
                                            @change="timeChange">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="物流单号：" class="hspace">
                                    <el-input v-model="tracking_order" placeholder="请输入物流单号" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="来源店铺：" class="hspace">
                                    <el-select v-model="shop_id" clearable placeholder="请输入店铺名称" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in optionsIII"
                                                :label="item.key"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="订单状态：" class="hspace">
                                    <el-select v-model="order_status" clearable placeholder="请选择" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in optionsI"
                                                :label="item.key"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="发货状态：" class="hspace">
                                    <el-select v-model="shipping_status" clearable placeholder="请选择" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in optionsII"
                                                :label="item.key"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="物流公司：">
                                    <el-input v-model="logistics_company" placeholder="请输入物流公司名称" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class="cb">
                                <el-button type="primary" class='btnw' @click="getAorderes" :size="size">查询</el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-dropdown @command="handleCommand">
                        <el-button type="primary" class='btnw' :size="size">批量操作<i
                                class="el-icon-caret-bottom el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="memo">批量设置备注</el-dropdown-item>
                            <el-dropdown-item command="order">批量关闭订单</el-dropdown-item>
                            <el-dropdown-item command="logistics">批量更改物流</el-dropdown-item>
                            <el-dropdown-item command="house">批量更改仓库</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <!--<el-button type="primary" class='btnw' @click="unopen" :size="size">导入</el-button>-->
                    <!--<el-button type="primary" class='btnw' @click="unopen" :size="size">导出</el-button>-->
                    <!--<el-button type="primary" class='btnw' @click="unopen" :size="size">打印</el-button>-->
                </el-col>
            </el-row>
            <el-table
                    v-loading="isLoading"
                    :data="tableData"
                    border
                    @selection-change="handleSelectionChange"
                    style="width: 100%"
                    class="geFontSize_list">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <table class="table_">
                            <tr class="title">
                                <th>货号</th>
                                <th style="width: 280px;">商品</th>
                                <th>单价</th>
                                <th>数量</th>
                                <th>优惠</th>
                                <th>商品总价(元)</th>
                                <th>运费(元)</th>
                                <th>实付总额(元)</th>
                            </tr>
                            <tr v-for="val in props.row.html_tr" v-html="val.htmls"></tr>
                        </table>
                    </template>
                </el-table-column>
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="95">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="detail(scope.$index)" type="text" :size="size">详情</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="store_name"
                        label="来源店铺"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        width="95"
                        prop="payment"
                        label="实付总额">
                </el-table-column>
                <el-table-column
                        min-width="95"
                        :formatter="statusC"
                        prop="status"
                        label="订单状态">
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="tid"
                        label="订单号">
                </el-table-column>
                <el-table-column
                        prop="created_time"
                        label="下单时间"
                        width="100">
                </el-table-column>
                <el-table-column
                        :formatter="send_goodsC"
                        prop="send_goods"
                        label="发货状态"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="warehouse_name"
                        label="所在仓库"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="dlycorp_type"
                        label="配送方式"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        prop="logi_name"
                        label="物流公司"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="logi_no"
                        label="物流单号"
                        min-width="140">
                </el-table-column>
                <el-table-column
                        prop=""
                        label="售后"
                        min-width="95">
                </el-table-column>
            </el-table>
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
        </div>
        <el-dialog title="备注信息" v-model="dialogTableVisible">
            <div style="margin-bottom: 10px;">
                <el-radio class="radio" v-model="radio" label="1">全部修改</el-radio>
                <el-radio class="radio" v-model="radio" label="2">追加至原有备注后</el-radio>
            </div>
            <el-input
                    type="textarea"
                    :autosize="{ minRows: 5, maxRows: 15}"
                    placeholder="请输入备注信息"
                    v-model="memo">
            </el-input>
            <el-row>
                <el-col :span="24" style="text-align: center;padding-top: 10px;">
                    <el-button type="primary" @click="addMemo">确认添加</el-button>
                    <el-button type="primary" @click="dialogTableVisible=false">取消操作</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog title="订单信息" v-model="closeR">
            <el-input
                    type="textarea"
                    :autosize="{ minRows: 5, maxRows: 15}"
                    placeholder="请输入关闭原因"
                    v-model="momo">
            </el-input>
            <el-row>
                <el-col :span="24" style="text-align: center;padding-top: 10px;">
                    <el-button type="primary" @click="closeOrders">确认关闭</el-button>
                    <el-button type="primary" @click="closeR=false">取消操作</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </section>
</template>

<script>
    import {getAorders, editMemo, closeOrder} from '../../api/api'
    export default{
        data(){
            return {
                order_id: "",
                value: "",
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
                time_quantum: "",
                start_date: "",
                end_date: "",
                tracking_order: "",
                shop_id: "",
                order_status: '',
                shipping_status: '',
                logistics_company: "",
                optionsI: [{key: '全部', value: ''}, {key: '未支付', value: 'WAIT_BUYER_PAY'}, {
                    key: '待发货',
                    value: 'WAIT_SELLER_SEND_GOODS'
                }, {key: '系统取消订单', value: 'TRADE_CLOSED_BY_SYSTEM'}, {
                    key: '用户取消订单',
                    value: 'TRADE_CLOSED_BY_BUYER'
                }, {key: '已完成', value: 'TRADE_FINISHED'}, {key: '待收货', value: 'WAIT_BUYER_CONFIRM_GOODS'}],
                optionsII: [{key: '全部', value: ''}, {key: '已发货', value: 1}, {key: '待发货', value: 0}],
                optionsIII: [{key: '快买酒官方旗舰店', value: 1}, {key: '快买酒商城', value: 2}],
                tableData: [],
                total: 200,
                per_page: 10,
                page: 1,
                selection: [],
                memo: "",
                radio: "1",
                dialogTableVisible: false,
                closeR: false,
                momo: "",
                isLoading: false,
                size: this.$store.state.size
            }
        },
        created(){
            this.getAorderes()
        },
        methods: {
            getAorderes(){
                this.isLoading = true;
                var parm = {
                    page: this.page,
                    per_page: this.per_page,
                    sort_by: 'created_time',
                    sort_type: 'DESC',
                    shop_id: this.shop_id,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    tid: this.order_id,
                    logi_no: this.tracking_order,
                    trade_status: this.order_status,
                    send_goods: this.shipping_status,
                    dlycorp_name: this.logistics_company
                }
                getAorders(parm).then((res) => {
                    this.isLoading = false;
                    if (res.status_code != 200) {
                        this.$alert(res.message, "", {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        });
                    }
                    this.tableData = res.data.trades;
                    for (let i = 0; i < this.tableData.length; i++) {
                        let html_tr = [];
                        for (let j = 0; j < this.tableData[i].orders.items.length; j++) {
                            let skus = this.tableData[i].orders.items;
                            let htmles = {htmls: ""};
                            if (j == 0) {
                                htmles.htmls = `<td style="text-align: center;padding: 10px">${skus[j].oid}</td>
                                                <td style="text-align: center;padding: 10px;">${skus[j].title}</td>
                                                <td style="text-align: center;">${skus[j].price}</td>
                                                <td style="text-align: center;">${skus[j].num}</td>
                                                <td style="text-align: center;" rowspan="${skus.length}">${this.tableData[i].orders.discount_fee}</td>
                                                <td style="text-align: center;" rowspan="${skus.length}">${this.tableData[i].orders.total_fee}</td>
                                                <td style="text-align: center;" rowspan="${skus.length}">${this.tableData[i].orders.post_fee}</td>
                                                <td style="text-align: center;" rowspan="${skus.length}">${this.tableData[i].orders.payment}</td>`
                            } else {
                                htmles.htmls = `<td style="text-align: center;padding: 10px">${skus[j].oid}</td>
                                                <td style="text-align: center;padding: 10px">${skus[j].title}</td>
                                                <td style="text-align: center;">${skus[j].price}</td>
                                                <td style="text-align: center;">${skus[j].num}</td>`
                            }
                            html_tr.push(htmles)
                        }
                        this.tableData[i].html_tr = html_tr;
                    }
                    this.total = res.data.totalCount;
                })
            },
            reLoad(){
                this.shop_id = "";
                this.order_id = "";
                this.tracking_order = "";
                this.order_status = "";
                this.shipping_status = "";
                this.logistics_company = "";
                this.value = "";
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getAorderes();
            },
            handleCurrentChange(val){
                this.page = val;
                if (!this.total) {
                    return
                }
                this.getAorderes();
            },
            unopen(){
                this.$notify.info({
                    message: '抱歉，该功能暂未开放，敬请期待'
                });
            },
            handleCommand(val){
                switch (val) {
                    case 'memo':
                        this.dialogTableVisible = true;
                        return
                        break;
                    case 'order':
                        this.closeR = true;
                        return
                        break;
                }
                this.unopen()
            },
            addMemo(){
                var parm = {
                    update_type: this.radio,
                    vender_remark: this.memo,
                    tids: ""
                }
                var str = "";
                for (let i in this.selection) {
                    str += this.selection[i].tid + ","
                }
                parm.tids = str;
                editMemo(parm).then((res) => {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            if (res.status_code == 200) {
                                this.dialogTableVisible = false;
                                this.memo = "";
                            }

                        }
                    });
                })
            },
            closeOrders(){
                var parm = {
                    tids: "",
                    cancel_reason: this.momo
                }
                var str = "";
                for (let i in this.selection) {
                    str += this.selection[i].tid + ","
                }
                parm.tids = str;
                closeOrder(parm).then((res) => {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            if (res.status_code == 200) {
                                this.closeR = false;
                                this.memo = "";
                            }
                        }
                    });
                })
            },
            send_goodsC(row){
                switch (row.send_goods) {
                    case 0:
                        return "未发货";
                        break;
                    default:
                        return "已发货"
                }
            },
            statusC(row){
                switch (row.status) {
                    case "WAIT_BUYER_PAY":
                        return "待支付";
                        break;
                    case "WAIT_SELLER_SEND_GOODS":
                        return "待发货";
                        break;
                    case "WAIT_BUYER_CONFIRM_GOODS":
                        return "待收货";
                        break;
                    case "TRADE_FINISHED":
                        return "完成";
                        break;
                    case "TRADE_CLOSED_BY_BUYER":
                        return "用户取消订单";
                        break;
                    case "TRADE_CLOSED_BY_SYSTEM":
                        return "系统取消订单";
                        break;
                }
            },
            detail(index){
                this.$router.push({path: "/Public", query: {tid: this.tableData[index].tid}})
            },
            handleSelectionChange(val) {
                this.selection = val;
            },
            timeChange(val){
                this.time_quantum = val;
                if (this.time_quantum) {
                    this.start_date = this.time_quantum.split(" - ")[0] + " 00:00:00";
                    this.end_date = this.time_quantum.split(" - ")[1] + " 23:59:59";
                } else {
                    this.start_date = "";
                    this.end_date = "";
                }
            }
        }
    }
</script>