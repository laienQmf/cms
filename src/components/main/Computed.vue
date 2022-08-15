<template>
    <div class="computed-con">
        <el-input
            v-model="localModel"
            size="mini"
            @input="inputCheck"
        ></el-input>
        <el-button size="mini" @click="calculate" type="primary"
            >Computed</el-button
        >
    </div>
</template>

<script>
export default {
    props: {
        data: Object,
        computedFunc: Function,
        model: [String, Number],
        errorText: String,
        formatFunc: Function,
        errorTextString: String,
    },
    data() {
        return {};
    },
    computed: {
        allData() {
            return this.data;
        },
        localModel: {
            get() {
                return this.model;
            },
            set(val) {
                this.$emit("update:model", val);
            },
        },
        errorTextTrue: {
            get() {
                return this.errorText;
            },
            set(val) {
                this.$emit("update:errorText", val);
            },
        },
    },
    watch: {
        // localModel同时也是绑定到allData里面的，localModel的修改也会触发
        // allData:{
        //     handler(val){
        //         let data = this.computedFunc(val)
        //         if(data){
        //             this.localModel = data.model
        //             data.errorText && (this.errorTextTrue = data.errorText)
        //         }
        //     },
        //     deep:true,
        //     immediate:true
        // }
    },
    methods: {
        calculate() {
            let data = this.computedFunc(this.allData);
            if (data) {
                let state = this.formatFunc(data.model);
                if (!state) {
                    this.$message({message:this.errorTextString,type:'warning'})
                }
                this.localModel = data.model;
            }
        },
        inputCheck(val) {
            let state = this.formatFunc(val);
            if (!state) {
                this.localModel = "";
            }
        },
    },
};
</script>

<style scoped>
.computed-con {
    display: flex;
}
.computed-con .el-input {
    width: 274px;
    margin-right: 10px;
}
</style>