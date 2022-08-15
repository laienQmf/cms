<template>
    <div class="list-all">
        <el-dialog :visible.sync="boxShow" :modal="false">
            <div>
                <el-input type="textarea"></el-input>
            </div>
        </el-dialog>
        <page-list
            :tableRander="tableRander"
            :customAdd="customAdd"
            headBtnsString="deletes"
            ref="listPage"
            :getList="getList"
        ></page-list>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableRander: [
                {
                    viewName: "Keyword",
                    modelName: "keyword",
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
                    viewName: "Options",
                    funcs: "delete",
                    type: "option",
                },
            ],
            boxShow: false,
        };
    },
    methods: {
        customAdd() {
            // this.boxShow = true
            this.$prompt("Please input keywords", "", {
                confirmButtonText: "confirm",
                cancelButtonText: "cancel",
                inputPattern: /^[^]{1,50}$/,
                inputErrorMessage: "Length limit bits 1 to 50",
            })
                .then(({ value }) => {
                    let key = value.trim();
                    if (key) {
                        key = key.split(",");
                        // 去重
                        key = [...new Set(key)];
                        this.$request(
                            "/res/keyword/addBatch",
                            { keyWords: key },
                            () => {
                                this.$refs.listPage.getData();
                            },
                            "post",
                            true,
                            true
                        );
                    }
                })
                .catch(() => {});
        },
        getList(){
            return new Promise(resolve => {
                this.$request('/res/keyword/list',{},res => {
                    res.data.data.list = res.data.data
                    resolve(res)
                },'get',false,false)
            })
        }
    },
};
</script>

<style scoped>
.list-all {
    min-width: 1280px;
}
.list-all >>> .all .el-pagination{
    display: none;
}
</style>