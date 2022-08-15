<template>
    <div class="file-prop">
        <el-dialog
            :visible.sync="dialogData.show"
            width="750px"
            :center="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <div class="upload-header">
                <div>{{ title }}</div>
                <i @click="closeBefore" class="el-icon-close hover"></i>
            </div>
            <div class="upload-file-body" v-show="!listState">
                <el-upload
                    class="upload-file"
                    drag
                    action="#"
                    :http-request="localUploadFile"
                    :show-file-list="false"
                    multiple
                >
                    <div class="upload-file-con">
                        <div class="text1">Select File to Upload</div>
                        <div class="text2">
                            or drag and drop
                            <span style="color: var(--orange)">{{
                                dialogData.type && `format:${dialogData.type}`
                            }}</span>
                        </div>
                    </div>
                </el-upload>
            </div>
            <div class="upload-list" v-show="listState">
                <div class="upload-list-search">
                    <i class="el-icon-search"></i>
                    <input
                        type="text"
                        placeholder="Filter"
                        v-model="searchName"
                    />
                </div>
                <div class="upload-list-body">
                    <!-- 图片 -->
                    <div
                        class="upload-list-title"
                        v-show="showImageList.length > 0"
                    >
                        IMAGES
                    </div>
                    <div
                        class="upload-list-item"
                        v-for="item in showImageList"
                        :key="item.uid"
                    >
                        <img :src="item.localURL" class="upload-item-img" />
                        <div class="list-item-message">
                            <div class="list-item-name">{{ item.name }}</div>
                            <div class="list-item-size">
                                {{ sizeComputed(item.size) }}
                            </div>
                        </div>
                        <div class="list-item-end">
                            <i
                                @click="
                                    clearItem('imageList', {
                                        key: 'uid',
                                        value: item.uid,
                                    })
                                "
                                class="el-icon-close hover"
                            ></i>
                        </div>
                    </div>
                    <!-- 其他文件 -->
                    <div
                        class="upload-list-title"
                        v-if="showFileList.length > 0"
                    >
                        FILES
                    </div>
                    <div
                        class="upload-list-item"
                        v-for="item in showFileList"
                        :key="item.uid"
                    >
                        <div class="list-item-image">
                            <i
                                v-if="item.type.indexOf('audio') != -1"
                                class="el-icon-headset"
                            ></i>
                            <i
                                v-if="item.type.indexOf('video') != -1"
                                class="el-icon-video-camera-solid"
                            ></i>
                        </div>
                        <div class="list-item-message">
                            <div class="list-item-name">{{ item.name }}</div>
                            <div class="list-item-size">
                                {{ sizeComputed(item.size) }}
                            </div>
                        </div>
                        <div class="list-item-end">
                            <i
                                @click="
                                    clearItem('fileList', {
                                        key: 'uid',
                                        value: item.uid,
                                    })
                                "
                                class="el-icon-close hover"
                            ></i>
                        </div>
                    </div>
                </div>
                <div class="list-func">
                    <div class="hover" @click="clearAll">Clear All</div>
                    <div class="func-end">
                        <div class="hover" @click="listState = false">
                            Upload more
                        </div>
                        <el-button
                            class="func-button1 hover"
                            @click="uploadFile"
                            :disabled="dialogData.loading"
                        >
                            Upload
                            <i
                                v-show="dialogData.loading"
                                class="el-icon-loading"
                            ></i>
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: ["uploadAllCallback", "filePopConfig", "localUploadLimit"],
    data() {
        return {
            listState: false,
            imageList: [],
            fileList: [],
            title: "",
            searchName: "",
        };
    },
    computed: {
        dialogData() {
            return this.filePopConfig;
        },
        showFileList() {
            return this.$cutArray(
                this.fileList,
                { key: "name", value: this.searchName },
                "get",
                true
            );
        },
        showImageList() {
            return this.$cutArray(
                this.imageList,
                { key: "name", value: this.searchName },
                "get",
                true
            );
        },
    },
    methods: {
        closeBefore() {
            if (this.dialogData.loading) {
                this.$confirm(
                    "Data is uploading, are you sure you want to close the window? may result in data loss？",
                    "",
                    { type: "warning" }
                ).then(() => {
                    this.dialogData.show = false;
                });
            } else {
                this.dialogData.show = false;
            }
        },
        clearAll() {
            this.fileList = [];
            this.imageList = [];
            this.searchName = "";
            this.listState = false;
            this.filePopConfig.loading = false;
        },
        clearItem(name, obj) {
            this[name] = this.$cutArray(this[name], obj);
            if (this.fileList.length === 0 && this.imageList.length === 0) {
                this.listState = false;
            }
        },
        sizeComputed(size) {
            let name = "";
            if (size % 1024 === size) {
                name = size + "B";
            } else {
                name = Math.round(size / 1024) + "KB";
                if (size % (1024 * 1024) != size) {
                    name = parseInt((size / (1024 * 1024)) * 10) / 10 + "MB";
                }
            }
            return name;
        },
        localUploadFile(fileObj) {
            let file = fileObj.file;
            // console.log(this.fileList)
            // 类型限制
            // if(this.dialogData.type){
            //     if()
            // }
            // 根据类型分配
            if (file.type.indexOf("image") != -1) {
                let url = URL.createObjectURL(file);
                file.localURL = url;
                this.imageList.push(file);
            } else {
                this.fileList.push(file);
            }
            this.listState = true;
        },
        localUploadBefore(file) {
            // 文件类型限制
            {
                let typeLimitString = this.dialogData.type;
                let type = file.type;
                let nameType = file.name;
                let state = false;
                // 初始使用文件名后缀作校验后使用大类进行校验
                let func = (name) => {
                    let regExp = new RegExp(name + "$");
                    // 文件后缀名进行校验
                    if (regExp.test(nameType)) {
                        state = true;
                    }
                    // name是大类 audio,image,video 的情况使用type进行校验
                    if (
                        name === "image" ||
                        name === "video"
                    ) {
                        type.indexOf(name) != -1 && (state = true);
                    }
                };
                // 多个类型上传
                if (this.filePopConfig.multipleType) {
                    typeLimitString.split(",").some((item) => {
                        func(item);
                    });
                }
                // 单类型
                else {
                    func(typeLimitString);
                }
                if (!state) {
                    if (this.filePopConfig.multipleType) {
                        this.$message({
                            message: `The upload format is limited to "${typeLimitString}"`,
                            type: "warning",
                        });
                    }
                    return true;
                }
            }
            // 超出limit最大长度反应
            if (
                this.imageList.length + this.fileList.length ===
                this.dialogData.fileSumLimit
            ) {
                this.listState = true;
                this.$nextTick(() => {
                    this.$message({
                        message: `Up to ${this.dialogData.fileSumLimit} files can be uploaded`,
                        type: "warning",
                    });
                });
                return true;
            }
            // 外部限制
            if (this.localUploadLimit) {
                return this.localUploadLimit(file);
            }
        },
        uploadFile() {
            let files = [...this.imageList, ...this.fileList];
            let urls = {};
            // 文件上传前校验
            for(let i of files){
                let state = this.localUploadBefore(i)
                if(state){
                    return true
                }
            }
            this.dialogData.loading = true;
            files.some((file) => {
                // 加上时间戳
                let fileName = file.name;
                this.uploadFileToServer(file, (url) => {
                    if (url === "error") {
                        this.$message({
                            message: `File ${fileName} upload fail`,
                            type: "error",
                        });
                    }
                    // 同名文件会覆盖掉，这里进行保留
                    urls[fileName] = url;
                    // 异步上传完成
                    if (Object.keys(urls).length === files.length) {
                        this.uploadAllCallback(urls);
                    }
                });
            });
        },
        uploadFileToServer(file, func) {
            // let src = "";
            // 上传
            let formData = new FormData();
            formData.append("file", file);
            formData.append("dirKey", file.dirKey);
            this.$request(
                "/manage/file/upload",
                formData,
                (res) => {
                    if (res.data.code === 200) {
                        func && func(res.data.data.fileRelativeUrl);
                    } else {
                        func && func("error");
                    }
                },
                "post",
                false,
                false
            );
        },
    },
    watch: {
        dialogData: {
            handler(val) {
                this.$emit("update:filePopConfig", val);
            },
            immediate: true,
            deep: true,
        },
        "dialogData.show"(val) {
            if (!val) {
                this.clearAll();
            }
        },
        listState(val) {
            val ? (this.title = "Selected Files") : (this.title = "");
        },
    },
};
</script>

<style scoped>
/* 文件列表的样式 */
.upload-list {
    padding: 12px 16px;
}
.upload-list-search {
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    position: relative;
}
.upload-list-search input {
    height: 35px;
    width: 100%;
    border: none;
    outline: none;
    padding-left: 24px;
    box-sizing: border-box;
    font-size: 13px;
    color: #444;
}
.upload-list-search input:focus {
    box-shadow: 0px 0px 5px 1px rgb(112 112 112 / 50%);
}
.upload-list-search i {
    position: absolute;
    left: 0;
    font-size: 14px;
    top: 10px;
    color: rgba(0, 0, 0, 0.5);
}
.upload-list-body {
    padding: 8px 0;
    height: 350px;
    box-sizing: border-box;
    overflow-y: auto;
}
.upload-list-title {
    padding: 10px 0;
    font-size: 12px;
}
.upload-list-item {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.upload-item-img {
    height: 50px;
    width: 50px;
    padding: 5px;
    box-sizing: border-box;
    object-fit: contain;
    display: flex;
    align-items: center;
    justify-content: center;
}
.list-item-image {
    height: 38px;
    width: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(236, 236, 236);
    margin: 0 6px;
    border-radius: 50%;
}
.list-item-message {
    padding: 0 8px;
    flex: 1;
    display: inline-block;
}
.list-item-name {
    color: rgb(68, 68, 68);
    font-size: 13px;
}
.list-item-size {
    color: rgba(34, 34, 34, 0.5);
    font-size: 12px;
    padding-top: 3px;
}
.list-item-end {
    color: rgb(68, 68, 68);
    font-size: 18px;
}
/* 尾部方法样式 */
.list-func {
    padding-top: 12px;
    border-top: 2px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.list-func div:nth-child(1) {
    padding: 8px 16px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 13px;
}
.func-end {
    display: flex;
    align-items: center;
}
.func-end div:nth-of-type(1) {
    color: rgba(0, 0, 0, 0.5);
    font-size: 13px;
    padding: 8px 16px;
    margin-right: 2px;
}
.func-end .func-button1 {
    background-color: #2d7ff9;
    color: rgba(255, 255, 255, 0.9);
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
}

/* 文件上传层的样式 */
.file-prop >>> .el-dialog__body {
    padding: 0;
}
.file-prop >>> .el-dialog__header {
    display: none;
}
.upload-header {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    color: rgb(68, 68, 68);
}
.upload-header i {
    position: absolute;
    right: 18px;
    top: 16px;
    font-size: 18px;
}
.upload-file-body {
    padding: 0 16px 16px;
}
.file-prop >>> .el-upload {
    width: 100%;
}
.file-prop >>> .el-upload-dragger {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 441px;
    border-width: 2px;
}
.file-prop >>> .upload-file-con {
    background-image: url("../../assets/file.svg");
    background-repeat: no-repeat;
    background-position: 50% 0;
    padding-top: 1px;
}
.file-prop >>> .el-upload-dragger:hover .upload-file-con {
    background-image: url("../../assets/file-hover.svg");
}
.file-prop >>> .upload-file-con .text1 {
    margin-top: 74px;
    font-weight: 600;
    color: #444;
    font-size: 20px;
}
.file-prop >>> .upload-file-con .text2 {
    color: #9e9e9e;
    font-size: 13px;
}
</style>
<style>
.v-modal {
    opacity: 0.25;
}
</style>