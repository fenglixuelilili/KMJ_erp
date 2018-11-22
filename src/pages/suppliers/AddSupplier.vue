<style media="screen">

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

.add-items .el-input,
.add-items .el-textarea{
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

</style>

<template>

<div class="add-items" style="padding: 15px;">
    <el-form ref="form" :model="form" label-width="120px">
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;供应商信息</h3>
            <el-row :gutter="3">
                <el-col :span="20" :offset="4">
                    <div class="grid-content bg-purple-light">
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
                            <el-cascader placeholder="试试搜索：太原" @change="handleChange" v-model="area" :props="defaultProps" :options="options" filterable>
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="详细地址">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入内容"
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
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="2">
            <el-col :span="24">
                <div class="grid-content bg-purple-light text-center">
                    <el-button type="primary" @click="onSubmit" class='btnw'>保存</el-button>
                    <el-button type="primary" @click="$router.replace('/purchase/suppliers/manager/list')" class='btnw'>取消</el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>
</div>

</template>

<script>
import { getPredefined, getAreaData, addSupplier } from '../../api/api'

export default {
    data() {
        return {
            form: {
                name: '',
                company: '',
                bn: '',
                area: '',
                address: '',
                zip: '',
                telephone: '',
                fax: '',
                contacter: '',
                bank_account: '',
                bank: '',
                operator: '',
                memo: ''
            },
            area: [],
            options: [],
            defaultProps: {
                value: 'id',
                label: 'values'
            }
        }
    },
    created() {
        var parm = {
            module: "suppliers"
        }
        getPredefined(parm).then((res)=>{
            this.form.bn = res.data.bn
        })
        let that = this
        getAreaData()
        .then(res => {
            that.options = res;
        })
        .catch(err => {
            console.log(err);
        })
    },
    methods: {
        onSubmit() {
            let params = {
                name: this.form.name,
                company: this.form.company,
                bn: this.form.bn,
                area: this.form.area,
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

            addSupplier(params)
            .then(res => {
                if (res.error_code) {
                    that.$message.error(res.message)
                } else {
                    that.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    that.$router.replace('/purchase/suppliers/manager/list')
                }
            })
            .catch(err => {
                console.log(err);
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
