<template>
    <div class="list-all">
        <page-list
            :tableRander="tableRander"
            :fromProject="true"
            headBtnsString="no"
            :getList="getList"
            :sortable="sortable"
        ></page-list>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableRander: [
                {
                    viewName: "Playlist Name",
                    modelName: "playlistName",
                    type: "text",
                },
                {
                    viewName: "Phone Cover Image",
                    modelName: "phoneCoverImgUrl",
                    type: "img",
                },
                {
                    viewName: "Phone Detail Image",
                    modelName: "phoneDetailImgUrl",
                    type: "img",
                },
                {
                    viewName: "Music Num",
                    modelName: "musicNum",
                    type: "text",
                },
                {
                    viewName: "Subscription",
                    modelName: "subscription",
                    type: "text",
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
        };
    },
    methods: {
        sortable(tableData){
            this.$request('/proj/playlist/sort',{ idList:tableData.map(i => i.id) },()=>{},'post',false,false)
        },
        getList(){
            return new Promise(resolve => {
                let id = sessionStorage.getItem('projectId')
                this.$request('/proj/playlist/list',{ projId:Number(id)},res => {
                    let list = res.data.data
                    res.data.data = {list:list}
                    resolve(res)
                },'get',false,false)
            })
        }
    },
};
</script>

<style scoped>
.list-all {
}
</style>