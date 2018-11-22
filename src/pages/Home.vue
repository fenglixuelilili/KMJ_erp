<style scoped>

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0
    }

    .panel {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
    }

    .panel-top {
        height: 60px;
        line-height: 60px;
        background: #1F2D3D;
        color: #c0ccda;
    }

    .panel-top .rightbar {
        float: right;
        text-align: right;
        padding-right: 35px;
    }

    .panel-top .rightbar .head {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin: 10px 0px 10px 10px;
        float: right;
    }

    .panel-center {
        background: #324057;
        position: absolute;
        top: 60px;
        bottom: 0px;
        overflow: hidden;
    }

    .panel-c-c {
        background: #f1f2f7;
        position: absolute;
        right: 0px;
        top: 0px;
        bottom: 0px;
        left: 200px;
        overflow-y: scroll;
        padding: 20px;
    }

    .logout {
        background: url(../assets/logout_36.png);
        background-size: contain;
        width: 20px;
        height: 20px;
        float: left;
    }

    .logo-box {
        width: 200px;
        height: 60px;
        background-color: #f1f2f7;
        text-align: center;
    }

    .logo {
        height: 48px;
        margin-top: 6px;
    }

    .tip-logout {
        float: right;
        margin-right: 20px;
        padding-top: 5px;
    }

    .tip-logout i {
        cursor: pointer;
    }

    .admin {
        color: #c0ccda;
        text-align: center;
    }

    #menus {
        height: 600px;
    }

    .flex_box {
        display: flex;
    }

    .flex_menu {
        width: 220px;
        flex-grow: 0;
        flex-shrink: 0;
    }

    .flex {
        width: 1px;
        flex-grow: 10;
    }
</style>

<template>
    <el-row class="panel">
        <el-col :span="24" class="panel-top">
            <el-col style="font-size:26px;" class="logo-box">
                <router-link to="/welcome">
                    <img src="../assets/logo.png" class="logo">
                </router-link>
            </el-col>
            <el-col :span="4" class="rightbar">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link" style="color:#c0ccda;cursor: pointer;">
                        <i class="fa fa-user"></i> {{userName}}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="dialogFormVisible = true">修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
            <el-dialog title="修改密码" v-model="dialogFormVisible" size="tiny" :close-on-click-modal="false">
                <el-form :model="passForm" :rules="passRules" ref="passForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="旧密码" prop="password">
                        <el-input type="password" v-model="passForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newpassword">
                        <el-input type="password" v-model="passForm.newpassword" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="newpassword_confirm">
                        <el-input type="password" v-model="passForm.newpassword_confirm" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="changePass('passForm')">提交</el-button>
                        <el-button @click="resetForm('passForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-col>
        <el-col :span="24" class="panel-center">
            <div class="flex_box">
                <div class="flex_menu" v-bind:style="style">
                    <aside style="width:200px;">
                        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen"
                                 @close="handleclose" @select="handleselect" theme="dark" unique-opened router>
                            <template v-for="(item, index) in routes">
                                <el-submenu :index="index+''">
                                    <template slot="title">
                                        <i :class="item.iconCls"></i>
                                        {{item.label}}


                                    </template>
                                    <el-submenu v-if="item.children.length > 0" v-for="child in item.children"
                                                :index="child.name" :key="child.name">
                                        <template slot="title">
                                            <i :class="child.iconCls"></i>
                                            {{child.label}}


                                        </template>
                                        <el-menu-item v-if="child.children.length > 0" v-for="son in child.children"
                                                      :index="son.name" :key="son.name">
                                            {{son.label}}


                                        </el-menu-item>
                                    </el-submenu>
                                </el-submenu>
                            </template>
                        </el-menu>
                    </aside>
                </div>
                <div class="flex">
                    <section class="panel-c-c">
                        <div class="grid-content bg-purple-light">
                            <el-col :span="24" style="margin-bottom:15px;">
                                <strong style="width:200px;float:left;color: #475669;">{{$route.name}}</strong>
                                <el-breadcrumb separator="/" style="float:right;">
                                    <el-breadcrumb-item v-for="item in $route.matched" :key="item.name">
                                        {{ item.name }}


                                    </el-breadcrumb-item>
                                </el-breadcrumb>
                            </el-col>
                            <el-col :span="24" style="background-color:#fff;box-sizing: border-box;min-width: 800px">
                                <keep-alive>
                                    <router-view v-if="$route.meta.keepAlive"></router-view>
                                </keep-alive>
                                <router-view v-if="!$route.meta.keepAlive">
                                    <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
                                </router-view>
                            </el-col>
                        </div>
                    </section>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import {changePassword, getMenuList} from '../api/api'
    export default {
        data() {
            var checkPass = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入旧密码'));
                } else {
                    callback();
                }

            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else if (!/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,32}$/.test(value)) {
                    callback(new Error('密码为8~32位，且必须包含字母、数字、符号中的两种'))
                } else {
                    if (this.passForm.newpassword_confirm !== '') {
                        this.$refs.passForm.validateField('newpassword_confirm');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.passForm.newpassword) {
                    callback(new Error('两次输入的新密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                style: {},
                text: "new",
                height: null,
                routes: [],
                sysUserName: '',
                sysUserAvatar: '',
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                dialogFormVisible: false,
                userName: "",
                passForm: {
                    password: '',
                    newpassword: '',
                    newpassword_confirm: ''
                },
                passRules: {
                    newpassword: [{
                        validator: validatePass,
                        trigger: 'blur'
                    }],
                    newpassword_confirm: [{
                        validator: validatePass2,
                        trigger: 'blur'
                    }],
                    password: [{
                        validator: checkPass,
                        trigger: 'blur'
                    }]
                }
            }
        },
        created(){
            this.style = {
                height: $(window).height() - 60 + "px",
                overflowY: 'auto'
            }
            this.getMenuList();
            this.userName = sessionStorage.getItem('userName');
        },
        methods: {
            getMenuList(){
                var that = this;
                getMenuList()
                    .then(res => {
                        that.routes = res.data;
                    })
            },
            handleopen() {
                //console.log('handleopen');
            },
            handleclose() {
                //console.log('handleclose');
            },
            handleselect: function (a, b) {
            },
            changePass(formName) {
                let params = {
                        password: this.passForm.password,
                        newpassword: this.passForm.newpassword,
                        newpassword_confirm: this.passForm.newpassword_confirm
                    },
                    that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        changePassword(params).then(res => {
                            if (res.error_code) {
                                that.$message.error(res.message);
                            } else {
                                that.$message({
                                    message: '密码修改成功',
                                    type: 'success'
                                });
                                that.dialogFormVisible = false;
                            }
                        })
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //退出登录
            logout: function () {
                var _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    sessionStorage.removeItem('access_token');
                    _this.$router.push('/login');
                }).catch(() => {

                });
            }
        },
        mounted() {
            var user = sessionStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.name || '';
                this.sysUserAvatar = user.avatar || '';
            }
        }
    }

</script>
