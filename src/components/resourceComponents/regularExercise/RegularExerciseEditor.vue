<template>
    <div>
        <page-editer
            :render="randerArray"
            :modelData.sync="data"
            :handleLoad="handleLoad"
            ref="editerPage"
            draftMustFields="combination,exerciseName"
        ></page-editer>
    </div>
</template>

<script>
export default {
    data() {
        let _this = this;
        return {
            data: {},
            randerArray: [
                {
                    key: "Combination",
                    type: "select",
                    modelName: "combination",
                    must: true,
                    options: "combination",
                    addAfterNotChange: true,
                    change(data) {
                        let allName =
                            "Description 2,Video Link 2,Animation 2,Sound 2";
                        let combination =
                            _this.$refs.editerPage.modelData.combination;
                        if (data) {
                            combination = data.combination || combination;
                        }
                        _this.randerArray.some((item) => {
                            // 通过key名称查找，因为有可能有的item的modelName是同一个
                            allName.split(",").some((name) => {
                                if (name === item.key) {
                                    _this.$refs.editerPage.modelData[
                                        item.modelName
                                    ] = "";
                                    item.noshow = true;
                                    if (combination === "Left & Right") {
                                        item.noshow = false;
                                    }
                                }
                            });
                        });
                    },
                },
                {
                    key: "Exercise Name",
                    type: "input",
                    modelName: "exerciseName",
                    must: true,
                    maxlength: "100",
                    point: "No need to enter Left or Right, the application will handle it automatically",
                },
                {
                    key: "Display Name",
                    type: "input",
                    modelName: "displayName",
                    must: true,
                    maxlength: "100",
                    point: "No need to enter Left or Right, the application will handle it automatically",
                },
                {
                    key: "Exercise Type",
                    modelName: "exerciseTypes",
                    trueModelName: ["exerciseType", "exerciseSubTypeArr"],
                    must: true,
                    type: "cascader",
                    multiple: true,
                    options: "exerciseTypeEditor",
                    change: (item) => {
                        // 获取主属性
                        let type = this.$refs.editerPage.modelData.exerciseType;
                        if (item.multiple) {
                            // 获取exerciseType
                            let exerciseType = this.$deepCopy(
                                this.$store.state.optionBase.exerciseType
                            );
                            exerciseType.some((item) => {
                                item.disabled = true;
                                console.log(item.value, type);
                                if (item.value === type) {
                                    item.disabled = false;
                                }
                                if (type.length === 0) {
                                    item.disabled = false;
                                }
                            });
                            this.$store.commit("optionBaseAdd", {
                                name: "exerciseTypeEditor",
                                newdata: exerciseType,
                            });
                        }
                        let allName =
                            "Body part,Target,Position,Focus,Equipment,MET,Star,Intensity,Difficulty,Special needs";
                        this.randerArray.some((item) => {
                            allName.split(",").some((name) => {
                                if (name === item.key) {
                                    this.$refs.editerPage.modelData[
                                        item.modelName
                                    ] = null;
                                    item.noshow = true;
                                }
                            });
                            if (type === "Yoga") {
                                let allowShow =
                                    "Body part,Target,Position,Focus,Equipment,MET,Star,Difficulty,Special needs";
                                allowShow = allowShow.split(",");
                                if (item.modelName === "targetArr") {
                                    item.options = "target-Yoga";
                                }
                                if (item.modelName === "position") {
                                    item.options = "position-Yoga";
                                }
                                if (item.modelName === "equipmentArr") {
                                    item.options = "equipment-Yoga";
                                }
                                if (item.modelName === "specialNeedArr") {
                                    item.options = "specialNeeds-Yoga";
                                }
                                allowShow.some((name) => {
                                    if (name === item.key) {
                                        item.noshow = false;
                                    }
                                });
                            }
                            if (type === "Fit") {
                                let allowShow =
                                    "Body part,Target,Position,Focus,Equipment,MET,Special needs,Intensity";
                                allowShow = allowShow.split(",");
                                if (item.modelName === "targetArr") {
                                    item.options = "target-Fit";
                                }
                                if (item.modelName === "position") {
                                    item.options = "position-Fit";
                                }
                                if (item.modelName === "equipmentArr") {
                                    item.options = "equipment-Fit";
                                }
                                if (item.modelName === "specialNeedArr") {
                                    item.options = "specialNeeds-Fit";
                                }
                                allowShow.some((name) => {
                                    if (name === item.key) {
                                        item.noshow = false;
                                    }
                                });
                            }
                        });
                        return this.randerArray;
                    },
                },
                {
                    key: "Body part",
                    type: "select",
                    modelName: "bodyPart",
                    must: true,
                    options: "bodyPart",
                    noshow: true,
                },
                {
                    key: "Target",
                    type: "selects",
                    modelName: "targetArr",
                    must: true,
                    options: "targetFit",
                    noshow: true,
                },
                {
                    key: "Position",
                    type: "select",
                    modelName: "position",
                    must: true,
                    options: "position",
                    noshow: true,
                },
                {
                    key: "Focus",
                    type: "select",
                    modelName: "focus",
                    must: true,
                    options: "focus",
                    noshow: true,
                },
                {
                    key: "Equipment",
                    type: "selects",
                    modelName: "equipmentArr",
                    options: "equipmentArr",
                    noshow: true,
                },
                {
                    key: "MET",
                    type: "select",
                    modelName: "met",
                    must: true,
                    options: "met",
                    uploadLabel: true,
                    noshow: true,
                },
                {
                    key: "Star",
                    type: "select",
                    modelName: "star",
                    options: "star",
                    uploadLabel: true,
                    noshow: true,
                },
                {
                    key: "Intensity",
                    type: "select",
                    modelName: "met",
                    must: true,
                    noshow: true,
                    options: "intensity2",
                    disabled: true,
                },
                {
                    key: "Difficulty",
                    type: "select",
                    modelName: "star",
                    must: true,
                    options: "difficulty2",
                    disabled: true,
                    noshow: true,
                },
                {
                    key: "Special needs",
                    modelName: "specialNeedArr",
                    type: "selects",
                    noshow: true,
                    options: 'specialNeed',
                },
                {
                    key: "Keyword",
                    type: "selects",
                    modelName: "keywords",
                    labelName: "keyword",
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
                    key: "Description 1",
                    modelName: "description",
                    type: "textarea",
                    must: true,
                    maxlength: "1000",
                },
                {
                    key: "Description 2",
                    modelName: "descriptionRight",
                    type: "textarea",
                    must: true,
                    maxlength: "1000",
                    noshow: true,
                },
                {
                    key: "Video Link 1",
                    modelName: "videoLinkUrl",
                    type: "textarea",
                    must: true,
                    maxlength: "255",
                },
                {
                    key: "Video Link 2",
                    modelName: "videoLinkRightUrl",
                    type: "textarea",
                    must: true,
                    maxlength: "255",
                    noshow: true,
                },
                {
                    key: "Animation 1",
                    type: "select",
                    modelName: "animationId",
                    optionModelName: "animation",
                    labelName: "animationName",
                    must: true,
                    remote: true,
                    remoteMethod: (query, loadName, optionName) => {
                        this.$refs.editerPage.loadAll[loadName] = true;
                        this.$request(
                            "/res/animation/page",
                            { animationName: query,status:1 },
                            (res) => {
                                this.$refs.editerPage.loadAll[loadName] = false;
                                let data = res.data.data.list;
                                this.$refs.editerPage.optionsAll[optionName] =
                                    data.map((item) => {
                                        return {
                                            value: item.id,
                                            label: item.animationName,
                                        };
                                    });
                            },
                            "get",
                            false,
                            false
                        );
                    },
                    options: "animation1",
                },
                {
                    key: "Animation 2",
                    type: "select",
                    modelName: "animationRightId",
                    optionModelName: "animationRight",
                    labelName: "animationName",
                    must: true,
                    remote: true,
                    remoteMethod: (query, loadName, optionName) => {
                        this.$refs.editerPage.loadAll[loadName] = true;
                        this.$request(
                            "/res/animation/page",
                            { animationName: query,status:1 },
                            (res) => {
                                this.$refs.editerPage.loadAll[loadName] = false;
                                let data = res.data.data.list;
                                this.$refs.editerPage.optionsAll[optionName] =
                                    data.map((item) => {
                                        return {
                                            value: item.id,
                                            label: item.animationName,
                                        };
                                    });
                            },
                            "get",
                            false,
                            false
                        );
                    },
                    options: "animation2",
                    noshow: true,
                },
                {
                    key: "Sound 1",
                    type: "select",
                    modelName: "soundId",
                    optionModelName: "sound",
                    labelName: "soundName",
                    must: true,
                    remote: true,
                    remoteMethod: (query, loadName, optionName) => {
                        this.$refs.editerPage.loadAll[loadName] = true;
                        this.$request(
                            "/res/sound/page",
                            { soundName: query,status:1,soundType:'Exercise Name',soundSubTypeArr:'Normal,Yoga' },
                            (res) => {
                                this.$refs.editerPage.loadAll[loadName] = false;
                                let data = res.data.data.list;
                                this.$refs.editerPage.optionsAll[optionName] =
                                    data.map((item) => {
                                        return {
                                            value: item.id,
                                            label: item.soundName,
                                        };
                                    });
                            },
                            "get",
                            false,
                            false
                        );
                    },
                    options: "sound1",
                },
                {
                    key: "Sound 2",
                    must:true,
                    type: "select",
                    modelName: "soundRightId",
                    optionModelName: "soundRight",
                    labelName: "soundName",
                    remote: true,
                    remoteMethod: (query, loadName, optionName) => {
                        this.$refs.editerPage.loadAll[loadName] = true;
                        this.$request(
                            "/res/sound/page",
                            { soundName: query,status:1,soundType:'Exercise Name',soundSubTypeArr:'Normal,Yoga' },
                            (res) => {
                                this.$refs.editerPage.loadAll[loadName] = false;
                                let data = res.data.data.list;
                                this.$refs.editerPage.optionsAll[optionName] =
                                    data.map((item) => {
                                        return {
                                            value: item.id,
                                            label: item.soundName,
                                        };
                                    });
                            },
                            "get",
                            false,
                            false
                        );
                    },
                    options: "sound2",
                    noshow: true,
                },
                {
                    key: "Remark",
                    modelName: "remark",
                    type: "textarea",
                    maxlength: "255",
                },
            ],
        };
    },
    methods: {
        handleLoad() {
            if (this.$refs.editerPage.add) {
                let exerciseType = this.$deepCopy(
                    this.$store.state.optionBase.exerciseType
                );
                exerciseType.some((item) => {
                    item.disabled = false;
                });
                this.$store.commit("optionBaseAdd", {
                    name: "exerciseTypeEditor",
                    newdata: exerciseType,
                });
            }
        },
    },
};
</script>

<style scoped>
</style>