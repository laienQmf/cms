<template>
    <!-- 系统入口 -->
    <div class="first-page">
        <div class="page-head">
            <div class="head-img">
                <i class="el-icon-user"></i>
                <!-- <img src="" alt=""> -->
            </div>
            <div class="head-name">
                Hi,{{ realName }}
                <el-dropdown @command="selectChange" placement="bottom-start">
                    <span class="el-dropdown-link">
                        <i
                            style="font-size: 20px"
                            class="el-icon-arrow-down el-icon--right hover"
                        ></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                            icon="el-icon-user"
                            command="toMymessage"
                            >My Account</el-dropdown-item
                        >
                        <el-dropdown-item
                            icon="el-icon-warning-outline"
                            command="signout"
                            >Sign out</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="page-main">
            <div
                class="main-item hover"
                v-if="programPermission"
                @click="$router.push('/projectHome-list')"
            >
                <div class="icon-con">
                    <img src="../../assets/program-manage.png" alt="" />
                </div>
                <div class="text">APP Project</div>
            </div>
            <div
                class="main-item hover"
                v-if="resourcePermission"
                @click="$router.push('/operationRecord-list')"
            >
                <div class="icon-con">
                    <img src="../../assets/resource-manage.png" alt="" />
                </div>
                <div class="text">Basic Resource</div>
            </div>
            <div
                class="main-item hover"
                v-if="userPermission"
                @click="$router.push('/accountManage-list')"
            >
                <div class="icon-con">
                    <img src="../../assets/user-manage.png" alt="" />
                </div>
                <div class="text">User Account</div>
            </div>
        </div>
        <div class="page-end">Content Management2 System {{ version }}</div>
    </div>
</template>

<script>
export default {
    computed: {
        version() {
            return this.$store.state.version;
        },
        realName() {
            return this.$store.state.userData.realName;
        },
        userPermission() {
            return this.$store.state.permissionPage.user.view || false;
        },
        resourcePermission() {
            return this.$store.state.permissionPage.resource.view || false;
        },
        programPermission() {
            return (
                this.$store.state.permissionPage.program.view ||
                this.$store.state.permissionPage.program.add ||
                false
            );
        },
    },
    methods: {
        selectChange(command) {
            if (command === "toMymessage") {
                this.$router.push("/my-account");
            }
            if (command === "signout") {
                this.$confirm("Are you sure?", "hint", { type: "warning" })
                    .then(() => {
                        this.$request("/sys/user/logout", {}, (res) => {
                            if (res.data.code === 200) {
                                sessionStorage.clear();
                                localStorage.removeItem("token");
                                // 刷新清内存数据
                                this.$router.push("/login");
                                location.reload()
                            }
                        },'post',false,false);
                    })
                    .catch(() => {});
            }
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
        let permissionObj = this.$store.state.permissionPage.local;
        if (permissionObj) {
            this.$getUserPermssion();
        } else {
            console.log(this.$store.state.permissionPage);
        }
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
        // get version
        this.$request(
            "/manage/system/version",
            {},
            (res) => {
                if (res.data.code === 200) {
                    this.$store.commit("modifyData", {
                        newdata: res.data.data,
                        name: "version",
                    });
                }
            },
            "get",
            false,
            false
        );
    },
};
</script>

<style scoped>
.page-head {
    height: 154px;
    display: flex;
    align-items: center;
    padding: 0 61px;
}
.page-head > .head-img {
    background-color: rgb(218, 219, 219);
    height: 56px;
    width: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: white;
    font-size: 50px;
}
.page-head > .head-name {
    color: rgb(119, 104, 104);
    font-size: 25px;
    margin-left: 28px;
}
.page-main {
    display: flex;
    justify-content: center;
    margin: 15vh 0;
}
.page-main > .main-item {
    /* flex: 1; */
    margin: 0 10%;
}
.main-item .icon-con {
    border-radius: 50%;
    box-shadow: 0 0 0 5px rgb(92, 87, 88);
    width: 190px;
    height: 190px;
    box-sizing: border-box;
    padding: 20px;
    opacity: 0.7;
}
.icon-con img {
    width: 100%;
}
.main-item > .text {
    font-size: 25px;
    color: rgb(119, 104, 104);
    margin-top: 3vh;
}
.page-end {
    margin-top: 20vh;
}
</style>