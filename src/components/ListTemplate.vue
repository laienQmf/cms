<template>
    <div class="all">
        <div class="title">{{ pageName }} List</div>
        <div class="search-con" v-if="searchRanderLocal.length > 0">
            <div class="search-container">
                <div
                    class="search-item"
                    v-for="(item, index) in searchRanderLocal"
                    :key="index"
                >
                    <div class="search-item-text">{{ item.placeholder }}:</div>
                    <el-input
                        size="mini"
                        v-if="item.type === 'input'"
                        v-model="searchDataBackup[item.modelName]"
                        :maxlength="item.maxlength"
                        show-word-limit
                        :placeholder="item.placeholder || 'input'"
                    ></el-input>
                    <el-select
                        size="mini"
                        v-if="item.type === 'selects' || item.type === 'select'"
                        v-model="searchDataBackup[item.modelName]"
                        :placeholder="item.placeholder || 'select'"
                        :multiple="item.type === 'selects'"
                        :disabled="item.disabled"
                        clearable
                        :multiple-limit="item.maxlength ? item.maxlength : 0"
                    >
                        <el-option
                            v-for="option in item.options.constructor === String
                                ? optionsAll[item.options]
                                : item.options"
                            :key="option.value"
                            :label="option.label"
                            :value="
                                item.uploadLabel ? option.label : option.value
                            "
                        ></el-option>
                        <el-option
                            v-if="item.type === 'selects' && !item.noNone"
                            value="None"
                            label="None"
                        ></el-option>
                        <!-- <el-option v-if="item.type === 'select'" value="" label="All"></el-option> -->
                    </el-select>
                    <div v-if="item.type === 'dates'" class="dates">
                        <el-date-picker
                            v-model="searchDataBackup[item.modelName[0]]"
                            type="date"
                            size="mini"
                            :placeholder="'Select Start Date'"
                            value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                        <div
                            style="
                                width: 10px;
                                height: 1px;
                                background-color: black;
                            "
                        ></div>
                        <el-date-picker
                            v-model="searchDataBackup[item.modelName[1]]"
                            type="date"
                            size="mini"
                            :placeholder="'Select End Date'"
                            value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                        <div class="hot-key">
                            <span @click="selectDate(item.modelName, 1)"
                                >Today</span
                            >
                            <span @click="selectDate(item.modelName, 3)"
                                >Three Days</span
                            >
                            <span @click="selectDate(item.modelName, 7)"
                                >Last Week</span
                            >
                        </div>
                    </div>
                    <!-- cascader??????????????? -->
                    <el-cascader
                        v-if="item.type === 'cascader'"
                        v-model="searchDataBackup[item.modelName]"
                        :options="
                            item.options &&
                            (item.options.constructor === String
                                ? optionsAll[item.options]
                                : item.options)
                        "
                        :props="
                            item.props || {
                                expandTrigger: 'hover',
                                multiple: item.multiple,
                            }
                        "
                        clearable
                        @change="(value) => cascaderChange(value, item)"
                        size="mini"
                    ></el-cascader>
                </div>
            </div>
            <el-button size="mini" type="primary" @click="search"
                >Search</el-button
            >
        </div>
        <div class="table-all">
            <div class="func-btns">
                <el-button
                    size="small"
                    style="background-color: var(--yellow); color: white"
                    @click="customAdd ? customAdd() : toDetail()"
                    v-show="btnItemVerify('', { sign: 'add' })"
                    >Add {{ pageName }}</el-button
                >
                <el-button
                    size="small"
                    v-for="btnI in mainBtnsRander || []"
                    :key="btnI.name"
                    :type="btnI.type"
                    v-show="btnItemVerify('', btnI)"
                    :style="`background-color:${btnI.bgc}; color: ${btnI.color}`"
                    @click="btnI.click()"
                    >{{ btnI.name }}</el-button
                >
                <el-button
                    size="small"
                    v-for="btnI in headBtns"
                    :key="btnI.name"
                    :type="btnI.type"
                    :style="`background-color:${btnI.bgc}; color: ${btnI.color}`"
                    v-show="btnItemVerify(headBtnsString, btnI)"
                    @click="batchHandle(btnI)"
                    :disabled="tableSelect.length === 0"
                    >{{ btnI.name }}</el-button
                >
            </div>
            <el-table
                :data="tableData"
                stripe
                header-row-class-name="tableHeadr"
                v-loading="tableLoad"
                @selection-change="handleSelectionChange"
                border
                ref="libraryTable"
                height="448px"
                row-key="id"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                    label="Id"
                    prop="id"
                    width="55"
                ></el-table-column>
                <el-table-column
                    min-width="140"
                    label="phone image"
                    v-for="item in tableRander"
                    :key="item.modelName"
                    :width="item.width || (item.type == 'option' && 260)"
                    :fixed="item.fixed"
                >
                    <template slot="header">
                        <div class="table--head-item" :title="item.viewName">
                            {{ item.viewName }}
                        </div>
                    </template>
                    <template slot-scope="scope">
                        <div class="table-cell">
                            <!-- ??????????????? -->
                            <div
                                class="table-input-text"
                                v-if="item.type === 'custom'"
                                :title="item.custom(scope.row)"
                            >
                                {{ item.custom(scope.row) }}
                            </div>
                            <!-- text?????? -->
                            <div
                                :class="`table-input-text ${item.jump && 'hover'}`"
                                v-if="item.type === 'text'"
                                :title="scope.row[item.modelName]"
                                @click="item.jump && $router.push(`/${pageName}-editor${fromProject?'-proj':''}?id=${scope.row.id}`)"
                                :style="item.jump ? 'color:#409eff':''"
                            >
                                {{ scope.row[item.modelName] }}
                            </div>
                            <!-- img?????? -->
                            <div
                                class="table-input-img"
                                v-if="item.type === 'img'"
                            >
                                <img
                                    :src="
                                        $store.state.default_file_url +
                                        scope.row[item.modelName]
                                    "
                                />
                            </div>
                            <!-- select?????? -->
                            <div
                                class="table-input-select"
                                v-if="item.type === 'select'"
                            >
                                {{
                                    $searchOptionName(
                                        optionsAll[item.options],
                                        scope.row[item.modelName]
                                    )
                                }}
                            </div>
                            <!-- option???????????? -->
                            <div
                                class="table-option"
                                v-if="item.type === 'option'"
                            >
                                <el-button
                                    v-for="btnI in optionsBtns"
                                    :key="btnI.name"
                                    :size="btnI.size || 'mini'"
                                    :type="btnI.type"
                                    v-show="
                                        btnItemVerify(
                                            item.funcs,
                                            btnI,
                                            scope.row.status,
                                            scope.row.compressionStatus
                                        )
                                    "
                                    @click="btnClickBefore(scope.row, btnI)"
                                    >{{ btnI.name }}</el-button
                                >
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-show="!sortable"
                background
                layout="total,sizes,prev, pager, next,jumper"
                :total="total"
                :pager-count="5"
                :page-size.sync="pageSize"
                :current-page.sync="nowPage"
                :page-sizes="[15]"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        mainBtnsRander: Array,
        headBtnsString: String, //??????????????????????????????
        permissionName: String,
        searchRander: {
            type: Array,
            default() {
                return [];
            },
        },
        tableRander: Array,
        getList: Function,
        customAdd: Function,
        pageNameTrue: String,
        fromProject: Boolean,
        sortable: Function,
        requestHead: {
            type: String,
        },
    },
    data() {
        return {
            pageName: "",
            requestHeadLocal: "res",
            optionsBtns: [
                {
                    name: "Detail",
                    type: "primary",
                    sign: "view",
                    click: (id) => this.toDetail(id),
                },
                {
                    name: "Enable",
                    type: "success",
                    sign: "enable",
                    click: (id) => this.Enable([id]),
                },
                {
                    name: "Disabled",
                    type: "info",
                    sign: "disabled",
                    click: (id) => this.Disable([id]),
                },
                {
                    name: "Delete",
                    type: "danger",
                    sign: "delete",
                    click: (id) => this.Delete([id]),
                },
                {
                    name: "Duplication",
                    type: "primary",
                    sign: "duplication",
                    click: (id) => this.toDetail(id, "duplication"),
                },
            ],
            headBtns: [
                {
                    name: "Batch Enable",
                    type: "success",
                    sign: "enables",
                },
                {
                    name: "Batch Disable",
                    type: "info",
                    sign: "disableds",
                },
                {
                    name: "Batch Delete",
                    type: "danger",
                    sign: "deletes",
                },
            ],
            pageSize: 15,
            total: 0,
            nowPage: 1,
            tableLoad: false,
            searchData: {},
            searchDataBackup: {},
            tableData: [],
            tableSelect: [],
            scriptOption: [],
        };
    },
    watch: {
        nowPage: {
            handler(val) {
                console.log("pageChange", val);
                this.getData();
            },
        },
        pageSize() {
            this.getData();
        },
    },
    computed: {
        searchRanderLocal: {
            get() {
                return this.searchRander;
            },
            set(val) {
                this.$emit("update:searchRander", val);
            },
        },
        optionsAll() {
            return this.$store.state.optionBase;
        },
        // ?????????????????????
        permission() {
            let field = this.permissionName || this.pageName;
            let returnData;
            try {
                if (this.fromProject) {
                    let id = sessionStorage.getItem("projectId");
                    let returnDataFather = this.$store.state.permissionPage.program[id] || {}
                    returnData = returnDataFather[field];
                } else {
                    returnData =
                        this.$store.state.permissionPage.resource[field];
                }
            } catch (errpr) {
                console.log(errpr);
            }
            return returnData || { add: true, editor: true, delete: true };
        },
    },
    methods: {
        // Date????????????
        selectDate(modelNames, key) {
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let time = date.getTime();
            if (key.constructor === Number) {
                key -= 1
                let fillZeroMonth = month < 10;
                let fillZeroDay = day < 10;
                this.searchDataBackup[modelNames[1]] = `${year}-${
                    fillZeroMonth ? "0" : ""
                }${month}-${fillZeroDay ? "0" : ""}${day}`;
                let DateNew = new Date(time - 24 * 3600 * 1000 * key);
                fillZeroMonth = DateNew.getMonth() + 1 < 10;
                fillZeroDay = DateNew.getDate() < 10;
                this.searchDataBackup[
                    modelNames[0]
                ] = `${DateNew.getFullYear()}-${fillZeroMonth ? "0" : ""}${
                    DateNew.getMonth() + 1
                }-${fillZeroDay ? "0" : ""}${DateNew.getDate()}`;
            }
        },
        // option??????????????????????????????
        async btnClickBefore(row, btnState) {
            // regularExercise???????????????
            let state = true;
            if (
                this.pageName === "regularExercise" &&
                row.combination === "Left & Right" &&
                btnState.sign != "view" &&
                btnState.sign != "duplication"
            ) {
                state = false;
                await this.$confirm(
                    "This operation will work on both Left and Right data.",
                    "",
                    { type: "warning" }
                ).then(() => (state = true));
            }
            if (state) {
                if (btnState.sign === "delete") {
                    let texts = 'This will permanently delete the data. Continue?'
                    if (this.pageName === "reminder") {
                        texts =
                            "This will permanently delete the data???and if the data is already used by the project, then the data will be removed from the project???Continue?";
                    }
                    this.$confirm(
                        texts,
                        "",
                        { type: "warning" }
                    )
                        .then(() => {
                            btnState.click(row.id);
                        })
                        .catch(() => {});
                } else {
                    btnState.click(row.id);
                }
            }
        },
        // ???????????????????????????
        cascaderChange(value, OptionItem) {
            let names = OptionItem.trueModelName;
            let func = OptionItem.change;
            if (value.length === 0) {
                this.searchDataBackup[names[0]] = "";
                this.searchDataBackup[names[1]] = "";
            }
            if (value.length != 0) {
                if (OptionItem.multiple) {
                    // ??????????????????
                    value && (this.searchDataBackup[names[0]] = value[0][0]);
                    // ??????????????????
                    value &&
                        (this.searchDataBackup[names[1]] = value.map(
                            (i) => i[1]
                        ));
                } else {
                    value &&
                        value.some((item, index) => {
                            this.searchDataBackup[names[index]] = item;
                        });
                }
            }
            let data = func ? func(OptionItem) : "";
            data && (this.searchRanderLocal = data)
        },
        // ????????????????????????????????????
        async batchHandle(btnItem) {
            let sign = btnItem.sign;
            let text = "";
            let texts = "";
            if (
                this.pageName === "animation" ||
                this.pageName === "regularExercise" ||
                this.pageName === "workout" 
            ) {
                if (sign === "enables") {
                    text = "Disabled";
                }
                if (sign === "disableds") {
                    text = "Enabled";
                }
                if (sign === "deletes") {
                    text = "Draft";
                }
                texts = `Data status other than '${text}' will be ignored`;
            }
            if (this.pageName === "sound" || this.pageName === "music") {
                if (sign === "enables") {
                    text = "Draft-Done";
                }
                if (sign === "deletes") {
                    text = "Draft";
                }
                texts = `Data status other than '${text}' will be ignored`;
            }
            if (this.pageName === "reminder") {
                texts =
                    "This will permanently delete the data???and if the data is already used by the project, then the data will be removed from the project???Continue?";
            }
            if (this.pageName === "quote" || this.pageName === "keyword") {
                if (sign === "deletes") {
                    texts = "This will permanently delete the data. Continue?";
                }
            }
            if (texts) {
                let answer;
                await this.$confirm(texts, "", { type: "warning" })
                    .then(() => {
                        answer = 1;
                    })
                    .catch(() => {
                        answer = 0;
                    });
                if (!answer) {
                    return true;
                }
            }
            {
                let list = this.tableSelect.map((i) => i.id);
                // ?????????
                if (sign === "enables") {
                    if (
                        this.pageName === "animation" ||
                        this.pageName === "regularExercise"
                    ) {
                        list = this.$cutArray(
                            this.tableSelect,
                            { key: "status", value: 2 },
                            "get"
                        ).map((i) => i.id);
                    }
                    if (
                        this.pageName === "sound" ||
                        this.pageName === "music"
                    ) {
                        // ????????????????????????
                        list = this.$cutArray(
                            this.tableSelect,
                            { key: "status", value: 0 },
                            "get"
                        );
                        list = this.$cutArray(
                            list,
                            { key: "compressionStatus", value: 2 },
                            "get"
                        ).map((i) => i.id);
                    }
                    if (list.length === 0) {
                        return;
                    }
                    this.Enable(list);
                }
                // ?????????
                if (sign === "disableds") {
                    if (
                        this.pageName === "animation" ||
                        this.pageName === "regularExercise"
                    ) {
                        list = this.$cutArray(
                            this.tableSelect,
                            { key: "status", value: 1 },
                            "get"
                        ).map((i) => i.id);
                    }
                    if (list.length === 0) {
                        return;
                    }
                    this.Disable(list);
                }
                // ?????????
                if (sign === "deletes") {
                    if (
                        this.pageName === "animation" ||
                        this.pageName === "regularExercise"
                    ) {
                        list = this.$cutArray(
                            this.tableSelect,
                            { key: "status", value: 0 },
                            "get"
                        ).map((i) => i.id);
                    }
                    if (
                        this.pageName === "sound" ||
                        this.pageName === "music"
                    ) {
                        list = this.$cutArray(
                            this.tableSelect,
                            { key: "status", value: 0 },
                            "get"
                        ).map((i) => i.id);
                    }
                    if (list.length === 0) {
                        return;
                    }
                    this.Delete(list);
                }
            }
        },
        // ?????????????????????????????????
        btnItemVerify(funcs, itemProperty, status, status2) {
            let state = true,
                sign = itemProperty.sign;
            // 1.??????????????????????????????????????????????????????
            if (funcs && funcs.indexOf(sign) === -1) {
                state = false;
            }
            // 2.??????????????????????????????
            {
                let permission = this.permission;
                // ??????????????????
                if (
                    (sign === "duplication" ||
                        sign === "add" ||
                        sign === "adds") &&
                    !permission.add
                ) {
                    state = false;
                }
                // ??????????????????
                if (
                    (sign === "delete" || sign === "deletes") &&
                    !permission.delete
                ) {
                    state = false;
                }
                // ??????????????????
                if (
                    (sign === "enable" ||
                        sign === "disabled" ||
                        sign === "enables" ||
                        sign === "disableds") &&
                    !permission.editor
                ) {
                    state = false;
                }
                // ??????????????????
                if (sign === "view" && !permission.view) {
                    state = false;
                }
            }
            // 3.????????????????????????????????????????????????????????????????????????????????????????????????
            // 0?????????????????????
            if (status || status === 0) {
                if (this.pageName === "animation" || this.pageName === "workout") {
                    if (
                        (status === 0 &&
                            (sign === "view" || sign === "delete")) ||
                        (status === 1 && (sign === "view" || sign === "disabled")) ||
                        (status === 2 && (sign === "view" || sign === "enable"))
                    ) {
                        1;
                    } else {
                        state = false;
                    }
                }
                if (this.pageName === "regularExercise") {
                    if (
                        (status === 0 &&
                            (sign === "view" ||
                                sign === "delete" ||
                                sign === "duplication")) ||
                        (status === 1 &&
                            (sign === "view" ||
                                sign === "disabled" ||
                                sign === "duplication")) ||
                        (status === 2 &&
                            (sign === "view" ||
                                sign === "enable" ||
                                sign === "duplication"))
                    ) {
                        1;
                    } else {
                        state = false;
                    }
                }
                if (this.pageName === "sound" || this.pageName === "music") {
                    // ???sound??? status2 ???compressionStatus
                    if (
                        (status === 0 &&
                            (sign === "view" || sign === "delete")) ||
                        (status === 0 && status2 === 2 && sign === "enable") ||
                        (status === 1 && sign === "view")
                    ) {
                        1;
                    } else {
                        state = false;
                    }
                }
                if (this.pageName === "playlist") {
                    if (
                        (status === 2 &&
                            (sign === "view" ||
                                sign === "enable" ||
                                sign === "delete")) ||
                        (status === 1 && (sign === "view" || sign === "disabled"))
                    ) {
                        1;
                    } else {
                        state = false;
                    }
                }
            }
            return state;
        },
        search() {
            // ????????????
            let state = false;
            this.searchRander.some((item) => {
                let backupData = this.searchDataBackup;
                // date?????????????????????
                if (
                    item.type === "dates" &&
                    backupData[item.modelName[0]] &&
                    backupData[item.modelName[1]]
                ) {
                    let start = Number(
                        backupData[item.modelName[0]].replaceAll("-", "")
                    );
                    let end = Number(
                        backupData[item.modelName[1]].replaceAll("-", "")
                    );
                    if (start > end) {
                        this.$message({
                            message:
                                "Start time cannot be greater than end time",
                            type: "warning",
                        });
                        state = true;
                        return true;
                    }
                }
            });
            if (state) return true;
            this.searchData = { ...this.searchDataBackup };
            this.getData();
        },
        toDetail(id, type) {
            // ??????????????????
            sessionStorage.setItem(this.pageName, this.nowPage);
            this.$router.push(
                `/${this.pageName}-editor${this.fromProject?'-proj':''}?id=${id ? id : "add"}${
                    type ? "&" + type + "=" + type : ""
                }`
            );
        },
        handleSelectionChange(val) {
            this.tableSelect = val;
        },
        async Enable(idList) {
            this.$request(
                `/${this.requestHeadLocal}/${this.pageName}/enable`,
                { idList },
                (res) => {
                    if (res.data.code === 200) {
                        this.getData();
                    }
                }
            );
        },
        async Disable(idList) {
            this.$request(
                `/${this.requestHeadLocal}/${this.pageName}/disable`,
                { idList },
                (res) => {
                    if (res.data.code === 200) {
                        this.getData();
                    }
                }
            );
        },
        async Delete(idList) {
            this.$request(
                `/${this.requestHeadLocal}/${this.pageName}/del`,
                { idList },
                (res) => {
                    if (res.data.code === 200) {
                        this.getData();
                    }
                }
            );
        },
        defaultGetList(data) {
            return new Promise((resolve) => {
                this.$request(
                    `/${this.requestHeadLocal}/${this.pageName}/page`,
                    data,
                    (res) => {
                        resolve(res);
                    },
                    "get",
                    false,
                    false
                );
            });
        },
        async getData() {
            this.tableLoad = true;
            let uploadData = {
                ...this.searchData,
                pageNum: this.nowPage,
                pageSize: this.pageSize,
            };
            Object.keys(uploadData).some((item) => {
                if (
                    uploadData[item] &&
                    uploadData[item].constructor === Array
                ) {
                    uploadData[item] = uploadData[item].toString();
                }
            });
            let res = this.getList
                ? await this.getList(uploadData)
                : await this.defaultGetList(uploadData);
            this.tableLoad = false;
            if (res.data.code === 200) {
                this.tableData = res.data.data.list;
                // ??????????????????????????????????????????????????????pageNum???????????????????????????????????????list
                this.total = res.data.data.total || 0;
            }
        },
    },
    async created() {
        // ???????????????
        {
            // res?????????
            if (this.fromProject) {
                this.requestHeadLocal = "proj";
            }
            if (this.requestHead) {
                this.requestHeadLocal = this.requestHead;
            }
            // search ?????????
            this.searchRanderLocal.some((item) => {
                // ??????item????????????modelName
                if (item.type === "dates") {
                    item.modelName.some((modelItem) => {
                        this.$set(this.searchData, modelItem, "");
                        this.$set(this.searchDataBackup, modelItem, "");
                    });
                    return false;
                }
                // cascader???????????????????????????
                if (item.type === "cascader") {
                    item.trueModelName.some((name) => {
                        this.$set(this.searchData, name, "");
                        this.$set(this.searchDataBackup, name, "");
                    });
                }
                this.$set(this.searchData, item.modelName, "");
                this.$set(this.searchDataBackup, item.modelName, "");
                // if (item.type === "select") {
                //     this.searchDataBackup[item.modelName] = "";
                // }
            });
            // pageName?????????
            this.pageName =
                this.pageNameTrue ||
                this.$route.path.match(/\/([a-z A-Z]{1,})-/)[1];
            console.log(this.pageName);
        }
        // ??????????????????????????????????????????
        let PageCache = sessionStorage.getItem(this.pageName);
        console.log(PageCache);
        PageCache && (this.nowPage = Number(PageCache));
        sessionStorage.removeItem(this.pageName);
        // ?????????????????????
        this.getData();
    },
    mounted() {
        // ?????????????????????????????????
        if (this.sortable) {
            this.$sortable.create(
                this.$refs.libraryTable.$el.querySelectorAll("tbody")[0],
                {
                    animation: 200,
                    // handle: ".move",
                    forceFallback: true,
                    onEnd: (evt) => {
                        // ??????????????????lable?????????arrary
                        const item = this.tableData[evt.oldIndex];
                        this.tableData.splice(evt.oldIndex, 1);
                        this.tableData.splice(evt.newIndex, 0, item);
                        this.sortable(this.tableData);
                    },
                }
            );
        }
    },
};
</script>

<style scoped>
.el-table >>> .el-table__row * {
    text-transform: none;
}
.all {
    box-sizing: border-box;
    padding: 0 20px;
    text-align: left;
    margin-top: 15px;
    /* min-width: 1230px; */
}
.title {
    font-size: 20px;
    margin: 0px 0 10px;
    text-transform: capitalize;
}
.search-con {
    padding: 0 2px;
    text-align: center;
    /* box-shadow: 0 0 10px rgba(0,0,0,0.2); */
}
.search-container {
    display: flex;
    flex-wrap: wrap;
}
.search-item {
    display: flex;
    margin: 0 10px 7px 0;
    font-size: 13px;
    align-items: center;
}
.search-item-text {
    text-align: left;
    margin-right: 5px;
}
.search-con .el-select,
.search-con .el-cascader,
.search-con .el-input {
    width: 180px;
    margin-right: 10px;
}
/* ?????????dates*/
.dates {
    margin-right: 10px;
    display: flex;
    align-items: center;
}
.dates > .el-input {
    width: 170px;
    margin-right: 5px;
}
.dates > div {
    margin-right: 5px;
}
.dates > .hot-key span {
    font-size: 12px;
    color: #409eff;
}
.hot-key span {
    cursor: pointer;
    margin-right: 10px;
}
/* ??????????????? */
.cascaderCustom > .el-select {
    margin: 0;
}
.table-all,
.search-con {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-top: 10px;
    padding: 10px 20px;
    background-color: white;
}
/* ?????????????????? */
.func-btns {
    margin-bottom: 5px;
}
.func-btns > .el-button {
    text-transform: capitalize;
    margin: 0 10px 0 0;
}
/* ?????????????????????????????????  ??? ?????????????????? */
/* .el-table >>> .el-table__body-wrapper {
    height: 400px;
    overflow-y: auto;
} */
.el-table >>> .el-table__row td .table-cell {
    width: 100%;
    height: 100%;
}
.el-table >>> .el-table__row td {
    padding: 0;
}
.el-table >>> .el-table__row td .cell {
    height: 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}
/* .el-table >>> .cell {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
} */
/* ????????????????????? ??? ??????????????? */
.table--head-item {
}
.table-input-text,
.table-input-select,
.table-option,
.table--head-item {
    padding: 12px 4px;
    width: 100%;
    height: inherit;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 100%;
}
.table-input-img {
    width: 100%;
    height: 100%;
}
.table-input-img img {
    height: 100%;
    width: 100%;
    object-fit: contain;
}
/* ???????????????????????? */
.table-option .el-button {
    padding: 4px 10px;
    margin-right: 5px;
    margin-left: 0;
}
.el-pagination {
    text-align: right;
    margin: 10px 0;
}
</style>