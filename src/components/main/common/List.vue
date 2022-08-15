<template>
    <div :class="`home-list ${hideBtn ? 'home-list-hide' : ''}`">
        <div :class="`con ${hideBtn ? 'con-hide' : ''}`" @mouseout="HiddenList">
            <!-- 侧边栏的移动竖线 -->
            <!-- <div class="lie_line" ref="lie_line"></div> -->
            <!-- 侧边栏主体 -->
            <el-menu :default-active="active" @select="cutPage">
                <div v-for="(item, index) in listdom" :key="index" class="kuai">
                    <div v-if="item.noShow || !$renderingCheck(permission,true,item)"></div>
                    <div v-else>
                        <el-menu-item
                            v-if="!item.children || item.noFold"
                            :index="item.path"
                        >
                            <i :class="[item.icon, 'icon1']"></i>
                            <span slot="title">{{ item.showName }}</span>
                        </el-menu-item>
                        <!-- 有子元素 -->
                        <el-submenu v-else :index="item.path">
                            <template slot="title">
                                <i :class="[item.icon, 'icon1']"></i>
                                <span>{{ item.showName }}</span>
                            </template>
                            <el-menu-item-group
                                v-for="(item2, index2) in item.children"
                                :key="index2"
                            >
                                <div v-if="item2.noShow"></div>
                                <el-menu-item
                                    :index="item.path + '/' + item2.path"
                                    v-else
                                >
                                    <!-- <i :class="[item2.icon, 'icon1']"></i> -->
                                    <span
                                        style="
                                            width: 30px;
                                            opacity: 0;
                                            height: 10px;
                                        "
                                        >1111</span
                                    >
                                    <span>{{ item2.showName }}</span>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </div>
                </div>
            </el-menu>
        </div>
    </div>
</template>
<script>
export default {
    props:['renderListdom','permissionList'],
    data() {
        return {
            listLineHeight: null,
            publishState: false,
            version: 2,
            hideBtn: false,
        };
    },
    methods: {
        cutPage(e) {
            this.$router.push(e);
        },
        HiddenList() {
            // if(!e.fromElement){return false}
            // let classList = e.fromElement.classList
            // for(let i = 0; i < classList.length ;i++){
            //     if(
            //         e.relatedTarget.classList.value != 'lie_line'&&   //阻止滑动竖线冒泡
            //         e.relatedTarget.localName != 'span'&&            //阻止文字冒泡
            //         e.relatedTarget.localName != 'i'&&               //阻止icon冒泡
            //         e.relatedTarget.localName != 'ui'&&              //阻止整个导航栏冒泡
            //         e.relatedTarget.localName != 'li'&&              //阻止其他li标签冒泡
            //         (classList[i] === 'el-submenu__title' || classList[i] === 'el-menu-item')
            //     ){
            //         let h = e.fromElement.getBoundingClientRect().height
            //         this.$refs["lie_line"].style.height = 0 + "px";
            //         this.$refs["lie_line"].style.top = parseInt(this.$refs["lie_line"].style.top) + h/2 + 'px';
            //     }
            // }
        },
    },
    computed: {
        nowPath: {
            get() {
                return this.$route.path;
            },
            set(newdata) {
                this.$store.commit("modifyData", { name: "nowPath", newdata });
            },
        },
        listdom(){
            return this.renderListdom
        },
        permission(){
            return this.permissionList
        },
        // 通过路由来选择绑定的列表栏
        active() {
            let state = "";
            this.listdom.some((item) => {
                // 设置组件默认绑定路由
                if (this.nowPath === item.path) {
                    state = item.active || item.path;
                }
            });
            return state;
        },
        projectMenu(){
            return this.$store.state.projectMenu
        }
    },
    watch: {
        nowPath: {
            handler(val) {
                let state = false
                let formatArray = ['accountManage-','projectHome-','my-account']
                formatArray.some(item => {
                    if(val.indexOf(item) != -1){
                        state = true
                    }
                })
                this.hideBtn = state
            },
            immediate:true
        },
    },
    created() {
        // this.nowPath = this.$route.path;
    },
    mounted() {},
};
</script>

<style scoped>
.header {
    display: flex;
    padding: 20px 20px 0;
    box-sizing: border-box;
    align-items: center;
    flex-wrap: wrap;
}
.header img {
    width: 30px;
    height: 30px;
    object-fit: contain;
}
.header > div {
    margin-right: 15px;
}
.lie_line {
    width: 5px;
    background-color: #3b8cff;
    position: absolute;
    height: 56px;
    left: 0;
    top: 0;
    z-index: 100;
    transition: all 0.2s;
}
.home-list {
    width: 210px;
    background-color: rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(234, 237, 242);
    position: relative;
    transition: margin 0.5s;
}
.con {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 5;
    /* transition: left 2s; */
}
.con-hide {
    /* left: calc(-200%); */
}
.home-list-hide {
    margin-left: -210px;
}
.el-menu {
    border-right: none;
}
.con >>> .el-menu-item {
    text-align: left;
}
.con >>> .el-menu-item:hover,
.con >>> .el-submenu__title:hover {
    color: #409eff !important;
}
.el-menu-item:focus {
    /* background-color: inherit !important; */
}
.con >>> .el-submenu__title {
    text-align: left;
}
.con >>> .el-menu-item-group__title {
    padding: 0;
}
.con >>> .el-menu-item-group {
    overflow: hidden;
}
.con >>> .el-menu-item-group li {
    width: 90%;
    min-width: auto;
    padding: 0 10px !important;
    margin: auto;
}
.kuai:hover {
    color: white;
}
.icon1 {
    color: inherit !important;
}
.con >>> .is-active {
    /* background-color: rgba(0,0,0,.08) !important; */
    color: #409eff;
}
.bbh {
    font-size: 12px;
    text-transform: none;
}
.header >>> * {
    text-transform: none;
}
</style>