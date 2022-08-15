<template>
    <div>
        <page-editer
            :render="randerArray"
            :modelData.sync="data"
            :handleLoad="handleLoad"
            draftMustFields="animationName"
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
                    key: "Animation Name",
                    type: "input",
                    modelName: "animationName",
                    must: true,
                    maxlength: "100",
                },
                {
                    key: "Phone Animation",
                    type: "image",
                    modelName: "animationPhoneUrl",
                    dirKey:'animation-phone',
                    must: true,
                    format: "gif",
                    limit:[640,360,'==']
                },
                {
                    key: "Pad Animation",
                    type: "image",
                    modelName: "animationTabletUrl",
                    dirKey:'animation-pad',
                    must: true,
                    format: "gif",
                    limit:[768,335,'==']
                },
                {
                    key: "Thumbnail Animation",
                    type: "image",
                    modelName: "animationCoverUrl",
                    dirKey:'animation-thumbnail',
                    must: true,
                    format: "png",
                    limit:[256,145,'==']
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