<template>
    <div class="my-account">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>Account Password</span>
            </div>
            <div class="show-list" v-show="!editor">
                <div class="show-item">
                    <div>Account:</div>
                    <div>{{ userData.userName }}</div>
                </div>
                <div class="show-item">
                    <div>Password:</div>
                    <div>************</div>
                </div>
                <div class="show-item">
                    <div>Name:</div>
                    <div>{{ userData.realName }}</div>
                </div>
                <div class="show-item">
                    <div>Team:</div>
                    <div>{{ userData.dept }}</div>
                </div>
                <div style="text-align: center">
                    <el-button
                        type="primary"
                        size="small"
                        @click="editor = true"
                        >Reset Password</el-button
                    >
                </div>
            </div>
            <div class="show-list" v-show="editor">
                <div class="show-item">
                    <div>Account:</div>
                    <div>{{ userData.userName }}</div>
                </div>
                <div class="show-item">
                    <div>Old Password:</div>
                    <el-input
                        maxlength="12"
                        show-word-limit
                        size="small"
                        v-model="passwordOld"
                        type="password"
                    ></el-input>
                </div>
                <div class="show-item">
                    <div>New Password:</div>
                    <el-input
                        maxlength="12"
                        show-word-limit
                        size="small"
                        v-model="password"
                        type="password"
                    ></el-input>
                </div>
                <div class="show-item">
                    <div>Confirm New Password:</div>
                    <el-input
                        maxlength="12"
                        show-word-limit
                        size="small"
                        v-model="passwordRe"
                        type="password"
                    ></el-input>
                </div>
                <div class="show-item">
                    <div>Name:</div>
                    <div>{{ userData.realName }}</div>
                </div>
                <div class="show-item">
                    <div>Team:</div>
                    <div>{{ userData.dept }}</div>
                </div>
                <div style="text-align: center">
                    <el-button type="primary" size="small" @click="Save"
                        >Save</el-button
                    >
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            trueData: {},
            editorData: {},
            editor: false,
            password: "",
            passwordOld: "",
            passwordRe: "",
        };
    },
    computed: {
        userData() {
            return this.$store.state.userData;
        },
    },
    watch: {
        userData: {
            handler(val) {
                this.editorData = this.$deepCopy(val);
                console.log(this.editorData);
            },
            deep: true,
        },
    },
    methods: {
        Save() {
            let password = this.password;
            let name = "";
            if (!this.password) {
                name = "New Password";
            }
            if (!this.passwordRe) {
                name = "Confirm New Password";
            }
            if (!this.passwordOld) {
                name = "Old Password";
            }
            if (name) {
                this.$message({
                    message: `Please input '${name}'`,
                    type: "warning",
                });
                return true;
            }
            if (
                !/[0-9]/.test(password) ||
                !(/[a-z]/.test(password) || /[A-Z]/.test(password)) ||
                password.length < 8
            ) {
                this.$message({
                    message:
                        "Password must contain both number and letter with 8-12 characters",
                    type: "warning",
                });
                return true;
            }
            if (this.password != this.passwordRe) {
                return this.$message({
                    message: "The two entered passwords do not match",
                    type: "warning",
                });
            }
            this.$request('/sys/user/updatePwd',{
              oldPassword:this.$md5(this.passwordOld),
              password:this.$md5(this.password)
            },(res) => {
              if(res.data.code === 200){
                this.editor = false
              }
            },'post',true,true)
        },
    },
};
</script>

<style scoped>
.my-account {
    max-width: 1300px;
    margin: auto;
    text-align: left;
    padding: 20px;
}
.show-item {
    display: flex;
    margin: 30px 0;
    align-items: center;
}
.show-item > div:nth-of-type(1) {
    width: 200px;
    text-align: right;
    margin-right: 20px;
}
.show-item .el-input {
    width: 250px;
}
</style>