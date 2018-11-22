<style>
    .cen{
        text-align: center;

    }
    .bg{
        background: #eef1f6;
    }
    .el-radio-button__inner {
        border-radius: 4px 4px 4px 4px!important;
        border-left: 1px solid #ccc!important;
        margin-left: 80px;
        margin-top: 20px;
    }
    .mengban{
        position: absolute;width: 100%;height: 820px!important;background: black;z-index: 888;opacity: 0.5
    }
    .show{
        position: absolute;width: 80%;height: 700px;z-index: 999;padding: 10px;box-sizing: border-box;background: white;margin-left: 10%;margin-top: 5%;
    }
    #close{
        text-align: center;
        font-weight: 100;
        width: 40px;
        height: 30px;
        font-size: 25px;
        line-height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
        background-size: 100%;
    }
    #close:hover {
        background: red;
        color: #FFF;
    }
    /*.el-row {*/
    /*margin-bottom: 20px;*/
    /*&:last-child {*/
    /*margin-bottom: 0;*/
    /*}*/
    /*}*/
    #ml span{
        margin-left: 0;
    }
    #remove{
        color: white;
        background: red;
        margin-left: 30px;
    }
</style>

<template>
    <section class='bg' id="gg">
        <div v-if='bool' class='mengban'></div>
        <div v-if='bool' class='show'>
            <el-input v-model="shop_name" placeholder="在售商品名称" style='width: 200px'></el-input>
            <el-cascader placeholder="物料分类" @change="handleItemChange" v-model='cat_ids' :props="defaultProps" :options="options" filterable>
            </el-cascader>
            <el-button type="primary" style='width: 150px' @click='getSkuListes'>查询</el-button>
            <div id="close" @click="hidden">×</div>
            <!--列表-->
            <el-table
                    :data="tableDataII"
                    border
                    height="500"
                    style="width: 100%;margin-top: 20px;">
                <el-table-column
                        label="操作"
                        min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click='addItemes(scope.$index)'>添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="物料名称"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        :formatter='props_valuesC'
                        prop="props_values"
                        label="规格"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="重量(kg)"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="单位"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="sku_store"
                        label="物料库存"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="barcode"
                        label="条码"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="bn"
                        label="货号"
                        min-width="120">
                </el-table-column>
            </el-table>
            <!--分页-->
            <template>
                <div class="block" style="padding:10px;padding-left:0;float: right">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="page"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="per_page"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </template>
            <div style='clear: both'></div>
            <div class=cen><el-button type="primary" style='width: 150px;' @click='hidden'>完成</el-button></div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;基本信息</h3>
            <el-row  class='bg' style="margin-top: 10px;">
                <el-col :span="2" class='cen' style='margin-left: 11px;margin-top: 7px;'><span style='color: red'>* </span>采购单号</el-col>
                <el-col :span='21'>
                    <el-form :inline="true" label-width="120px" :model="form" ref='form' :rules="rules">
                        <el-form-item label="" prop="po_bn" :rules="[
                              { required: true, message: '请输入采购单号', trigger: 'blur' },
                            ]">
                            <el-input v-model="form.po_bn" style="width: 280px"></el-input>
                        </el-form-item>
                        <el-form-item label="供应商" prop="requires">
                            <el-select v-model="form.supplier_id" clearable placeholder="请选择" class="col" style='width: 280px;'>
                                <el-option
                                        v-for="item in optionsIV"
                                        :label="item.name"
                                        :value="item.supplier_id"
                                        :key="item.supplier_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class='bg'>
                <el-col :span='22' :offset="1">
                    <div style='padding: 10px;padding-left: 0;'>
                        <el-button type="primary" style='width: 150px;' @click='show'>添加物料</el-button>
                    </div>
                    <el-table
                            :data="tableDataI"
                            border
                            height="500"
                            style="width: 100%;  margin-bottom: 20px">
                        <el-table-column
                                label="操作"
                                min-width="70">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click='removeItem(scope.$index)'>移除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="title"
                                label="物料名称"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                :formatter='props_valuesC'
                                prop="props_values"
                                label="规格"
                                min-width="120">
                        </el-table-column>
                        <el-table-column
                                prop="unit"
                                label="单位"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="sku_store"
                                label="物料库存"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                label="采购数量"
                                min-width="95">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.num" placeholder="请输入数量"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="采购单价(元)"
                                min-width="120">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.price" placeholder="请输入单价"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="运费(选填)"
                                min-width="110">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.post_fee" placeholder="请输入运费"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="weight"
                                label="重量(kg)"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                prop="barcode"
                                label="条码"
                                min-width="180">
                        </el-table-column>
                        <el-table-column
                                prop="bn"
                                label="货号"
                                min-width="180">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;其他信息</h3>
            <el-row class="bg">
                <el-col :span='2' class='cen' style='padding-top: 20px;margin-right: 13px'>
                    <p><span style='color: red'>* </span>发票类型</p>
                </el-col>
                <el-col :span="21">
                    <el-col :span="21" style="line-height: 60px;">
                        <el-radio class="radio" v-model="radio" label="没有发票">没有发票</el-radio>
                        <el-radio class="radio" v-model="radio" label="普通发票">普通发票</el-radio>
                        <el-radio class="radio" v-model="radio" label="增值税发票(6%税率)">增值税发票(6%税率)</el-radio>
                        <el-radio class="radio" v-model="radio" label="增值税发票(17%税率)">增值税发票(17%税率)</el-radio>
                    </el-col>
                </el-col>
            </el-row>
            <div style="height: 20px;"></div>
            <el-row class="bg">
                <el-col :span='2' class='cen' style="margin-right: 10px;">
                    <p>付款计划</p>
                </el-col>
                <el-col :span="21">
                    <el-form :model="Form" label-width="120px">
                        <el-form-item
                                v-for="(domain, index) in Form.domains"
                                :label="'第' + (index+1) + '次付款日期：'"
                                :key="domain.key"
                                :prop="'domains.' + index + '.value'">
                            <el-date-picker
                                    style='margin-right: 30px'
                                    v-model="domain.pay_date"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                            付款金额：
                            <el-input v-model="domain.payment" placeholder="请输入付款金额" style='width: 200px;'></el-input> 元
                            <el-button @click.prevent="removeDomain(domain)" id="remove">删除</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="addDomain" class='btnw' style=''>新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class="bg">
                <el-col :span='2' class='cen' style='margin-right: 10px;'>
                    <p>备注</p>
                </el-col>
                <el-col :span="21">
                    <el-input
                            style='width: 100%;margin-bottom: 20px;'
                            :autosize="{ minRows: 2, maxRows: 8}"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="textarea">
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-row class="bg" style='text-align: center;margin: 0;'>
            <el-button type="primary" style='width: 200px;margin: 20px;' @click='subMit'>保存</el-button>
            <el-button type="primary" style='width: 200px;margin: 20px;background:#FFF;color: black;border: 1px solid #ccc' @click='getback'>取消</el-button>
        </el-row>
    </section>
</template>

<script>
    import { getItemsList, getCategoriesList, getSuppliersList, editPurchases, PurchaseDetail } from '../../api/api'

    export default {
        data () {
            return {
                defaultProps: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                cat_id: '',
                cat_ids: [],
                form: {
                    supplier_id: "",
                    people: "",
                    po_bn: "",
                },
                rules: {
                    requires: [
                        { required: true, message: '必填项', trigger: 'blur' },
                    ]
                },
                tableDataI: [],
                tableDataII: [],
                num: 1,
                radio: "",
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                Form: {
                    domains:[
                        {payment:"",pay_date:""}
                    ]
                },
                textarea: "",
                bool: false,
                shop_name: "",
                options: [],
                optionsIV: [],
                total: 200,
                page: 1,
                per_page: 20,
            }
        },
        created () {
            var parms = {
                po_id: this.$route.query.po_id
            }
            PurchaseDetail(this.$route.query.po_id,parms).then((res)=>{
                this.tableDataI = res.data.items;
                this.form.po_bn = res.data.po_bn;
                this.form.supplier_id = res.data.supplier_id;
                for (let i = 0;i < this.tableDataI.length;i++){
                    this.tableDataI[i].sku_store = this.tableDataI[i].store
                }
                switch (res.data.invoice_type){
                    case 1:
                        this.radio = '没有发票';
                        break;
                    case 2:
                        this.radio = '增值税发票(6%税率)';
                        break;
                    case 3:
                        this.radio = '增值税发票(17%税率)';
                        break;
                    case 4:
                        this.radio = '普通发票';
                        break;
                }
                this.Form.domains = res.data.payments
                this.textarea = res.data.memo;
            })
            this.getSkuListes();
            let that = this;
            getCategoriesList().then(function(response) {
                that.options = response.data;
            })
                .catch(function(error) {
                    console.log(error);
                });
            var parm = {
                per_page: 99999
            }
            getSuppliersList(parm).then(res=>{
                this.optionsIV = res.data.itemList
            })

        },
        methods: {
            getback(){
                this.$router.push({path:'/purchase/orders/manager/list',query:{criteria:this.$route.query.criteria}})
            },
            subMit(){
                var parm = {
                    po_bn: this.form.po_bn,
                    supplier_id: this.form.supplier_id,
                    invoice_type: this.radio,
                    items: this.tableDataI,
                    memo: this.textarea,
                    payments: this.Form.domains
                }
                var arr = [];
                for (var i in parm.items){
                    let obj = {'sku_id':parm.items[i].sku_id,'bn':parm.items[i].bn,'num':parm.items[i].num,'price':parm.items[i].price,'post_fee':parm.items[i].post_fee}
                    arr.push(obj)
                }
                parm.items = arr;
                var arrI = parm.payments;
                var arrs = [];
                for(let i in arrI){
                    let obj = {'pay_date':'','payment':arrI[i].payment}
                    var str = arrI[i].pay_date.toString();
                    str = str.replace(/ GMT.+$/, '');// Or str = str.substring(0, 24)
                    var d = new Date(str);
                    var a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
                    for(var i = 0, len = a.length; i < len; i ++) {
                        if(a[i] < 10) {
                            a[i] = '0' + a[i];
                        }
                    }
                    str = a[0] + '-' + a[1] + '-' + a[2] + ' ' + a[3] + ':' + a[4] + ':' + a[5];
                    obj.pay_date = str;
                    arrs.push(obj);
                }
                parm.payments = arrs;
                switch (parm.invoice_type){
                    case '没有发票':
                        parm.invoice_type = 1;
                        break;
                    case '增值税发票(6%税率)':
                        parm.invoice_type = 2;
                        break;
                    case '增值税发票(17%税率)':
                        parm.invoice_type = 3;
                        break;
                    case '普通发票':
                        parm.invoice_type = 4;
                        break;
                }
                var timP = [];
                for(let i in parm.payments){
                    var dateTime = new Date(parm.payments[i].pay_date).getTime()
                    timP.push(dateTime)
                }
                for (let i in timP){
                    if (timP[i] < timP[i-1]){
                        this.$notify.info({
                            message: "付款日期顺序填写错误"
                        });
                        return
                    }
                }
                editPurchases(this.$route.query.po_id,parm).then((res)=>{
                    this.$notify.info({
                        message: res.message
                    });
                    if (res.status_code == 200){
                        this.$router.replace('/purchase/orders/manager/list')
                    }
                })
            },
            removeItem(index){
                this.tableDataII.unshift(this.tableDataI[index])
                this.tableDataI.splice(index,1)
            },
            addItemes(index){
                this.tableDataII[index].num = 1;
                this.tableDataII[index].post_fee = 0;
                this.tableDataI.push(this.tableDataII[index])
                this.tableDataII.splice(index,1)
            },
            getSkuListes(){
                var parm = {
                    per_page: this.per_page,
                    page: this.page,
                    item_title: this.shop_name,
                    cat_id: this.cat_id
                }
                getItemsList(parm).then((res)=>{
                    this.tableDataII = res.data.skusList;
                    this.total= res.data.totalCount;
                    for(var i = 0;i < this.tableDataII.length;i++){
                        for (var j = 0;j < this.tableDataI.length;j++){
                            if (this.tableDataII[i].sku_id==this.tableDataI[j].sku_id){
                                this.tableDataII.splice(i,1)
                            }
                        }
                    }
                })

            },
            handleItemChange(val) {
                this.cat_id = val[this.cat_ids.length - 1]
            },
            props_valuesC(val){
                var str = '';
                for(var i = 0; i < val.props_values.length;i++){
                    str =  val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                }
                return str
            },
            handleSizeChange(val){
                this.per_page = val;
                this.getSkuListes();
                return;
            },
            handleCurrentChange(val){
                this.page = val;
                this.getSkuListes();
                return;
            },
            show(){
                $("#gg").css({overflow:"hidden",height:"810px"})
                this.bool = true;
            },
            hidden(){
                $("#gg").css({overflow:"",height:""})
                this.bool = false;
            },
            addDomain(){
                this.Form.domains.push({
                    pay_date: '',
                    key: Date.now(),
                    payment: ""
                });
            },
            removeDomain(item){
                var index = this.Form.domains.indexOf(item)
                if (index !== -1) {
                    this.Form.domains.splice(index, 1)
                }
            }
        }
    }
</script>