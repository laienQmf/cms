<template>
    <div>
        <page-editer
            :render="randerArray"
            :modelData.sync="data"
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
                    key: "Title",
                    type: "input",
                    modelName: "title",
                    must: true,
                    maxlength: "50",
                },
                {
                    key: "Content",
                    type: "textarea",
                    modelName: "content",
                    must: true,
                    maxlength: "255",
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