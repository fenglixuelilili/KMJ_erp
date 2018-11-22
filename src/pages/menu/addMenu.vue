<template>
    <section style="background:#eef1f6;height: 100%;">
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;新建菜单（直接建立三级菜单 / 建立一级菜单）</h3>
            <el-row  class='bg' style="margin-top: 10px;">
                <el-col :span='21'>
                    <el-form label-width="120px" style="width: 100%;">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="中文标记：" required>
                                    <el-input v-model="label" placeholder="请逐层输入名称以 / 分割"></el-input>
                                </el-form-item>
                                <el-form-item label="英文标记：" required>
                                    <el-input v-model="names" placeholder="请输入完整路径例：xxx/xxx/xxx"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class="bg" style='text-align: center;margin: 0;padding-bottom: 10px;'>
                <el-button type="primary" class="btnw" @click="subMit">保存</el-button>
            </el-row>
        </div>
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;已有菜单（新增二 / 三级菜单）</h3>
            <el-row  class='bg' style="margin-top: 10px;">
                <el-col :span='21'>
                    <el-form label-width="120px" style="width: 100%;">
                        <el-row>
                            <el-form-item label="提示：">
                                <p style="color: #48576a">请选择需要添加菜单的列表项，选择完成后添加二 / 三级菜单标识</p>
                            </el-form-item>
                            <el-col :span="10">
                                <el-form-item label="一级菜单：" required>
                                    <el-select v-model="parent_I" clearable placeholder="请选择">
                                        <el-option
                                                v-for="item in menu"
                                                :label="item.label"
                                                :value="item.id"
                                                :key="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="二级菜单：">
                                    <el-select v-model="parent_II" clearable placeholder="请选择">
                                        <el-option
                                                v-for="item in menu_second"
                                                :label="item.label"
                                                :value="item.id"
                                                :key="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="中文标记：" required>
                                    <el-input v-model="label_second" placeholder="请输入名称"></el-input>
                                </el-form-item>
                                <el-form-item label="英文标记：" required>
                                    <el-input v-model="name_second" placeholder="请输入单级路径"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class="bg" style='text-align: center;margin: 0;padding-bottom: 10px;'>
                <el-button type="primary" class="btnw" @click="addMenus">保存</el-button>
            </el-row>
        </div>
    </section>
</template>
<script>
    import { addMenu, allMenu } from "../../api/api"
    export default{
        data () {
            return {
                i: 0,
                label: "",
                names: "",
                parent_id: "",
                menu: [],
                menu_second: [],
                parentId: "",
                label_second: "",
                name_second: "",
                parent_I: "",
                parent_II: "",
            }
        },
        created(){
            allMenu().then(res => {
                this.menu = res.data;
            })
        },
        watch: {
            parent_I: function () {
                if (this.parent_I != ""){
                    for (let i in this.menu){
                        if (this.parent_I == this.menu[i].id){
                            this.menu_second = this.menu[i].children;
                        }
                    }
                }
            }
        },
        methods:{
            subMit(){
                let names = this.names.split("/");
                let labels = this.label.split("/");
                if (this.i >= 3) {
                    this.i = 0;
                    this.parent_id = "";
                    return;
                }
                let parm = {
                    name: "",
                    label: labels[this.i],
                    parent_id: this.parent_id
                }
                for (let j = 0;j < this.i;j++){
                    if (j == 0){
                        parm.name += names[j]
                    }else {
                        parm.name += "/" + names[j]
                    }
                }
                addMenu(parm).then(res => {
                    if (!res.error_code){
                        ++this.i;
                        this.parent_id = res.data.id
                        this.subMit()
                    }else {
                        this.$message.error(res.message)
                    }
                })
            },
            addMenus(){
                let parm = {
                    name: this.name_second,
                    label: this.label_second,
                    parent_id: "",
                }
                if (this.parent_II){
                    parm.parent_id = this.parent_II
                }else {
                    parm.parent_id = this.parent_I
                }
                addMenu(parm).then(res => {
                    if (!res.error_code){
                        this.$message("保存成功");
                    }
                })
            }
        },

     }
</script>