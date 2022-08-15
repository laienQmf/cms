<template>
    <div class="project-message">
        <page-editer
            :render="randerArray"
            :modelData.sync="data"
            pageNameTrue="info"
            requestHead="proj"
            :idFromSession="true"
            :handlerSave="Save"
            ref="editorPage"
            backRouter="/projectHome-list"
            :getDetil="getDetil"
            :handleLoad="handleLoad"
            :fromProject="true"
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
                    key: "App Icon",
                    type: "image",
                    modelName: "iconUrl",
                    dirKey: "animation-pad",
                    must: true,
                    limit: [1024, 1024, "=="],
                    maxSize: 5,
                },
                {
                    key: "App Code",
                    type: "input",
                    modelName: "appCode",
                    must: true,
                    maxlength: "30",
                },
                {
                    key: "Apple ID",
                    type: "input",
                    modelName: "appleId",
                    must: true,
                    maxlength: "30",
                },
                {
                    key: "Bundle ID",
                    type: "input",
                    modelName: "bundleId",
                    must: true,
                    maxlength: "64",
                },
                {
                    key: "Apple Store Name",
                    type: "input",
                    modelName: "appStoreName",
                    must: true,
                    maxlength: "100",
                },
                {
                    key: "App Subtitle",
                    type: "input",
                    modelName: "appSubtitle",
                    must: true,
                    maxlength: "100",
                },
                {
                    key: "Scheme",
                    type: "input",
                    modelName: "scheme",
                    maxlength: "64",
                },
                {
                    key: "Dynamic Link API KEY",
                    type: "input",
                    modelName: "webApiKey",
                    maxlength: "64",
                },
                {
                    key: "Dynamic Link",
                    type: "input",
                    modelName: "dynamicLink",
                    maxlength: "64",
                },
                {
                    key: "Campaign Link",
                    type: "input",
                    modelName: "campaignLink",
                    maxlength: "255",
                },
                {
                    key: "Menu",
                    type: "checkboxs",
                    modelName: "menuIds",
                    options: "menuList",
                },
            ],
        };
    },
    methods: {
        // getProjectDetail(){
        //     return new Promise(resolve => {
        //         this.$request('/')
        //     })
        // },
        handleLoad(){
            // 给info默认赋值
            this.data.menuIds = [...this.data.menuIds,1]
        },
        getDetil(){
              return new Promise((resolve) => {
                    let id = sessionStorage.getItem("projectId")
                    this.$request(
                        `/proj/info/detail/${id}`,
                        {},
                        (res) => {
                            let state = false
                            res.data.data.menuIds && res.data.data.menuIds.some(item => {
                                if(item === 1){
                                    state = true
                                }
                            })
                            // 回参把info勾上，避免之前数据没勾上的影响
                            if(!state){
                                res.data.data.menuIds.push(1)
                            }
                            resolve(res.data.data);
                        },
                        "get",
                        false,
                        false
                    );
                });
        },
        Save() {
            this.$refs.editorPage.pageLoadState = true;
            let path = this.$refs.editorPage.add
                ? `/proj/info/add`
                : `/proj/info/update`;
            this.$request(
                path,
                this.$refs.editorPage.data,
                () => {
                    this.$refs.editorPage.pageLoadState = false;
                    if(this.$refs.editorPage.add){
                        this.$router.push('/projectHome-list')
                    }
                    location.reload()
                },
                "post",
                false,
                true
            );
        },
    },
    created() {},
    mounted() {},
};
</script>

<style scoped>
.project-message >>> .editor-all {
    /* max-width: 800px; */
    /* margin: auto; */
}
.project-message >>> .editor-all .img {
    width: 173px;
    height: 173px;
}
/* 隐藏掉backlist按钮 */
/* .project-message >>> .editor-all .btns .back-list{
    display: none;
} */
</style>