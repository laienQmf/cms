<template>
    <div class="list-all">
        <upload-file
            :filePopConfig.sync="filePopConfig"
            :localUploadLimit="LocalUploadBefore"
            :uploadAllCallback="Uploaded"
        ></upload-file>
        <page-list
            :tableRander="tableRander"
            :searchRander="searchRander"
            :mainBtnsRander="mainBtnsRander"
            headBtnsString="deletes,enables"
            ref="listPage"
        ></page-list>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageName:'',
            filePopConfig: {
                show: false,
                type: "mp3",
                loading: false,
            },
            mainBtnsRander: [
                {
                    name: "Batch Add",
                    type: "primary",
                    click: () => (this.filePopConfig.show = true),
                    sign: "adds",
                },
            ],
            tableRander: [
                {
                    viewName: "Sound Name",
                    modelName: "soundName",
                    type: "text",
                    jump:true
                },
                {
                    viewName: "Sound Type",
                    modelName: "soundType",
                    type: "custom",
                    custom:(row) => {
                        let text = `${row.soundType}${row.soundSubType?'-'+row.soundSubType:''}`
                        return row.soundType?text:''
                    }
                },
                {
                    viewName: "Compression Status",
                    modelName: "compressionStatus",
                    type: "select",
                    options:'resourceCompressionStatus'
                },
                {
                    viewName: "Status",
                    modelName: "status",
                    type: "select",
                    options: "resourceStatus",
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
                    funcs: "view,enable,delete",
                    type: "option",
                },
            ],
            searchRander: [
                {
                    placeholder: "Sound Name",
                    modelName: "soundName",
                    type: "input",
                    maxlength: 50,
                },
                {
                    placeholder: "Sound Type",
                    modelName:'soundTypes',
                    trueModelName:['soundType','soundSubType'],
                    type: "cascader",
                    options:'soundType'
                },
                {
                    placeholder: "Status",
                    modelName: "status",
                    type: "select",
                    options: "resourceStatusSound",
                },
                {
                    placeholder: "Compression Status",
                    modelName: "compressionStatus",
                    type: "select",
                    options: "resourceCompressionStatus",
                },
                {
                    placeholder: "Sound Source",
                    modelName: "soundSource",
                    type: "select",
                    options: "resourceStatusSound",
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
            // ??????????????????
            Object.keys(filesUrlObj).some((fileName) => {
                this.filesFormat.some((item) => {
                    if (fileName.indexOf(item.format) != -1) {
                        let name = fileName.replace(item.format, "");
                        // ??????obj?????????????????????name???key
                        obj[name] || (obj[name] = {});
                        obj[name][item.field] = filesUrlObj[fileName];
                    }
                });
            });
            // ???????????????
            let array = Object.keys(obj).map((i) => {
                return {
                    ...obj[i],
                    soundName: i,
                };
            });
            // ??????????????????
            this.pageName = this.$refs.listPage.pageName
            this.$request(
                `/res/${this.pageName}/addBatch`,
                { [this.pageName + 'List']: array },
                () => {
                    this.filePopConfig.loading = false;
                    this.filePopConfig.show = false;
                    // ????????????
                    this.$refs.listPage.getData()
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
            if(!state){
                    this.$message({
                        message: `The file name format is 'xxx_female.mp3','xxx"_female_robot.mp3','xxx"_male.mp3' or 'xxx_male_robot.mp3'`,
                        type: "warning",
                    });
            }
            return !state;
        },
    },
};
</script>

<style scoped>
.list-all {
    min-width: 1280px;
}
</style>