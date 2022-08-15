<template>
    <div class="editor-all">
        <div class="editor-con" v-loading="pageLoadState">
            <div
                class="editor-head"
                :style="add && 'background-color:var(--red)'"
            >
                {{ pageTitle || pageName }} {{ add ? "add" : "editor" }}
            </div>
            <div class="form-con">
                <div
                    :class="`kuai ${
                        errorText[item.modelName] && 'kuai-main-error'
                    }`"
                    v-for="item in renderData"
                    :key="item.key"
                    v-show="!item.noshow"
                >
                    <div
                        class="kuai-name"
                        :style="
                            (item.must || item.blodKey) &&
                            'color:#262325;font-weight:800'
                        "
                    >
                        <div>
                            <span v-if="item.must" style="color: #f56c6c"
                                >*</span
                            >{{ item.key }}:
                        </div>
                        <div v-if="item.type === 'selects'" class="format">
                            (multi-select)
                        </div>
                    </div>
                    <div class="kuai-con">
                        <el-input
                            v-if="
                                item.type === 'input' ||
                                item.type === 'textarea'
                            "
                            v-model="data[item.modelName]"
                            @focus="errorText[item.modelName] = ''"
                            size="mini"
                            :rows="8"
                            :type="item.type === 'input' ? 'text' : 'textarea'"
                            show-word-limit
                            :maxlength="
                                item.maxlength ||
                                (item.type === 'input' ? '50' : '250')
                            "
                            :placeholder="item.placeholder"
                            @input="(val) => formatLimit(val, item)"
                        ></el-input>
                        <!-- 下拉框 -->
                        <div
                            v-if="
                                item.type === 'select' ||
                                item.type === 'selects'
                            "
                        >
                            <el-select
                                size="mini"
                                v-model="data[item.modelName]"
                                :multiple="item.type === 'selects'"
                                @change="(val) => seletChange(val, item)"
                                :disabled="
                                    item.disabled ||
                                    (!add && item.addAfterNotChange)
                                "
                                clearable
                                :multiple-limit="
                                    item.maxlength ? item.maxlength : 0
                                "
                                :filterable="item.remote"
                                :remote="item.remote"
                                :remote-method="
                                    (query) =>
                                        item.remoteMethod(
                                            query,
                                            item.modelName,
                                            item.options
                                        )
                                "
                                :loading="loadAll[item.modelName]"
                            >
                                <el-option
                                    v-for="option in item.options.constructor ===
                                    String
                                        ? optionsAll[item.options]
                                        : item.options"
                                    :label="option.label"
                                    :value="
                                        item.uploadLabel
                                            ? option.label
                                            : option.value
                                    "
                                    :key="option.value"
                                ></el-option>
                            </el-select>
                            <!-- <div v-if="item.type === 'selects'" class="format">
                            (multi-select)
                        </div> -->
                        </div>
                        <!-- 多个复选框 -->
                        <!-- checkboxs单独切换的model问题报错，加入data未存在时不渲染解决 -->
                        <div
                            v-if="
                                item.type === 'checkboxs' &&
                                data[item.modelName]
                            "
                        >
                            <el-checkbox-group v-model="data[item.modelName]">
                                <el-checkbox
                                    v-for="item2 in item.options.constructor ===
                                    String
                                        ? optionsAll[item.options]
                                        : item.options"
                                    :disabled="item2.disabled"
                                    :label="item2.value"
                                    :key="item2.value"
                                    >{{ item2.label }}</el-checkbox
                                >
                            </el-checkbox-group>
                        </div>
                        <!-- 媒体 -->
                        <div
                            class="kuai-media"
                            v-if="
                                item.type === 'video' || item.type === 'audio'
                            "
                        >
                            <div>
                                <el-button
                                    @click="selectFile(item)"
                                    size="mini"
                                    type="primary"
                                    :loading="loadAll[item.modelName]"
                                    :disabled="
                                        item.disabled || loadAll[item.modelName]
                                    "
                                    >Click to upload</el-button
                                >
                                <div class="format">
                                    (format:{{
                                        item.format ||
                                        (item.type === "video" ? "mp4" : "mp3")
                                    }}{{ (item.maxSize || item.minSize) && `,${item.minSize?(item.minSize + 'M &lt;='):''} size ${item.maxSize && ('&lt;= '+ item.maxSize + 'M')}` }})
                                </div>
                            </div>
                            <div
                                v-if="
                                    data[item.timeModel] &&
                                    item.type === 'video'
                                "
                                style="line-height: 32px"
                            >
                                {{ data[item.timeModel] / 1000 }} s
                            </div>
                            <video
                                :style="
                                    item.type === 'video' ? 'height:150px' : ''
                                "
                                v-if="!!data[item.modelName]"
                                :src="
                                    $store.state.default_file_url +
                                    data[item.modelName]
                                "
                                controls
                            ></video>
                        </div>
                        <!-- 图片 -->
                        <div
                            class="image"
                            v-if="item.type === 'image'"
                            @click="selectFile(item)"
                        >
                            <div
                                class="img hover"
                                v-loading="loadAll[item.modelName]"
                            >
                                <img
                                    style="width: 100%"
                                    v-show="data[item.modelName]"
                                    :src="
                                        data[item.modelName]
                                            ? `${
                                                  $store.state.default_file_url
                                              }${data[item.modelName]}?${
                                                  item.random
                                              }`
                                            : ''
                                    "
                                    @load="loadend(item)"
                                />
                                <i
                                    v-if="!data[item.modelName]"
                                    class="el-icon-plus"
                                ></i>
                            </div>
                            <div v-if="item.limit" class="image-limit">
                                ( format:
                                {{ item.limit[0] + "x" + item.limit[1] }}{{ (item.maxSize || item.minSize) && `,${item.minSize?(item.minSize + 'M &lt;='):''} size ${item.maxSize && ('&lt;= '+ item.maxSize + 'M')}` }})
                            </div>
                        </div>
                        <!-- checkbox -->
                        <div v-if="item.type === 'checkbox'">
                            <p style="height: 5px"></p>
                            <el-checkbox
                                :true-label="item.aloneLimit.on"
                                :false-label="item.aloneLimit.off"
                                v-model="data[item.modelName]"
                            ></el-checkbox>
                        </div>
                        <!-- switch -->
                        <div v-if="item.type === 'switch'">
                            <el-switch
                                :width="50"
                                v-model="data[item.modelName]"
                                :active-color="
                                    item.options.on.color || '#13ce66'
                                "
                                :inactive-color="
                                    item.options.off.color || '#ff4949'
                                "
                                :active-value="item.options.on.value"
                                :inactive-value="item.options.off.value"
                                :active-text="item.options.on.text"
                                :inactive-text="item.options.off.text"
                            >
                            </el-switch>
                        </div>
                        <div v-if="item.type === 'cascader'">
                            <!-- cascader级联选择器 -->
                            <el-cascader
                                v-model="data[item.modelName]"
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
                        <!-- 自定义穿梭框 -->
                        <div v-if="item.type === 'transfer'" class="transfer">
                            <transfer
                                ref="transfer"
                                searchKey="title"
                                :transferBase="item.transferBase"
                                :model.sync="data[item.modelName]"
                                :sign="item.modelName"
                                :showRender="item.showRender"
                                :searchRander="item.searchRander"
                                :localSearchRander="item.localSearchRander"
                                :repeat="item.repeat"
                                :getBase="item.getBase"
                                :pageSize="item.pageSize"
                                :dataRander="item.dataRander"
                                :uploadFieldTransform="
                                    item.uploadFieldTransform
                                "
                                :localSearchFun="item.localSearchFunc"
                                :BasekeyID="item.BasekeyID"
                                :sortable="item.sortable"
                                :selectAll="item.selectAll"
                            ></transfer>
                        </div>
                        <!-- 富文本 -->
                        <div v-if="item.type === 'richText'" class="rich-text">
                            <editer
                                :textvalue.sync="data[item.modelName]"
                            ></editer>
                        </div>
                        <!-- 自定义类型 输入列表渲染 -->
                        <div
                            v-if="item.type === 'renderList'"
                            class="rich-text"
                        >
                            <renderList
                                :data.sync="data[item.modelName]"
                            ></renderList>
                        </div>
                        <!-- 自定义类型 计算数据展示 -->
                        <div
                            v-if="item.type === 'computed'"
                            class="rich-text"
                            style="padding-top: 5px"
                        >
                            <computed
                                :data="data"
                                :func="item.computedFunc"
                                :model.sync="data[item.modelName]"
                                :errorText.sync="errorText[item.modelName]"
                                :errorTextString="item.errorText"
                                :formatFunc="item.formatFunc"
                                :computedFunc="item.computedFunc"
                            ></computed>
                        </div>
                        <div class="kuai-error">
                            <div v-show="errorText[item.modelName]">
                                {{ errorText[item.modelName] }}
                            </div>
                        </div>
                    </div>
                    <div class="kuai-end">
                        <div class="kuai-point">
                            {{ item.point ? `(${item.point})` : "" }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="btns" v-if="hideBtn === true ? false : true">
                <el-button size="small" type="primary" @click="SaveBefore"
                v-show="checkoutShow()"
                    >Save</el-button
                >
                <el-button
                    size="small"
                    type="success"
                    v-show="checkoutShow()"
                    @click="SaveToDraft"
                    v-if="SaveAsDraftState"
                    >Save as Draft</el-button
                >
                <el-button
                    class="back-list"
                    size="small"
                    @click="$router.push(backRouter || `/${pageName}-list${fromProject?'-proj':''}`)"
                    >Back to List</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import renderList from "./main/renderList.vue";
import editer from "./main/Editer.vue";
import transfer from "./main/TransferTemplate.vue";
import computed from './main/Computed.vue'
export default {
    components: { transfer, editer, renderList,computed },
    data() {
        return {
            pageLoadState: false,
            loadAll: {},
            disabled2: false,
            add: false,
            duplication: false,
            errorText: {},
            pageName: "",
            optionsAll: {},
            pageId: "",
            requestHeadLocal: "res",
        };
    },
    props: {
        // 用于渲染页面的的数组
        render: Array,
        // 草稿状态下的必填字段
        draftMustFields: [String, Array],
        // 页面的数据对象
        modelData: Object,
        // 自定义保存的方法
        handlerSave: Function,
        // 自定义mounted后的执行方法
        handleLoad: Function,
        // 尾部的按钮的展示，默认展示，默认为flash
        hideBtn: Boolean,
        // 为true时id从sesstionStorage中获取
        idFromSession: {
            type: Boolean,
            default: false,
        },
        // 自定义的展示title，默认使用pageName
        pageTitle: String,
        // 自定义真实的pageName,会覆盖掉默认pageName
        pageNameTrue: String,
        // 自定义获取详情数据的方法
        getDetil: Function,
        // 自定义保存为草稿方法
        SaveDraftBtn: Function,
        // 所有请求访问的head公共字段
        requestHead: {
            type: String,
        },
        // 保存成功后返回的路由默认为 pageName + 'list'
        backRouter: String,
        // 是否是项目
        fromProject: Boolean,
    },
    computed: {
        renderData: {
            get() {
                return this.render;
            },
            set(val) {
                this.$emit("update:render", val);
            },
        },
        data: {
            get() {
                return this.modelData;
            },
            set(val) {
                this.$emit("update:modelData", val);
            },
        },
        optionsBase() {
            let optionBase = this.$store.state.optionBase;
            return optionBase;
        },
        Permissions(){
            let permission = this.$store.state.permissionPage
            // info add的特殊情况做权限
            if(this.pageName === 'info' && this.add){
                return permission.program
            }
            permission = this.fromProject ? permission.program[sessionStorage.getItem('projectId')] : permission.resource || {}
            permission = (permission && permission[this.pageName]) || {}
            return permission
        },
        // 保存为草稿的按钮显示校验
        SaveAsDraftState() {
            let state = false;
            if (this.SaveDraftBtn) {
                return this.SaveDraftBtn();
            } else {
                (this.add || this.data.status === 0) && (state = true);
            }
            // 不存在草稿的必传字段情况下，一定没有保存为草稿按钮
            if (!this.draftMustFields) {
                state = false;
            }
            return state;
        },
    },
    watch: {
        optionsBase: {
            handler(val) {
                // 初始化remote类型的option
                this.renderData
                    .filter((i) => i.remote)
                    .some((item) => {
                        if (!this.optionsAll[item.options]) {
                            val[item.options] = [];
                        } else {
                            val[item.options] = this.optionsAll[item.options];
                        }
                    });
                this.optionsAll = val;
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        // 底部按钮权限控制的显隐
        checkoutShow(){
            let state = false
            if(this.add?this.Permissions.add:this.Permissions.editor){
                state = true
            }
            if((this.pageName === 'custom' || this.pageName === 'reminder' || this.pageName === 'info') && (this.Permissions.editor || this.Permissions.add)){
                state = true
            }
            return state
        },
        // 级联选中的默认方法
        cascaderChange(value, OptionItem) {
            let names = OptionItem.trueModelName;
            let func = OptionItem.change;
            if (value.length === 0) {
                this.data[names[0]] = "";
                this.data[names[1]] = "";
            }
            if (value.length != 0) {
                if (OptionItem.multiple) {
                    // 一级字段选中
                    value && (this.data[names[0]] = value[0][0]);
                    // 二级字段选中,字段存在
                    value[0][1] && (this.data[names[1]] = value.map((i) => i[1]));
                } else {
                    value &&
                        value.some((item, index) => {
                            this.data[names[index]] = item;
                        });
                }
            }
            let data = func ? func(OptionItem) : "";
            data && (this.renderData = data)
        },
        SaveToDraft() {
            if (this.draftMustFields) {
                let draftMustFields = this.draftMustFields;
                let state = true;
                if (draftMustFields.constructor === String) {
                    draftMustFields = draftMustFields.split(",");
                }
                draftMustFields.some((draftMustField) => {
                    if (!this.modelData[draftMustField]) {
                        this.errorText[draftMustField] = "Can not be empty";
                        state = false;
                    }
                });
                if (state) {
                    this.pageLoadState = true;
                    let path = this.add
                        ? `/${this.requestHeadLocal}/${this.pageName}/addAsDraft`
                        : `/${this.requestHeadLocal}/${this.pageName}/updateAsDraft`;
                    this.$request(
                        path,
                        this.data,
                        (res) => {
                            this.pageLoadState = false;
                            if (res.data.code === 200)
                                this.$router.push(`/${this.pageName}-list${this.fromProject?'-proj':''}`);
                        },
                        "post",
                        false,
                        true
                    );
                }
            }
        },
        formatLimit(val, item) {
            let format = item.format;
            if (!format) {
                return val;
            } else {
                let reg = new RegExp(format);
                // console.log(reg);
                // console.log(reg.test(val));
                // console.log(val);
                if (reg.test(val)) {
                    this.data[item.modelName] = "";
                }
            }
        },
        seletChange(val, item) {
            let modelName = item.modelName;
            // 对数组进行首字母adc排序
            if (typeof this.data[modelName] === "object") {
                this.data[modelName] = this.data[modelName].sort();
            }
            item.change && item.change(val,item);
            // if (typeof array === "object") {
            //     for (let i = 0; i < array.length; i++) {
            //         for (let j = 0; j < array.length; j++) {
            //             if (j > 0) {
            //                 let oldItem = array[j - 1];
            //                 let nowItem = array[j]
            //                 if(oldItem)
            //             }
            //         }
            //     }
            // }
        },
        loadend(item) {
            this.loadAll[item.modelName] = false;
        },
        // 上传到服务器
        uploadFile(file, func, name, dirKey, item) {
            // let src = "";
            // 上传
            this.loadAll[name] = true;
            let formData = new FormData();
            formData.append("file", file);
            formData.append("dirKey", dirKey);
            let url = "/manage/file/upload",
                localUrl = "";
            if (item.compressionFile) {
                // 压缩的话需要提供本地路径
                localUrl = URL.createObjectURL(file);
                url = "/manage/file/uploadCompressionFile";
            }
            this.$request(
                url,
                formData,
                (res) => {
                    if (res.data.code === 200) {
                        item.compressionFile
                            ? func(res.data.data.fileUrl, localUrl)
                            : func(res.data.data.fileRelativeUrl);
                    }
                },
                "post",
                false,
                false
            );
        },
        selectFile(obj) {
            // request
            let type = obj.type;
            let modelName = obj.modelName;
            // 如果要展示时间给时间一个model
            let timeModel = obj.timeModel;
            // 文件格式
            let format = obj.format;
            // 文件上传的 bucket
            let dirKey = obj.dirKey;
            // 文件最大大小
            let maxSize = obj.maxSize;
            // 文件最小限制
            let minSize = obj.minSize;
            let files = document.createElement("input");
            files.type = "file";
            files.onchange = async () => {
                let file = files.files[0];
                // 类型校验(后缀名校验)
                {
                    let state = false;
                    // format为空
                    if (!format) {
                        if (file.type.indexOf(type) === -1) {
                            state = true;
                        }
                    } else if (file.name.indexOf(format) === -1) {
                        state = true;
                    }
                    if (state) {
                        this.$message({
                            message: `Must be ${format || type}`,
                            type: "warning",
                        });
                        return false;
                    }
                }
                // // 名字校验赋值
                // if (/_([^_]{1,})\./.test(file.name)) {
                //     this.data[name] = /_([^_]{1,})\./.exec(file.name)[1];
                // } else {
                //     this.data[name] = /([^0]{1,})\./.exec(file.name)[1];
                // }

                // 文件大小校验
                if (maxSize || minSize) {
                    // 默认单位是1MB
                    // 默认最大为10GB
                    let size = file.size / 1024 / 1024;
                    maxSize = maxSize || 1024 * 10;
                    minSize = minSize || 0;
                    if (size > maxSize || size < minSize) {
                        this.$message({
                            message: `File size ranges from ${minSize}MB to ${maxSize}MB`,
                            type: "warning",
                        });
                        return true;
                    }
                }
                // 图片比例像素大小限制
                if (type === "image" && obj.limit) {
                    let a = document.createElement("img");
                    a.src = URL.createObjectURL(file);
                    await new Promise((resolve) => {
                        a.onload = () => {
                            resolve();
                        };
                    });
                    if (obj.limit) {
                        if (
                            (obj.limit[2] === "==" &&
                                !(
                                    a.width === obj.limit[0] &&
                                    a.height === obj.limit[1]
                                )) ||
                            (obj.limit[2] === ">" &&
                                !(
                                    a.width > obj.limit[0] &&
                                    a.height > obj.limit[1]
                                )) ||
                            (obj.limit[2] === ">=" &&
                                !(
                                    a.width >= obj.limit[0] &&
                                    a.height >= obj.limit[1]
                                )) ||
                            (obj.limit[2] === "<" &&
                                !(
                                    a.width < obj.limit[0] &&
                                    a.height < obj.limit[1]
                                )) ||
                            (obj.limit[2] === "<=" &&
                                !(
                                    a.width <= obj.limit[0] &&
                                    a.height <= obj.limit[1]
                                ))
                        ) {
                            this.$message({
                                message: "Incorrect size",
                                type: "warning",
                            });
                            return true;
                        }
                    }
                }
                // 上传
                this.disabled2 = true;
                this.uploadFile(
                    file,
                    (url, localUrl) => {
                        // console.log(url);
                        this.disabled2 = false;
                        // this.loadAll[modelName] = false;
                        // 图片上传完毕后再等加载完成再取消掉load状态
                        if (type != "image") {
                            // console.log(1);
                            this.loadAll[modelName] = false;
                        }
                        this.data[modelName] = url;
                        // 需要获取时长进行赋值
                        if (timeModel) {
                            let video = document.createElement("video");
                            video.src = obj.compressionFile
                                ? localUrl
                                : this.$store.state.default_file_url + url;
                            video.onloadeddata = () => {
                                this.data[timeModel] = parseInt(
                                    video.duration * 1000
                                );
                            };
                        }
                    },
                    modelName,
                    dirKey,
                    obj
                );
            };
            files.click();
        },
        // 保存前的校验
        SaveBefore() {
            let state = true;
            // 校验前清空错误提示
            Object.keys(this.errorText).some(
                (item) => (this.errorText[item] = "")
            );
            // must校验
            this.renderData.some((item) => {
                // trim去字符串空格
                if (typeof this.data[item.modelName] === "string") {
                    this.data[item.modelName] =
                        this.data[item.modelName].trim();
                }
                if (
                    item.must &&
                    (!this.data[item.modelName] ||
                        (this.data[item.modelName].constructor === Array &&
                            this.data[item.modelName].length === 0)) &&
                    this.data[item.modelName] !== 0 &&
                    this.data[item.modelName] !== false &&
                    !item.noshow
                ) {
                    // this.$message({
                    //     message: "Please complete all required fields",
                    //     type: "warning",
                    // });
                    this.errorText[item.modelName] = "Can not be empty";
                    state = false;
                    // return true;
                }
                // 穿梭框的特殊must校验
                if(item.type === 'transfer'){
                    let fieldName = ''
                    item.dataRander && item.dataRander.filter(i => i.editor && i.must).some(randerItem => {
                        this.data[item.modelName] && this.data[item.modelName].some(dataItem => {
                            // 只要有一个为空
                            if(!dataItem[randerItem.modelName] && !dataItem[randerItem.modelName] != 0 && !dataItem[randerItem.modelName] != false){
                                state = false
                                fieldName = randerItem.name
                            }
                        })
                    })
                    if(!state && fieldName){
                        this.$message({message:`'${fieldName}' in '${item.key}' cannot be empty`,type:'warning'})
                    }
                }
                // if (
                //     item.type === "input" &&
                //     typeof this.data[item.modelName] === "string"
                // ) {
                //     this.data[item.modelName] = this.data[item.modelName].trim();
                // }
            });
            if (state) {
                let data = this.data
                // Object.keys(this.data).some(item => {
                //     if(this.data[item] || this.data[item] === 0 || this.data[item] === false){
                //         data[item] = this.data[item]
                //     }
                // })
                this.handlerSave ? this.handlerSave(data) : this.defaultSave(data);
            }
        },
        defaultSave(data) {
            this.pageLoadState = true;
            let path = this.add
                ? `/${this.requestHeadLocal}/${this.pageName}/add`
                : `/${this.requestHeadLocal}/${this.pageName}/update`;
            this.$request(
                path,
                data,
                (res) => {
                    this.pageLoadState = false;
                    if (res.data.code === 200)
                        this.$router.push(
                            this.backRouter || `/${this.pageName}-list${this.fromProject?'-proj':''}`
                        );
                },
                "post",
                false,
                true
            );
        },
        async getData() {
            this.pageLoadState = true;
            let data;
            if (this.getDetil) {
                data = await this.getDetil();
            } else {
                data = await new Promise((resolve) => {
                    this.$request(
                        `/${this.requestHeadLocal}/${this.pageName}/detail/${this.pageId}`,
                        {},
                        (res) => {
                            if(res.data.code === 200){
                                resolve(res.data.data)
                            }else{
                                resolve(res.data);
                            }
                        },
                        "get",
                        false,
                        false
                    );
                });
            }
            {
                this.renderData.some((item) => {
                    // 对远程查询的数据进行还原
                    if (item.remote && data[item.modelName]) {
                        if (item.type === "selects") {
                            this.optionsAll[item.options] = data[
                                item.modelName
                            ].map((i) => {
                                return {
                                    value: i[item.idName] || i.id,
                                    label: i[item.labelName],
                                };
                            });
                            data[item.modelName] = data[item.modelName].map(
                                (i) => i[item.idName] || i.id
                            );
                        }
                        if (item.type === "select") {
                            if (data[item.optionModelName]) {
                                this.optionsAll[item.options] = [
                                    // xxxId 对应的 xxx
                                    data[item.optionModelName],
                                ].map((i) => {
                                    return {
                                        // value默认为返回回显数据的id
                                        value: i.id,
                                        label: i[item.labelName],
                                    };
                                });
                            }
                        }
                    }
                    // 对级联数据进行还原
                    if (item.type === "cascader") {
                        data[item.modelName] = [];
                        item.trueModelName.some((name, index) => {
                            data[name] &&
                                (data[item.modelName][index] = data[name]);
                        });
                        // 特殊情况多选两层的情况
                        if(item.multiple){
                            data[item.modelName] = []
                            data[item.trueModelName[1]].some((item2,index) => {
                                data[item.modelName][index] = []
                                data[item.modelName][index][0] = data[item.trueModelName[0]]
                                data[item.modelName][index][1] = item2
                            })
                            if(data[item.trueModelName[1]].length === 0){
                                console.log(1)
                                data[item.modelName] = [ [data[item.trueModelName[0]]] ]
                            }
                        }
                        // 调用cascader选中后的chnage事件
                        this.cascaderChange(data[item.modelName], item);
                    }
                    // 对特殊select的方法进行执行
                    if (item.type === "select") {
                        item.change && this.seletChange(data[item.modelName],item)
                    }
                });
            }
            // 因为data的set是一个回调函数，只能最后赋值
            this.data = data;
            this.pageLoadState = false;
        },
    },
    created() {
        // 状态模块
        {
            // res初始化
            if (this.fromProject) {
                this.requestHeadLocal = "proj";
            }
            if (this.requestHead) {
                this.requestHeadLocal = this.requestHead;
            }
            let id = this.$route.query.id;
            if (this.idFromSession) {
                id = sessionStorage.getItem("projectId");
                id !== "add" && (id = parseInt(id));
            }
            // 复制的数据
            let duplication = this.$route.query.duplication;
            if (duplication) {
                this.duplication = true;
            }
            // add状态判定只使用头部的id = add
            if (this.$route.query.id === "add" || duplication) {
                this.add = true;
            }
            this.pageId = id;
        }
        // pageName初始化
        this.pageName =
            this.pageNameTrue ||
            this.$route.path.match(/\/([a-z A-Z]{1,})-/)[1];
        {
            // render渲染
            let domData = {},
                load = {},
                errorText = {};
            this.renderData.some((item) => {
                // cascader类型提前录入多字段
                if (item.type === "cascader") {
                    item.trueModelName.some((name) => {
                        domData[name] = "";
                    });
                    // 特殊情况，如果之后有三级级联，这里要改
                    if(item.multiple){
                        domData[item.trueModelName[1]] = []
                    }
                }
                // data 空值 初始化
                // 媒体文件时长的字段初始化
                item.timeModel && (domData[item.timeModel] = "");
                domData[item.modelName] = "";
                // 特定 空数组 录入
                if (
                    item.type === "transfer" ||
                    item.type === "selects" ||
                    item.type === "checkboxs"
                ) {
                    domData[item.modelName] = [];
                }
                // 图片类型录入 随机数
                if (item.type === "image") {
                    item.random = parseInt(Math.random() * 100000);
                }
                // 默认值录入
                if (
                    item.defaultData ||
                    item.defaultData === 0 ||
                    item.defaultData === false
                ) {
                    domData[item.modelName] = item.defaultData;
                }
                // load初始化
                load[item.modelName] = false;
                // errorText初始化
                errorText[item.modelName] = "";
            });
            this.$set(this, "data", domData);
            this.$set(this, "loadAll", load);
            this.$set(this, "errorText", errorText);
        }
        // 数据获取模块,不为新增或者为复制
        if (!this.add || this.duplication) {
            this.getData();
        }
    },
    mounted() {
        this.handleLoad && this.handleLoad();
    },
};
</script>

<style scoped>
.editor-all {
    padding: 0 20px 20px;
    display: flex;
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
}
.editor-head {
    color: white;
    background-color: var(--orange);
    border-radius: 8px 8px 0 0;
    height: 50px;
    text-transform: capitalize;
    text-align: left;
    line-height: 50px;
    padding: 0 20px;
}
.editor-con {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-top: 10px;
    background-color: white;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 1190px;
}
.form-con {
    padding: 10px 20px;
    flex: 1;
    overflow: auto;
}
.format {
    text-transform: none;
    font-weight: 400;
    font-size: 13px;
    color: rgb(51, 51, 51);
    box-sizing: border-box;
    padding-top: 4px;
}
.kuai {
    padding: 10px;
    min-height: 50px;
    display: flex;
    border-bottom: 1px solid #eee;
}
.kuai:nth-last-child(1) {
    border-bottom: 0;
}
.kuai-name {
    line-height: 27px;
    font-size: 13px;
    min-width: 160px;
    padding: 0 10px 0 0;
    color: #454545;
    text-align: left;
    font-weight: 800;
}
/* 行的error的样式 */
.kuai-main-error >>> input {
    border-color: #f56c6c;
}
.kuai-error {
    font-size: 12px;
    height: 22px;
    padding-top: 4px;
    box-sizing: border-box;
    text-align: left;
    color: #f56c6c;
}

.kuai .el-input,
.kuai .el-cascader,
.kuai .el-select {
    width: 274px;
}
.kuai .el-input {
    height: 28px;
}
.kuai .rich-text {
    width: 624px;
}
.kuai .el-textarea {
    font-size: 13px;
    width: 624px;
}
.kuai-media {
    display: flex;
}
.kuai-media > *:nth-child(n + 2) {
    margin-left: 40px;
}
.kuai-media video {
    width: 300px;
    height: 50px;
}
.kuai-con {
    display: flex;
    flex-direction: column;
}
.kuai-con >>> * {
    text-transform: none;
}
.kuai-con .right-kuai {
    margin-left: 40px;
}
.kuai-con .el-input >>> input {
    padding: 0 6px;
    padding-right: 60px;
    line-height: normal;
}
.kuai-point {
    font-size: 12px;
    line-height: 28px;
    margin-left: 5px;
}
.image {
    display: flex;
    color: #f56c6c;
}
.image .image-limit {
    font-size: 13px;
    color: rgb(51, 51, 51);
    box-sizing: border-box;
    padding-top: 4px;
}
.image .img {
    height: 100px;
    width: 100px;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    object-fit: contain;
}
.btns {
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 4px;
    border: 1px solid #eee;
    padding: 14px 20px;
    /* padding-left: 200px; */
    text-align: left;
}
</style>