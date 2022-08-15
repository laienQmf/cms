<template>
    <div class="all">
        <div class="btns" v-for="(item, index) in modules" :key="index">
            <el-input v-model="modules[index]" show-word-limit maxlength="30"></el-input>
            <el-button icon="el-icon-remove" @click="deleteInput(index)" v-show="modules.length > 1"></el-button>
        </div>
        <el-button icon="el-icon-plus" @click="addInput()" v-show="modules.length != 5"></el-button>
    </div>
</template>

<script>
export default {
    props: ["data"],
    data() {
        return {
            modules: [],
        };
    },
    methods: {
        addInput() {
            this.modules.push("");
        },
        deleteInput(index){
          this.modules.splice(index,1)
        }
    },
    computed: {
        datas: {
            get() {
                return this.data;
            },
            set(val) {
                this.$emit("update:data", val);
            },
        },
    },
    watch: {
        datas(val) {
            this.modules = val.split("\n");
        },
        modules: {
            handler(val) {
                // console.log(val)
                if(typeof val === 'object'){
                    let array = []
                    val.some(item => {
                        // if(item){
                            array.push(item)
                        // }
                    })
                    val = array
                    // console.log(val)
                }
                let data = val.join("\n");
                // console.log(data)
                if (this.datas === data) {
                    return true;
                }
                this.datas = data;
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
.all{
  height: 240px;
}
.btns {
    display: flex;
    margin-bottom: 2px;
}
</style>