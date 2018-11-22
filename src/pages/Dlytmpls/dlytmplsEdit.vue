<template>
    <section v-loading="isLoading" element-loading-text="数据传输中">
        <div class='bg' id="gg">
            <div v-if='bool' class='mengban' style="position: fixed;"></div>
            <div v-if='bool' class="setArea">
                <div id="close" @click="hidden">×</div>
                <span v-for="(city,index) in area" style="width: 33%;display: inline-block;height: 30px;" id="cityss" @click="move(city,$event,-1)" :key="index">
                    <el-checkbox :key="city.id"  v-model="city.bool" @change="checkAll(city)" :indeterminate="city.bools" :disabled="city.disable"></el-checkbox>
                    <span style="cursor: pointer" @click="move(city,$event,index)" :class="'citys'+index">{{city.values}}</span><span style="font-size: 5px;margin-left: 5px;" @click="move(city,$event,index)">▼</span>
                </span>
                <div class="el-popover" v-bind:style="style">
                    <span v-for="(city,index) in citys.children" style="width: 50%;display: inline-block;" :key="index">
                        <el-checkbox style="cursor: pointer" :key="city.id" :label="city.values" v-model="city.bool" @change="checkList" :disabled="city.disable"></el-checkbox>
                    </span>
                    <div style="width: 0;height: 0;border: 10px solid transparent;border-bottom: 10px solid #d1dbe5;position: absolute;top: -20px;left: 27px"></div>
                    <div style="width: 0;height: 0;border: 8px solid transparent;border-bottom: 8px solid #F2F2F2;position: absolute;top: -16px;left: 29px"></div>
                </div>
                <hr>
                <div class='cen' style="margin-top: 20px;">
                    <el-button type="primary" style='width: 150px;' @click='confirm'>确 认</el-button>
                    <el-button style='width: 150px;' @click='hidden'>取 消</el-button>
                </div>
            </div>
            <el-form label-width="150px">
                <div class="shadow">
                    <h3 class="info"><span class="el-icon-edit"></span>&#8195;基本信息</h3>
                    <el-row style="padding-left: 5%;background:#f6f6f6;padding-top: 20px;">
                        <el-form-item label="运费模板名称：" required>
                            <el-input v-model="dly_name" class="share"></el-input>
                        </el-form-item>
                        <el-form-item label="状态：">
                            <el-radio class="radio" v-model="status" :label="2">启用</el-radio>
                            <el-radio class="radio" v-model="status" :label="1">禁用</el-radio>
                        </el-form-item>
                        <el-form-item label="物流公司：" required>
                            <el-select v-model="logistics" placeholder="" filterable clearable class="share">
                                <el-option
                                        v-for="item in logisticses"
                                        :label="item.label"
                                        :value="item.val"
                                        :key="item.val">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发货仓库：" required>
                            <el-select v-model="warehouse_id" multiple placeholder="" class="share">
                                <el-option
                                        v-for="item in warehouse"
                                        :label="item.warehouse_name"
                                        :value="item.warehouse_id"
                                        :key="item.warehouse_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="地区费用设置：" required>
                            <div class="setFee">
                                <p>默认运费（除指定地区外，其余地区的运费采用默认运费）</p>
                                <el-row style="margin-bottom: 10px;">
                                    <span>首重重量：</span>
                                    <el-input class="share_" v-model="weight"></el-input>
                                    <span style="margin-right: 20px;">（kg以内）</span>
                                    <span>首重运费：</span>
                                    <el-input class="share_" v-model="postFee"></el-input>
                                    <span>（元）</span>
                                </el-row>
                                <el-row>
                                    <span>续重重量：</span>
                                    <el-input class="share_" v-model="weight_"></el-input>
                                    <span style="margin-right: 20px;">（kg以内）</span>
                                    <span>续重运费：</span>
                                    <el-input class="share_" v-model="postFee_"></el-input>
                                    <span>（元）</span>
                                </el-row>
                            </div>
                            <div class="setFee">
                                <p>为指定地区城市设置运费：</p>
                                <el-table
                                        :data="tableData"
                                        border
                                        style="width: 100%">
                                    <el-table-column
                                            prop="str"
                                            label="指定地区"
                                            width="180">
                                    </el-table-column>
                                    <el-table-column
                                            label="操作"
                                            width="180">
                                        <template slot-scope="scope">
                                            <el-button size="small" @click="edit(scope.row,scope.$index)">编辑</el-button>
                                            <el-button type="danger" size="small" @click="remove(scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="address"
                                            label="首重重量（kg）">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.weight" placeholder=""></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="address"
                                            label="首重运费（元）">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.post_fee" placeholder=""></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="address"
                                            label="续重重量（kg）">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.weight_" placeholder=""></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="address"
                                            label="续重运费（元）">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.post_fees" placeholder=""></el-input>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-row>
                                    <el-col :span="24" style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0 10px;'>
                                        <el-button type="primary" @click="bool=true" class="btnw">+ 添加地区</el-button>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-form-item>
                    </el-row>
                </div>
            </el-form>
            <div class="shadow" style="margin: 0 0 10px 0;margin-bottom: 20px;">
                <h3 class="info"><span class="el-icon-edit"></span>&#8195;备注</h3>
                <el-row style="background:#f6f6f6;">
                    <el-col :span="24" style="padding: 20px;">
                        <el-input
                                style="width: 100%;"
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 8}"
                                placeholder="请输入备注信息"
                                v-model="memo">
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <el-row :gutter="2">
                <el-col :span="24">
                    <div class="grid-content bg-purple-light text-center">
                        <el-button type="primary" @click="subMit" class="btnw">保存</el-button>
                        <el-button @click="getback" class="btnw">取消</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
    </section>
</template>
<style scoped>
    .box {
        padding: 20px;
    }

    .share {
        width: 40%;
    }

    .share_ {
        width: 30%;
    }

    .setFee {
        border: 1px solid #cccccc;
        padding: 10px;
        margin-right: 20px;
        margin-bottom: 20px;
        background: #FFF;
    }
    .setArea{
        padding: 20px;
        position: fixed;
        z-index: 2001;
        top: 200px;
        background:#FFF;
        width: 80%;
        margin-left: 3%;
        padding-top: 30px;
        box-sizing: border-box;
    }
</style>
<script>
    import {getWareHousesList, getCorp, AreaData, getAreaData, editDlys, dlyDetail} from './../../api/api'
    export default{
        data () {
            return {
                bool: false,
                dly_name: "",
                status: 1,
                warehouse_id: [],
                warehouse: [],
                logistics: "",
                logisticses: [],
                weight: "",
                weight_: "",
                postFee: "",
                postFee_: "",
                memo: "",
                tableData: [],
                area: [],
                style: {},
                citys: [],
                index: -1,
                isLoading: false
            }
        },
        created(){
            this.style = {
                width: '35%',
                transformOrigin: 'left center 0px',
                zIndex: 2002,
                positon: 'absolute',
                display: "none",
                top: 0,
                left: 0,
                background: '#F2F2F2!important'
            }
            getWareHousesList().then(res => {
                this.warehouse = res.data.itemList;
//                this.warehouse.unshift({warehouse_name: "全部仓库", warehouse_id: "all"})
            }).catch(e => {
                console.log(e);
            })
            getCorp().then((res) => {
                for (let key in res.data) {
                    let obj = {};
                    obj.label = res.data[key]
                    obj.val = key
                    this.logisticses.push(obj)
                }
            })
            getAreaData().then((res) => {
                this.area = res;
                for (let i = 0;i < this.area.length;i++){
                    this.area[i].bool = false;
                    this.area[i].bools = false;
                    this.area[i].disable = false;
                    for (let j = 0;j < this.area[i].children.length;j++){
                        this.area[i].children[j].bool = false;
                        this.area[i].children[j].disable = false;
                    }
                }
            })
            dlyDetail(this.$route.query.rule_id).then((res)=>{
                this.dly_name = res.data.rule_name;
                this.status = res.data.enabled;
                this.logistics = res.data.corp_id.toString();
                this.weight = res.data.first_weight;
                this.postFee = res.data.first_cost;
                this.weight_ = res.data.renew_weight;
                this.postFee_ = res.data.renew_cost;
                this.memo = res.data.memo;
                for (let i = 0;i < res.data.ware_house.length;i++){
                    this.warehouse_id.push(res.data.ware_house[i].warehouse_id)
                }
                this.area = JSON.parse(res.data.original);
                this.tableData = JSON.parse(res.data.original2)
            })
        },
        methods: {
            checkAll(city){
                if (city.bools == true){
                    city.bools = false;
                    city.bool = true;
                }
                var bool;
                if (city.bool){
                    bool = true;
                }else {
                    bool = false;
                }
                for (let i = 0;i < city.children.length;i++){
                    if (city.children[i].disable == false){
                        city.children[i].bool = bool;
                    }
                }
                this.$forceUpdate()
            },
            checkList(){
                let arr = []
                for (let i = 0;i < this.citys.children.length;i++){
                    arr.push(this.citys.children[i].bool)
                }
                if (arr.indexOf(true)>=0&&arr.indexOf(false)>=0){
                    this.citys.bools = true;
                    this.citys.bool = false;
                }else {
                    this.citys.bools = false;
                    if (arr.indexOf(true)>=0){
                        this.citys.bool = true;
                    }else {
                        this.citys.bool = false;
                    }
                }
                this.$forceUpdate()
            },
            getback(){
                this.$router.push({path: "/warehouses/dlytmpls/manager/list",query:{page: this.$route.query.page}})
            },
            move(city,event,index){
                event.stopPropagation();
                if (index == -1){
                    this.style.display = "none";
                    return;
                }
                if (this.citys.children == city.children){
                    this.style.display == "block"?this.style.display="none":this.style.display="block";
                    return;
                }
                this.style.display = "block";
                this.citys = city;
                var classes = ".citys" + index;
                var top = $(classes).position().top;
                var left = $(classes).position().left;
                this.style.top = top + 25 + "px";
                this.style.left = left - 22 + "px";
            },
            confirm(){
                let str = "";
                let ids = [];
                for (let i = 0;i < this.area.length;i++) {
                    if (this.area[i].disable == false){
                        if (this.area[i].bool == true){
                            this.area[i].disable = true;
                            let strs = "";
                            let bol = "";
                            let id_ = [];
                            for (let j = 0;j < this.area[i].children.length;j++){
                                if (this.area[i].children[j].disable == false){
                                    this.area[i].children[j].disable = true;
                                    if (strs == "") {
                                        strs += this.area[i].children[j].values;
                                    }else {
                                        strs += "，" + this.area[i].children[j].values;
                                    }
                                    id_.push(this.area[i].children[j].id)
                                }else {
                                    bol = 1;
                                }
                            }
                            if (bol){
                                str += this.area[i].values + `(${strs})` + " ";
                                ids.push(id_)
                            }else {
                                str += this.area[i].values + " ";
                                ids.push(this.area[i].id)
                            }
                        }else if(this.area[i].bools == true){
                            let strs = "";
                            let id_ = [];
                            for (let j = 0;j < this.area[i].children.length;j++){
                                if (this.area[i].children[j].disable == false){
                                    if (this.area[i].children[j].bool == true){
                                        this.area[i].children[j].disable = true;
                                        if (strs == ""){
                                            strs += this.area[i].children[j].values;
                                        }else {
                                            strs += "，" + this.area[i].children[j].values;
                                        }
                                        id_.push(this.area[i].children[j].id)
                                    }
                                }
                            }
                            if (strs != ""){
                                ids.push(id_);
                                str += this.area[i].values + `(${strs})` + " ";
                            }
                        }
                    }
                }
                let obj = {str: str, post_fee: 0, weight: 0, post_fees: 0, weight_: 0, ids: ids};
                if (this.index >= 0){
                    this.tableData[this.index].str = str;
                    this.tableData[this.index].ids = ids;
                    this.index = -1;
                    this.$forceUpdate()
                }else {
                    this.tableData.push(obj);
                }
                for (let i = 0;i < this.area.length;i++){
                    let arr = [];
                    for (let k = 0;k < this.area[i].children.length;k++){
                        arr.push(this.area[i].children[k].disable)
                    }
                    if (arr.indexOf(true)>=0&&arr.indexOf(false)<0){
                        this.area[i].disable = true;
                    }
                }
                this.bool = false;
                this.style.display = "none";
            },
            hidden(){
                var val = this.tableData[this.index];
                if (this.index >= 0){
                    for (let i = 0;i < this.area.length;i++){
                        for (let j = 0;j < val.ids.length;j++){
                            if (typeof (val.ids[j]) == 'object'){
                                for (let k = 0;k < this.area[i].children.length;k++){
                                    for (let z = 0;z < val.ids[j].length;z++){
                                        if (this.area[i].children[k].id == val.ids[j][z]){
                                            this.area[i].children[k].disable = true;
                                        }
                                    }
                                }
                            }else {
                                if (this.area[i].id == val.ids[j]){
                                    this.area[i].disable = true;
                                    for (let k = 0;k < this.area[i].children.length;k++){
                                        this.area[i].children[k].disable = true;
                                    }
                                }
                            }
                        }
                    }
                }
                this.index = -1;
                this.bool = false;
                this.style.display = "none";
            },
            edit(val,index){
                this.bool = true;
                this.index = index;
                for (let i = 0;i < this.area.length;i++){
                    for (let j = 0;j < val.ids.length;j++){
                        if (typeof (val.ids[j]) == 'object'){
                            for (let k = 0;k < this.area[i].children.length;k++){
                                for (let z = 0;z < val.ids[j].length;z++){
                                    if (this.area[i].children[k].id == val.ids[j][z]){
                                        this.area[i].children[k].disable = false;
                                        this.area[i].disable = false;
                                    }
                                }
                            }
                        }else {
                            if (this.area[i].id == val.ids[j]){
                                this.area[i].disable = false;
                                for (let k = 0;k < this.area[i].children.length;k++){
                                    this.area[i].children[k].disable = false;
                                }
                            }
                        }
                    }
                }
            },
            remove(index){
                var val = this.tableData[index];
                this.tableData.splice(index,1);
                for (let i = 0;i < this.area.length;i++){
                    for (let j = 0;j < val.ids.length;j++){
                        if (typeof (val.ids[j]) == 'object'){
                            for (let k = 0;k < this.area[i].children.length;k++){
                                for (let z = 0;z < val.ids[j].length;z++){
                                    if (this.area[i].children[k].id == val.ids[j][z]){
                                        if (this.area[i].disable == true){
                                            this.area[i].bools = true;
                                        }
                                        this.area[i].children[k].disable = false;
                                        this.area[i].children[k].bool = false;
                                        this.area[i].disable = false;
                                        this.area[i].bool = false;
                                    }
                                }
                            }
                        }else {
                            if (this.area[i].id == val.ids[j]){
                                this.area[i].disable = false;
                                this.area[i].bool = false;
                                for (let k = 0;k < this.area[i].children.length;k++){
                                    this.area[i].children[k].disable = false;
                                    this.area[i].children[k].bool = false;
                                }
                            }
                        }
                    }
                }
            },
            subMit(){
                this.isLoading = true;
                var parm = {
                    corp_id: this.logistics,
                    rule_name: this.dly_name,
                    first_weight: this.weight,
                    first_cost: this.postFee,
                    renew_weight: this.weight_,
                    renew_cost: this.postFee_,
                    enabled: this.status,
                    memo: this.memo,
                    warehouses: "",
                    regionsRule: [],
                    original: "",
                    original2: "",
                }
                parm.original = JSON.stringify(this.area);
                parm.original2 = JSON.stringify(this.tableData);
                for (let i = 0;i < this.warehouse_id.length;i++){
                    if (parm.warehouses == ""){
                        parm.warehouses += this.warehouse_id[i]
                    }else {
                        parm.warehouses += "," + this.warehouse_id[i]
                    }
                }
                for (let i = 0;i < this.tableData.length;i++){
                    let obj = {};
                    obj.first_weight = this.tableData[i].weight;
                    obj.first_cost = this.tableData[i].post_fee;
                    obj.renew_weight = this.tableData[i].weight_;
                    obj.renew_cost = this.tableData[i].post_fees;
                    obj.regions = [];
                    for (let k = 0;k < this.tableData[i].ids.length;k++){
                        for (let j = 0;j < this.area.length;j++){
                            if (typeof (this.tableData[i].ids[k]) == "object"){
                                for (let l = 0;l < this.tableData[i].ids[k].length;l++){
                                    for (let o = 0;o < this.area[j].children.length;o++){
                                        if (this.area[j].children[o].id == this.tableData[i].ids[k][l]){
                                            let obj_city = {region_city_id:"",region_province_id:"",region_province_name:"",region_city_name:""};
                                            obj_city.region_city_id = parseInt(this.tableData[i].ids[k][l]);
                                            obj_city.region_province_id = parseInt(this.area[j].id);
                                            obj_city.region_province_name = this.area[j].values;
                                            obj_city.region_city_name = this.area[j].children[o].values;
                                            obj.regions.push(obj_city);
                                        }
                                    }
                                }
                            }else {
                                if (this.area[j].id == this.tableData[i].ids[k]){
                                    for (let l = 0;l < this.area[j].children.length;l++){
                                        let obj_city = {region_city_id:"",region_province_id:"",region_province_name:"",region_city_name:""};
                                        obj_city.region_city_id = parseInt(this.area[j].children[l].id);
                                        obj_city.region_province_id = parseInt(this.area[j].id);
                                        obj_city.region_province_name = this.area[j].values;
                                        obj_city.region_city_name = this.area[j].children[l].values;
                                        obj.regions.push(obj_city)
                                    }
                                }
                            }
                        }
                    }
                    parm.regionsRule.push(obj)
                }
                parm.regionsRule = JSON.stringify(parm.regionsRule);
                editDlys(this.$route.query.rule_id,parm).then((res)=>{
                    this.isLoading = false;
                    if (!res.error_code){
                        this.$notify({
                            title: '通知',
                            message: "编辑成功",
                            type: 'success'
                        });
                        this.$router.replace("/warehouses/dlytmpls/manager/list")
                    }else {
                        this.$notify.error({
                            title: '错误',
                            message: res.message,
                        });
                    }
                })
            }
        }
    }
</script>