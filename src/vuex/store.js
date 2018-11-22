import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 应用初始状态
const state = {
    size: "small",
    sizeButton: "mini",
    isPackUp: true,
    url: "",
    urlBackstage: "",
    urlBackstageApi: "",
    urlBackstageEntity: "",
    pickerOptions: {
        shortcuts: [{
            text: '今天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '昨天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '本周',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                var strD = start.toString();
                switch (strD.split(" ")[0]) {
                    case 'Mon':
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
                        break;
                    case 'Tue':
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                        break;
                    case 'Wed':
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                        break;
                    case 'Thu':
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                        break;
                    case 'Fri':
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 4);
                        break;
                    case 'Sat':
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
                        break;
                    case 'Sun':
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        break;
                }
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '上周',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                var strD = end.toString();
                switch (strD.split(" ")[0]) {
                    case 'Mon':
                        end.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                        start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                        break;
                    case 'Tue':
                        end.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                        start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                        break;
                    case 'Wed':
                        end.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                        start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                        break;
                    case 'Thu':
                        end.setTime(start.getTime() - 3600 * 1000 * 24 * 4);
                        start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                        break;
                    case 'Fri':
                        end.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
                        start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                        break;
                    case 'Sat':
                        end.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                        break;
                    case 'Sun':
                        end.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
                        break;
                }
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '本月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                var strD = start.toString();
                var num = parseInt(strD.split(' ')[2]) - 1;
                start.setTime(start.getTime() - 3600 * 1000 * 24 * num);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '上月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                var strD = start.toString();
                var num = parseInt(strD.split(' ')[2]);
                var numN = parseInt(strD.split(' ')[2]) - 1;
                end.setTime(end.getTime() - 3600 * 1000 * 24 * num);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * numN);
                start.setMonth(start.getMonth() - 1);
                picker.$emit('pick', [start, end]);
            }
        }]
    },
    platform: [{key:"全部",val:""},{key:"饿了么",val:"eleme"},{key:"京东到家",val:"jddj"},{key:"百度外卖",val:"bd"},{key:"美团外卖",val:"meituan"}],
}

// 定义所需的 mutations
const mutations = {
    setIsPackUp(state){
        state.isPackUp == false ? state.isPackUp = true : state.isPackUp = false;
    },
    setTrue(state){
        state.isPackUp = true;
    },
    setUrl(state,url){
        state.url = url;
    },
    setUrlBackstage(state,url){
        state.urlBackstage = url;
    },
    setUrlBackstageApi(state,url){
        state.urlBackstageApi = url;
    },
    setUrlBackstageEntity(state,url){
        state.urlBackstageEntity = url;
    },
}

// 创建 store 实例
export default new Vuex.Store({
    state,
    mutations
})
