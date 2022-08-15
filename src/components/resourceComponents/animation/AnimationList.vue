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
            headBtnsString="deletes,enables,disableds"
            ref="list"
        ></page-list>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filePopConfig: {
                show: false,
                type: "gif,png",
                multipleType: true,
                loading:false,
            },
            mainBtnsRander: [
                {
                    name: "Batch Add",
                    type: "primary",
                    click: () => (this.filePopConfig.show = true),
                    sign:'adds'
                },
            ],
            tableRander: [
                {
                    viewName: "Animation Name",
                    modelName: "animationName",
                    type: "text",
                    jump:true
                },
                {
                    viewName: "Thumbnail",
                    modelName: "animationCoverUrl",
                    type: "img",
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
                    funcs: "view,disabled,enable,delete",
                    type: "option",
                },
            ],
            searchRander: [
                {
                    placeholder: "Name",
                    modelName: "animationName",
                    type: "input",
                    maxlength: 50,
                },
                {
                    placeholder: "Status",
                    modelName: "status",
                    type: "select",
                    options: "resourceStatus",
                },
                {
                    placeholder: 'Create Time',
                    modelName: ["startCreateTime", "endCreateTime"],
                    type: "dates",
                },
                {
                    placeholder: 'Update Time',
                    modelName: ["startUpdateTime", "endUpdateTime"],
                    type: "dates",
                },
            ],
            animationFormat: [
                {
                    format:"_iphone.gif",
                    name:"iphone",
                    dirKey:'animation-phone',
                    field:'animationPhoneUrl'
                },
                {
                    format:"_ipad.gif",
                    name:"ipad",
                    dirKey:'animation-pad',
                    field:'animationTabletUrl'
                },
                {
                    format:"_thumbnail.png",
                    name:"thumbnail",
                    dirKey:'animation-thumbnail',
                    field:'animationCoverUrl'
                },
            ],
        };
    },
    methods: {
        getList(data) {
            return new Promise((resolve) => {
                this.$request(
                    "/res/animation/page",
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
        Uploaded(filesUrlObj) {
            console.log(filesUrlObj);
            let obj = {};
            // 解析分类数据
            Object.keys(filesUrlObj).some((fileName) => {
                this.animationFormat.some(item => {
                    if(fileName.indexOf(item.format) != -1){
                        let name = fileName.replace(item.format,'')
                        // 判断obj是否存在当前的name的key
                        obj[name] || ( obj[name] = {})
                        obj[name][item.field] = filesUrlObj[fileName]
                    }
                })
            });
            // 转化为数组
            let array = Object.keys(obj).map(i => {
                return {
                    ...obj[i],
                    animationName:i
                }
            })
            // 保存到服务器
            this.$request('/res/animation/addBatch',{ animationList:array },() => {
                this.filePopConfig.loading = false
                this.filePopConfig.show = false
                this.$refs.list.getData()
            },'post',false,true)
        },
        LocalUploadBefore(file) {
            let name = file.name;
            let animationFormat = this.animationFormat
            let state = false;
            animationFormat.some(item => {
                if (name.indexOf(item.format) != -1) {
                file.dirKey = item.dirKey;
                state = true;
            }
            })
            if(!state){
                    this.$message({
                        message: `The file name format is 'xxx_iphone.gif','xxx_ipad.gif' or 'xxx_thumbnail.png'`,
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
}
</style>