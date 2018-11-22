<style media="screen">

.add-items {
    padding: 15px;
}

.add-items .el-row {
    display: flex;
    align-items: stretch;
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}

.add-items .el-col {
    border-radius: 4px;
}

.add-items .bg-purple-dark {
    background: #99a9bf;
}

.add-items .bg-purple {
    background: #d3dce6;
}

.add-items .bg-purple-light {
    background: #f6f6f6;
}

.add-items .grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding: 23px 20px 10px;
}

.add-items .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}

.add-items .el-input {
    width: 300px;
}

.add-items .el-tag {
    margin-right: 5px;
}

.add-items .el-row {
    margin-bottom: 2px;
}

.ql-container {
    background-color: #fff;
}

.ql-container .ql-editor {
    min-height: 30em;
    padding-bottom: 1em;
    max-height: 35em;
}

.add-items .sku-table .el-input {
    width: 100%;
}

.avatar {
    width: 100%;
    height: 100%;
    display: block
}

.active1{
    width: 96px!important;
    height: 96px!important;
    line-height: 100px!important;
}
</style>

<template id="">

<div class="add-items">
    <el-form :model="form" ref="form" :inline="true" label-width="120px">
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;基本信息</h3>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="物料分类">
                            <el-cascader placeholder="试试搜索：干红" @change="handleItemChange" v-model="form.cat_id" :props="defaultProps" :options="options" filterable>
                            </el-cascader>
                        </el-form-item>
                        <br>
                        <el-form-item label="物料标题">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item label="物料副标题">
                            <el-input v-model="form.sub_title"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="是否是虚拟商品">
                            <el-switch on-text="" off-text="" v-model="form.is_virtual"></el-switch>
                        </el-form-item>
                        <br>
                        <el-form-item label="物料ID">
                            <el-input v-model="form.outer_id"></el-input>
                        </el-form-item>
                        <el-form-item label="物料条码">
                            <el-input v-model="form.barcode"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="单位">
                            <el-input v-model="unit"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="到货周期">
                            <el-input v-model="form.cycle" :maxlength="2" placeholder="单位（天）"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="供应商">
                            <el-select v-model="form.suppliers" placeholder="请选择" clearable filterable>
                                <el-option
                                        v-for="item in suppliers"
                                        :key="item.supplier_id"
                                        :label="item.name"
                                        :value="item.supplier_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <br>
                        <br>
                        <el-form-item label="默认图片">
                            <el-upload list-type="picture-card" :action="action" name="image" :show-file-list="false" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload" :on-preview="handlePictureCardPreview">
                                <img v-if="form.default_image" :src="form.default_image" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <el-dialog v-model="dialogVisible" size="tiny">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form-item>
                        <br>
                        <el-form-item label="商品图片">
                            <el-upload
                                    name="image"
                                    :action="action"
                                    list-type="picture-card"
                                    :on-preview="handlePictureCardPreview"
                                    :on-remove="handleRemove"
                                    :on-success="success_list"
                                    :before-upload="beforeAvatarUpload"
                                    :file-list="fileList">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog v-model="dialogVisible" size="tiny">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;规格</h3>
            <el-row>
                <el-col :span="2">
                    <div class="grid-content bg-purple-light text-center">
                        商品规格
                    </div>
                </el-col>
                <div class="grid-content bg-purple-light" style="padding-left: 0;">
                    <table class="el-table el-table--border sku-table" cellspacing="0" cellpadding="0" border="0" style="width: 90%;" v-if="form.skux.length > 0">
                        <tr>
                            <template v-if="skuNameList.length > 0" v-for="(th, index) in skuNameList">
                                <th style="width:100px" >{{ th }}</th>
                            </template>
                            <template v-else v-for="(th, index) in getSkuName">
                                <th style="width:100px" v-if="form.skus[index].dynamicTags.length > 0">{{ th }}</th>
                            </template>
                            <th>商品标题</th>
                            <th>副标题</th>
                            <th>货号</th>
                            <th>条码</th>
                            <th>重量(kg)</th>
                            <th>sku图片</th>
                        </tr>
                        <tr v-for="(td,index) in form.skux">
                            <td v-for="tx in td.skus">{{ tx }}</td>
                            <td>
                                <input v-model="td.title" class="el-input__inner">
                            </td>
                            <td>
                                <input v-model="td.sub_title" class="el-input__inner">
                            </td>
                            <td>
                                <input v-model="td.bn" class="el-input__inner">
                            </td>
                            <td>
                                <input v-model="td.barcode" class="el-input__inner">
                            </td>
                            <td>
                                <input v-model="td.weight" class="el-input__inner">
                            </td>
                            <td>
                                <el-upload
                                        name="image"
                                        class="avatar-uploader"
                                        :action="action"
                                        :show-file-list="false"
                                        :on-success="successII"
                                        :before-upload="beforeAvatarUpload">
                                    <img v-if="td.default_image" :src="td.default_image" class="avatar active1">
                                    <i v-else class="active1 el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </td>
                        </tr>
                    </table>
                </div>
            </el-row>
        </div>
        <div class="shadow" style="margin: 0 0 10px 0;padding-bottom: 20px">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;商品描述</h3>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-light">
                        <quill-editor ref="myTextEditor" v-model="content" :config="editorOption">
                        </quill-editor>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="shadow" style="margin: 0 0 10px 0;padding-bottom: 10px">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;备注</h3>
            <el-row>
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
                    <el-button type="primary" @click="onSubmit('form')" class="btnw">保存</el-button>
                    <el-button @click="retu" class="btnw">取消</el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>



</div>

</template>

<script>

import { getCategoriesList, editItem, getPropsList, imgUploadUrl ,getItemDetail, getCategoriesDetail, getSuppliersList } from '../../api/api';

export default {
    data() {
            return {
                form: {
                    cat_id: [],
                    title: '',
                    sub_title: '',
                    is_virtual: false,
                    outer_id: '',
                    barcode: '',
                    skus: [],
                    skux: [],
                    default_image: '',
                    cycle: '',
                    suppliers: ""
                },
                action: "",
                suppliers: [],
                options5: [],
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
                content: '',
                editorOption: {},
                dialogImageUrl: '',
                dialogVisible: false,
                options: [],
                defaultProps: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                skuNameList: [],
                unit: "",
                fileList: [],
                memo: ""
            }
        },
        created() {
            if (window.location.host == "testfonterp.kmjiu.com"){
                this.action = `https://testerp.kmjiu.com/api/v1/images?access_token=${sessionStorage.getItem('access_token')}`;
            }else{
                this.action = `https://duperp.kmjiu.com/api/v1/images?access_token=${sessionStorage.getItem('access_token')}`;
            }
            let that = this;
            getCategoriesList()
                .then(function(response) {
                    that.options = response.data;
                    getItemDetail(that.$route.query.item_id)
                    .then(function(res) {
                        that.content = res.data.intro;
                        // that.options = response.data;
                        that.form.title = res.data.title;
                        that.form.sub_title = res.data.sub_title;
                        that.form.is_virtual = res.data.is_virtual ? true : false;
                        that.form.outer_id = res.data.outer_id;
                        that.form.barcode = res.data.barcode;
                        that.form.suppliers = res.data.supplier_id;
                        that.form.cycle = res.data.supply_day;
                        that.form.default_image = res.data.default_image;
                        that.unit = res.data.unit;
                        that.memo = res.data.memo;
                        var arr1 = [];
                        if (res.data.list_image) {
                            arr1 = res.data.list_image.split(",");
                            for (var i = 0; i < arr1.length - 1; i++) {
                                that.fileList.push({url:"",name:""});
                                that.fileList[i].url = arr1[i];
                                that.fileList[i].name = i;
                            }
                        }

                        // that.form.skus = res.data.skus;
                        let tabs = [];

                        for (let i in res.data.skus){
                            that.form.skux[i] = {skus: []}
                            tabs[i] = []
                            for (let j in res.data.skus[i].props_values){
                                tabs[i][j] = []
                                tabs[i][j].push(res.data.skus[i].props_values[j].prop_value)
                                that.form.skux[i].skus.push(res.data.skus[i].props_values[j].prop_value);
                            }
                        }
                        for (let i in res.data.skus) {
                            that.form.skux[i].sku_id = res.data.skus[i].sku_id;
                            that.form.skux[i].title = res.data.skus[i].title;
                            that.form.skux[i].sub_title = res.data.skus[i].sub_title;
                            that.form.skux[i].bn = res.data.skus[i].bn;
                            that.form.skux[i].barcode = res.data.skus[i].barcode;
                            that.form.skux[i].weight = res.data.skus[i].weight;
                            that.form.skux[i].default_image = res.data.skus[i].default_image;
                        }
                        // console.log(that.form.skux);
                        // that.createTabaleData();
                        getCategoriesDetail(res.data.cat_id)
                        .then(resp => {
                            let arr = [],
                            cat_path = resp.data.cat_path.split(',');
                            for(let i in cat_path) {
                                if (cat_path[i] !== '') {
                                    arr.push(parseInt(cat_path[i]))
                                }
                            }
                            arr.push(res.data.cat_id);
                            that.handleItemChange(arr, true);
                            that.form.cat_id = arr;
                            for(let i in res.data.skus[0].props_values){
                                that.form.skus[i] = {value: res.data.skus[0].props_values[i].prop_id}
                            }
                        })
                        .catch(e => {
                            console.log(e);
                        })
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });
            getSuppliersList().then(res => {
                this.suppliers = res.data.itemList
            })
        },
        computed: {
            getSkuName: function() {
                let skuName = [];
                for(let i in this.form.skus) {
                    for (let j in this.options5) {
                        if (this.form.skus[i].value === this.options5[j].prop_id) {
                            skuName.push(this.options5[j].prop_name)
                        }
                    }
                }
                return skuName
            }
        },
        methods: {
            handleRemove(file, fileList) {
                this.fileList = fileList;
            },
            success_list(res, file, fileList) {
                for (var i = 0; i < fileList.length; i++) {
                    if (fileList[i].name == res.data.image_name) {
                        fileList[i].url = res.data.url;
                    }
                }
                this.fileList = fileList;
            },
            retu(){
                this.$router.push({path: "/items/manager/list",query:{criteria: this.$route.query.criteria}})
            },
            getSkuNames: function() {
                let skuName = [];
                for(let i in this.form.skus) {
                    for (let j in this.options5) {
                        if (this.form.skus[i].value === this.options5[j].prop_id) {
                            skuName.push(this.options5[j].prop_name)
                        }
                    }
                }
                this.skuNameList = skuName;
            },
            // 上传图片
                handleAvatarScucess(res, file) {
                    this.form.default_image = res.data.url;
                },
                beforeAvatarUpload(file) {
                    const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/gif';
                    const isLt10M = file.size / 1024 / 1024 < 10;

                    if (!isJPG) {
                        this.$message.error('图片格式为 JPG、PNG、GIF !');
                    }
                    if (!isLt10M) {
                        this.$message.error('图片大小不能超过 10MB!');
                    }
                    return isJPG && isLt10M;
                },
                successII(res, file){
                    var arr = [];
                    for (var i = 0; i < this.form.skux.length; i++) {
                        arr.push(this.form.skux[i]);
                    }
                    arr[0].default_image = res.data.url;
                    this.form.skux = arr;
                },
                handleItemChange(val, edit) {
                    let params = {
                            cat_id: val[this.form.cat_id.length - 1]
                        },
                        that = this;
                    getPropsList(params)
                        .then(function(response) {
                            that.options5 = response.data;
                            if(edit){
                                that.getSkuNames();
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                },
                handlePictureCardPreview(file) {
                    this.dialogImageUrl = file.url;
                    this.dialogVisible = true;
                },

                handleClose(tag, index) {
                    this.form.skus[index].dynamicTags.splice(this.form.skus[index].dynamicTags.indexOf(tag), 1);
                    this.createTabaleData();
                },

                showInput(sku) {
                    sku.inputVisible = true;
                },
                addDomain() {
                    this.form.skus.push({
                        value: '',
                        inputValue: '',
                        inputVisible: false,
                        dynamicTags: []
                    });
                },
                removeDomain(item) {
                    var index = this.form.skus.indexOf(item)
                    if (index !== -1) {
                        this.form.skus.splice(index, 1)
                        this.createTabaleData();
                    }
                },
                handleInputConfirm(sku) {
                    let inputValue = sku.inputValue;
                    if (inputValue != '') {
                        sku.dynamicTags.push(inputValue);
                        this.createTabaleData();
                    }
                    sku.inputVisible = false;
                    sku.inputValue = '';
                },
                onEditorChange({
                    editor, html, text
                }) {
                    this.content = html
                },

                // 判断规格值是否相同
                disableOptions(option) {
                    let arr = this.form.skus
                    if (this.form.skus.length > 1 && option !== "") {
                        for (let i = 0; i < arr.length - 1; i++) {
                            if (arr[i].value == option) {
                                this.$message.error('规格名不能相同');
                                return;
                            }
                        }
                    }
                },

                // 生成sku(旧)
                createTabaleData() {
                    let skus = this.form.skus,
                        arrx = [],
                        arr = [],
                        that = this;
                    for (let i in skus) {
                        for (let j in skus[i].dynamicTags) {
                            arrx.push(skus[i].dynamicTags[j])
                        }
                        arr.push(arrx);
                        arrx = []
                    }
                    let list = this.descartes(arr);
                    this.form.skux = []
                    for (let i in list) {
                        // console.log(that.form.sub_title);
                        this.form.skux[i] = {
                            skus: list[i],
                            title: that.form.title,
                            sub_title: that.form.sub_title,
                            bn: '',
                            barcode: '',
                            // default_image: '',
                        }
                    }
                },

                // 生成sku
                descartes(list) {
                    //parent上一级索引;count指针计数
                    var point = {};
                    var result = [];
                    var pIndex = null;
                    var tempCount = 0;
                    var temp = [];
                    //根据参数列生成指针对象
                    for (var index in list) {
                        if (typeof list[index] == 'object') {
                            point[index] = {
                                'parent': pIndex,
                                'count': 0
                            }
                            pIndex = index;
                        }
                    }
                    //单维度数据结构直接返回
                    if (pIndex == null) {
                        return list;
                    }
                    //动态生成笛卡尔积
                    while (true) {
                        for (var index in list) {
                            tempCount = point[index]['count'];
                            temp.push(list[index][tempCount]);
                        }
                        //压入结果数组
                        result.push(temp);
                        temp = [];
                        //检查指针最大值问题
                        while (true) {
                            if (point[index]['count'] + 1 >= list[index].length) {
                                point[index]['count'] = 0;
                                pIndex = point[index]['parent'];
                                if (pIndex == null) {
                                    return result;
                                }
                                //赋值parent进行再次检查
                                index = pIndex;
                            } else {
                                point[index]['count']++;
                                break;
                            }
                        }
                    }
                },
                onSubmit(formName) {
                    if (!this.form.title.length) {
                        this.$message.error("请填写标题");
                        return;
                    }
                    let params = {
                            cat_id: this.form.cat_id[this.form.cat_id.length - 1],
                            title: this.form.title,
                            sub_title: this.form.sub_title,
                            is_virtual: this.form.is_virtual ? 1 : 0,
                            outer_id: this.form.outer_id,
                            barcode: this.form.barcode,
                            default_image: this.form.default_image,
                            skus: '',
                            list_image: "",
                            intro: this.content,
                            memo: this.memo,
                            unit: this.unit,
                            supplier_id: this.form.suppliers,
                            supply_day: this.form.cycle,
                        },
                        paramy = [],
                        that = this;
                        for (var i = 0; i < this.fileList.length; i++) {
                            params.list_image += this.fileList[i].url+',';
                        }
                    for (let i in this.form.skux) {
                        if (!this.form.skux[i].title) {
                            this.$message.error("请填写sku标题");
                            return;
                        }
                        let paramx = {
                            title: this.form.skux[i].title,
                            sub_title: this.form.skux[i].sub_title,
                            bn: this.form.skux[i].bn,
                            barcode: this.form.skux[i].barcode,
                            props_values: [],
                            default_image: this.form.skux[i].default_image,
                            weight: this.form.skux[i].weight,
                            sku_id: this.form.skux[i].sku_id
                        }
                        for (let j in this.form.skux[i].skus) {
                            for (let k = this.form.skus.length - 1; k >= 0; k--) {
                                paramx.props_values[j] = {
                                    prop_id: this.form.skus[j].value,
                                    prop_value: this.form.skux[i].skus[j]
                                }
                            }
                        }
                        paramy[i] = JSON.stringify(paramx)
                    }
                    params.skus = JSON.stringify(paramy)

                    editItem(this.$route.query.item_id, params)
                        .then(function(res) {
                            console.log(res);
                            if (res.error_code) {
                                that.$message.error(res.message);
                            } else {
                                that.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                that.$router.push({path:"/items/manager/list",query:{item_page: that.$route.query.item_page}})
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                }
        }
}

</script>
