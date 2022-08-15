<template>
    <div>
        <page-editer
            :render="randerArray"
            :modelData.sync="data"
            :fromProject="true"
            :handleLoad="handleLoad"
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
                    key: "Playlist Name",
                    type: "input",
                    modelName: "playlistName",
                    must: true,
                    maxlength: "50",
                },
                {
                    key: "Phone Cover Image",
                    type: "image",
                    modelName: "phoneCoverImgUrl",
                    dirKey: "project-playlist-phone-cover",
                    format: "png",
                },
                {
                    key: "Tablet Cover Image",
                    type: "image",
                    modelName: "tabletCoverImgUrl",
                    dirKey: "project-playlist-tablet-cover",
                    format: "png",
                },
                {
                    key: "Phone Detail Image",
                    type: "image",
                    modelName: "phoneDetailImgUrl",
                    dirKey: "project-playlist-phone-detail",
                    format: "png",
                },
                {
                    key: "Tablet Detail Image",
                    type: "image",
                    modelName: "tabletDetailImgUrl",
                    dirKey: "project-playlist-tablet-detail",
                    format: "png",
                },
                {
                    key: "Subscription",
                    type: "checkbox",
                    modelName: "subscription",
                    aloneLimit: {
                        on: 1,
                        off: 0,
                    },
                    defaultData:0
                },
                {
                    key: "Music List",
                    type: "transfer",
                    modelName: "musicList",
                    transferBase: [],
                    repeat: true,
                    BasekeyID:'id',
                    showRender: [
                        { name: "Display Name", modelName: "displayName",type:'text',width:180},
                        { name: "Music Type", modelName: "musicType",type:'text' },
                    ],
                    searchRander: [
                        {
                            placeholder: "Display Name",
                            modelName: "displayName",
                            type: "input",
                            maxlength: 50,
                        },
                        {
                            placeholder: "Music Type",
                            modelName: "musicType",
                            type: "select",
                            options: "musicType",
                        },
                    ],
                    localSearchRander:[],
                    dataRander:[
                        { name: "Display Name", modelName: "displayName" ,type:'text'},
                        { name: "Subscription", modelName: "subscription",editor:true,aloneLimit:{on:1,off:0},type:'checkbox',default:0,width:60},
                    ],
                    uploadFieldTransform:[
                        { BaseField:'id',UploadField:'resMusicId' }
                    ],
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
                                "/res/music/page",
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
        handleLoad() {},
    },
};
</script>

<style scoped>
</style>