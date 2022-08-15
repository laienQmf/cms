<template>
  <div>
    <div class="conta" :style="'height:' + hei + 'px'">
      <div class="conta2">
        <div class="header">Content Management2 System</div>
        <div class="input">
          <div>Account</div>
          <input :class="accountError?'errorInput':''" placeholder="account" v-model="account" @focus="accountError = ''"/>
        </div>
        <div class="error">{{ accountError }}</div>
        <div class="input">
          <div>Password</div>
          <input
          :class="passwordError?'errorInput':''"
            v-model="password"
            placeholder="password"
            @keyup.enter="login"
            type="password"
          />
        </div>
        <div class="error">{{ passwordError }}</div>
        <el-button class="btn" type="primary" @click="login">Sign in</el-button>
        <div class="end-con">
          <!-- <div @click="$router.push('/register')">Register</div> -->
        </div>
      </div>
      <!-- <div class="mobile_c">
                <div class="mobile_c_title">后台管理系统</div>
                <p style="height:1rem"></p>
                <div class="input2">
                    <input placeholder="账号" v-model="account"/>
                </div>
                <div class="input2">
                    <input  placeholder="密码" v-model="password" type="password"/>
                </div>
                <p style="height:3rem"></p>
                <el-button class="btn" type="primary" @click="login">登录</el-button>
            </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      password: '',
      verify:true,
      accountError:'',
      passwordError:'',
    };
  },
  computed:{
    hei(){
      return this.$store.state.hei
    }
  },
  methods: {
    login() {
      if(!this.password){
        this.passwordError = 'Please input password'
      }
      if(!this.account){
        this.accountError = 'Please input account'
      }
      if(!this.account || !this.password){
        return false
      }
      // 都存在清掉error
      this.accountError = ''
      this.passwordError = ''
      //一段请求
      // if (!this.account || !this.password) {
      //   return this.$message({
      //     message: "Account password cannot be empty",
      //     type: "warning",
      //   });
      // }
      // this.$request(
      //   "/manage/user/login",
      //   {
      //     username: this.account,
      //     password: this.$md5(this.password),
      //   },
      //   (res) => {
      //     if (res.data.code === 200) {
      //       this.$message({ message: res.data.message, type: "success" });
      //       this.localDown(res.data.data.token);
      //       localStorage.setItem("username", res.data.data.userName);
      //       this.$store.commit("modifyData", {
      //         name: "username",
      //         newdata: res.data.data.userName,
      //       });
      //       this.$router.push(this.$store.state.defineNowPath);
      //     }
      //   //   else{
      //   //       this.$message({message:res.data.message,type:'warning'})
      //   //   }
      //   }
      // );
      let loading = this.$loading.service()
      this.$request('/sys/user/login',{
        password:this.$md5(this.password),
        userName:this.account
      },(res) => {
        loading.close()
        if(res.data.code === 200){
          let token = res.data.data.token
          this.$store.commit('modifyData',{name:'token',newdata:token})
          this.localDown(token)
          this.$router.push(this.$store.state.defineNowPath)
        }
      },'post',false,false)
    },
    change(val){
      console.log(val)
    },
    localDown(token) {
      localStorage.setItem("token", token);
    },
  },
  created() {
  },
};
</script>
<style scoped>
.conta {
  /* background-color: rgba(50, 65, 87); */
  background-color: rgba(0, 0, 0, 0.7);
  height: 500px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media screen and (min-width: 769px) {
  .mobile_c {
    display: none;
  }
  .conta2 {
    width: 500px;
    height: 270px;
    background-color: white;
    border-radius: 5px;
    box-sizing: border-box;
    position: relative;
    padding: 50px;
  }
  .header {
    position: absolute;
    top: -80px;
    left: 0;
    right: 0;
    text-align: center;
    color: white;
    font-size: 30px;
  }
  .error{
    height: 30px;
    color: #f56c6c;
    text-align: left;
    font-size: 12px;
    margin-left: 100px;
    padding-top: 3px;
  }
  .input {
    width: 100%;
    margin: auto;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .input > div{
    text-align: left;
    min-width: 80px;
  }
  .input input {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    outline: none;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    padding: 0 15px;
    font-size: 15px;
    margin-left: 20px;
  }
  .input input:focus {
    border: 1px solid rgb(102, 177, 255) !important;
  }
  .input input:hover {
    border-color: rgba(0, 0, 0, 0.3);
  }
  .input input::-webkit-input-placeholder {
    color: rgba(0, 0, 0, 0.2);
  }
  .btn {
    width: 40%;
    height: 40px;
    color: white;
  }
  .end-con {
      color: #409EFF;
      font-size: 12px;
      display: flex;
      flex-direction: row-reverse;
      width: 80%;
      margin: auto;
      margin-top: 10px;
  }
  .end-con > div{
      cursor: pointer;
  }
}
</style>