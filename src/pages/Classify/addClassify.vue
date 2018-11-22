<template>
    <div class="add-items" style="padding: 15px;">
        <div class="shadow">
            <h3 class="info"><span class="el-icon-edit"></span>&#8195;账号信息</h3>
            <div style="display: flex;padding: 100px 0">
                <div style="flex-grow: 1;width: 1px;"></div>
                <div style="flex-grow: 2;width: 1px;">
                    <el-form label-width="100px" style="width: 60%;">
                        <el-form-item label="一级分类：" required>
                            <el-input v-model="userName" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="二级分类：" required>
                            <el-input v-model="name" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="三级分类：" required>
                            <el-input v-model="password" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="flex-grow: 1;width: 1px;"></div>
            </div>
        </div>
        <el-row :gutter="2">
            <el-col :span="24">
                <div class="grid-content bg-purple-light text-center">
                    <el-button type="primary" @click="onSubmit" class='btnw'>保存</el-button>
                    <el-button @click="$router.replace('')" class='btnw'>取消</el-button>
                </div>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    import {  } from '../../api/api'

    export default {
        data() {
            return {
                memo: "",
                radio: "",
                telephone: "",
                repassword: "",
                password: "",
                userName: "",
                name: "",
                postbox: "",
            }
        },
        methods: {
            onSubmit() {

            }
        }
    }

</script>
