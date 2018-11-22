<style scoped>

    .demo-table-expand {
        font-size: 12px;
    }

    .demo-table-expand label {
        width: 140px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

</style>

<template>
    <section>
        <!--工具条-->
        <div class='pt'>
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="21">
                    <el-form :model="filters" label-width="130px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="供应商名称：">
                                    <el-input v-model="filters.name" placeholder="供应商" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="供应商公司名称：">
                                    <el-input v-model="filters.company" placeholder="供应商公司名称" class="col"
                                              :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所在地区：">
                                    <el-cascader placeholder="试试搜索：太原" @change="handleChange" clearable class="col"
                                                 :size="size" v-model="area" :props="defaultProps" :options="options"
                                                 filterable>
                                    </el-cascader>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" v-on:click="getSuppliers" class='btnw' :size="size">查询
                                </el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                        <el-form-item>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" class='btnw' @click='$router.replace("/purchase/suppliers/manager/add")'
                               :size="size">新增供应商
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <template>
            <el-table :data="suppliers" highlight-current-row border v-loading="loading" style="width: 100%;"
                      class="geFontSize_list">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="供应商名称">
                                <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="供应商公司名称">
                                <span>{{ props.row.company }}</span>
                            </el-form-item>
                            <el-form-item label="供应商ID">
                                <span>{{ props.row.supplier_id }}</span>
                            </el-form-item>
                            <el-form-item label="供应商自定义编号">
                                <span>{{ props.row.bn }}</span>
                            </el-form-item>
                            <el-form-item label="供应商所在区域">
                                <span>{{ props.row.area | area }}</span>
                            </el-form-item>
                            <el-form-item label="供应商详细地址">
                                <span>{{ props.row.address }}</span>
                            </el-form-item>
                            <el-form-item label="供应商所在地邮编">
                                <span>{{ props.row.zip }}</span>
                            </el-form-item>
                            <el-form-item label="供应商联系电话">
                                <span>{{ props.row.telephone }}</span>
                            </el-form-item>
                            <el-form-item label="供应商传真号码">
                                <span>{{ props.row.fax }}</span>
                            </el-form-item>
                            <el-form-item label="供应商联系人">
                                <span>{{ props.row.contacter }}</span>
                            </el-form-item>
                            <el-form-item label="供应商银行账户">
                                <span>{{ props.row.bank_account }}</span>
                            </el-form-item>
                            <el-form-item label="供应商开户行">
                                <span>{{ props.row.bank }}</span>
                            </el-form-item>
                            <el-form-item label="采购联系人">
                                <span>{{ props.row.operator }}</span>
                            </el-form-item>
                            <el-form-item label="备注">
                                <span>{{ props.row.memo }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="55">
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="120">
                    <span>
                        <el-button :size="sizeButton" @click="handleEdit(row)">编辑</el-button>
                        <el-button type="danger" :size="sizeButton" @click="handleDel(row)">删除</el-button>
                    </span>
                </el-table-column>
                <el-table-column prop="name" label="供应商名称" min-width="120">
                </el-table-column>
                <el-table-column prop="company" label="供应商公司名称" min-width="125">
                </el-table-column>
                <el-table-column prop="telephone" label="联系电话" min-width="95">
                </el-table-column>
                <el-table-column prop="area" label="所在地区" :formatter="formatArea" min-width="95">
                </el-table-column>
                <el-table-column prop="address" label="详细地址" min-width="95">
                </el-table-column>
            </el-table>
        </template>
        <!--分页-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="per_page"
                           layout="total, sizes, prev, pager, next, jumper" :total="total" class="paging">
            </el-pagination>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" top="5%">
            <el-form :model="form" label-width="120px" ref="form">
                <el-form-item label="供应商名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="供应商公司名称">
                    <el-input v-model="form.company"></el-input>
                </el-form-item>
                <el-form-item label="编号">
                    <el-input v-model="form.bn"></el-input>
                </el-form-item>
                <el-form-item label="所在地区">
                    <el-cascader placeholder="试试搜索：太原" @change="handleChangeI" v-model="areas" :props="defaultProps"
                                 :options="options" filterable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"
                              v-model="form.address">
                    </el-input>
                </el-form-item>
                <el-form-item label="邮编">
                    <el-input v-model="form.zip"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="form.telephone"></el-input>
                </el-form-item>
                <el-form-item label="传真号码">
                    <el-input v-model="form.fax"></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="form.contacter"></el-input>
                </el-form-item>
                <el-form-item label="银行账号">
                    <el-input v-model="form.bank_account"></el-input>
                </el-form-item>
                <el-form-item label="开户行">
                    <el-input v-model="form.bank"></el-input>
                </el-form-item>
                <el-form-item label="采购员">
                    <el-input v-model="form.operator"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.memo"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保 存</el-button>
                <el-button @click.native="editFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>

    import {getAreaData, getSuppliersList, removeSupplier, editSupplier}from '../../api/api';
    import {checkLogin}from '../../api/checkLogin';
    import NProgress from 'nprogress'
    export default {
        data() {
            return {
                filters: {
                    name: '',
                    company: ""
                },
                form: {
                    supplier_id: '',
                    name: '',
                    company: '',
                    bn: '',
                    areas: "",
                    area: [],
                    address: '',
                    zip: '',
                    telephone: '',
                    fax: '',
                    contacter: '',
                    bank_account: '',
                    bank: '',
                    operator: '',
                    memo: '',
                },
                defaultProps: {
                    value: 'id',
                    label: 'values'
                },
                total: 0,
                page: 1,
                per_page: 10,
                currentPage: 1,
                area: [],
                areas: [],
                options: [],
                loading: false,
                suppliers: [],
                editFormVisible: false, //编辑界面显是否显示
                editFormTtile: '', //编辑界面标题
                editLoading: false,
                size: "",
                sizeButton: ""
            }
        },
        created() {
            this.size = this.$store.state.size;
            this.sizeButton = this.$store.state.sizeButton;
            this.getSuppliers();
            getAreaData().then(res => {
                this.options = res;
            }).catch(err => {
                console.log(err);
            })
        },
        filters: {
            area: function (value) {
                if (value) {
                    var newstr = value.split(":");
                    return newstr[0].replace(/\//g, "");
                }
            }
        },
        methods: {
            reLoad(){
                this.filters.name = "";
                this.filters.company = "";
                this.form.area = [];
                this.area = [];
            },
            formatArea: function (row, column) {
                if (row.area) {
                    var newstr = row.area.split(":");
                    return newstr[0].replace(/\//g, "");
                }
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getSuppliers();
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.getSuppliers();
            },
            getSuppliers: function () {
                let params = {
                    name: this.filters.name,
                    company: this.filters.company,
                    per_page: this.per_page,
                    page: this.page,
                    area: this.form.area
                };
                this.loading = true;
                NProgress.start();
                getSuppliersList(params).then((res) => {
                    this.suppliers = res.data.itemList;
                    this.total = res.data.totalCount;
                    this.loading = false;
                    NProgress.done();
                });
            },
            handleDel: function (row) {
                var that = this;
                this.$confirm('确定要删除此供应商么，请谨慎操作?', '提示', {
                    type: 'warning'
                }).then(() => {
                    that.listLoading = true;
                    NProgress.start();
                    removeSupplier(row.supplier_id).then((res) => {
                        checkLogin(res, this)
                        that.listLoading = false;
                        NProgress.done();
                        if (res.error_code) {
                            that.$message.error(res.message);
                        } else {
                            that.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }
                        that.getSuppliers();
                    });
                }).catch(() => {

                });
            },
            handleEdit: function (row) {
                let arr = [];
                if (row.area) {
                    let newstr = row.area.split(":"),
                        newArr = newstr[1].split("/");
                    for (let i in newArr) {
                        arr.push(newArr[i])
                    }
                }
                console.log(row.area)
                this.editFormVisible = true;
                this.form.supplier_id = row.supplier_id;
                this.areas = arr;
                this.form.areas = row.area;
                this.form.address = row.address;
                this.form.name = row.name
                this.form.company = row.company
                this.form.bn = row.bn
                this.form.zip = row.zip
                this.form.telephone = row.telephone
                this.form.fax = row.fax
                this.form.contacter = row.contacter
                this.form.bank_account = row.bank_account
                this.form.bank = row.bank
                this.form.operator = row.operator
                this.form.memo = row.memo
            },
            editSubmit() {
                let params = {
                        name: this.form.name,
                        company: this.form.company,
                        bn: this.form.bn,
                        area: this.form.areas,
                        address: this.form.address,
                        zip: this.form.zip,
                        telephone: this.form.telephone,
                        fax: this.form.fax,
                        contacter: this.form.contacter,
                        bank_account: this.form.bank_account,
                        bank: this.form.bank,
                        operator: this.form.operator,
                        memo: this.form.memo
                    },
                    that = this;
                editSupplier(this.form.supplier_id, params)
                    .then(res => {
                        if (res.error_code) {
                            that.$message.error(res.message);
                        } else {
                            that.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            that.editFormVisible = false;
                            that.getSuppliers();
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },
            handleChange(value) {
                let a = '',
                    b = '',
                    c = '',
                    areaData = this.options;
                for (let i in areaData) {
                    if (areaData[i].id == value[0]) {
                        a = areaData[i].values;
                        for (let j in areaData[i].children) {
                            if (areaData[i].children[j].id == value[1]) {
                                b = areaData[i].children[j].values;
                                if (value.length === 3) {
                                    for (let k in areaData[i].children[j].children) {
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
            },
            handleChangeI(value) {
                let a = '',
                    b = '',
                    c = '',
                    areaData = this.options;
                for (let i in areaData) {
                    if (areaData[i].id == value[0]) {
                        a = areaData[i].values;
                        for (let j in areaData[i].children) {
                            if (areaData[i].children[j].id == value[1]) {
                                b = areaData[i].children[j].values;
                                if (value.length === 3) {
                                    for (let k in areaData[i].children[j].children) {
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
                    this.form.areas = `${a}/${b}/${c}:${value[0]}/${value[1]}/${value[2]}`;
                } else {
                    this.form.areas = `${a}/${b}:${value[0]}/${value[1]}`;
                }
            }
        }
    };

</script>
