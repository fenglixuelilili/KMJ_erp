<style type="text/css">
    *{box-sizing: border-box;}
    header{
        padding: 10px 0;
        width: 100%;
        height: 60px;
        display: flex;
    }
    .flex{
        width: 1px;
        flex-grow: 8;
    }
    .flex_side{
        width: 1px;
        flex-grow: 2;
    }
    .flex img{
        height: 100%;
    }
    #sec{
        width: 100%;
        height: 600px;
        background-image: url("../assets/gg.png");
        -webkit-background-size: cover;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
    }
    #box{
        position: relative;
        width: 1200px;
        margin: 0 auto;
        height: 600px;
        background-color: none;
    }
    #box div{
        padding: 25px;
        position: absolute;
        right: 60px;
        top: 120px;
        z-index: 10;
        width: 350px;
        height: 350px;
        text-align: center;
        background: rgba(255,255,255,0.6);
    }
    .input{
        width: 300px;
        height: 42px;
        text-indent: 18px;
    }
    #userNmae,#password{
        margin-bottom: 20px;
    }
    #btn{
        width: 300px;
        height: 42px;
        color: #FFF;
    }
    #log{
        height: 18px;
        line-height: 18px;
        font-size: 16px;
        font-weight: 700;
        margin-top: 10px;
        text-align: left;
        margin-bottom: 30px;
        color: #3c3c3c;
    }
    #info{
        color: #6c6c6c;
        text-align: right;
        font-size: 12px;
        margin-top: 20px;
    }
    .ck{
        margin-right: 10px;
        cursor: pointer;
    }
    #info span:hover{
        color: #f40;
    }
    footer div{
        width: 60%;
        text-align: center;
        margin: 0 auto;
        padding: 20px;
        color: #8d9ba0;
    }
    #title{
        font-size: 20px;
        background: #FFF;
        position: relative;
        width: 160px;
        z-index: 10;
        left: 50%;
        top: -45px;
        margin-left: -80px;
    }
    #detail{
        text-align: left;
        line-height: 25px
    }
    #hr{
        height: 10px;
        width: 400px;
        position: relative;
        left: 50%;
        top: 72%;
        margin-left: -200px;    /* 宽度的一半 */
    }
</style>
<template>
    <section style="background:#FFF;height: 100%;">
        <header>
            <div class="flex_side"></div>
            <div class="flex">
                <img src="../assets/logo.png">
            </div>
        </header>
        <div id="sec">
            <div id="box">
                <div>
                    <p id="log">密码登录</p>
                    <p id="userNmae">
                        <input class="input" v-model="userName" type="input" name="" placeholder="账 号：">
                    </p>
                    <p id="password">
                        <input class="input" v-model="password" type="password" name="" placeholder="密 码：">
                    </p>
                    <el-button id="btn" type="primary" v-loading="logining" @click="subMit">{{texts}}</el-button>
                    <p id="info">
                        <span class="ck" @click="forget">忘记密码？</span>
                        <span class="ck" @click="register">立即注册</span>
                    </p>
                </div>
            </div>
        </div>
        <footer>
            <div>
                <div id="hr"><hr></div>
                <p id="title">系统简介</p>
                <p id="detail">“快买酒ERP管理平台”是一个企业综合管理的软件系统，涵盖财务、原材料、生产计划、销售等非常专业的一套系统，主要宗旨是对企业所拥有的人、财、物、信息、时间和空间等综合资源进行综合平衡和优化管理，ERP软件协调企业各管理部门，围绕市场导向开展业务活动，提高企业核心竞争力，从而取得最好的经济效益。</p>
            </div>
        </footer>
    </section>
</template>

<script>

import { requestLogin } from '../api/api';

export default {
    data() {
        return {
            logining: false,
            userName: "",
            password: "",
            texts: "登 录",
        };
    },
    created(){
        this. addEventL();
    },
    methods: {
        addEventL(){
            var _this = this;
            $(window).keyup(function(event){
                if(event.keyCode == 13){
                    _this.subMit();
                }
            })
        },
        subMit() {
            var parm = {
                username: this.userName,
                password: this.password,
            }
            this.loading = true;
            this.texts = "登录中";
            requestLogin(parm).then((res)=>{
                this.loading = false;
                this.texts = "登 录";
                if (!res.error_code){
                    sessionStorage.setItem('access_token', res.data);
                    sessionStorage.setItem('userName', this.userName);
                    $(window).unbind();
                    this.$router.replace("/welcome")
                }else {
                    this.$message.error(res.message);
                }
            })
        },
        register(){
            this.$message("该功能暂未开放！！！")
        },
        forget(){
            this.$message("请联系管理员韩钊")
        }
    }
}
</script>
