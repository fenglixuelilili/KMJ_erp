<template>
    <section style="background:#f6f6f6;padding: 20px;">
        <div class="shadow" style="padding-bottom: 20px;text-align: center">
            <h3 class="info" style="text-align: left;margin-bottom: 20px;"><span class="el-icon-edit"></span>&#8195;绑定已开通的店铺
            </h3>
            <el-select v-model="value" clearable filterable placeholder="请选择" @change="change">
                <el-option
                        v-for="item in tableData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </div>

        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-light text-center">
                    <el-button type="primary" @click="subMit" class="btnw">确定</el-button>
                    <el-button @click="retu" class="btnw">返回</el-button>
                </div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import {getOuterStores, bindStore} from '../../api/api'
    export default{
        data(){
            return {
                tableData: [],
                value: ""
            }
        },
        created(){
            var platform = this.$route.query.platform;
            var parm = {platform: platform, bonded_status: 'unbonded'};
            getOuterStores(parm).then((res) => {
                console.log(res)
                if (!res.data.storesList) {
                    return
                }
                switch (this.$route.query.platform) {
                    case 'bd':
                        for (var i = 0; i < res.data.storesList.length; i++) {
                            var obj = {name: "", id: ""};
                            obj.name = res.data.storesList[i].name;
                            obj.id = res.data.storesList[i].bd_id;
                            this.tableData.push(obj);
                        }
                        break;
                    case 'meituan':
                        for (var i = 0; i < res.data.storesList.length; i++) {
                            var obj = {name: "", id: ""};
                            obj.name = res.data.storesList[i].name;
                            obj.id = res.data.storesList[i].app_poi_code;
                            this.tableData.push(obj);
                        }
                        break;
                    case 'jddj':
                        for (var i = 0; i < res.data.storesList.length; i++) {
                            var obj = {name: "", id: ""};
                            obj.name = res.data.storesList[i].stationName;
                            obj.id = res.data.storesList[i].stationNo;
                            this.tableData.push(obj);
                        }
                        break;
                    case 'eleme':
                        for (var i = 0; i < res.data.storesList.length; i++) {
                            var obj = {name: "", id: ""};
                            obj.name = res.data.storesList[i].restaurant_name;
                            obj.id = res.data.storesList[i].restaurant_id;
                            this.tableData.push(obj);
                        }
                        break;
                }
            })
        },
        methods: {
            retu(){
                this.$router.push({path: '/delivery', query: {store_id: this.$route.query.store_id}})
            },
            change(val){

            },
            subMit(){
                var parm = {
                    store_id: this.$route.query.store_id,
                }
                switch (this.$route.query.platform) {
                    case 'bd':
                        parm.bdstore_id = this.value;
                        break;
                    case 'meituan':
                        parm.meituanstore_id = this.value;
                        break;
                    case 'jddj':
                        parm.jddjstore_id = this.value;
                        break;
                    case 'eleme':
                        parm.elemestore_id = this.value;
                        break;
                }
                bindStore(this.$route.query.store_id, parm).then((res) => {
                    this.$notify.info({
                        message: res.message
                    });
                    if (res.status_code == 200) {
                        this.$router.push({path: '/delivery', query: {store_id: this.$route.query.store_id}})
                    }
                })
            }
        }
    }
</script>