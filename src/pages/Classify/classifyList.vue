<template>
    <section style="padding: 0 20px 20px;">
        <div style="padding: 10px 0;">
            <el-button type="primary" class="btnw" @click="addOnce">新增一级分类</el-button>
        </div>
        <div style="margin-bottom: 10px;">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText" ></el-input>
        </div>
        <el-tree
                v-loading="bool_tree"
                class="filter-tree"
                empty-text="正在加载数据,请稍后！！！"
                :data="tableData"
                :props="defaultProps"
                node-key="cat_id"
                :filter-node-method="filterNode"
                ref="tree"
                :expand-on-click-node="false"
                :render-content="renderContent">
        </el-tree>
        <!--新增窗口-->
        <el-dialog :title="title" v-model="addVisible" :close-on-click-modal="false" top="5%">
            <p class="cen">分类名称：<el-input v-model="add_cat_name" style="width: 70%;"></el-input></p>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addFinsshed">保 存</el-button>
                <el-button @click.native="callOff">取 消</el-button>
            </div>
        </el-dialog>
        <!--编辑窗口-->
        <el-dialog title="编辑" v-model="editVisible" :close-on-click-modal="false" top="5%">
            <p class="cen">分类名称：<el-input v-model="edit_cat_name" style="width: 70%;"></el-input></p>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editFinsshed">保 存</el-button>
                <el-button @click.native="editVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import { getCategoriesList, addCategories, editCategories, deleteCategories, detailCategories } from './../../api/api'
    export default{
        data (){
            return {
                role: "",
                filterText: "",
                addVisible: false,
                editVisible: false,
                page: 1,
                per_page: 10,
                total: 100,
                tableData: [],
                defaultProps: {
                    children: 'children',
                    label: 'cat_name'
                },
                adds: {parent_id:"",cat_id:"",cat_name:""},
                edits: {parent_id:"",cat_id:"",cat_name:""},
                deletes: {parent_id:"",cat_id:"",cat_name:""},
                add_cat_name:"",
                edit_cat_name:"",
                delete_cat_name:"",
                title: "",
                bool_tree: false,
            }
        },
        created (){
            this.getClassify()
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            addVisible: function () {
                if (this.addVisible == false){
                    this.title = "";
                    this.add_cat_name = "";
                }
            }
        },
        methods: {
            callOff(){
                this.addVisible = false;
                this.title = "";
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.cat_name.indexOf(value) !== -1;
            },
            getClassify(){
                this.bool_tree = true;
                var parm = {
                    show_type: "tree"
                }
                getCategoriesList(parm).then((res)=>{
                    this.bool_tree = false;
                    this.tableData = res.data;
                })
            },
            remove(event) {
                var cat_id = event.target.style.zIndex;
                this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteCategories(cat_id).then((res)=>{
                        if (!res.error_code){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getClassify()
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            add(event) {
                this.bool_tree = true;
                detailCategories(event.target.style.zIndex).then((res)=>{
                    this.title += "新增"+res.data.cat_name + "分类";
                    if (res.data.level>=3){
                        this.bool_tree = false;
                        this.$message.error("四级分类未开放，敬请期待！！！")
                        return
                    }else{
                        this.bool_tree = false;
                        this.addVisible = true;
                        this.adds.parent_id = event.target.style.zIndex;
                        this.adds.cat_id = event.target.style.zIndex;
                    }
                })
            },
            addOnce(){
                this.title = "新增一级分类";
                this.addVisible = true;
                this.adds.parent_id = 0;
            },
            edit(event) {
                detailCategories(event.target.style.zIndex).then((res)=>{
                    this.edit_cat_name = res.data.cat_name;
                })
                this.edits.parent_id = event.target.style.top.replace("px","");
                this.edits.cat_id = event.target.style.zIndex;
                this.editVisible = true;
            },
            addFinsshed(){
                this.adds.cat_name = this.add_cat_name;
                addCategories(this.adds).then((res)=>{
                    if (!res.error_code){
                        this.$message.info("添加成功！！！")
                        this.addVisible = false;
                        this.getClassify()
                    }else {
                        this.$message.error(res.message)
                    }
                })
            },
            editFinsshed(){
                this.edits.cat_name = this.edit_cat_name;
                editCategories(this.edits.cat_id,this.edits).then((res)=>{
                    if (!res.error_code){
                        this.$message.info("编辑成功！！！")
                        this.editVisible = false;
                        this.getClassify()
                    }else {
                        this.$message.error(res.message)
                    }
                })
            },
            renderContent(h, { node, data, store }) {
                return h("span", [h("span",node.label),h("button",{staticStyle:{"cursor":"pointer","outline":"none","line-height":"36px","border":"none","background":"none","color":"#20a0ff","float":"right","margin-right":"20px",'z-index':data.cat_id,"top":data.parent_id+"px"},on:{"click":this.add}},"新增"),h("button",{staticStyle:{"cursor":"pointer","outline":"none","line-height":"36px","border":"none","background":"none","color":"#20a0ff","float":"right","margin-right":"20px",'z-index':data.cat_id,"top":data.parent_id+"px"},on:{"click":this.edit}},"编辑"),h("span",[h("button",{staticStyle:{"cursor":"pointer","outline":"none","line-height":"36px","border":"none","background":"none","color":"red","float":"right","margin-right":"20px",'z-index':data.cat_id,"top":data.parent_id+"px"},on:{"click":this.remove}},"删除")])])
            }
        }
    }
</script>