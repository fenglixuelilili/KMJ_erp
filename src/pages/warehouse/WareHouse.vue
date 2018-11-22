<template>
    <section>
        <HS></HS>
        <!--工具条-->
        <div class="pt">
            <el-row>
                <el-col :span="2" class='ptc'><span style='margin-left: 30px'>筛选条件</span></el-col>
                <el-col :span="21" class="toolbar">
                    <el-form label-width="120px" :model="filters">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="仓库名称" class="hspace">
                                    <el-input v-model="filters.warehouse_name" placeholder="仓库名称"
                                              class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="仓库负责人" class="hspace">
                                    <el-input v-model="filters.warehouse_head" placeholder="仓库负责人"
                                              class="col" :size="size"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所在地区" class="hspace">
                                    <el-cascader placeholder="试试搜索：太原" @change="handleChange" class="col"
                                                 v-model="filters.warehouse_area" :props="defaultProps"
                                                 :options="options" filterable :size="size">
                                    </el-cascader>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="$store.state.isPackUp">
                            <el-col :span="8">
                                <el-form-item label="仓库类型">
                                    <el-select v-model="filters.warehouse_type" clearable placeholder="请选择" class="col"
                                               :size="size">
                                        <el-option
                                                v-for="item in optionsTs"
                                                :label="item.key"
                                                :value="item.value"
                                                :key="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class='cb'>
                                <el-button type="primary" v-on:click="getWareHouses" class='btnw' :size="size">查询
                                </el-button>
                                <el-button type="primary" class='btnw' @click='reLoad' :size="size">重置</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style='margin-bottom: 20px;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;padding: 10px 0px 10px 10px'>
                    <el-button type="primary" @click="educe" class="btnw" :size="size">导出</el-button>
                    <el-button type="primary" class='btnw' :size="size"
                               @click='$router.replace("/warehouses/manager/add")'>新增仓库

                    </el-button>
                </el-col>
            </el-row>
        </div>
        <template>
            <el-table :data="warehouses" highlight-current-row border v-loading="loading" style="width: 100%;"
                      class="geFontSize_list">
                <el-table-column type="index" width="55">
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="125">
					<span>
						<el-button :size="sizeButton" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" :size="sizeButton" @click="handleDel(row)">删除</el-button>
					</span>
                </el-table-column>
                <el-table-column prop="warehouse_name" label="仓库名称" min-width="95">
                </el-table-column>
                <el-table-column prop="warehouse_type" :formatter="warehouse_typeC" label="仓库类型" min-width="85">
                </el-table-column>
                <el-table-column prop="warehouse_number" label="仓库编号" min-width="95">
                </el-table-column>
                <el-table-column prop="manager" label="仓库负责人" min-width="100">
                </el-table-column>
                <el-table-column prop="area" label="所在地区" :formatter="formatLevel" min-width="95">
                </el-table-column>
                <el-table-column prop="address" label="详细地址" min-width="170">
                    <template slot-scope="props">
                        <elliptical :message="props.row.address"></elliptical>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="per_page"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="paging">
        </el-pagination>
        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="form" label-width="120px" ref="form">
                <el-form-item label="仓库名称">
                    <el-input v-model="form.warehouse_name"></el-input>
                </el-form-item>
                <el-form-item label="仓库编号">
                    <el-input v-model="form.warehouse_number"></el-input>
                </el-form-item>
                <el-form-item label="所在地区">
                    <el-cascader placeholder="试试搜索：太原" @change="handleChangeI" v-model="areas" :props="defaultProps"
                                 :options="options" filterable style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="仓库类型">
                    <el-select v-model="warehouse_types" clearable placeholder="请选择" style="width: 100%;">
                        <el-option
                                v-for="item in optionsT"
                                :label="item.key"
                                :value="item.value"
                                :key="item.value">
                        </el-option>
                    </el-select>
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
            </el-form>
            <el-row>
                <el-col :span="24" class='cb'>
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading" class='btnw'>保存

                    </el-button>
                    <el-button @click.native="editFormVisible = false" class='btnw'>取 消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </section>
</template>
<script>
    import {getAreaData, getWareHousesList, removeWarehouse, editWarehouse} from '../../api/api';
    import {checkLogin} from '../../api/checkLogin';
    import NProgress from 'nprogress'
    export default {
        data() {
            return {
                filters: {
                    warehouse_name: '',
                    warehouse_head: "",
                    warehouse_area: [],
                    warehouse_type: "",
                },
                warehouse_types: null,
                form: {
                    warehouse_name: '',
                    warehouse_number: '',
                    area: '',
                    areas: '',
                    address: '',
                    manager: ''
                },
                optionsT: [{key: "自建仓库", value: 1}, {key: "第三方仓库", value: 2}],
                optionsTs: [{key: "全部", value: ""}, {key: "自建仓库", value: 1}, {key: "第三方仓库", value: 2}],
                total: 0,
                page: 1,
                per_page: 10,
                currentPage: 1,
                area: [],
                areas: [],
                options: [],
                defaultProps: {
                    value: 'id',
                    label: 'values'
                },
                loading: false,
                warehouses: [],
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '编辑',//编辑界面标题
                editLoading: false,
                btnEditText: '提交',
                size: "",
                sizeButton: ""
            }
        },
        created() {
            this.size = this.$store.state.size;
            this.sizeButton = this.$store.state.sizeButton;
            this.getWareHouses();
            getAreaData().then(res => {
                this.options = res;
            }).catch(err => {
                console.log(err);
            })
        },
        methods: {
            educe(){
                window.open(`${this.$store.state.urlBackstageApi}/warehouses/exportLists?access_token=${sessionStorage.getItem('access_token')}&warehouse_name=${this.filters.warehouse_name}&warehouse_type=${this.filters.warehouse_type}&area=${this.form.area}&manager=${this.filters.warehouse_head}`)
            },
            warehouse_typeC(row){
                switch (row.warehouse_type) {
                    case 1:
                        return "自建仓库";
                        break;
                    case 2:
                        return "第三方仓库";
                        break;
                }
            },
            reLoad(){
                this.filters.warehouse_name = "";
                this.filters.warehouse_head = "";
                this.filters.warehouse_area = [];
                this.filters.warehouse_type = "";
                this.filters.cat_id = "";
                this.form.area = ""
            },
            formatLevel: function (row, column) {
                var newstr = row.area.split(":");
                return newstr[0].replace(/\//g, "");
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getWareHouses();
            },
            handleSizeChange(val) {
                this.per_page = val;
                this.getWareHouses();
            },
            //获取仓库列表
            getWareHouses: function () {
                let params = {
                    per_page: this.per_page,
                    page: this.page,
                    warehouse_name: this.filters.warehouse_name,
                    warehouse_type: this.filters.warehouse_type,
                    area: this.form.area,
                    manager: this.filters.warehouse_head
                };
                this.loading = true;
                NProgress.start();
                getWareHousesList(params).then((res) => {
                    this.warehouses = res.data.itemList;
                    this.total = res.data.totalCount;
                    this.loading = false;
                    NProgress.done();
                });
            },
            handleEdit: function (row) {
                let newstr = row.area.split(":"),
                    newArr = newstr[1].split("/"),
                    arr = [];
                for (let i in newArr) {
                    arr.push(newArr[i])
                }
                this.editFormVisible = true;
                this.editFormTtile = '编辑';
                this.form.warehouse_id = row.warehouse_id;
                this.warehouse_types = parseInt(row.warehouse_type);
                this.form.warehouse_name = row.warehouse_name;
                this.form.warehouse_number = row.warehouse_number;
                this.areas = arr;
                this.form.areas = row.area;
                this.form.address = row.address;
                this.form.manager = row.manager;
            },
            handleDel: function (row) {
                var that = this;
                this.$confirm('确定要删除此仓库么，请谨慎操作?', '提示', {
                    type: 'warning'
                }).then(() => {
                    that.listLoading = true;
                    NProgress.start();
                    removeWarehouse(row.warehouse_id).then((res) => {
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
                        that.getWareHouses();
                    });
                }).catch(() => {

                });
            },
            editSubmit(){
                let params = {
                        warehouse_name: this.form.warehouse_name,
                        warehouse_number: this.form.warehouse_number,
                        warehouse_type: this.warehouse_types,
                        area: this.form.areas,
                        address: this.form.address,
                        manager: this.form.manager
                    },
                    that = this;
                editWarehouse(this.form.warehouse_id, params)
                    .then(res => {
                        if (res.error_code) {
                            that.$message.error(res.message);
                        }
                        else {
                            that.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            that.editFormVisible = false;
                            that.getWareHouses();
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },
            handleChange(value) {
                let a = '', b = '', c = '', areaData = this.options;
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
                let a = '', b = '', c = '', areaData = this.options;
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
            },
        }
    }
</script>