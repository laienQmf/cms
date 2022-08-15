<template>
    <div class="aaa">
        <el-tabs v-model="editableTabsValue" 
        type="card" 
        closable @edit="clearPage"
        @tab-click="cutPage"
        >
            <el-tab-pane
                :key="item.path"
                v-for="item in editableTabs"
                :label="item.meta"
                :name="item.path"
            >{{item.content}}</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import single from '../../../assets/js/single'
export default {
    name: "Tabs",
    data() {
        return {
        };
    },
    computed: {
        //渲染的标签列表
        editableTabs: {
            get() {
                return this.$store.state.showDom;
            },
            set(newdata){
                this.$store.commit('modifyData',{name:'showDom',newdata})
            }
        },
        //显示的标签
        editableTabsValue: {
            get(){
                return this.$store.state.nowPath
            },
            set(data){
               data
            }
        },
    },
    methods: {
        clearPage(targetName) {
            let con = [],nowPath;
            this.editableTabs.some(item => {
                if(item.path != targetName){
                    con.push(item)
                }
            })
            if(con.length === 0){
                let definePath = this.$store.state.defineNowPath
                this.$store.state.allDom.some(item => {
                    if(item.path === definePath){
                        con.push(item)
                        return true
                    }
                })
            }
            nowPath = con[con.length-1].path
            this.editableTabs = con
            single.cutPage(nowPath)
        },
        cutPage(e){
            single.cutPage(e.name)
        }
    },
    created() {
    },
};
</script>

<style scoped>
.el-tabs__header{
    margin: 0;
}
.aaa{
    width: 100%;
}
.aaa >>> .el-tabs__header{
    background-color: white;
}
</style>