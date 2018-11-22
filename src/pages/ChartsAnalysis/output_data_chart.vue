<template>
    <div >
        <div id="toptitle" >
            <span style="font-size:16px;font-weight:400;margin: auto 0;">日期：</span>
            <el-date-picker
                    class="datestyle"
                    v-model="choseDateRange"
                    type="daterange"
                    align="right"
                    placeholder="请选择"
                    :picker-options="pickerOptions"
                    @change="timeChangeIII"/>
            <span style="font-size:16px;font-weight:400;margin: auto 0;">排名范围：</span>
            <el-input
                    v-model="startNum"
                    style="width: 150px;"
                    placeholder="请输入开始排名"/>
            <span> ___ </span>
            <el-input
                    v-model="endNum"
                    style="width: 150px;margin-right: 20px"
                    placeholder="请输入结束排名"/>
            <span style="font-size:16px;font-weight:400;margin: auto 0;">单品名称：</span>
            <el-input
                    v-model="sku_title"
                    style="width: 150px;margin-right: 10px"
                    placeholder="请输入单品名称"/>
            <el-button type="primary" @click="getData" style="display: inline-block;" size="small">筛选</el-button>
            <div style="flex-grow: 1;"></div>
            <el-button type="primary" :disabled="cannotClick" @click="changeChart" style="display: inline-block;"
                       size="small">{{changeTitle}}
            </el-button>
        </div>
        <div id="outputdata" ref="outputdata"></div>
    </div>
</template>

<style scoped>
    #outputdata {
        width: 100%;
        height: 550px;
    }

    #toptitle {
        display: flex;
        padding: 10px 10px;
    }

    .datestyle {
        width: 250px;
        margin-right: 10px;

    }

</style>
<script>
    import echarts from 'echarts'
    import {getOutPutdata} from '../../api/api'
    import {toDate} from '../../api/geFunc'

    export default {
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },
                startNum: 1,//排名开始范围
                endNum: 20,//排名结束范围 默认排名
                sku_title:'',//单品筛选
                endDate: "",
                startDate: "",
                type:1,//默认类型 酒 2 为酒具
                //时间范围
                choseDateRange: [],
                //切换按钮文字
                changeTitle: '切换饼图',
                //切换按钮是否可点击
                cannotClick: true,
                //图表状态
                currentType: 'line',
                //出库折线图
                outputLine: null,
                //折线图横轴数据
                lineXData: [],
                //酒类别
                legendData: [],
                //数据
                lineSeriesData: [],
                //饼图数据
                pieSeriesData: [],
                //echarts 配置
                options: {
                    title: {
                        text: '出库物料数据分析',

                    },
                    tooltip: {},
                    legend: {
                        type: 'scroll',
                        orient: 'horizontal',
                        right: 0,
                        top: 30,
                        bottom: 20,
                        data: []
                    },
//                    dataZoom: [
//                        {
//                            type: 'inside',
//                            show: true,
//                            xAxisIndex: [0],
//                            start: 0,
//                            end: 100
//                        }
//                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {},
                    series: []
                },
            }
        },
        methods: {
            initEchart: function () {
                this.outputLine = echarts.init(document.getElementById('outputdata'))
            },
            drawCharts: function () {
                if (this.outputLine == null) {
                    this.initEchart();
                }
//                var echart=echarts.init(document.getElementById('outputdata'))
                this.options.legend.data = this.legendData;
                switch (this.currentType) {
                    case 'line':
                        this.options.xAxis.show = true;
                        this.options.yAxis.show = true;
                        this.options.xAxis.data = this.lineXData;
                        this.options.series = this.lineSeriesData;
                        break;
                    case 'pie':
                        this.options.xAxis.show = false;
                        this.options.yAxis.show = false;
                        this.options.series = [];
                        let tempData = {
                            name: '出库量',
                            type: 'pie',
                            radius: '60%',
                            center: ['50%', '55%'],
                            data: this.pieSeriesData
                        }
                        this.options.series = tempData;
                        break;
                    default:
                        console.log("currentType erro")
                        break;
                }
//                console.log(this.options)
                this.outputLine.setOption(this.options, true)
//                echart.setOption(this.options,true)
            },
            //切换图列
            changeChart: function () {
                this.currentType = this.currentType == 'line' ? 'pie' : 'line';
                this.changeTitle = this.currentType == 'line' ? '切换饼图' : '切换折线图';
                this.options.legend.orient=this.currentType == 'line' ?'horizontal':'vertical';
                this.drawCharts();
            },
            //获取数据
            getData: function () {
//                console.log(this.startDate, this.endDate)
                if (this.endDate == '' || this.startDate == '') {
                    this.$message("请选择时间范围!")
                    return;
                }
                let params = {
                    outstock_start_date: this.startDate,
                    outstock_end_date: this.endDate,
                    sku_title:this.sku_title,
                    start:this.startNum,
                    count:this.endNum-this.startNum+1<=0?1:this.endNum-this.startNum+1,
                    cat_type:this.type
                }
                getOutPutdata(params)
                    .then(res => {
                        this.legendData = res.data.legendData;
                        this.lineXData = res.data.lineXData;
                        this.lineSeriesData = res.data.lineSeriesData;
                        this.pieSeriesData = res.data.pieSeriesData;
                        this.cannotClick = false;
                        this.drawCharts();
                    })
            },
            //时间格式化
            timeChangeIII(val) {
                var time_quantumIII = val;
                if (time_quantumIII) {
                    this.startDate = time_quantumIII.split(" - ")[0] + " 00:00:00";
                    this.endDate = time_quantumIII.split(" - ")[1] + " 23:59:59";
                } else {
                    this.startDate = "";
                    this.endDate = "";
                }
            },
            //日期格式化
            formatDate: function (value) {
                var d = new Date(value);
                var year=d.getFullYear();
                var month=(d.getMonth()+1)>=10?d.getMonth()+1:'0'+(d.getMonth()+1);
                var date=d.getDate()>=10?d.getDate():'0'+d.getDate();
                return  year+'-'+month+'-'+date;
            },
        },
        mounted() {
            //视图加载完毕，初始化 echart
            this.initEchart();
            //
            this.getData()
        },

        //
        created() {
            this.type=this.$route.query.type;
            var endDate = new Date();
            var startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            this.startDate = this.formatDate(startDate)
            this.endDate = this.formatDate(endDate)
            console.log(this.startDate,this.endDate)
            this.choseDateRange = [startDate, endDate]
        }
    }

</script>