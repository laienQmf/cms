<template>
    <div class="reminder">
        <page-editer
            :render="randerArray"
            :modelData.sync="data"
            :fromProject="true"
            ref="editerPage"
            :handlerSave="handlerSave"
            backRouter="/reminder-list-proj"
            :getDetil="getDetil"
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
                    key: "Reminder List",
                    type: "transfer",
                    modelName: "idList",
                    BasekeyID: "id",
                    sortable:false,
                    showRender: [
                        {
                            name: "Id",
                            modelName: "id",
                            type: "text",
                            width: "50",
                        },
                        {
                            name: "Title",
                            modelName: "title",
                            type: "text",
                        },
                    ],
                    searchRander: [
                        {
                            placeholder: "Title",
                            modelName: "title",
                            type: "input",
                            maxlength: 50,
                        },
                        {
                            placeholder: "Content",
                            modelName: "content",
                            type: "input",
                            maxlength: 255,
                        },
                    ],
                    dataRander: [
                        {
                            name: "Id",
                            modelName: "id",
                            type: "text",
                            width: "50",
                        },
                        {
                            name: "Title",
                            modelName: "title",
                            type: "text",
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
                                ...config,
                            };
                            this.$request(
                                "/res/reminder/page",
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
            data.idList = data.idList.map(i => i.id)
            this.$refs.editerPage.pageLoadState = true;
            this.$request(
                '/proj/reminder/add',
                data,
                (res) => {
                    this.$refs.editerPage.pageLoadState = false;
                    if (res.data.code === 200)
                        this.$router.push('/reminder-list-proj');
                },
                "post",
                false,
                true
            );
        },
        getDetil() {
            return new Promise((resolve) => {
                this.$request(
                    "/proj/reminder/page",
                    {},
                    (res) => {
                        res.data.data = {
                            idList: res.data.data,
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
.reminder >>> .editor-all .btns .back-list{
    display: none;
}
</style>