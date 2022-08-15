<template>
    <div class="list-all">
        <upload-file
            :filePopConfig.sync="filePopConfig"
            :localUploadLimit="LocalUploadBefore"
            :uploadAllCallback="Uploaded"
        ></upload-file>
        <page-list
            :tableRander="tableRander"
            :searchRander.sync="searchRander"
            headBtnsString="deletes,enables,disableds"
            ref="listPage"
        ></page-list>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageName: "regularExercise",
            filePopConfig: {
                show: false,
                type: "mp3",
                loading: false,
            },
            tableRander: [
                {
                    viewName: "Combination",
                    modelName: "combination",
                    type: "text",
                },
                {
                    viewName: "Exercise Name",
                    modelName: "exerciseName",
                    type: "text",
                    jump:true
                },
                {
                    viewName: "Display Name",
                    modelName: "displayName",
                    type: "text",
                },
                {
                    viewName: "L/R",
                    modelName: "concatName",
                    type: "text",
                },
                {
                    viewName: "Animation",
                    modelName: "animationPhoneUrl",
                    type: "img",
                },
                {
                    viewName: "Status",
                    modelName: "status",
                    type: "select",
                    options: "resourceStatus",
                },
                {
                    viewName: "Exercise Type",
                    modelName: "exerciseTypes",
                    type: "custom",
                    custom: (row) => {
                        let text = `${row.exerciseType}${row.exerciseSubType?'-'+row.exerciseSubType:''}`
                        return row.exerciseType?text:''
                    },
                },
                {
                    viewName: "Body Part",
                    modelName: "bodyPart",
                    type: "text",
                },
                {
                    viewName: "Target",
                    modelName: "target",
                    type: "text",
                },
                {
                    viewName: "Position",
                    modelName: "position",
                    type: "text",
                },
                {
                    viewName: "Focus",
                    modelName: "focus",
                    type: "text",
                },
                {
                    viewName: "Equipment",
                    modelName: "equipment",
                    type: "text",
                },
                // {
                //     viewName: "MET",
                //     modelName: "equipmentArr",
                //     type: "text",
                // },
                // {
                //     viewName: "Star",
                //     modelName: "equipmentArr",
                //     type: "text",
                // },
                {
                    viewName: "Intensity",
                    modelName: "intensity",
                    type: "text",
                },
                {
                    viewName: "Difficulty",
                    modelName: "difficulty",
                    type: "text",
                },
                {
                    viewName: "Met",
                    modelName: "met",
                    type: "text",
                    options: "met",
                },
                {
                    viewName: "Star",
                    modelName: "star",
                    type: "text",
                    options: "star",
                },
                {
                    viewName: "Special Needs",
                    modelName: "specialNeed",
                    type: "text",
                },
                {
                    viewName: "Create Person",
                    modelName: "createUser",
                    type: "text",
                },
                {
                    viewName: "Create Time",
                    modelName: "createTime",
                    type: "text",
                },
                {
                    viewName: "Update Person",
                    modelName: "updateUser",
                    type: "text",
                },
                {
                    viewName: "Update Time",
                    modelName: "updateTime",
                    type: "text",
                },
                {
                    viewName: "Options",
                    funcs: "view,enable,delete,duplication,disabled",
                    type: "option",
                    fixed: "right",
                },
            ],
            searchRander: [
                {
                    placeholder: "Exercise Name",
                    modelName: "exerciseName",
                    type: "input",
                    maxlength: 50,
                },
                {
                    placeholder: "Display Name",
                    modelName: "displayName",
                    type: "input",
                    maxlength: 50,
                },
                {
                    placeholder: "Combination",
                    modelName: "combination",
                    type: "select",
                    options: "combination",
                },
                {
                    placeholder: "Status",
                    modelName: "status",
                    type: "select",
                    options: "resourceStatus",
                },
                {
                    placeholder: "Exercise Type",
                    modelName: "exerciseTypes",
                    trueModelName: ["exerciseType", "exerciseSubTypeArr"],
                    must: true,
                    type: "cascader",
                    multiple: true,
                    options: "exerciseType",
                    change: (item) => {
                        // 获取主属性
                        let type =
                            this.$refs.listPage.searchDataBackup[item.trueModelName[0]];
                        if (item.multiple) {
                            // 获取options
                            let options = item.options;
                            if (options.constructor === String) {
                                options = this.$deepCopy(
                                    this.$store.state.optionBase[options]
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
                            item.options = options
                        }
                    },
                },
                {
                    placeholder: "Body Part",
                    modelName: "bodyPart",
                    type: "select",
                    options: "bodyPart",
                },
                {
                    placeholder: "Target",
                    modelName: "targetArr",
                    type: "selects",
                    noNone: true,
                    uploadLabel: true,
                    options: [
                        { label: "Abs" },
                        { label: "Arm" },
                        { label: "Back" },
                        { label: "Butt" },
                        { label: "Chest" },
                        { label: "Core" },
                        { label: "Hamstrings" },
                        { label: "Hip" },
                        { label: "Leg" },
                        { label: "Lower Leg" },
                        { label: "Lower back" },
                        { label: "Neck" },
                        { label: "Shoulder" },
                        { label: "Spine" },
                        { label: "Thigh" },
                    ],
                },
                {
                    placeholder: "Position",
                    modelName: "position",
                    type: "select",
                    uploadLabel: true,
                    options: [
                        { label: "Lying" },
                        { label: "Prone" },
                        { label: "Seated" },
                        { label: "Kneeling" },
                        { label: "Standing" },
                        { label: "Start" },
                        { label: "End" },
                    ],
                },
                {
                    placeholder: "Focus",
                    modelName: "focus",
                    type: "select",
                    options: "focus",
                },
                {
                    placeholder: "Equipment",
                    modelName: "equipmentArr",
                    type: "selects",
                    uploadLabel: true,
                    options: [
                        { label: "Bed" },
                        { label: "Chair" },
                        { label: "Dumbbells" },
                        { label: "Pillow" },
                        { label: "Resistance band" },
                        { label: "Towel" },
                        { label: "Wall" },
                        { label: "Yoga block" },
                        { label: "Yoga mat" },
                    ],
                },
                {
                    placeholder: "Intensity",
                    modelName: "intensity",
                    type: "select",
                    uploadLabel: true,
                    options: [
                        { label: "level 1" },
                        { label: "level 2" },
                        { label: "level 3" },
                    ],
                },
                {
                    placeholder: "Difficulty",
                    modelName: "difficulty",
                    type: "select",
                    uploadLabel: true,
                    options: [
                        { label: "Beginner" },
                        { label: "Intermediate" },
                        { label: "Advanced" },
                    ],
                },
                {
                    placeholder: "Special Needs",
                    modelName: "specialNeedArr",
                    type: "selects",
                    uploadLabel: true,
                    options: [
                        { label: "Elderly" },
                        { label: "Knee-friendly" },
                        { label: "Overweight" },
                        { label: "Pregnancy" },
                        { label: "Wrist-friendly" },
                    ],
                },
            ],
            filesFormat: [
                {
                    format: "_female.mp3",
                    name: "female",
                    dirKey: "sound-female",
                    field: "femaleUrl",
                },
                {
                    format: "_female_robot.mp3",
                    name: "femaleRobot",
                    dirKey: "sound-female-robot",
                    field: "femaleRobotUrl",
                },
                {
                    format: "_male.mp3",
                    name: "male",
                    dirKey: "sound-male",
                    field: "maleUrl",
                },
                {
                    format: "_male_robot.mp3",
                    name: "maleRobot",
                    dirKey: "sound-male-robot",
                    field: "maleRobotUrl",
                },
            ],
        };
    },
    methods: {
        Uploaded(filesUrlObj) {
            console.log(filesUrlObj);
            let obj = {};
            // 解析分类数据
            Object.keys(filesUrlObj).some((fileName) => {
                this.filesFormat.some((item) => {
                    if (fileName.indexOf(item.format) != -1) {
                        let name = fileName.replace(item.format, "");
                        // 判断obj是否存在当前的name的key
                        obj[name] || (obj[name] = {});
                        obj[name][item.field] = filesUrlObj[fileName];
                    }
                });
            });
            // 转化为数组
            let array = Object.keys(obj).map((i) => {
                return {
                    ...obj[i],
                    soundName: i,
                };
            });
            // 保存到服务器
            this.$request(
                `/res/${this.pageName}/addBatch`,
                { [this.pageName + "List"]: array },
                () => {
                    this.filePopConfig.loading = false;
                    this.filePopConfig.show = false;
                    // 刷新页面
                    this.$refs.listPage.getData();
                },
                "post",
                false,
                true
            );
        },
        LocalUploadBefore(file) {
            let name = file.name;
            let filesFormat = this.filesFormat;
            let state = false;
            filesFormat.some((item) => {
                if (name.indexOf(item.format) != -1) {
                    file.dirKey = item.dirKey;
                    state = true;
                }
            });
            return state;
        },
    },
};
</script>

<style scoped>
.list-all {
    min-width: 1280px;
}
</style>