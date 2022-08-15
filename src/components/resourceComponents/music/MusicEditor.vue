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
                    key: "Music Name",
                    type: "input",
                    modelName: "musicName",
                    must: true,
                    maxlength: "100",
                },
                {
                    key: "Display Name",
                    type: "input",
                    modelName: "displayName",
                    must: true,
                    maxlength: "100",
                },
                {
                    key: "Audio",
                    type: "audio",
                    modelName: "audio",
                    dirKey:'music-audio',
                    must:true,
                    timeModel:'audioDuration',
                    compressionFile:true,
                    format: "mp3",
                },
                {
                    key:'Type',
                    type:'select',
                    options:'musicType',
                    modelName:'musicType',
                    must:true
                }
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