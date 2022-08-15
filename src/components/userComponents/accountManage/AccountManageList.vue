<template>
    <div class="account-all">
        <el-dialog :visible.sync="dialogShow">
            <div v-loading="treeLoading">
                <el-tree
                    ref="tree-dom"
                    :data="permissionTree"
                    show-checkbox
                    node-key="permsId"
                    :props="defaultProps"
                    :default-expanded-keys="permission"
                >
                </el-tree>
            </div>
        </el-dialog>
        <div class="filters">
            <div class="filter-item-con">
                <div class="filter-item">
                    <div class="filter-name">Account:</div>
                    <div class="filter-type">
                        <el-input
                            size="mini"
                            v-model="temporaryData.userName"
                            :maxlength="20"
                            show-word-limit
                        ></el-input>
                    </div>
                </div>
                <div class="filter-item">
                    <div class="filter-name">Status:</div>
                    <div class="filter-type">
                        <el-select
                            size="mini"
                            v-model="temporaryData.status"
                            clearable
                        >
                            <el-option
                                v-for="item in statusOptions"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="filter-item">
                    <div class="filter-name">Team:</div>
                    <div class="filter-type">
                        <el-select
                            size="mini"
                            v-model="temporaryData.deptId"
                            clearable
                        >
                            <el-option
                                v-for="item in TeamOptions"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <el-button
                class="searchBtn"
                size="mini"
                type="primary"
                @click="searchDataFunc"
                >Search</el-button
            >
        </div>
        <div class="table-con">
            <div style="margin-bottom: 5px">
                <el-button
                    @click="$router.push(`/accountManage-editor?id=add`)"
                    type="primary"
                    size="small"
                    v-if="permissionPage.add"
                    >+Add</el-button
                >
            </div>
            <el-table
                :data="tableData"
                border
                v-loading="tableLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-text="Loading.."
                height="448px"
            >
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column
                    label="Account"
                    prop="userName"
                ></el-table-column>
                <el-table-column label="Name" prop="realName"></el-table-column>
                <el-table-column label="Team" prop="deptName"></el-table-column>
                <el-table-column label="Permission">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="viewPermission(scope.row.id)"
                            >View Permission</el-button
                        >
                    </template>
                </el-table-column>
                <el-table-column label="Status">
                    <template slot-scope="scope">
                        {{ $searchOptionName(statusOptions, scope.row.status) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="Create Time"
                    prop="createTime"
                ></el-table-column>
                <el-table-column label="Options">
                    <template slot-scope="scope">
                        <div>
                            <el-button
                                size="mini"
                                @click="toDetail(scope.row.id)"
                                type="primary"
                                >Detail</el-button
                            >
                            <el-button
                                @click="deleteAccount([scope.row.id])"
                                size="mini"
                                type="danger"
                                v-if="permissionPage.delete"
                                >Delete</el-button
                            >
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px">
                <el-pagination
                    :current-page.sync="nowPage"
                    :page-sizes="[15]"
                    :pager-count="5"
                    :page-size="15"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            permission: [],
            temporaryData: {
                userName: "",
                status: 1,
                deptId: "",
            },
            searchData: {},
            tableData: [],
            nowPage: 1,
            total: 15,
            dialogShow: false,
            defaultProps: {
                label: "permsName",
                children: "subPerms",
            },
            tableLoading: false,
            treeLoading: false,
        };
    },
    watch: {
        nowPage() {
            this.getList();
        },
    },
    computed: {
        permissionPage() {
            return this.$store.state.permissionPage.user;
        },
        statusOptions() {
            return this.$store.state.optionBase.resourceStatus2;
        },
        TeamOptions() {
            return this.$store.state.optionBase.TeamList;
        },
        permissionTree() {
            let permission = this.$deepCopy(this.$store.state.permissionTree);
            function allDisabled(doms) {
                doms.some((item) => {
                    item.disabled = true;
                    if (item.subPerms.length > 0) {
                        allDisabled(item.subPerms);
                    }
                });
            }
            allDisabled(permission);
            return permission;
        },
    },
    methods: {
        toDetail(id) {
            sessionStorage.setItem(this.pageName, this.nowPage);
            this.$router.push(`/accountManage-editor?id=${id}`);
        },
        searchDataFunc() {
            this.searchData = { ...this.temporaryData };
            this.getList();
        },
        viewPermission(id) {
            this.dialogShow = true;
            this.treeLoading = true;
            this.$request(
                `/sys/perms/listByUser/${id}`,
                {},
                (res) => {
                    this.treeLoading = false;
                    let array = res.data.data.map((i) => i.permsId);
                    this.$refs["tree-dom"].setCheckedKeys(array);
                    this.permission = array;
                },
                "get",
                false,
                false
            );
        },
        deleteAccount(idList) {
            this.$confirm(
                `This will permanently delete the data. Continue?`,
                "",
                { type: "warning" }
            ).then(() => {
                this.$request(
                    "/sys/user/del",
                    { idList },
                    (res) => {
                        if (res.data.code === 200) {
                            this.getList();
                        }
                    },
                    "post",
                    true,
                    true
                );
            });
        },
        getList() {
            this.tableLoading = true;
            let data = {
                pageSize: 15,
                pageNum: this.nowPage,
                ...this.searchData,
            };
            Object.keys(data).some((i) => data[i] === "all" && (data[i] = ""));
            this.$request(
                "/sys/user/page",
                data,
                (res) => {
                    this.tableLoading = false;
                    if (res.data.code === 200) {
                        this.tableData = res.data.data.list;
                        this.total = res.data.data.total;
                    }
                },
                "get",
                false,
                false
            );
        },
    },
    created() {
        this.searchDataFunc();
        this.pageName = this.$route.path.match(/\/([a-z A-Z]{1,})-/)[1];
        let PageCache = sessionStorage.getItem(this.pageName);
        PageCache && (this.nowPage = Number(PageCache));
        sessionStorage.removeItem(this.pageName);
    },
};
</script>

<style scoped>
.account-all {
    width: 1300px;
    margin: auto;
}
.filters,
.table-con {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-top: 20px;
    padding: 10px 30px;
    background-color: white;
}
.filter-item-con {
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.filter-item {
    display: flex;
    align-items: center;
}
.filter-name {
    margin-right: 20px;
    font-size: 14px;
}
.searchBtn {
    margin-top: 10px;
}
.table-con {
    text-align: right;
    margin-top: 10px;
}
.el-table >>> .el-table__body-wrapper {
    height: 600px;
    overflow-y: auto;
}
.el-table >>> .el-table__row td {
    height: 40px;
    width: 30px;
    padding: 0;
}
.el-table >>> .el-table__row .cell {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.account-all >>> .el-dialog__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}
.account-all >>> .el-dialog__wrapper .el-dialog {
    margin: 0 !important;
    width: 500px;
}
.account-all >>> .el-tree {
    height: 600px;
    overflow-y: auto;
}
</style>