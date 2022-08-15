<template>
    <div class="bgcdiv">
        <div class="tit_text">
            <img src="../../../assets/lion.png" alt="" />
            <span>CMS</span>
        </div>
        <div class="head-list">
            <div
                class="head-list-item"
                v-for="item in Object.keys(headList)"
                :key="item"
                @click="$router.push(headList[item].path)"
                v-show="
                    typeof headList[item].show === 'boolean'
                        ? headList[item].show
                        : (permissions[headList[item].show].view)
                "
            >
                {{ headList[item].name }}
            </div>
        </div>
        <div class="user">
            <!-- <img class="img1" :src="headeimg" /> -->
            <div class="username hover">
                <el-dropdown @command="selectChange">
                    <span class="el-dropdown-link">
                        {{ userName
                        }}<i class="el-icon-arrow-down el-icon--right"></i>
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
            <!-- <div class="exit" @click="signOut">
                <p class="swicth_1">Logout</p>
                <i class="el-icon-switch-button"></i>
            </div> -->
        </div>
    </div>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            headeimg: require("../../../assets/default_head.jpg"),
            headList: {
                firstPage: {
                    name: "Home",
                    path: "/main",
                    show: true,
                },
                programPage: {
                    name: "APP Project",
                    path: "/projectHome-list",
                    show: "program",
                },
                resourcePage: {
                    name: "Basic Resource",
                    // 资源管理默认跳转到animation
                    path: "/operationRecord-list",
                    show: "resource",
                },
                accountPage: {
                    name: "User Account",
                    path: "/accountManage-list",
                    show: "user",
                },
            },
        };
    },
    computed: {
        userName() {
            return this.$store.state.userData.realName;
        },
        permissions() {
            return this.$store.state.permissionPage;
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
    },
    created() {
        let username = localStorage.getItem("username");
        if (username) {
            this.$store.commit("modifyData", {
                name: "username",
                newdata: username,
            });
        }
    },
};
</script>

<style scoped>
.el-icon-switch-button {
    display: none;
}
.el-icon-s-tools {
    display: none;
}

.bgcdiv {
    background-color: var(--yellow);
    height: 50px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 1px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%),
        0 1px 18px 0 rgb(0 0 0 / 12%);
    position: relative;
    z-index: 2;
}
.bgcdiv > div {
    color: white;
}
.tit_text {
    font-size: 20px;
    height: 100%;
    display: flex;
    align-items: center;
    width: 210px;
    padding-left: 20px;
}
.tit_text img {
    height: 55%;
    object-fit: contain;
    margin-right: 10px;
}
.img1 {
    height: 45px;
    width: 45px;
    display: block;
    float: left;
    border-radius: 50%;
}
.head-list {
    display: flex;
    flex: 6;
}
.head-list-item {
    padding:0 10px;
    cursor: pointer;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
}
.head-list-item:nth-child(1){
    border: 0;
}
.head-list-item:hover {
    color: rgb(28, 28, 28);
}
.user {
    /* width: 200px; */
    font-size: 14px;
    flex: 2;
    display: flex;
    justify-content: right;
    align-items: center;
    margin-right: 20px;
}
.exit {
    margin-right: 20px;
    cursor: pointer;
}
.el-icon-switch-button:active {
    color: red;
}

.username {
    margin: 0 30px 0 15px;
}
.el-dropdown {
    color: white;
}
</style>