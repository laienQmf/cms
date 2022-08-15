<template>
    <div class="list-all">
        <page-list
            :tableRander="tableRander"
            :fromProject="true"
            :searchRander="searchRander"
            headBtnsString="deletes,enables,disableds"
        ></page-list>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableRander: [
                {
                    viewName: "Workout Name",
                    modelName: "workoutName",
                    type: "text",
                },
                {
                    viewName: "Cover Image",
                    modelName: "imgCoverPhone",
                    type: "img",
                },
                {
                    viewName: "Detail Image",
                    modelName: "imgDetailPhone",
                    type: "img",
                },
                {
                    viewName: "Status",
                    modelName: "status",
                    type: "select",
                    options: "resourceStatus",
                },
                {
                    viewName: "Difficulty",
                    modelName: "difficulty",
                    type: "text",
                },
                {
                    viewName: "Intensity",
                    modelName: "intensity",
                    type: "text",
                },
                {
                    viewName: "Type",
                    modelName: "workoutType",
                    type: "text",
                },
                {
                    viewName: "Calorie",
                    modelName: "calorie",
                    type: "text",
                },
                {
                    viewName: "Time",
                    modelName: "duration",
                    type: "text",
                },
                {
                    viewName: "Subscription",
                    modelName: "subscription",
                    type: "custom",
                    custom(row){
                        let state = ''
                        if(row.subscription){
                            state = '√'
                        }
                        return state
                    }
                },
                {
                    viewName: "Short Link",
                    modelName: "shortLink",
                    type: "text",
                },
                {
                    viewName: "Create Time",
                    modelName: "createTime",
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
                    placeholder: "Workout Name",
                    modelName: "workoutName",
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
                    modelName: ["startCreateDate", "endCreateDate"],
                    type: "dates",
                },
                {
                    placeholder: "Intensity",
                    modelName: "intensity",
                    type: "select",
                    uploadLabel:true,
                    options: [
                        {label:'level 1'},
                        {label:'level 2'},
                        {label:'level 3'},
                    ],
                },
                {
                    placeholder: "Difficulty",
                    modelName: "difficulty",
                    type: "select",
                    uploadLabel:true,
                    options: [
                        {label:'Beginner'},
                        {label:'Intermediate'},
                        {label:'Advanced'},
                    ],
                },
                {
                    placeholder: "Type",
                    modelName: "workoutType",
                    type: "select",
                    options: 'workoutType',
                },
                {
                    placeholder: "Subscription",
                    modelName: "subscription",
                    type: "select",
                    options: 'subscription',
                },
            ],
        };
    },
    methods: {},
};
</script>

<style scoped>
.list-all {
}
</style>