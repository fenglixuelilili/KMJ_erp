<template>
    <section>
        <el-tooltip style="width: 50%;" class="item" effect="dark" :content="message"
                    placement="top" v-if="!omitLengths(message)">
            <span>{{omit(message)}}</span>
        </el-tooltip>
        <span v-if="omitLengths(message)">{{message}}</span>
    </section>
</template>
<script>
    import { omits, omitLength } from "../../api/geFunc"
    export default {
        data () {
            return {

            }
        },
        props: ['message','length'],
        methods:{
            omit(str){
                return omits(str,this.length);
            },
            omitLengths(str){
                return omitLength(str,this.length);
            },
        }
    }
</script>