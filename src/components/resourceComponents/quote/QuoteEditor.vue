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
                    key: "Content",
                    type: "textarea",
                    modelName: "quoteContent",
                    must: true,
                    maxlength: "255",
                },
                {
                    key: "Author",
                    type: "input",
                    modelName: "quoteAuthor",
                    must: true,
                    maxlength: "50",
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