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
        <el-row :gutter="2">
            <div class="shadow" style="width: 100%;">
                <h3 class="info"><span class="el-icon-edit"></span>&#8195;仓库信息</h3>
                <el-col :span="24">
                    <div class="grid-content bg-purple-light" style="width: 600px;margin: 0 auto">
                        <el-form-item label="仓库名称">
                            <el-input v-model="form.warehouse_name"></el-input>
                        </el-form-item>
                        <el-form-item label="仓库编号">
                            <el-input v-model="form.warehouse_number"></el-input>
                        </el-form-item>
                        <el-form-item label="仓库类型">
                            <el-select v-model="form.warehouse_type" clearable placeholder="请选择">
                                <el-option
                                        v-for="item in optionsT"
                                        :label="item.key"
                                        :value="item.value"
                                        :key="item.value">
                                </el-option>
                            </el-select>
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
                        <el-form-item label="仓库负责人姓名">
                            <el-input v-model="form.manager"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </div>
        </el-row>
        <el-row :gutter="2">
            <el-col :span="24">
                <div class="grid-content bg-purple-light text-center">
                    <el-button type="primary" @click="onSubmit" class="btnw">保存</el-button>
                    <el-button @click="$router.replace('/warehouses/manager/list')" class="btnw">取消</el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>



</div>

</template>

<script>
import { getAreaData, addWarehouse } from '../../api/api'

export default {
    data() {
        return {
            form: {
                warehouse_name: '',
                warehouse_number: '',
                area: '',
                address: '',
                manager: '',
                warehouse_type: ""
            },
            optionsT:[{key:"自建仓库",value:"1"},{key:"第三方仓库",value:"2"}],
            area: [],
            options: [],
            defaultProps: {
                value: 'id',
                label: 'values'
            }
        }
    },
    created() {
        let that = this
        getAreaData().then(res => {
            that.options = res;
        }).catch(err => {
            console.log(err);
        })
    },
    methods: {
        onSubmit() {
            let params = {
                warehouse_name: this.form.warehouse_name,
                warehouse_number: this.form.warehouse_number,
                warehouse_type: this.form.warehouse_type,
                area: this.form.area,
                address: this.form.address,
                manager: this.form.manager
            },
            that = this;

            addWarehouse(params)
            .then(res => {
                if (res.error_code) {
                    that.$message.error(res.message)
                } else {
                    that.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    that.$router.replace('/warehouses/manager/list')
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
