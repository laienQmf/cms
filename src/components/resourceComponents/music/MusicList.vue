<template>
    <div class="list-all">
        <!-- <upload-file
            :filePopConfig.sync="filePopConfig"
            :localUploadLimit="LocalUploadBefore"
            :uploadAllCallback="Uploaded"
        ></upload-file> -->
        <page-list
            :tableRander="tableRander"
            :searchRander="searchRander"
            headBtnsString="deletes,enables"
            ref="listPage"
        ></page-list>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageName:'music',
            filePopConfig: {
                show: false,
                type: "mp3",
                loading: false,
            },
            // mainBtnsRander: [
            //     {
            //         name: "Batch Add",
            //         type: "primary",
            //         click: () => (this.filePopConfig.show = true),
            //         sign: "adds",
            //     },
            // ],
            tableRander: [
                {
                    viewName: "Music Name",
                    modelName: "musicName",
                    type: "text",
                    maxlength:100,
                    jump:true
                },
                {
                    viewName: "Display Name",
                    modelName: "displayName",
                    type: "text",
                },
                {
                    viewName: "Type",
                    modelName: "musicType",
                    type: "text",
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
                    placeholder: "Music Name",
                    modelName: "musicName",
                    type: "input",
                    maxlength: 50,
                },
                {
                    placeholder: "Display Name",
                    modelName: "displayName",
                    type: "input",
                    maxlength: 100,
                },
                {
                    placeholder: "Type",
                    modelName: "musicType",
                    type: "select",
                    options: "musicType",
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
                { [this.pageName + 'List']: array },
                () => {
                    this.filePopConfig.loading = false;
                    this.filePopConfig.show = false;
                    // 刷新页面
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