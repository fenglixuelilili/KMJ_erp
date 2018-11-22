<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        components: {},
        created(){
            if (window.location.host == "testfonterp.kmjiu.com") {
                this.$store.commit("setUrl", 'https://testfonterp.kmjiu.com');
                this.$store.commit("setUrlBackstage", 'https://testerp.kmjiu.com/waimai_api/v1');
                this.$store.commit("setUrlBackstageApi", 'https://testerp.kmjiu.com/api/v1');
                this.$store.commit("setUrlBackstageEntity", 'https://testerp.kmjiu.com/entity/v1');
            } else {
                this.$store.commit("setUrl", 'https://fonterp.kmjiu.com');
                this.$store.commit("setUrlBackstage", 'https://duperp.kmjiu.com/waimai_api/v1');
                this.$store.commit("setUrlBackstageApi", 'https://duperp.kmjiu.com/api/v1');
                this.$store.commit("setUrlBackstageEntity", 'https://duperp.kmjiu.com/entity/v1');
            }
        }
    }
</script>

<style>
    @import "./assets/css/reset.min.css";
    @import "../node_modules/font-awesome/css/font-awesome.min.css";
    @import "../node_modules/flex.css/dist/flex.css";

    .bounce-enter-active {
        animation: bounce-in .5s;
    }

    .bounce-leave-active {
        animation: bounce-out .2s;
    }

    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes bounce-out {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(0.95);
        }
        100% {
            transform: scale(0);
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }

    body {
        margin: 0px;
        padding: 0px;
        background: #1F2D3D;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
        box-sizing: border-box;
    }

    .text-center {
        text-align: center;
    }

    #app {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
    }

    .el-submenu [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .el-menu-item [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .toolbar .el-form-item {
        margin-bottom: 10px;
    }

    .toolbar {
        background: #fff;
        padding: 10px 10px 0px 10px;
    }

    .right {
        float: right !important;
        margin-left: 10px !important;
        margin-right: 0px !important;
    }

    .cell{
        text-align: center!important;
    }

    .geFontSize_list {
        font-size: 12px !important;
    }

    .hspace {
        margin-bottom: 10px !important;
    }

    .btn_addBox {
        margin-bottom: 10px;
        border-bottom: 1px solid #ccc;
        border-top: 1px solid #ccc;
        padding: 5px 0px 5px 10px;
    }

    #packUp {
        position: absolute;
        width: 30px;
        height: 30px;
        right: 40px;
        top: 76px;
        z-index: 100000;
        transition: all .3s;
    }

    .col {
        width: 70% !important;
        min-width: 120px;
    }

    .btnw {
        width: 120px;
    }

    #scroll_bottom {
        width: 100% !important;
        overflow: auto;
    }

    #scroll_bottom .el-table__footer-wrapper {
        overflow: visible !important;
    }

    #scroll_bottom .el-table__body-wrapper {
        overflow: initial;
    }

    #scroll_bottom .el-table__header-wrapper {
        overflow: initial !important;
    }

    #scroll_bottomBox .el-table::after {
        display: none !important;
    }

    #scroll_bottom .el-table__footer td:not(:last-child) {
        border-right: none !important;
    }

    .el-tooltip__popper {
        max-width: 50% !important;
    }

    .orderDetails {
        padding: 10px 20px;
        box-sizing: border-box;
    }

    .items {
        width: 30%;
        display: inline-block;
    }

    .check-box {
        padding: 20px 0;
        text-align: center;
    }

    .checks {
        width: 130px;
    }

    .paging{
        padding:10px!important;
        float:right;
    }

    .remove{
        color: red!important;
    }
</style>
