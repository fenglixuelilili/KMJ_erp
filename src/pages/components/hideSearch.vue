<template>
    <section>
        <img src="../../assets/gitup.png" id="packUp" @click="packUp">
    </section>
</template>
<script>
    import {packUp} from "../../api/geFunc"
    export default {
        data () {
            return {

            }
        },
        methods:{
            packUp(){
                this.$store.commit("setIsPackUp");
                packUp(this.$store.state.isPackUp);
            },
        }
    }
</script>