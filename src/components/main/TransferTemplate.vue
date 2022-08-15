<template>
    <div class="all table-all">
        <div class="rander-main">
            <!-- Base -->
            <div class="base-table">
                <div class="search-con" v-if="searchRander.length > 0">
                    <div class="search-container">
                        <div
                            class="search-item"
                            v-for="(item, index) in searchRander"
                            :key="index"
                        >
                            <div class="search-item-text">
                                {{ item.placeholder }}:
                            </div>
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
                                v-if="
                                    item.type === 'selects' ||
                                    item.type === 'select'
                                "
                                v-model="searchDataBackup[item.modelName]"
                                :placeholder="item.placeholder || 'select'"
                                :multiple="item.type === 'selects'"
                                :disabled="item.disabled"
                                clearable
                                :multiple-limit="
                                    item.maxlength ? item.maxlength : 0
                                "
                            >
                                <el-option
                                    v-for="option in item.options
                                        .constructor === String
                                        ? optionsAll[item.options]
                                        : item.options"
                                    :key="option.value"
                                    :label="option.label"
                                    :value="option.value || option.label"
                                ></el-option>
                                <el-option
                                    v-if="
                                        item.type === 'selects' && !item.noNone
                                    "
                                    value="None"
                                    label="None"
                                ></el-option>
                                <!-- <el-option v-if="item.type === 'select'" value="" label="All"></el-option> -->
                            </el-select>
                            <div v-if="item.type === 'dates'" class="dates">
                                <el-date-picker
                                    v-model="
                                        searchDataBackup[item.modelName[0]]
                                    "
                                    type="date"
                                    size="mini"
                                    :placeholder="'Select Start Date'"
                                    value-format="yyyy-MM-dd"
                                >
                                </el-date-picker>
                                -
                                <el-date-picker
                                    v-model="
                                        searchDataBackup[item.modelName[1]]
                                    "
                                    type="date"
                                    size="mini"
                                    :placeholder="'Select End Date'"
                                    value-format="yyyy-MM-dd"
                                >
                                </el-date-picker>
                            </div>
                            <!-- cascader级联选择器 -->
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
                    <el-button size="mini" type="primary" @click="searchFunc"
                        >Search</el-button
                    >
                </div>
                <el-table
                    :data="Base2"
                    :height="(40 * 10) + 48"
                    @selection-change="(val) => changeTransfer(val, 'base')"
                    ref="transferTable"
                    v-loading="loading"
                    border
                >
                    <el-table-column
                        type="selection"
                        width="42"
                        :selectable="isDisabled"
                    ></el-table-column>
                    <!-- 本地的tablecolumn，用于本地的查询 -->
                    <el-table-column
                        :prop="searchKey"
                        label="name"
                        v-if="!getBase"
                    >
                        <template
                            slot="header"
                            slot-scope="/* eslint-disable vue/no-unused-vars */ scope"
                        >
                            <div style="display: flex">
                                <div style="width: 70px">Name:</div>
                                <el-input v-model="search" size="mini" />
                            </div>
                        </template>
                    </el-table-column>
                    <!--  -->
                    <el-table-column
                        :min-width="item.width"
                        v-for="item in showRender"
                        :key="item.modelName"
                        :label="item.name"
                        :prop="item.modelName"
                    >
                        <template slot-scope="scope" v-if="scope.row">
                            <tableColumn
                                :scoped="scope"
                                :randerItems="item"
                            ></tableColumn>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagin table-all">
                    <el-pagination
                        background
                        layout="total,sizes,prev, pager, next,jumper"
                        :total="total"
                        :pager-count="5"
                        :page-size.sync="pageSize"
                        :current-page.sync="nowPage"
                        :page-sizes="[pageSize]"
                    ></el-pagination>
                </div>
            </div>
            <div class="iconCon">
                <div class="add-all-btn hover" v-if="selectAll">
                    All <i class="el-icon-arrow-right"></i>
                </div>
                <el-button
                    class="el-icon-arrow-right"
                    circle
                    type="primary"
                    :disabled="changeBaseList.length === 0"
                    @click="SelectedData"
                ></el-button>
                <el-button
                    :disabled="changeDataList.length === 0"
                    class="el-icon-arrow-left"
                    circle
                    type="danger"
                    @click="DeleteData"
                ></el-button>
            </div>
            <!-- data -->
            <div class="data-table">
                <div
                    class="search-con"
                    v-show="localSearchRander.length > 0"
                >
                    <div class="search-container">
                        <div
                            class="search-item"
                            v-for="(item, index) in localSearchRander"
                            :key="index"
                        >
                            <div class="search-item-text">
                                {{ item.placeholder }}:
                            </div>
                            <el-input
                                size="mini"
                                v-if="item.type === 'input'"
                                v-model="localSearchDataBackup[item.modelName]"
                                :maxlength="item.maxlength"
                                show-word-limit
                                :placeholder="item.placeholder || 'input'"
                            ></el-input>
                            <el-select
                                size="mini"
                                v-if="
                                    item.type === 'selects' ||
                                    item.type === 'select'
                                "
                                v-model="localSearchDataBackup[item.modelName]"
                                :placeholder="item.placeholder || 'select'"
                                :multiple="item.type === 'selects'"
                                :disabled="item.disabled"
                                clearable
                                :multiple-limit="
                                    item.maxlength ? item.maxlength : 0
                                "
                            >
                                <el-option
                                    v-for="option in item.options
                                        .constructor === String
                                        ? optionsAll[item.options]
                                        : item.options"
                                    :key="option.value"
                                    :label="option.label"
                                    :value="option.value || option.label"
                                ></el-option>
                                <el-option
                                    v-if="
                                        item.type === 'selects' && !item.noNone
                                    "
                                    value="None"
                                    label="None"
                                ></el-option>
                                <!-- <el-option v-if="item.type === 'select'" value="" label="All"></el-option> -->
                            </el-select>
                            <div v-if="item.type === 'dates'" class="dates">
                                <el-date-picker
                                    v-model="
                                        localSearchDataBackup[item.modelName[0]]
                                    "
                                    type="date"
                                    size="mini"
                                    :placeholder="'Select Start Date'"
                                    value-format="yyyy-MM-dd"
                                >
                                </el-date-picker>
                                -
                                <el-date-picker
                                    v-model="
                                        localSearchDataBackup[item.modelName[1]]
                                    "
                                    type="date"
                                    size="mini"
                                    :placeholder="'Select End Date'"
                                    value-format="yyyy-MM-dd"
                                >
                                </el-date-picker>
                            </div>
                            <!-- cascader级联选择器 -->
                            <el-cascader
                                v-if="item.type === 'cascader'"
                                v-model="localSearchDataBackup[item.modelName]"
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
                                @change="(value) => cascaderChange(value, item,'local')"
                                size="mini"
                            ></el-cascader>
                        </div>
                    </div>
                    <el-button size="mini" type="primary" @click="searchFunc('local')"
                        >Search</el-button
                    >
                </div>
                <el-table
                    :data="nowPageData"
                    row-key="id2"
                    :height="(40 * 10) + 48"
                    @selection-change="(val) => changeTransfer(val, 'data')"
                    :ref="sign"
                    border
                >
                    <el-table-column
                        type="selection"
                        width="50"
                    ></el-table-column>
                    <el-table-column
                        :prop="searchKey"
                        label="Name"
                        v-if="!dataRander"
                    >
                        <template slot-scope="scope">
                            <div>
                                <div>{{ scope.row.title }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :min-width="item.width || 120"
                        v-for="item in dataRander"
                        :key="item.id2"
                        :label="item.name"
                        :prop="item.modelName"
                    >
                        <template slot-scope="scope">
                            <div v-if="item.editor" style="width:100%;height:100%">
                                <div v-if="item.type === 'checkbox'" class="checkbox-con">
                                    <p style="height: 5px"></p>
                                    <el-checkbox
                                        :true-label="item.aloneLimit.on"
                                        :false-label="item.aloneLimit.off"
                                        v-model="scope.row[item.modelName]"
                                    ></el-checkbox>
                                </div>
                                <el-input
                                    v-if="
                                        item.type === 'input' ||
                                        item.type === 'textarea'
                                    "
                                    v-model="scope.row[item.modelName]"
                                    size="mini"
                                    :rows="8"
                                    :type="
                                        item.type === 'input'
                                            ? 'text'
                                            : 'textarea'
                                    "
                                    show-word-limit
                                    :maxlength="
                                        item.maxlength ||
                                        (item.type === 'input' ? '3' : '250')
                                    "
                                    :placeholder="item.placeholder"
                                    @input="
                                        (val) =>
                                            formatLimit(val, item, scope.row)
                                    "
                                ></el-input>
                            </div>
                            <tableColumn
                            v-else
                                :scoped="scope"
                                :randerItems="item"
                            ></tableColumn>
                        </template>
                    </el-table-column>
                    <el-table-column :prop="searchKey" label="Sort" width="60px" v-if="sortable">
                        <template slot-scope="scope">
                            <div class="right-table-row">
                                <i class="el-icon-rank move"></i>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagin table-all" v-if="localSearchRander.length > 0">
                    <el-pagination
                        background
                        layout="total,sizes,prev, pager, next,jumper"
                        :total="showData && showData.length"
                        :pager-count="5"
                        :page-size.sync="pageSize"
                        :current-page.sync="localPageNum"
                        :page-sizes="[pageSize]"
                    ></el-pagination>
                </div>
            </div>
            <!-- <div class="iconCon">
                <el-button
                    :disabled="changeDataList.length === 0"
                    class="el-icon-delete"
                    circle
                    type="danger"
                    @click="DeleteData"
                ></el-button>
            </div> -->
        </div>
    </div>
</template>

<script>
import tableColumn from "./TableColumnTemplate.vue";
export default {
    components: { tableColumn },
    props: {
        transferBase: {
            type: Array,
            default() {
                return [];
            },
        },
        model: Array,
        sign: String,
        searchKey: String,
        repeat: Boolean,
        getBase: Function,
        showRender: {
            type: Array,
            default() {
                return [];
            },
        },
        dataRander: {
            type: Array,
            default() {
                return [];
            },
        },
        searchRander: {
            type: Array,
            default() {
                return [];
            },
        },
        localSearchRander: {
            type: Array,
            default() {
                return [];
            },
        },
        pageSize: {
            type: Number,
            default() {
                return 15;
            },
        },
        //
        BasekeyID: {
            type: String,
            default: "id",
        },
        uploadFieldTransform: Array,
        localSearchFun:Function,
        selectAll:Boolean,
        sortable:{
            type:Boolean,
            default:true
        }
    },
    data() {
        return {
            search: "",
            totalHeight: 400,
            changeBaseList: [],
            changeDataList: [],
            count: 1,
            Base2: [],
            searchDataBackup: {},
            searchData: {},
            localSearchDataBackup: {},
            localSearchData: {},
            localPageNum:1,
            // total
            total: 0,
            nowPage: 1,
            loading: false,
        };
    },
    methods: {
        formatLimit(val, item, scope) {
            let format = item.format;
            if (format) {
                let reg = new RegExp(format);
                // console.log(reg);
                // console.log(reg.test(val));
                // console.log(val);
                if (reg.test(val)) {
                    scope[item.modelName] = "";
                }
            } else if (item.formatFunc) {
                if (!item.formatFunc(val)) {
                    scope[item.modelName] = "";
                }
            } else {
                return val;
            }
        },
        cascaderChange(value, OptionItem,local) {
            let names = OptionItem.trueModelName;
            let func = OptionItem.change;
            let searchDataBackup = local ? this.localSearchDataBackup : this.searchDataBackup
            if (value.length === 0) {
                searchDataBackup[names[0]] = "";
                searchDataBackup[names[1]] = "";
            }
            if (value.length != 0) {
                if (OptionItem.multiple) {
                    // 一级字段选中
                    value && (searchDataBackup[names[0]] = value[0][0]);
                    // 二级字段选中
                    value &&
                        (searchDataBackup[names[1]] = value.map(
                            (i) => i[1]
                        ));
                } else {
                    value &&
                        value.some((item, index) => {
                            searchDataBackup[names[index]] = item;
                        });
                }
            }
            func && func(OptionItem)
            // let data = func ? func(OptionItem) : "";
            // data && (this.searchRanderLocal = data);
        },
        searchFunc(local) {
            // 日期校验
            local = local === 'local'?true:false
            let state = false;
            let searchRander = local ? this.localSearchRander:this.searchRander
            searchRander.some((item) => {
                let backupData = local ? this.localSearchDataBackup:this.searchDataBackup;
                // date的单独校验规则
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
                    }
                }
            });
            if (state) return true;
            if(local){
                this.localSearchData = { ...this.localSearchDataBackup }
                return true
            }
            this.searchData = { ...this.searchDataBackup };
            this.getBaseLocal();
        },
        async getBaseLocal() {
            let config = {
                pageNum: this.nowPage,
                ...this.searchData,
            };
            Object.keys(config).some((item) => {
                if (config[item] && config[item].constructor === Array) {
                    config[item] = config[item].toString();
                }
            });
            this.loading = true;
            let data = await this.getBase(config);
            this.Base2 = data.list;
            this.total = data.total;
            this.loading = false;
        },
        isDisabled(row) {
            if (!this.repeat) {
                let state = true;
                this.data && this.data.some((item) => {
                    if (item[this.BasekeyID] === row[this.BasekeyID]) {
                        state = false;
                    }
                });
                return state;
            } else {
                return true;
            }
        },
        // 左右侧的表的选中
        changeTransfer(val, type) {
            if (type === "base") {
                this.changeBaseList = val;
            } else {
                this.changeDataList = val;
            }
        },
        // 左侧添加到右侧
        SelectedData() {
            let data = this.$deepCopy(this.changeBaseList);
            data.some((item) => {
                item.id2 = "";
                // 特殊字段转化
                if (this.uploadFieldTransform) {
                    this.uploadFieldTransform.some((item2) => {
                        item[item2.BaseField] &&
                            !item[item2.UploadField] &&
                            (item[item2.UploadField] = item[item2.BaseField]);
                        !item[item2.BaseField] &&
                            item[item2.UploadField] &&
                            (item[item2.BaseField] = item[item2.UploadField]);
                    });
                }
                // Base字段中不包含dataRander字段的加上
                if (this.dataRander) {
                    this.dataRander.some((item2) => {
                        // 不包含的字段初始化
                        if (
                            !item[item2.modelName] &&
                            item2.editor &&
                            item[item2.modelName] !== 0 &&
                            item[item2.modelName] !== false
                        ) {
                            // 不存在字段的话 统一字符串初始化
                            if (
                                !item[item2.modelName] &&
                                item[item2.modelName] != 0 &&
                                item[item2.modelName] != false
                            ) {
                                item[item2.modelName] = "";
                                if (item2.type === "checkbox") {
                                    item[item2.modelName] = 0;
                                }
                                item2.default &&
                                    (item[item2.modelName] = item2.default);
                            }
                        }
                    });
                }
            });
            // this.$set(this,'data',[...this.data, ...data])
            this.data = [...this.data, ...data];
            // 刷新左侧table
            // this.$refs.transferTable.doLayout()
            this.$refs.transferTable.clearSelection();
        },
        DeleteData() {
            let data = [];
            this.data.some((item) => {
                let state = true;
                this.changeDataList.some((item2) => {
                    if (item.id2 === item2.id2) {
                        state = false;
                    }
                });
                if (state) {
                    data.push(item);
                }
            });
            this.data = data;
            this.$refs[this.sign].clearSelection();
        },
    },
    computed: {
        Base() {
            let a = [];
            this.transferBase.some((item) => {
                if (
                    item[this.searchKey].toString().indexOf(this.search) != -1
                ) {
                    a.push(item);
                }
            });
            return a;
        },
        data: {
            get() {
                // let models = JSON.parse(JSON.stringify(this.model));
                // models.some((item) => {
                //     item.id2 = this.count;
                //     this.count++;
                // });
                return this.model;
            },
            set(val) {
                this.$emit("update:model", val);
            },
        },
        showData(){
            let array = this.localSearchRander.length > 0? this.localSearchFun(this.localSearchData):this.data
            return array
        },
        nowPageData(){
            let array = this.localSearchRander.length > 0? this.showData.slice((this.pageSize*(this.localPageNum-1)),(this.pageSize*this.localPageNum)):this.showData
            return array
        },
        optionsAll() {
            return this.$store.state.optionBase;
        },
        searchRanderLocal: {
            get() {
                return this.searchRander;
            },
            set(val) {
                this.$emit("update:searchRander", val);
            },
        },
    },
    watch: {
        nowPage: {
            handler() {
                this.getBaseLocal();
            },
        },
        Base: {
            handler(val) {
                this.Base2 = val;
            },
            deep: true,
        },
        data: {
            handler() {
                // let data = this.$deepCopy(this.data);
                this.data && this.data.some((item) => {
                    if (!item.id2) {
                        item.id2 = this.count;
                        this.count++;
                    }
                });
                // // 赋值showData
                // {
                //     this.showData = this.data?this.data.filter(i => {
                //         let state = false
                //         Object.keys(this.localSearchData).some(item => {
                //             if(i[item].indexOf(this.localSearchData[item]) != -1){
                //                 state = true   
                //             }  
                //         })
                //         return state
                //     }) : []
                // }
                // this.data = data
            },
        },
    },
    async created() {
        // 初次加载
        if (this.getBase) {
            this.getBaseLocal();
        }
        // search 初始化
        this.searchRanderLocal.some((item) => {
            // 单个item多个渲染modelName
            if (item.type === "dates") {
                item.modelName.some((modelItem) => {
                    this.$set(this.searchData, modelItem, "");
                    this.$set(this.searchDataBackup, modelItem, "");
                });
                return false;
            }
            // cascader类型提前录入多字段
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
    },
    mounted() {
        // console.log(this.$refs);
        this.sortable &&
        this.$sortable.create(
            this.$refs[this.sign].$el.querySelectorAll("tbody")[0],
            {
                animation: 200,
                forceFallback: true,
                handle: ".move",
                onEnd: (evt) => {
                    // 循环获取内容lable值返回arrary
                    const item = this.data[evt.oldIndex];
                    this.data.splice(evt.oldIndex, 1);
                    this.data.splice(evt.newIndex, 0, item);
                },
            }
        );
    },
};
</script>

<style scoped>
.rander-main {
    display: flex;
}
.base-table,.data-table{
    width: 450px;
}
.add-all-btn{
    border-radius: 50%;
    background-color: #409EFF;
    font-size: 12px;
    height: 40px;
    width: 40px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
}
.el-table {
    border: 1px solid rgba(0, 0, 0, 0.2);
    min-width: 200px;
    margin-top: 10px;
}
.iconCon {
    display: flex;
    flex-direction: column;
    width: 80px;
    justify-content: center;
    align-items: center;
    font-size: 20px;
}
.iconCon .el-button {
    margin: 10px 0;
}
.right-table-row {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}
.move {
    cursor: pointer;
}
/* table的checkbox的禁用后可选中的bug修复 */
.el-table >>> .el-checkbox__input,
.el-table >>> .el-checkbox__inner {
    height: 14px;
    display: block;
}
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
/* search */
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
.table-all,
.search-con {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin: 10px 0 0 0;
    padding: 10px 20px;
    background-color: white;
}
/* table */
.data-table {
    display: flex;
    flex-direction: column;
}
.checkbox-con{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}
/* pagin */
.pagin {
    text-align: left;
}
</style>