<template>
    <div class="account-detil">
        <div class="row-con">
            <div
                class="row-item"
                v-for="item in randerArray"
                :key="item.modelName"
            >
                <div class="item-main">
                    <div class="main-text">
                        <span style="color: red" v-if="item.must">*</span
                        >{{ item.key }}
                    </div>
                    <div class="main-value-con">
                        <div
                            v-show="editor"
                            :class="
                                !errorData[item.modelName] ? '' : 'error-input'
                            "
                        >
                            <el-input
                                size="mini"
                                v-if="item.type === 'input'"
                                v-model="modelData[item.modelName]"
                                :maxlength="item.maxlength"
                                show-word-limit
                                @focus="item.focus?item.focus():(errorData[item.modelName] = '')"
                                :placeholder="item.placeholder || 'input'"
                                :disabled="(item.noEditor && !add)"
                            ></el-input>
                            <el-select
                                size="mini"
                                v-if="item.type === 'select'"
                                v-model="modelData[item.modelName]"
                                @focus="errorData[item.modelName] = ''"
                                :disabled="item.disabled"
                                :placeholder="item.placeholder || 'select'"
                                @change="
                                    (val) => item.select && item.select(val)
                                "
                            >
                                <el-option
                                    v-for="option in item.options"
                                    :key="option.id"
                                    :label="option.label"
                                    :value="option.value"
                                ></el-option>
                            </el-select>
                        </div>
                        <div class="main-value" v-show="!editor">
                            <div v-if="item.type != 'select'">
                                {{ modelData[item.modelName] }}
                            </div>
                            <div v-else>
                                {{
                                    $searchOptionName(
                                        item.options,
                                        modelData[item.modelName]
                                    )
                                }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-error">
                    {{ errorData[item.modelName] }}
                </div>
            </div>
        </div>
        <div class="item-main permission-con">
            <div class="main-text">Permission:</div>
            <div class="main-value-con permission-tree">
                <el-tree
                    ref="tree-dom"
                    :data="permissionTree"
                    show-checkbox
                    node-key="permsId"
                    :props="defaultProps"
                    :default-expanded-keys="permission"
                >
                </el-tree>
            </div>
        </div>
        <div class="btns">
            <el-button
                type="primary"
                size="small"
                v-show="editor"
                @click="uploadUserData"
                v-if="(permissionPage.add && add) || permissionPage.editor"
                >Confirm</el-button
            >
            <el-button
                type="primary"
                size="small"
                v-show="!editor"
                @click="editor = true"
                v-if="permissionPage.editor"
                >Edit</el-button
            >
            <el-button size="small" @click="$router.push('/accountManage-list')"
                >Back to List</el-button
            >
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            editor: false,
            add: false,
            randerArray: [
                {
                    type: "input",
                    key: "Account:",
                    modelName: "userName",
                    must: true,
                    maxlength: 20,
                    noEditor:true,
                },
                {
                    type: "input",
                    key: "Password:",
                    modelName: "password",
                    must: true,
                    maxlength: 12,
                    focus:() => {
                        this.errorData.password = '';
                        this.modelData.password === '************' && (this.modelData.password = '')
                    }
                },
                {
                    type: "input",
                    key: "Name:",
                    modelName: "realName",
                    must: true,
                    maxlength: 50,
                },
                {
                    type: "select",
                    key: "Status:",
                    modelName: "status",
                    must: true,
                    options: [],
                },
                {
                    type: "select",
                    key: "Team:",
                    modelName: "deptId",
                    must: true,
                    options: [],
                    select: (val) => {
                        this.permission = [];
                        this.$request(
                            `/sys/perms/listByDept/${val}`,
                            {},
                            (res) => {
                                let array = res.data.data.map((i) => i.permsId);
                                this.$refs["tree-dom"].setCheckedKeys(array);
                                this.permission = array;
                            },
                            "get",
                            false,
                            false
                        );
                    },
                },
            ],
            defaultProps: {
                label: "permsName",
                children: "subPerms",
            },
            modelData: {},
            errorData: {},
            permission: [],
            permissionTree: [],
            passwordBackUp:''
        };
    },
    watch: {
        userStatusOptions: {
            handler(val) {
                this.randerArray.some((item) => {
                    if (item.modelName === "status") {
                        item.options = val;
                    }
                });
            },
            immediate: true,
        },
        teamList: {
            handler(val) {
                this.randerArray.some((item) => {
                    if (item.modelName === "deptId") {
                        item.options = val;
                    }
                });
            },
            immediate: true,
        },
        // 节点数据变化后赋值给本地，用本地变量保存方便给tree节点其赋值
        permissionTreeData: {
            handler(val) {
                this.permissionTree = this.$deepCopy(val);
                this.treeReRander();
            },
            immediate: true,
        },
        // editor 和 tree变化都重现渲染一次真正的tree
        editor: {
            handler() {
                this.treeReRander();
            },
            immediate: true,
        },
    },
    computed: {
        permissionPage() {
            return this.$store.state.permissionPage.user;
        },
        userStatusOptions() {
            return this.$store.state.optionBase.resourceStatus2;
        },
        teamList() {
            return this.$store.state.optionBase.TeamList;
        },
        // 动态绑定tree节点
        permissionTreeData() {
            let permission = this.$store.state.permissionTree;
            return permission;
        },
    },
    methods: {
        createPassword() {
            let a = "abcdefghijklmnopqrstuvwxyz";
            a += a.toUpperCase();
            a += "0123456789";
            let password = "";
            // 固定12位，随机一位必定有数字，随机一位必定有字母
            let digital = parseInt(Math.random() * 12)
            let alphabet = parseInt(Math.random() * 12)
            if(digital === alphabet){
                alphabet++;
                alphabet === 11 && (alphabet = 0)
            }
            for (let i = 0; i < 12; i++) {
                // 0-9 a-z A-Z 62个字符
                let random = parseInt(Math.random() * 62);
                if(i === digital){
                    random = parseInt(Math.random() * 10) + 52;
                }
                if(i === alphabet){
                    random = parseInt(Math.random() * 52);
                }
                password += a[random];
            }
            this.modelData.password = password;
        },
        treeReRander() {
            let permissionTree = this.$deepCopy(this.permissionTree);
            let _this = this;
            function allDisabled(doms) {
                doms.some((item) => {
                    item.disabled = !_this.editor;
                    if (item.subPerms.length > 0) {
                        allDisabled(item.subPerms);
                    }
                });
            }
            allDisabled(permissionTree);
            this.$set(this, "permissionTree", permissionTree);
        },
        uploadUserData() {
            // 空校验
            {
                let state = false;
                this.randerArray.some((item) => {
                    // 为空
                    if (!this.modelData[item.modelName]) {
                        this.errorData[item.modelName] = `Please ${
                            item.type
                        } ${item.key.toLowerCase()}`;
                        state = true;
                    }
                });
                // 密码格式校验
                {
                    let password = this.modelData.password;
                    // 修改时跳过格式校验 或者 password为空报错
                    if(password === '************' || this.errorData.password){
                        1
                    }
                    else if (
                        !/[0-9]/.test(password) ||
                        !(/[a-z]/.test(password) || /[A-Z]/.test(password)) ||
                        password.length < 8
                    ) {
                        this.errorData.password =
                            "Password must contain both number and letter with 8-12 characters";
                        state = true;
                    }
                }
                if (state) return true;
            }
            // 数据转化格式
            let url = this.add ? "/sys/user/add" : "/sys/user/update";
            // 获取权限id赋值
            let data = {
                ...this.modelData,
                // 子节点和父节点
                permsIds: [
                    ...this.$refs["tree-dom"].getCheckedKeys(),
                    ...this.$refs["tree-dom"].getHalfCheckedKeys(),
                ],
            };
            // 密码未修改赋backup的密码，密码修改了md5加密
            if(data.password === '************'){
                data.password = this.passwordBackUp
            }else{
                data.password = this.$md5(data.password)
            }
            // Object.keys(this.errorData).some(i => this.errorData[i] = '')
            this.$request(
                url,
                data,
                (res) => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: res.data.message,
                            type: "success",
                        });
                        this.$router.push("/accountManage-list");
                    } else if (res.data.message === "Account existed") {
                        this.errorData.userName = "Account existed";
                    }
                },
                "post",
                true,
                false
            );
        },
    },
    created() {
        // 基础数据模块
        {
            this.randerArray.some((item) => {
                this.$set(this.modelData, item.modelName, "");
                this.$set(this.errorData, item.modelName, "");
                // 设定默下拉框认值
                if (item.modelName === "status") {
                    this.modelData[item.modelName] = 1;
                }
            });
        }
        // 状态模块
        {
            let id = this.$route.query.id;
            if (id === "add") {
                this.editor = true;
                this.add = true;
                // 随机生成密码
                this.createPassword();
                // add禁用Status
                this.randerArray.some((item) => {
                    if (item.modelName === "status") {
                        item.disabled = true;
                    }
                });
            } else {
                this.$request(
                    `/sys/user/detail/${id}`,
                    {},
                    (res) => {
                        let data = res.data.data;
                        this.passwordBackUp = data.password
                        //已有账号显示12位*占位
                        data.password = '************'
                        this.modelData = data;
                        let array = data.permsData.map((i) => i.permsId);
                        this.$refs["tree-dom"].setCheckedKeys(array);
                        this.permission = array;
                    },
                    "get",
                    true,
                    false
                );
            }
        }
    },
};
</script>

<style scoped>
.account-detil {
    width: 1100px;
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
    margin: 15px auto;
    border-radius: 15px;
    background-color: white;
    padding: 20px 0;
}
.row-con {
    display: flex;
    flex-wrap: wrap;
    height: 174px;
}
.item-main {
    display: flex;
    margin-right: 50px;
    align-items: center;
}
.item-main .main-text {
    width: 150px;
    text-align: right;
    margin-right: 10px;
    margin-left: 50px;
    font-size: 14px;
}
.item-main .main-value {
    font-size: 14px;
    text-align: left;
}
.item-main .main-value-con {
    width: 250px;
}
.item-main .main-value-con .el-select {
    width: 100%;
}
.error-input >>> input {
    border-color: #f56c6c;
}
.item-error {
    height: 30px;
    color: #f56c6c;
    font-size: 12px;
    text-align: left;
    margin-left: 160px;
    box-sizing: border-box;
    padding-top: 4px;
}
.permission-con {
    align-items: flex-start;
}
.permission-tree {
    flex: 1;
    height: 550px;
    overflow-y: auto;
}
.btns .el-button {
    margin: 0 100px;
    margin-top: 50px;
}
</style>