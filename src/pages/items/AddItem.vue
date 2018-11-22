<style media="screen">

    .add-items {
        padding: 15px;
    }

    .add-items .el-row {
        display: flex;
        align-items: stretch;
        margin-bottom: 20px;

    &
    :last-child {
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

    .add-items .el-form-item .el-input {
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

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 146px;
        height: 146px;
        line-height: 146px;
        text-align: center;
        background: #fbfdff;
    }

    .avatar {
        display: block;
    }

    .active1 {
        width: 96px !important;
        height: 96px !important;
        line-height: 100px !important;
    }

    .info {
        line-height: 40px;
        text-indent: 10px;
        background: #FFF;
    }

    .add-items {
        background: #f6f6f6;

    }

    .shadow {
        box-shadow: -1px 0px 10px #ccc;
        margin-bottom: 50px;
    }
</style>

<template>
    <div class="add-items">
        <el-form :model="form" :inline="true" ref="form" label-width="120px">
            <div class="shadow">
                <h3 class="info"><span class="el-icon-edit"></span>&#8195;基本信息</h3>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-light">
                            <el-form-item label="物料分类">
                                <el-cascader placeholder="试试搜索：干红" @change="handleItemChange" v-model="form.cat_id"
                                             :props="defaultProps" :options="options" filterable>
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
                            <el-form-item label="物料编号">
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
                            <el-form-item label="默认图片">
                                <el-upload
                                        name="image"
                                        class="avatar-uploader"
                                        :action="action"
                                        :show-file-list="false"
                                        :on-success="successI"
                                        :before-upload="beforeAvatarUpload">
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar"
                                         style="width:146px;height:146px">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
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
                                >
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
                    <el-col :spam="24">
                        <div class="grid-content bg-purple-light">
                            <el-form-item v-for="(sku, index) in form.skus" label="商品规格" :key="sku.key"
                                          style="display: block!important;">
                                <el-col :span="24">
                                    <el-select v-model="sku.value" @change="disableOptions" filterable
                                               placeholder="请选择规格项目">
                                        <el-option v-for="(item, index) in options5" :label="item.prop_name"
                                                   :key="index" :value="item.prop_id" :disabled="item.disabled">
                                        </el-option>
                                    </el-select>
                                    <el-button @click.prevent="removeDomain(sku)">删除</el-button>
                                </el-col>
                                <el-col>
                                    <el-form-item label="">
                                        <el-tag v-for="(tag, inDy) in sku.dynamicTags" :key="inDy" :closable="true"
                                                :close-transition="false" @close="handleClose(tag, index, inDy)">
                                            {{tag}}

                                        </el-tag>
                                        <el-input class="input-new-tag" v-if="sku.inputVisible" v-model="sku.inputValue"
                                                  ref="saveTagInput" size="samll"
                                                  @keyup.enter.native="handleInputConfirm(sku)"
                                                  @blur="handleInputConfirm(sku)" style="width: 80px">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <br>
                            </el-form-item>
                            <br>
                            <el-form-item label="商品规格" v-if="form.skus.length < 3">
                                <el-button @click="addDomain">添加规格项目</el-button>
                            </el-form-item>
                            <br>
                            <el-form-item label="表格" v-if="form.skux.length > 0">
                                <table class="el-table el-table--border sku-table" cellspacing="0" cellpadding="0"
                                       border="0" style="width: 90%;" v-if="form.skux.length > 0">
                                    <tr v-if="getResult">
                                        <template v-for="(th, index) in getSkuName">
                                            <th style="width:100px">{{ th }}</th>
                                        </template>
                                        <th>商品标题</th>
                                        <th>副标题</th>
                                        <th>货号</th>
                                        <th>条码</th>
                                        <th style="width:120px">重量(kg)</th>
                                        <th style="width:100px">sku图片</th>
                                    </tr>
                                    <tr v-for="(td,index) in form.skux" v-if="getResult">
                                        <template v-for="(th, index) in getSkuName">
                                            <td v-if="th">{{ td.skus[index] }}</td>
                                        </template>
                                        <td>
                                            <input v-model="td.title" class="el-input__inner">
                                        </td>
                                        <td>
                                            <input v-model="td.sub_title" class="el-input__inner">
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
                                                <img v-if="td.default_image" :src="td.default_image"
                                                     class="avatar active1">
                                                <i v-else class="active1 el-icon-plus avatar-uploader-icon"
                                                   @click='save(index)'></i>
                                            </el-upload>
                                        </td>
                                    </tr>
                                </table>
                            </el-form-item>
                        </div>
                    </el-col>
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
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    import {getPredefined, getCategoriesList, addItem, getPropsList, imgUploadUrl, getSuppliersList} from '../../api/api';
    export default {
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
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
                    weight: '',
                    list_image: "",
                    cycle: "",
                    suppliers: ""
                },
                action: ``,
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
                imageUrl: '',
                fileList: [],
                opSelect: [],
                index_td: null,
                saveSkuxImg: [],
                unit: "",
                result: false,
                memo: ""
            }
        },
        created() {
            if (window.location.host == "testfonterp.kmjiu.com") {
                this.action = `https://testerp.kmjiu.com/api/v1/images?access_token=${sessionStorage.getItem('access_token')}`;
            } else {
                this.action = `https://duperp.kmjiu.com/api/v1/images?access_token=${sessionStorage.getItem('access_token')}`;
            }
            var parm = {
                module: "items"
            }
            getPredefined(parm).then((res) => {
                this.form.outer_id = res.data.bn
            })
            let that = this;
            getCategoriesList()
                .then(function (response) {
                    that.options = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
            getSuppliersList().then(res => {
                this.suppliers = res.data.itemList
            })
        },
        computed: {
            getResult: function () {
                if (this.form.skus[0].dynamicTags.length > 0 && this.getSkuName[0]) {
                    return true;
                } else {
                    return false;
                }
            },
            getSkuName: function () {
                let skuName = [];
                for (let i in this.form.skus) {
                    for (let j in this.options5) {
                        if (this.form.skus[i].value === this.options5[j].prop_id) {
                            skuName.push(this.options5[j].prop_name)
                        }
                    }
                }
                return skuName;
            }
        },
        methods: {
            // 上传图片
            handleRemove(file, fileList) {
                this.fileList = fileList;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            successI(res, file){
                this.imageUrl = res.data.url;
                this.form.default_image = res.data.url;
            },
            success_list(res, file, fileList) {
                for (var i = 0; i < fileList.length; i++) {
                    if (fileList[i].name == res.data.image_name) {
                        fileList[i].url = res.data.url;
                    }
                }
                this.fileList = fileList;
            },
            successII(res, file){
                this.saveSkuxImg = [];
                var arr = [];
                for (var i = 0; i < this.form.skux.length; i++) {
                    arr.push(this.form.skux[i]);
                }
                arr[this.index_td].default_image = res.data.url;
                this.form.skux = arr;
                for (var i = 0; i < this.form.skux.length; i++) {
                    this.saveSkuxImg.push(this.form.skux[i].default_image);
                }
            },
            save(index){
                this.index_td = index;
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
            handleItemChange(val) {
                let params = {
                        cat_id: val[this.form.cat_id.length - 1]
                    },
                    that = this;
                getPropsList(params)
                    .then(function (response) {
                        that.options5 = response.data;
                        for (let i in that.options5) {
                            that.options5[i].disabled = false;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleClose(tag, index, v) {
                this.form.skus[index].dynamicTags.splice(this.form.skus[index].dynamicTags.indexOf(tag), 1);
                this.saveSkuxImg.splice(v, 1);
                this.createTabaleData();
            },
            showInput(sku) {
                sku.inputVisible = true;
            },
            addDomain() {
                this.form.skus.push({
                    value: '',
                    inputValue: '',
                    inputVisible: true,
                    dynamicTags: []
                });
            },
            removeDomain(item) {
                var index = this.form.skus.indexOf(item);
                if (index !== -1) {
                    this.form.skus.splice(index, 1);
                }
                this.createTabaleData();
                this.disableOptions();
            },
            handleInputConfirm(sku) {
                let inputValue = sku.inputValue;
                if (inputValue != '') {
                    sku.dynamicTags.push(inputValue);
                    this.createTabaleData();
                }
                sku.inputVisible = true;
                sku.inputValue = '';
            },
            onEditorChange({editor, html, text}) {
                this.content = html
            },
            // 判断规格值是否相同
            disableOptions(option) {
                let arr = this.form.skus;
                let op = [];
                this.opSelect = [];
                let bool = false;
                for (let i in this.options5) {
                    op.push(this.options5[i]);
                }
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0; j < op.length; j++) {
                        if (arr[i].value == op[j].prop_id) {
                            this.opSelect.push(j);
                            bool = true;
                        }
                    }
                }
                for (let i = 0; i < op.length; i++) {
                    op[i].disabled = false;
                }
                if (bool) {
                    for (let i = 0; i < this.opSelect.length; i++) {
                        op[this.opSelect[i]].disabled = true;
                    }
                }
                this.options5 = op;
            },
            // 生成sku(旧)
            createTabaleData() {
                let skus = this.form.skus,
                    skux = this.form.skux,
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
                this.form.skux = [];
                for (let i in list) {
                    this.form.skux[i] = {
                        skus: list[i],
                        title: that.form.title,
                        sub_title: that.form.sub_title,
                        bn: '',
                        barcode: '',
                        default_image: that.saveSkuxImg[i]
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
                let params = {
                        cat_id: this.form.cat_id[this.form.cat_id.length - 1],
                        title: this.form.title,
                        sub_title: this.form.sub_title,
                        is_virtual: this.form.is_virtual ? 1 : 0,
                        outer_id: this.form.outer_id,
                        barcode: this.form.barcode,
                        default_image: this.form.default_image,
                        list_image: "",
                        skus: '',
                        intro: this.content,
                        memo: this.memo,
                        unit: this.unit,
                        supplier_id: this.form.suppliers,
                        supply_day: this.form.cycle,
                    },
                    paramy = [],
                    that = this;
                if (!this.form.cat_id[this.form.cat_id.length - 1]) {
                    this.$message.error("请添加分类");
                    return;
                }
                if (!this.form.title) {
                    this.$message.error("请添加物料标题");
                    return;
                }
                if (!this.form.skux.length) {
                    this.$message.error("请添加规格项目");
                    return;
                }
                for (var i = 0; i < this.fileList.length; i++) {
                    params.list_image += this.fileList[i].url + ',';
                }
                for (let i in this.form.skux) {
                    if (isNaN(parseInt(this.form.skux[i].weight))) {
                        if (this.form.skux[i].weight) {
                            this.$message.error("重量必须为数字");
                            return
                        }
                    }
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
                        weight: this.form.skux[i].weight,
                        default_image: this.form.skux[i].default_image
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
                addItem(params).then(function (res) {
                    if (res.error_code) {
                        that.$message.error(res.message);
                    } else {
                        that.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        that.$router.replace({
                            path: '/items/manager/list'
                        })
                    }
                }).catch(function (error) {
                    console.log(error);
                });

            }
        }
    }

</script>
