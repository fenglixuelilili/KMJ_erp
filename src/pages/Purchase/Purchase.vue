<template>
    <section>
        <div id="orderDetails" style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.status == '待支付'">未生效，未审核</h3>
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.status == '待发货'">未生效，未审核 => 生效中，未审核</h3>
            <h3 style="text-align:center;font-weight:normal" v-if="tableData.status == '待收货'">未生效，未审核 => 生效中，未审核 => 生效总，已入库</h3>
            <h3>采购信息</h3>
            <el-row>
                <el-col :span='8'>采购单号：{{tableData.po_bn}}</el-col>
                <el-col :span='8'>采购员：{{tableData.operator_name}}</el-col>
                <el-col :span='8'>创建时间：{{tableData.created_at}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>确认时间：<span v-if="tableData.check_at != '0000-00-00 00:00:00'">{{tableData.check_at}}</span></el-col>
                <el-col :span='8'>发票类型：{{tableData.invoice_type}}</el-col>
                <el-col :span='8'>采购单执行状态：{{tableData.po_status}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>确认状态：{{tableData.check_status}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='24'>备注信息：{{tableData.memo}}</el-col>
            </el-row>
        </div>
        <div style="padding: 10px 20px;" id="scroll_bottomBox">
            <h3>物料信息</h3>
            <el-table :data="tableData.items" :summary-method="addUp" show-summary border id="scroll_bottom">
                <el-table-column label="缩略图" width="120">
                    <template slot-scope="props">
                        <img :src="props.row.default_image" alt="" style="width:100%" v-if="props.row.default_image">
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="sku标题" min-width="120">
                </el-table-column>
                <el-table-column prop="sub_title" label="副标题" min-width="120">
                </el-table-column>
                <el-table-column :formatter='props_valuesC' prop="props_values" label="规格" min-width="120">
                </el-table-column>
                <el-table-column prop="unit" label="单位" min-width="120">
                </el-table-column>
                <el-table-column prop="num" label="采购数量" min-width="120">
                </el-table-column>
                <el-table-column prop="price" label="采购单价(元)" min-width="120">
                </el-table-column>
                <el-table-column prop="post_fee" label="运费" min-width="120">
                </el-table-column>
                <el-table-column label="采购单品总价" prop="" :formatter='adduct' width="140">
                </el-table-column>
                <el-table-column prop="instock_num" label="实际入库数量" min-width="140">
                </el-table-column>
                <el-table-column prop="barcode" label="条码" min-width="120">
                </el-table-column>
                <el-table-column prop="bn" label="货号" min-width="120">
                </el-table-column>
            </el-table>
        </div>
        <div style="padding: 10px 20px;box-sizing: border-box;line-height: 25px">
            <h3>供应商信息</h3>
            <el-row>
                <el-col :span='8'>供应商名称：{{supplier.name}}</el-col>
                <el-col :span='8'>供应商公司名称：{{supplier.company}}</el-col>
                <el-col :span='8'>联系人：{{supplier.contacter}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>所在地区：{{supplier.area}}</el-col>
                <el-col :span='8'>详细地址：{{supplier.address}}</el-col>
                <el-col :span='8'>联系电话：{{supplier.telephone}}</el-col>
            </el-row>
        </div>
        <div class="check-box">
            <el-button :plain="true" type="info" @click="getback" class="checks">返回</el-button>
        </div>
    </section>
</template>
<script>
    import { PurchaseDetail } from '../../api/api'
    export default{
        data() {
            return {
                tableData: [],
                supplier: [],
            }
        },
        created(){
            var parms = {
                po_id: this.$route.query.po_id
            }
            PurchaseDetail(this.$route.query.po_id,parms).then((res)=>{
                this.tableData = res.data
                switch ( this.tableData.invoice_type){
                    case 1:
                        this.tableData.invoice_type = '没有发票';
                        break;
                    case 2:
                        this.tableData.invoice_type = '增值税发票(6%税率)';
                        break;
                    case 3:
                        this.tableData.invoice_type = '增值税发票(17%税率)';
                        break;
                    case 4:
                        this.tableData.invoice_type = '普通发票';
                        break;
                }
                switch ( this.tableData.check_status){
                    case '1':
                        this.tableData.check_status = '未确认';
                        break;
                    case '2':
                        this.tableData.check_status = '已确认';
                        break;
                }
                switch ( this.tableData.po_status){
                    case '1':
                        this.tableData.po_status = '已新建 ';
                        break;
                    case '2':
                        this.tableData.po_status = '已生效';
                        break;
                    case '3':
                        this.tableData.po_status = '采购退货';
                        break;
                    case '4':
                        this.tableData.po_status = '采购完成';
                        break;
                }
                this.supplier = res.data.supplier
                this.supplier.area = this.supplier.area.split(":")[0]
            })
        },
        methods: {
            adduct(val){
                let num = 0;
                num = parseFloat(val.num) * parseFloat(val.price) + parseFloat(val.post_fee);
                return num.toFixed(2);
            },
            addUp(val){
                let num = 0;
                for (let i = 0; i < val.data.length; i++) {
                    num += parseFloat(this.adduct(val.data[i]));
                }
                num = num.toFixed(2);
                return ["", "", "", "", "", "", "", "", "", "合计总价", num, ""];
            },
            props_valuesC(val){
                var str = '';
                if (val){
                    for(var i = 0; i < val.props_values.length;i++){
                        str =  val.props_values[i].prop_name + ' ' + val.props_values[i].prop_value + ' '
                    }
                    return str
                }
            },
            getback(){
                this.$router.push({path: '/purchase/orders/manager/list',query:{criteria:this.$route.query.criteria}})
            }
        }
    }
</script>