<template>
    <section class='bg' id="gg" v-loading="isLoading" element-loading-text="数据传输中...">
        <div v-if='bool' class='mengban'></div>
        <div v-if='bool' class='show'>
            <el-input v-model="title" placeholder="商品名称" style='width: 200px' v-if="!bols"></el-input>
            <el-button type="primary" style='width: 150px' @click='getSkusList' v-if="!bols">查询</el-button>
            <el-input v-model="storeName" placeholder="店铺名称" style='width: 200px' v-if="bols"></el-input>
            <el-button type="primary" style='width: 150px' @click='getStoreList' v-if="bols">查询</el-button>
            <div id="close" @click="hidden">×</div>
            <!--列表。物料-->
            <el-table
                    v-if="!bols"
                    :data="tableDataII"
                    border
                    height="500"
                    style="width: 100%;margin-top: 20px;">
                <el-table-column
                        label="操作"
                        min-width="70">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click='addItemes(scope.$index)'>添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="item_name"
                        label="商品名称"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="item_id"
                        label="销售货号"
                        min-width="95">
                </el-table-column>
                <el-table-column
                        min-width="90"
                        prop="platform"
                        :formatter="platformC"
                        label="销售平台">
                </el-table-column>
                <el-table-column
                        prop="memo"
                        label="备注"
                        min-width="95">
                </el-table-column>
            </el-table>
            <!--分页。物料-->
            <template v-if="!bols">
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
            <!--列表。店铺-->
            <el-table
                    v-if="bols"
                    :data="tableStoreII"
                    border
                    height="500"
                    style="width: 100%;margin-top: 10px;">
                <el-table-column
                        label="操作"
                        min-width="70">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click='addItemes(scope.$index,"store")'>添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="store_name"
                        label="快买酒店铺名"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="business_license"
                        label="店铺真实名称"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="地址"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="platform"
                        label="已开通平台"
                        min-width="120">
                </el-table-column>
            </el-table>
            <!--分页。店铺-->
            <template v-if="bols">
                <el-button style="margin:10px;margin-left: 0;" @click="addAllStore"  type="primary" size="small">全部添加</el-button>
                <div class="block" style="padding:10px;padding-left:0;float: right">
                    <el-pagination
                            size="small"
                            @size-change="handleSizeChangeStore"
                            @current-change="handleCurrentChangeStore"
                            :current-page="pageStore"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="per_pageStore"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalStore">
                    </el-pagination>
                </div>
            </template>
            <!--通用-->
            <div style='clear: both'></div>
            <div class=cen><el-button type="primary" style='width: 150px;' @click='hidden'>完成</el-button></div>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;商品信息</h3>
            <el-row  class='bg' style="margin-top: 10px;">
                <el-col :span='21'>
                    <el-form label-width="120px" style="width: 100%;">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="促销日期：" required>
                                    <el-date-picker
                                            v-model="value"
                                            type="datetimerange"
                                            placeholder="选择时间范围"
                                            :picker-options="pickerOptions"
                                            align="right"
                                            @change="timeChange">
                                    </el-date-picker>
                                    <!--<el-date-picker-->
                                            <!--style="width: 100%"-->
                                            <!--v-model="value"-->
                                            <!--type="daterange"-->
                                            <!--align="right"-->
                                            <!--placeholder=""-->
                                            <!--:picker-options="pickerOptions"-->
                                            <!--@change="timeChange">-->
                                    <!--</el-date-picker>-->
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="促销平台：" required>
                            <el-checkbox-group v-model="platform">
                                <el-checkbox label="京东到家" name="type"></el-checkbox>
                                <el-checkbox label="百度外卖" name="type"></el-checkbox>
                                <el-checkbox label="美团外卖" name="type"></el-checkbox>
                                <el-checkbox label="饿了么" name="type"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class='bg'>
                <el-col :span='22' :offset="1">
                    <div style='padding: 10px;padding-left: 0;'>
                        <el-button type="primary" style='width: 150px;' @click='show'>选择物料</el-button>
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
                                prop="item_name"
                                label="商品名称"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                prop="item_id"
                                label="销售货号"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                min-width="90"
                                prop="platform"
                                :formatter="platformC"
                                label="销售平台">
                        </el-table-column>
                        <el-table-column
                                prop="memo"
                                label="备注"
                                min-width="95">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <div class="shadow" id="store">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;店铺信息</h3>
            <el-row class='bg'>
                <el-col :span='22' :offset="1">
                    <div style='padding: 10px;padding-left: 0;'>
                        <el-button type="primary" style='width: 150px;' @click='show("store")'>选择店铺</el-button>
                    </div>
                    <el-table
                            :data="tableStoreI"
                            border
                            height="500"
                            style="width: 100%;  margin-bottom: 20px">
                        <el-table-column
                                label="操作"
                                min-width="70">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click='removeItem(scope.$index,"store")'>移除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="store_name"
                                label="店铺名称"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                prop="address"
                                label="店铺地址"
                                min-width="95">
                        </el-table-column>
                        <el-table-column
                                min-width="90"
                                prop="platform"
                                label="已开通平台">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;备注</h3>
            <el-row class="bg" style="padding: 20px;">
                <el-col :span="24">
                    <el-input
                            style='width: 100%;margin-bottom: 20px;'
                            :autosize="{ minRows: 4, maxRows: 8}"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="memo">
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-row class="bg" style='text-align: center;margin: 0;'>
            <el-button type="primary" class="btnw" @click="subMit">保存</el-button>
            <el-button class="btnw" @click="$router.replace('/waimaiitems/activity/list')">取消</el-button>
        </el-row>
    </section>
</template>
<script>
    import { getItemList, addActivityItem, storeList } from '../../api/api'
    export default {
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
                            switch (strD.split(" ")[0]){
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
                            switch (strD.split(" ")[0]){
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
                            var num = parseInt(strD.split(' ')[2])-1;
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
                            var numN = parseInt(strD.split(' ')[2])-1;
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * num);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * numN);
                            start.setMonth(start.getMonth()-1);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                tableDataI: [],
                tableDataII: [],
                tableStoreI: [],
                tableStoreII: [],
                num: 1,
                bool: false,
                bols: false,
                title: "",
                storeName: "",
                total: 200,
                totalStore: 200,
                page: 1,
                pageStore: 1,
                per_page: 10,
                per_pageStore: 10,
                item_name: "",
                item_id: "",
                memo: "",
                platform: [],
                value: "",
                time_quantum: "",
                start_date: "",
                end_date: "",
                isLoading: false,
            }
        },
        created () {
            this.getSkusList();
            this.getStoreList();
        },
        methods: {
            addAllStore(){
                let parm = {
                    per_page: 9999999999,
                    sort_type: 'DESC',
                    sort_by: 'created_at',
                }
                storeList(parm).then((res)=>{
                    this.tableStoreI = res.data.storesList;
                    for (let i = 0; i < this.tableStoreI.length; i++) {
                        this.tableStoreI[i].platform = "";
                        if (this.tableStoreI[i].bdstore_id != 0) {
                            this.tableStoreI[i].platform = "百度外卖  "
                        }
                        if (this.tableStoreI[i].meituanstore_id != 0) {
                            this.tableStoreI[i].platform += "美团外卖  "
                        }
                        if (this.tableStoreI[i].jddjstore_id != 0) {
                            this.tableStoreI[i].platform += "京东到家  "
                        }
                        if (this.tableStoreI[i].elemestore_id != 0) {
                            this.tableStoreI[i].platform += "饿了么  "
                        }
                    }
                    this.tableStoreII = [];
                })
            },
            timeChange(val){
                this.time_quantum = val;
                if (this.time_quantum) {
                    this.start_date = this.time_quantum.split(" - ")[0];
                    this.end_date = this.time_quantum.split(" - ")[1];
                }else{
                    this.start_date = "";
                    this.end_date = "";
                }
            },
            platformC(val){
                if (!val.platform){
                    return;
                }
                var pf = val.platform;
                var arr = pf.split(',');
                var str = "";
                for (var i = 0;i < arr.length;i++){
                    switch (arr[i]){
                        case "bd":
                            str += "百度外卖 "
                            break;
                        case "jddj":
                            str += "京东到家 "
                            break;
                        case "eleme":
                            str += "饿了么 "
                            break;
                        case "meituan":
                            str += "美团外卖 "
                            break;
                    }
                }
                return str;
            },
            getSkusList() {
                let parm = {
                    page: this.page,
                    per_page: this.per_page,
                    item_name: this.title,
//                    platform: this.platform,
                };
                getItemList(parm).then((res)=>{
                    this.tableDataII = res.data.data;
                    this.total = res.data.totalCount;
                    for(var i = 0;i < this.tableDataII.length;i++){
                        for (var j = 0;j < this.tableDataI.length;j++){
                            if (this.tableDataII[i].item_id==this.tableDataI[j].item_id){
                                this.tableDataII.splice(i,1)
                            }
                        }
                    }
                })
            },
            getStoreList(){
                var parm = {
                    per_page: this.per_pageStore,
                    page: this.pageStore,
                    sort_type: 'DESC',
                    sort_by: 'created_at',
                    store_name: this.storeName,
                }
                storeList(parm).then((res) => {
                    this.totalStore = res.data.totalCount;
                    this.tableStoreII = res.data.storesList;
                    for (var i = 0; i < this.tableStoreII.length; i++) {
                        this.tableStoreII[i].platform = "";
                        if (this.tableStoreII[i].bdstore_id != 0) {
                            this.tableStoreII[i].platform = "百度外卖  "
                        }
                        if (this.tableStoreII[i].meituanstore_id != 0) {
                            this.tableStoreII[i].platform += "美团外卖  "
                        }
                        if (this.tableStoreII[i].jddjstore_id != 0) {
                            this.tableStoreII[i].platform += "京东到家  "
                        }
                        if (this.tableStoreII[i].elemestore_id != 0) {
                            this.tableStoreII[i].platform += "饿了么  "
                        }
                        for (let j = 0;j < this.tableStoreI.length;j++){
                            if (this.tableStoreII[i].waimaistore_id==this.tableStoreI[j].waimaistore_id){
                                this.tableStoreII.splice(i,1)
                            }
                        }
                    }
                });
            },
            subMit(){
                let stores = [];
                let parm = {
                    item_ids: "",
                    platform: "",
                    activity_start: this.start_date,
                    activity_end: this.end_date,
                    memo: this.memo,
                    stores: ""
                }
                for (let i = 0;i < this.tableStoreI.length;i++){
                    let obj = {};
                    obj.waimaistore_id = this.tableStoreI[i].waimaistore_id;
                    obj.store_name = this.tableStoreI[i].store_name;
                    obj.memo = this.tableStoreI[i].memo;
                    obj.business_license = this.tableStoreI[i].business_license;
                    obj.address = this.tableStoreI[i].address;
                    obj.platform = this.tableStoreI[i].platform;
                    stores.push(obj);
                }
                parm.stores = JSON.stringify(stores);
                for (let i = 0;i < this.tableDataI.length;i++){
                    parm.item_ids += this.tableDataI[i].item_id + ",";
                }
                for (let i = 0;i < this.platform.length;i++){
                    switch (this.platform[i]){
                        case "饿了么":
                            parm.platform += "eleme,";
                            break;
                        case "百度外卖":
                            parm.platform += "bd,";
                            break;
                        case "美团外卖":
                            parm.platform += "meituan,";
                            break;
                        case "京东到家":
                            parm.platform += "jddj,";
                            break;
                    }
                }
                this.isLoading = true;
                $("#gg").css({overflow:"hidden",height:"810px"})
                addActivityItem(parm).then((res)=>{
                    this.isLoading = false;
                    $("#gg").css({overflow:"",height:""});
                    if (!res.error_code){
                        this.$notify({
                            title: '成功',
                            message: '新增促销商品成功',
                            type: 'success'
                        });
                        this.$router.push({path:"/waimaiitems/activity/list"})
                    }else {
                        this.$notify({
                            title: '失败',
                            message: res.message,
                            type: 'error'
                        });
                    }
                })
            },
            removeItem(index,str){
                if (str){
                    this.tableStoreII.unshift(this.tableStoreI[index]);
                    this.tableStoreI.splice(index,1)
                }else {
                    this.tableDataII.unshift(this.tableDataI[index])
                    this.tableDataI.splice(index,1)
                }
            },
            addItemes(index,str){
                if (str){
                    this.tableStoreI.push(this.tableStoreII[index]);
                    this.tableStoreII.splice(index,1)
                }else {
                    this.tableDataI.push(this.tableDataII[index])
                    this.tableDataII.splice(index,1)
                }
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
                this.getSkusList();
            },
            handleSizeChangeStore(val){
                this.per_pageStore = val;
                this.getStoreList();
            },
            handleCurrentChange(val){
                this.page = val;
                this.getSkusList();
            },
            handleCurrentChangeStore(val){
                this.pageStore = val;
                this.getStoreList();
            },
            show(str){
                if (str == "store"){
                    this.bols = true;
                    this.getStoreList();
                }
                $("#gg").css({overflow:"hidden",height:"810px"})
                this.bool = true;
            },
            hidden(){
                $("#gg").css({overflow:"",height:""})
                if(this.bols){
//                    location.href = "#store";
                }
                this.bool = false;
                this.bols = false;
            }
        }
    }
</script>
