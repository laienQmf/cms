<template>
    <div class="project-list">
        <div class="project-con">
            <div
                v-for="item in projectList"
                :key="item.id"
                class="project-item hover"
                @click="toProject(item)"
            >
                <div class="app-icon">
                    <img
                        :src="$store.state.default_file_url + item.iconUrl"
                        v-show="item.iconUrl"
                    />
                    <img
                        src="../../assets/headImg.png"
                        v-show="!item.iconUrl"
                    />
                </div>
                <div class="app-message">
                    <div class="app-name">{{ item.appStoreName }}</div>
                    <div class="app-title">{{ item.appSubtitle }}</div>
                </div>
                <div class="app-code">{{ item.appCode }}</div>
            </div>
            <div class="project-item" style="background-color:rgba(0,0,0,0);box-shadow:none;border:0">
                <div class="add-row" @click="toAddProject" v-if="addPermission">
                    <i class="el-icon-circle-plus-outline hover"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            projectList: [],
        };
    },
    computed: {
        addPermission() {
            return this.$store.state.permissionPage.program.add;
        },
    },
    methods: {
        toProject(item) {
            sessionStorage.setItem("projectId", item.id);
            this.$router.push("/info-list-proj");
        },
        toAddProject() {
            sessionStorage.removeItem("projectId");
            this.$router.push("/info-list-proj?id=add");
        },
    },
    async created() {
        this.$request(
            "/proj/info/page",
            { pageSize: 999 },
            (res) => {
                if (res.data.code === 200) {
                    this.projectList = res.data.data.list;
                }
            },
            "get",
            true,
            false
        );
    },
};
</script>

<style scoped>
.project-list {
    margin: auto;
    padding-top: 20px;
}
.project-con {
    width: 1000px;
    display: flex;
    flex-wrap: wrap;
    margin: auto;
}
.project-item {
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin: 10px;
    border-radius: 15px;
    padding: 25px;
    box-sizing: border-box;
    display: flex;
    height: 165px;
    background-color: white;
    width: 447px;
    position: relative;
}
.app-icon {
    width: 115px;
    height: 115px;
    border-radius: 15px;
    overflow: hidden;
}
.app-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.app-message {
    margin-left: 30px;
    width: 250px;
    text-align: left;
    /* padding: 7px 0; */
}
.app-message > div {
    margin: 5px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    /* white-space: nowrap; */
    /* word-break: break-all; */
display: -webkit-box;/*重点，不能用block等其他*/
-webkit-line-clamp: 2;/*重点IE和火狐不支持*/
-webkit-box-orient: vertical;/*重点*/
    height: 60px;
}
.app-name {
    font-weight: 800;
    font-size: 23px;
}
.add-row {
    text-align: left;
    padding: 10px;
    font-size: 80px;
}
.app-code {
    position: absolute;
    right: 20px;
    bottom: 10px;
    color: rgba(0, 0, 0, 0.5);
    font-weight: 800;
}
</style>