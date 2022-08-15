<template>
    <div class="list-all">
        <page-list
            :tableRander="tableRander"
            :searchRander="searchRander"
            headBtnsString="deletes"
            ref="listPage"
        ></page-list>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageName:'sound',
            tableRander: [
                {
                    viewName: "Content",
                    modelName: "quoteContent",
                    type: "text",
                    jump:true
                },
                {
                    viewName: "Author",
                    modelName: "quoteAuthor",
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
                    funcs: "view,delete",
                    type: "option",
                },
            ],
            searchRander: [
                {
                    placeholder: "Author",
                    modelName: "quoteAuthor",
                    type: "input",
                    maxlength: 50,
                },
                {
                    placeholder: "Content",
                    modelName: "quoteContent",
                    type: "input",
                    maxlength: 255,
                },
            ],
        };
    },
    methods: {
    },
};
</script>

<style scoped>
.list-all {
    min-width: 1280px;
}
</style>