<template>
    <div class="home-main">
        <headers></headers>
        <!-- <div class="swicth_home_1"></div> -->
        <div class="home-body">
            <list
                v-show="resourceShow"
                :renderListdom="resourceRouter"
                :permissionList="permission.resource"
            ></list>
            <list
                v-show="!resourceShow"
                :renderListdom="projectRouter"
                :permissionList="permission.program"
            ></list>
            <div class="home-nowpage">
                <!-- <tabs class="tabs"></tabs> -->
                <!-- <div class="home-con" :style="'min-height:'+hei+'px;'"> -->
                <div class="home-con">
                    <transition name="page-transition">
                        <router-view class="page-con" />
                    </transition>
                </div>
                <!-- <div class="movecon" :style="'height:'+hei+'px'" @click="showlistbtn = false">
                    <router-view />
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import headers from "./Header.vue";
import list from "./List.vue";
// import tabs from "./Tabs.vue";
export default {
    name: "Home",
    components: { list, headers },
    data() {
        return {
            hei: null,
            showlistbtn: false,
            resourceShow: true,
            resourceRouter: [],
            projectRouter: [],
        };
    },
    computed: {
        nowPath() {
            return this.$route.path;
        },
        permission() {
            return this.$store.state.permissionPage;
        },
        projectMenu() {
            return this.$store.state.projectMenu;
        },
    },
    watch: {
        nowPath: {
            handler(val) {
                this.nowPathChange(val);
            },
        },
    },
    methods: {
        // // 通过权限和菜单栏控制 项目list列表 和 资源list列表 中模块的显隐
        // listViewChange(){
        //     let id = sessionStorage.getItem('projectId')
        //     // project的列表还受menu的影响
        //     let projectMenu = this.projectMenu
        //     let projectPermission = this.permission.program[id] || {}
        //     Object.keys(projectPermission).some(listName => {
        //         projectPermission[listName].view && projectMenu.listName && this.projectRouter.some(routerItem => {
        //             routerItem.meta === listName && routerItem.type === 'list' && (routerItem.noShow = false)
        //         })
        //     })
        //     let resourcePermission = this.permission.resource
        // },
        nowPathChange(val) {
            [...this.resourceRouter, ...this.projectRouter].some((item) => {
                if (item.path === val) {
                    if (item.class === "resource") {
                        this.resourceShow = true;
                    }
                    if (item.class === "project") {
                        this.resourceShow = false;
                    }
                }
            });
        },
        showlist() {
            this.showlistbtn = !this.showlistbtn;
        },
        // 初始化list渲染的所有节点
        listDomRender() {
            let op = this.$router.options.routes;
            let container = [];
            op.some((item) => {
                item.meta &&
                    item.meta === "start" &&
                    (container = item.children);
            });
            let resource = [],
                project = [];
            container.some((item) => {
                if (item.class === "resource") {
                    resource.push(item);
                }
                if (item.class === "project") {
                    project.push(item);
                }
            });
            this.projectRouter = project;
            this.resourceRouter = resource;
            // 手动调用第一次nowpage的change
            this.nowPathChange(this.nowPath);
        },
        fieldToLocal(obj) {
            if (obj.read) {
                obj.view = true;
            }
            if (obj.update) {
                obj.editor = true;
            }
            if (obj.del) {
                obj.delete = true;
            }
            Object.keys(obj).some((item) => {
                if (typeof obj[item] === "object") {
                    this.fieldToLocal(obj[item]);
                }
            });
        },
        toHump(string) {
            return string.replace(/_([a-z])/g, (all, val) => val.toUpperCase());
        },
        Permission() {
            let obj = {};
            obj.view = false;
            obj.add = false;
            obj.editor = false;
            obj.delete = false;
            return obj;
        },
    },
    async created() {
        this.hei = this.$store.state.hei - 80; //get page height
        if (this.$store.state.wid < 769) {
            this.hei =
                this.$store.state.hei - (this.$store.state.wid / 20) * 3.4;
        }
        let path = this.$route.path;
        this.$store.state.allDom.some((item) => {
            if (item.path === path) {
                this.$store.commit("modifyData", {
                    name: "showDom",
                    newdata: [item],
                });
                return true;
            }
        });
        this.listDomRender();
        let loading = this.$loading.service();
        // 获取整个权限树
        await new Promise((resolve) => {
            this.$request(
                "/sys/perms/list",
                {},
                (res) => {
                    // 在第一个请求中判断是否错误，关闭loading
                    if (res === "error") {
                        loading.close()
                        return true;
                    }
                    if (res.data.code === 200) {
                        this.$store.commit("modifyData", {
                            name: "permissionTree",
                            newdata: res.data.data,
                        });
                    }
                    resolve();
                },
                "get",
                false,
                false
            );
        });
        // 获取所有部门
        await new Promise((resolve) => {
            this.$request(
                "/sys/dept/list",
                {},
                (res) => {
                    if (res.data.code === 200) {
                        res.data.data.some((item) => {
                            item.label = item.name;
                            item.value = item.id;
                        });
                        this.$store.commit("optionBaseAdd", {
                            name: "TeamList",
                            newdata: res.data.data,
                        });
                    }
                    resolve();
                },
                "get",
                false,
                false
            );
        });
        {
            // 递归转化array为本地
            function toLocal(array) {
                array.some((item) => {
                    item.label = item.dictValue;
                    item.value = item.dictKey;
                    if (item.children) {
                        toLocal(item.children);
                    }
                });
            }
            // 批量获取options
            let optionArray = [
                "musicType",
                "combination",
                "soundType",
                "exerciseType",
                "workoutType",
                "bodyPart",
                "target-Fit",
                "target-Yoga",
                "position-Yoga",
                "position-Fit",
                "equipment-Yoga",
                "equipment-Fit",
                "focus",
                "specialNeeds-Fit",
                "specialNeeds-Yoga",
            ];
            for (let optionKey of optionArray) {
                await new Promise((resolve) => {
                    this.$request(
                        "/sys/dict/list",
                        { dictName: optionKey },
                        (res) => {
                            if (res === "error") {
                                return true;
                            }
                            toLocal(res.data.data);
                            this.$store.commit("optionBaseAdd", {
                                name: optionKey,
                                newdata: res.data.data,
                            });
                            if (optionKey === "exerciseType") {
                                this.$store.commit("optionBaseAdd", {
                                    name: "exerciseTypeEditor",
                                    newdata: res.data.data,
                                });
                            }
                            resolve();
                        },
                        "get",
                        false,
                        false
                    );
                });
            }
        }
        // 获取项目菜单表
        await new Promise((resolve) => {
            this.$request(
                "/proj/menu/list",
                {},
                (res) => {
                    this.$store.commit("optionBaseAdd", {
                        name: "menuList",
                        newdata: res.data.data.map((i) => {
                            return {
                                label: i.menuName,
                                value: i.id,
                                // 给info禁用
                                disabled: i.id === 1,
                            };
                        }),
                    });
                    resolve();
                },
                "get",
                false,
                false
            );
        });
        // 获取文件baseUrl
        await new Promise((resolve) => {
            this.$request(
                "/manage/file/baseUrl",
                {},
                (res) => {
                    this.$store.commit("modifyData", {
                        name: "default_file_url",
                        newdata: res.data.data,
                    });
                    resolve();
                },
                "post",
                false,
                false
            );
        });
        // 获取用户信息
        await new Promise((resolve) => {
            this.$request(
                "/sys/user/getMyInfo",
                {},
                (res) => {
                    this.$store.commit("modifyData", {
                        name: "userData",
                        newdata: res.data.data,
                    });
                    resolve();
                },
                "get",
                false,
                false
            );
        });
        // l拉取用户权限并且本地化,如果store是本地默认数据，拉取服务器数据
        if (this.$store.state.permissionPage.local) {
            await this.$getUserPermssion();
        }
        // // 如果projectId存在，home拉取info Menu
        // if (sessionStorage.getItem("projectId")) {
        //     await new Promise((resolve) => {
        //         this.$request(
        //             `/proj/info/detail/${sessionStorage.getItem("projectId")}`,
        //             {},
        //             (res) => {
        //                 // 依托于获取了菜单列表
        //                 let projectMenu = {};
        //                 // 通过id转化为本地的对应字典
        //                 let transLocal = {
        //                     1: "info",
        //                     2: "playlist",
        //                     3: "workout",
        //                     4: "reminder",
        //                     5: "custom",
        //                 };
        //                 this.$store.state.optionBase.menuList.some((item) => {
        //                     projectMenu[transLocal[item.value]] = false;
        //                     res.data.data.menuIds.some((i) => {
        //                         if (i === item.value) {
        //                             projectMenu[transLocal[item.value]] = true;
        //                             return true;
        //                         }
        //                     });
        //                 });
        //                 this.$store.commit("modifyData", {
        //                     name: "projectMenu",
        //                     newdata: projectMenu,
        //                 });
        //                 resolve();
        //             },
        //             "get",
        //             false,
        //             false
        //         );
        //     });
        // }
        loading.close();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.swicth_home_1 {
    height: 15px;
    width: 100%;
}
.home-body {
    /* min-width: 1524px; */
    position: relative;
    display: flex;
    flex: 1;
}
.home-main {
    background-color: rgb(238, 238, 238);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
}
.vertical_wall {
    width: 0.7%;
    height: 500px;
    min-width: 15px;
}
.home-nowpage {
    flex: 9;
    box-sizing: border-box;
    overflow-y: auto;
    position: relative;
}
.home-con {
    background-color: #f8f3d4;
    overflow: hidden;
    overflow-y: auto;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    position: absolute;
}
.movecon {
    display: none;
    overflow: auto;
}
.page-con {
    /* border: 1px solid rgba(0, 0, 0, 0.05); */
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}
.page-transition-enter {
    /* opacity: 0; */
    transform: translateX(-100%);
    position: absolute;
    top: 0;
}
.page-transition-leave-active,
.page-transition-enter-active {
    transition: all 0.3s;
}
.page-transition-leave-to {
    opacity: 0;
    transform: translateX(100%);
    position: absolute;
    top: 0;
}
</style>
