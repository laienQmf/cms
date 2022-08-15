<template>
    <div class="custom">
        <page-editer
            :render="randerArray"
            :modelData.sync="data"
            :fromProject="true"
            ref="editerPage"
            :handlerSave="handlerSave"
            backRouter="/custom-list-proj"
            :getDetil="getDetil"
            pageNameTrue="custom"
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
                    key: "Exercise List",
                    type: "transfer",
                    modelName: "regularExerciseIdList",
                    repeat: true,
                    BasekeyID: "id",
                    sortable:false,
                    // selectAll:true,
                    showRender: [
                        {
                            name: "Id",
                            modelName: "id",
                            type: "text",
                            width: "50",
                        },
                        // {
                        //     name: "Exercise Name",
                        //     modelName: "exerciseName",
                        //     type: "text",
                        // },
                        {
                            name: "Display Name",
                            modelName: "displayName",
                            width: "200",
                            type: "custom",
                            custom(row) {
                                return `${row.displayName} ${row.concatName}`;
                            },
                        },
                        // {
                        //     name: "Concat Name",
                        //     modelName: "concatName",
                        //     type: "text",
                        // },
                        {
                            name: "Added",
                            modelName: "concatName",
                            type: "custom",
                            width: "110",
                            custom: (row) => {
                                let data = this.data.regularExerciseIdList;
                                let text = "No";
                                data &&
                                    data.some((item) => {
                                        if (item.id === row.id) {
                                            text = "Yes";
                                            return true;
                                        }
                                    });
                                return text;
                            },
                        },
                    ],
                    searchRander: [
                        // {
                        //     placeholder: "Exercise Name",
                        //     modelName: "exerciseName",
                        //     type: "input",
                        //     maxlength: 50,
                        // },
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
                    localSearchRander: [
                        // {
                        //     placeholder: "Exercise Name",
                        //     modelName: "exerciseName",
                        //     type: "input",
                        //     maxlength: 50,
                        // },
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
                                // 本地查询的逻辑不使用exerciseSubTypeArr
                                "exerciseSubType",
                            ],
                            must: true,
                            type: "cascader",
                            multiple: true,
                            options: "exerciseTypeEditor",
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
                            name: "Id",
                            modelName: "id",
                            type: "text",
                            width: "50",
                        },
                        // {
                        //     name: "Exercise Name",
                        //     modelName: "exerciseName",
                        //     type: "text",
                        // },
                        {
                            name: "Display Name",
                            modelName: "displayName",
                            width: "200",
                            type: "custom",
                            custom(row) {
                                return `${row.displayName} ${row.concatName}`;
                            },
                        },
                        // {
                        //     name: "Concat Name",
                        //     modelName: "concatName",
                        //     type: "text",
                        // },
                        // {
                        //     name: "Options",
                        //     modelName: "custom",
                        //     type: "customCustom",
                        // },
                    ],
                    uploadFieldTransform: [
                        { BaseField: "id", UploadField: "regularExerciseId" },
                    ],
                    localSearchFunc: (localSearchData) => {
                        let array;
                        let Datalist = this.data.regularExerciseIdList;
                        localSearchData = this.$deepCopy(localSearchData)
                        // 删掉exerciseTypes
                        delete localSearchData.exerciseTypes
                        // 不存在全查
                        if (!localSearchData) {
                            array = Datalist
                        } else if (Object.keys(localSearchData).length === 0) {
                            // 没有子属性全查
                            array = Datalist;
                        } else {
                            array = Datalist?
                                Datalist.filter((item) => {
                                    let state = false;
                                    let checkArray = Object.keys(localSearchData).map(() => false)
                                    Object.keys(localSearchData).some(
                                        (key,index) => {
                                            // 名称可模糊查询
                                            if(key === 'displayName' && item[key].indexOf(localSearchData[key]) != -1){
                                                checkArray[index] = true
                                            }
                                            // 查询的数据类型为数组
                                            if(localSearchData[key] && localSearchData[key].constructor === Array){
                                                localSearchData[key].some(item2 => {
                                                    if(item2 === item[key]){
                                                        checkArray[index] = true
                                                    }
                                                })
                                                // 空数组
                                                localSearchData[key].length === 0 && (checkArray[index] = true)
                                            }
                                            // 非名称查全称，或者查询的字符串为空
                                            if ( item[key] === localSearchData[key] || !localSearchData[key]){
                                                checkArray[index] = true
                                            }
                                        }
                                    );
                                    // 所有的校验通过才返回true
                                    checkArray.filter(i => i).length === checkArray.length && (state = true)
                                    return state
                                }) : []
                        }
                        return array || []
                    },
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
            ],
        };
    },
    methods: {
        handlerSave(data) {
            data = this.$deepCopy(data)
            data.regularExerciseIdList = data.regularExerciseIdList.map(i => i.id)
            this.$refs.editerPage.pageLoadState = true;
            this.$request(
                '/proj/custom/add',
                data,
                (res) => {
                    this.$refs.editerPage.pageLoadState = false;
                    if (res.data.code === 200)
                        this.$router.push(`/custom-list-proj`);
                },
                "post",
                false,
                true
            );
        },
        getDetil() {
            return new Promise((resolve) => {
                this.$request(
                    "/proj/custom/list",
                    {},
                    (res) => {
                        res.data.data = {
                            regularExerciseIdList: res.data.data,
                        };
                        resolve(res.data.data);
                    },
                    "get",
                    false,
                    false
                );
            });
        },
    },
};
</script>

<style scoped>
.custom >>> .kuai-name {
    display: none;
}
.custom >>> .base-table,
.custom >>> .data-table {
    width: 450px;
}
/* 隐藏掉backlist按钮 */
.custom >>> .editor-all .btns .back-list{
    display: none;
}
</style>