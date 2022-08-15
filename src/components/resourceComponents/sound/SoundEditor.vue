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
                    key: "Sound Name",
                    type: "input",
                    modelName: "soundName",
                    must: true,
                    maxlength: "100",
                },
                {
                    key: "Sound Script",
                    type: "textarea",
                    modelName: "soundScript",
                    must: true,
                    maxlength: "500",
                },
                {
                    key: "Sound Type",
                    modelName:'soundTypeMain',
                    trueModelName:['soundType','soundSubType'],
                    must: true,
                    type: "cascader",
                    options:'soundType'
                },
                {
                    key: "Female",
                    type: "audio",
                    modelName: "femaleUrl",
                    dirKey:'sound-female',
                    format: "mp3",
                    compressionFile:true,
                    maxSize:5,
                },
                {
                    key: "Female Robot",
                    type: "audio",
                    modelName: "femaleRobotUrl",
                    dirKey:'sound-female-robot',
                    format: "mp3",
                    compressionFile:true,
                    maxSize:5,
                },
                {
                    key: "Male",
                    type: "audio",
                    modelName: "maleUrl",
                    dirKey:'sound-male',
                    format: "mp3",
                    compressionFile:true,
                    maxSize:5,
                },
                {
                    key: "Male Robot",
                    type: "audio",
                    modelName: "maleRobotUrl",
                    dirKey:'sound-male-robot',
                    format: "mp3",
                    compressionFile:true,
                    maxSize:5,
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