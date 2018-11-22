<template>
    <section>
        <el-form :model="form" label-width="100px" style="background:#f6f6f6;padding: 20px;">
            <div class="shadow" style="width: 100%;">
                <h3 class="info"><span class="el-icon-edit"></span>&#8195;店铺信息</h3>
                <el-row>
                    <el-col :span="20" :offset="4" style="margin-top: 20px;">
                        <el-form-item label="店铺名称" prop="store_name" :rules="[{required:true,message:'店铺名不能为空'}]">
                            <el-input v-model="form.store_name" style="width: 280px;"></el-input>
                        </el-form-item>
                        <el-form-item label="所在行政区">
                            <el-cascader placeholder="试试搜索：太原" style="width: 280px;" @change="handleChange" clearable v-model="area" :props="defaultProps" :options="options" filterable>
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="详细地址">
                            <el-input v-model="form.address" style="width: 280px;"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人">
                            <el-input v-model="form.contacter" style="width: 280px;"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="telephone" :rules="[
                            { required: false, message: ''},
                            { type: 'number', message: '联系电话必须为数字'}]">
                            <el-input type="telephone" v-model.number="form.telephone" style="width: 280px;">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="地推负责人">
                            <el-input v-model="form.marketers" style="width: 280px;"></el-input>
                            <!--<el-select v-model="form." clearable placeholder="请选择" style="width:280px;">-->
                                <!--<el-option-->
                                        <!--v-for="item in marketers"-->
                                        <!--:key="item"-->
                                        <!--:label="item"-->
                                        <!--:value="item">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        </el-form-item>
                        <el-form-item label="运营负责人">
                            <el-input v-model="form.operater" style="width: 280px;"></el-input>
                            <!--<el-select v-model="form." clearable placeholder="请选择" style="width: 280px;">-->
                                <!--<el-option label="李四" value="李四"></el-option>-->
                            <!--</el-select>-->
                        </el-form-item>
                        <el-form-item label="店铺描述">
                            <el-input type="textarea" v-model="form.memo" :rows="5" style="width: 280px;">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="经度" prop="longitude" :rules="[
                            { required: false, message: ''},
                            { type: 'number', message: '经度必须为数字'}]">
                            <el-input type="longitude" v-model.number="form.longitude" style="width: 280px;">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="纬度" prop="latitude" :rules="[
                            { required: false, message: ''},
                            { type: 'number', message: '纬度必须为数字'}]">
                            <el-input type="latitude" v-model.number="form.latitude" style="width: 280px;">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-light text-center">
                        <el-button type="primary" @click="onSubmit" class="btnw">保存</el-button>
                        <el-button @click="$router.replace('/waimaistores/manager/list')" class="btnw">取消</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </section>
</template>

<script>
    import {addStore, getAreaData} from '../../api/api'
    export default{
        data (){
            return {
                form: {
                    store_name: "",
                    area: "",
                    address: "",
                    zip: "",
                    telephone: null,
                    contacter: "",
                    marketers: "",
                    operater: "",
                    longitude: "",
                    latitude: "",
                    memo: "",
                    bool: true
                },
                area: [],
                marketers: ["祁春艳","周振伟","王振宏","赵文成","郭将星","户争"],
                options: [],
                defaultProps: {
                    value: 'id',
                    label: 'values'
                }
            }
        },
        created(){
            getAreaData().then(res=>{
                this.options = res;
            })
        },
        methods: {
            onSubmit(){
                if (this.form.telephone!=null){
                    if(!parseInt(this.form.telephone)){
                        this.$alert("联系电话错误，请重新输入");
                        return
                    }
                }
                if (this.form.longitude!=""){
                    if(!parseInt(this.form.longitude)){
                        this.$alert("经度错误，请重新输入");
                        return
                    }
                }
                if (this.form.latitude!=""){
                    if(!parseInt(this.form.latitude)){
                        this.$alert("维度错误，请重新输入");
                        return
                    }
                }
                addStore(this.form).then((res) => {
                    if(res.status_code == 200){
                        this.bool = false;
                        this.$notify.info({
                            message: '保存成功'
                        });
                        this.$router.replace('/waimaistores/manager/list')
                    }else{
                        this.$notify.info({
                            message: res.message
                        });
                    }
                })
            },
            handleChange(value) {
                let a = '', b = '', c = '', areaData = this.options;
                for (let i in areaData) {
                    if (areaData[i].id == value[0]) {
                        a = areaData[i].values;
                        for(let j in areaData[i].children){
                            if (areaData[i].children[j].id == value[1]) {
                                b = areaData[i].children[j].values;
                                if (value.length === 3) {
                                    for(let k in areaData[i].children[j].children){
                                        if (areaData[i].children[j].children[k].id === value[2]) {
                                            c = areaData[i].children[j].children[k].values;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (value.length === 3) {
                    this.form.area = `${a}/${b}/${c}:${value[0]}/${value[1]}/${value[2]}`;
                } else {
                    this.form.area = `${a}/${b}:${value[0]}/${value[1]}`;
                }
            }
        }
    }
</script>