<template>
    <div class="workout-editor">
        <page-editer
            :render="randerArray"
            :modelData.sync="data"
            :fromProject="true"
            ref="editerPage"
            draftMustFields="workoutName"
            :handlerSave="handlerSave"
        ></page-editer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data: {},
            randerArray: [
                {
                    key: "Workout Name",
                    type: "input",
                    modelName: "workoutName",
                    must: true,
                    maxlength: "50",
                },
                {
                    key: "Description",
                    modelName: "description",
                    type: "textarea",
                    must: true,
                    maxlength: "255",
                },
                {
                    key: "Tablet Cover Image",
                    type: "image",
                    modelName: "imgCoverTablet",
                    dirKey: "project-workout-tablet-cover",
                    must: true,
                    format: "png",
                },
                {
                    key: "Phone Cover Image",
                    type: "image",
                    modelName: "imgCoverPhone",
                    dirKey: "project-workout-phone-cover",
                    must: true,
                    format: "png",
                },
                {
                    key: "Tablet Detail Image",
                    type: "image",
                    modelName: "imgDetailPhone",
                    dirKey: "project-workout-tablet-detail",
                    must: true,
                    format: "png",
                },
                {
                    key: "Phone Detail Image",
                    type: "image",
                    modelName: "imgDetailTablet",
                    dirKey: "project-workout-phone-detail",
                    must: true,
                    format: "png",
                },
                {
                    key: "Type",
                    type: "select",
                    modelName: "workoutType",
                    must: true,
                    options: "workoutType",
                    change: (val) => {
                        let randerArray = this.$deepCopy(this.randerArray);
                        randerArray.some((item) => {
                            if (item.key === "Difficulty") {
                                item.noshow = val === "Yoga" ? false : true;
                            }
                            if (item.key === "Intensity") {
                                item.noshow = val === "Fit" ? false : true;
                            }
                        });
                        this.randerArray = randerArray;
                    },
                },
                {
                    key: "Intensity",
                    type: "select",
                    modelName: "intensity",
                    must: true,
                    noshow: true,
                    options: "intensity",
                    uploadLabel: true,
                },
                {
                    key: "Difficulty",
                    type: "select",
                    modelName: "difficulty",
                    must: true,
                    options: "difficulty",
                    noshow: true,
                    uploadLabel: true,
                },
                {
                    key: "Exercise List",
                    type: "transfer",
                    modelName: "exerciseList",
                    repeat: true,
                    must:true,
                    BasekeyID: "id",
                    showRender: [
                        {
                            name: "Display Name",
                            modelName: "displayName",
                            type: "custom",
                            custom: (row) => {
                                let text = `${row.displayName}${
                                    row.combination === 'Left & Right'
                                        ? row.concatName
                                        : ""
                                }`;
                                return row.exerciseType ? text : "";
                            },
                        },
                        {
                            name: "Exercise Type",
                            modelName: "exerciseTypes",
                            type: "custom",
                            custom: (row) => {
                                let text = `${row.exerciseType}${
                                    row.exerciseSubType
                                        ? "-" + row.exerciseSubType
                                        : ""
                                }`;
                                return row.exerciseType ? text : "";
                            },
                        },
                    ],
                    searchRander: [
                        {
                            placeholder: "Display Name",
                            modelName: "displayName",
                            type: "input",
                            maxlength: 50,
                        },
                        {
                            placeholder: "Exercise Type",
                            modelName: "exerciseTypes",
                            trueModelName: [
                                "exerciseType",
                                "exerciseSubTypeArr",
                            ],
                            must: true,
                            type: "cascader",
                            multiple: true,
                            options: "exerciseType",
                            change: (item) => {
                                // 获取主属性
                                let type =
                                    this.$refs.editerPage.$refs.transfer[0]
                                        .searchDataBackup[
                                        item.trueModelName[0]
                                    ];
                                if (item.multiple) {
                                    // 获取options
                                    let options = item.options;
                                    if (options.constructor === String) {
                                        options = this.$deepCopy(
                                            this.$store.state.optionBase[
                                                options
                                            ]
                                        );
                                    }
                                    options.some((item2) => {
                                        item2.disabled = true;
                                        if (item2.value === type) {
                                            item2.disabled = false;
                                        }
                                        if (type.length === 0) {
                                            item2.disabled = false;
                                        }
                                    });
                                    item.options = options;
                                }
                            },
                        },
                    ],
                    dataRander: [
                        {
                            name: "Display Name",
                            modelName: "displayName",
                            type: "custom",
                            custom: (row) => {
                                let text = `${row.displayName}${
                                    row.combination === 'Left & Right'
                                        ? row.concatName
                                        : ""
                                }`;
                                return row.exerciseType ? text : "";
                            },
                        },
                        {
                            name: "Met",
                            modelName: "met",
                            type: "text",
                        },
                        {
                            name: "Exercise Type",
                            modelName: "exerciseTypes",
                            type: "custom",
                            custom: (row) => {
                                let text = `${row.exerciseType}${
                                    row.exerciseSubType
                                        ? "-" + row.exerciseSubType
                                        : ""
                                }`;
                                return row.exerciseType ? text : "";
                            },
                        },
                        {
                            width:120,
                            name: "Exercise Time",
                            modelName: "duration",
                            editor: true,
                            must: true,
                            type: "input",
                            formatFunc: (value) => {
                                let state = false;
                                if (
                                    /^[0-9]{0,3}$/.test(value) &&
                                    Number(value) <= 100 &&
                                    Number(value) >= 1
                                ) {
                                    state = true;
                                }
                                return state;
                            },
                            default: 30,
                        },
                        {
                            width:120,
                            name: "Rest Time",
                            modelName: "restDuration",
                            editor: true,
                            type: "input",
                            must: true,
                            formatFunc: (value) => {
                                let state = false;
                                if (
                                    /^[0-9]{0,3}$/.test(value) &&
                                    Number(value) <= 100 &&
                                    Number(value) >= 0
                                ) {
                                    state = true;
                                }
                                return state;
                            },
                            default: 10,
                        },
                    ],
                    uploadFieldTransform: [
                        { BaseField: "id", UploadField: "regularExerciseId" },
                    ],
                    getBase: (config) => {
                        config = config || {};
                        return new Promise((resolve) => {
                            config = {
                                pageSize: 15,
                                pageNum: 1,
                                status: 1,
                                ...config,
                            };
                            this.$request(
                                "/res/regularExercise/page",
                                config,
                                (res) => {
                                    resolve(res.data.data);
                                },
                                "get",
                                false,
                                false
                            );
                        });
                    },
                },
                {
                    key: "Keyword",
                    type: "selects",
                    modelName: "keywordIdList",
                    labelName: "keyword",
                    idName: "keywordId",
                    remote: true,
                    remoteMethod: (query, loadName, optionName) => {
                        this.$refs.editerPage.loadAll[loadName] = true;
                        this.$request(
                            "/res/keyword/list",
                            { keyword: query },
                            (res) => {
                                this.$refs.editerPage.loadAll[loadName] = false;
                                let data = res.data.data;
                                this.$refs.editerPage.optionsAll[optionName] =
                                    data.map((item) => {
                                        return {
                                            value: item.id,
                                            label: item.keyword,
                                        };
                                    });
                            },
                            "get",
                            false,
                            false
                        );
                    },
                    options: "keywords",
                },
                {
                    key: "Calorie",
                    type: "computed",
                    modelName: "calorie",
                    must: true,
                    computedFunc(dataObj) {
                        let exerciseList = dataObj.exerciseList;
                        if (exerciseList && exerciseList.length > 0) {
                            let Calories = 0;
                            exerciseList.some((exerciseItem) => {
                                let met = exerciseItem.met || 0;
                                met = Number(met);
                                // time字段名存疑，乘还是乘分母存疑
                                Calories +=
                                    ((met * 75) / 3600) * exerciseItem.duration;
                            });
                            Calories = Math.round(Calories);
                            return { model: Calories };
                        }
                        return false;
                    },
                    errorText:'The exercise time or quantity is set incorrectly, please reset',
                    formatFunc: (value) => {
                        let state = false;
                        if (
                            /^[0-9]{0,4}$/.test(value) &&
                            Number(value) <= 1000 &&
                            Number(value) >= 1
                        ) {
                            state = true;
                        }
                        return state;
                    },
                },
                {
                    key: "Time",
                    type: "computed",
                    modelName: "duration",
                    must: true,
                    computedFunc(dataObj) {
                        let exerciseList = dataObj.exerciseList;
                        if (exerciseList && exerciseList.length > 0) {
                            let AllTime = 0;
                            exerciseList.some((exerciseItem) => {
                                let exerciseTime = exerciseItem.duration || 0;
                                let restTime = exerciseItem.restDuration || 0;
                                restTime = Number(restTime);
                                exerciseTime = Number(exerciseTime);
                                // time字段名存疑，乘还是乘分母存疑
                                AllTime += exerciseTime + restTime;
                            });
                            // 向下取整,并且转化为分
                            AllTime = Math.floor(AllTime/60);
                            return { model: AllTime };
                        }
                        return false;
                    },
                    errorText:'The exercise time or rest time is set incorrectly, please reset',
                    formatFunc: (value) => {
                        let state = false;
                        if (
                            /^[0-9]{0,4}$/.test(value) &&
                            Number(value) <= 100 &&
                            Number(value) >= 1
                        ) {
                            state = true;
                        }
                        return state;
                    },
                },
                {
                    key: "Subscription",
                    type: "checkbox",
                    modelName: "subscription",
                    aloneLimit: {
                        on: 1,
                        off: 0,
                    },
                    defaultData: 0,
                },
            ],
        };
    },
    methods: {
        handlerSave(data) {
            // 对于exerciselist left right单独校验
            {
                let list = data.exerciseList;
                let checkArray = {};
                list.filter((s) => s.combination === "Left & Right").some(
                    (item) => {
                        let cover = false;
                        for (let i of Object.keys(checkArray)) {
                            if (i === item.displayName) {
                                cover = true;
                            }
                        }
                        // 不包含就初始化该字段
                        if (!cover) {
                            checkArray[item.displayName] = {
                                left: 0,
                                right: 0,
                            };
                        }
                        // 判断为left right
                        if (item.concatName === "(Right)") {
                            checkArray[item.displayName].right += 1;
                        }
                        if (item.concatName === "(Left)") {
                            checkArray[item.displayName].left += 1;
                        }
                    }
                );
                // 最后校验checkArray
                let checkError = false;
                Object.keys(checkArray).some((item) => {
                    if (checkArray[item].left != checkArray[item].right) {
                        checkError = true;
                    }
                });
                if (checkError) {
                    this.$message({
                        message: "Exercise must be paired",
                        type: "warning",
                    });
                    return true;
                }
            }
            this.$refs.editerPage.pageLoadState = true;
            let path = this.$refs.editerPage.add
                ? `/proj/workout/add`
                : `/proj/workout/update`;
            this.$request(
                path,
                data,
                (res) => {
                    this.$refs.editerPage.pageLoadState = false;
                    if (res.data.code === 200)
                        this.$router.push(this.backRouter || `/workout-list-proj`);
                },
                "post",
                false,
                true
            );
        },
    },
};
</script>

<style scoped>
/* .workout-editor >>> .rander-main{
    flex-direction: column;
} */
</style>