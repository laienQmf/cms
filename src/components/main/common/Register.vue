<template>
  <div class="all" :style="`height:${hei}px`">
    <div class="con">
      <div class="t1">Sign Up</div>
      <p style="height: 30px; color: black"></p>
      <div class="name">Account</div>
      <div
        style="
          font-size: 12px;
          color: rgba(0, 0, 0, 0.5);
          text-align: left;
          margin-bottom: 5px;
        "
      >
        Please use the company email to sign up
      </div>
      <el-input
        v-model="table.username"
        @focus="state.username = ''"
        @blur="
          () => {
            if (!table.username) {
              return (state.username = 'An username is required');
            }
          }
        "
      ></el-input>
      <p>
        <span v-show="state.username"
          ><i class="el-icon-warning-outline" style="margin-right: 5px"></i
          >{{ state.username }}</span
        >
      </p>
      <div class="name">Password</div>
      <el-input
        @blur="
          () => {
            if (!table.password) {
              return (state.password = 'A password is required.');
            }
            (table.password != table.password2 &&
              (state.password2 = `The passwords don\'t match.`)) ||
              (state.password2 = '');
          }
        "
        v-model="table.password"
        @focus="state.password = ''"
        type="password"
      ></el-input>
      <p>
        <span v-show="state.password"
          ><i class="el-icon-warning-outline" style="margin-right: 5px"></i
          >{{ state.password }}</span
        >
      </p>
      <div class="name">Confirm password</div>
      <el-input
        @blur="
          () => {
            if (!table.password2) {
              return (state.password2 = 'You must confirm your password');
            }
            (table.password != table.password2 &&
              (state.password2 = `The passwords don\'t match.`)) ||
              (state.password2 = '');
          }
        "
        v-model="table.password2"
        @focus="state.password2 = ''"
        type="password"
      ></el-input>
      <p>
        <span v-show="state.password2"
          ><i class="el-icon-warning-outline" style="margin-right: 5px"></i
          >{{ state.password2 }}</span
        >
      </p>
      <!-- <div class="t1">Optional</div>
      <el-input v-model="table.userRealName" placeholder="name"></el-input>
      <p>{{ state.userRealName }}</p>
      <el-input v-model="table.sex" placeholder="sex"></el-input>
      <p>{{ state.sex }}</p>
      <el-input v-model="table.mobile" placeholder="phone"></el-input>
      <p >{{ state.mobile }}</p> -->
      <el-button
        :disabled="!!state.username || !!state.password || !!state.password2"
        type="primary"
        @click="register"
        >Sign Up</el-button
      >
      <div class="end-con">
        <div @click="$router.push('/login')">return to login</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hei: 0,
      table: {
        username: "",
        password: "",
        password2: "",
      },
      state: {
        username: "",
        password: "",
        password2: "",
      },
    };
  },
  methods: {
    register() {
    //   let state = false;
    //   Object.keys(this.table).some((item) => {
    //     if (!this.table[item]) {
    //       state = true;
    //       this.state[item] = `${item} cannot be empty`;
    //     }
    //   });
    //   if (state) {
    //     return true;
    //   }
    if(!this.table.password){
        return this.state.password = 'A password is required.'
    }
    if(!this.table.password2){
        return this.state.password2 = 'You must confirm your password'
    }
      this.$request(
        "/manage/user/register",
        {
          userName: this.table.username,
          password: this.$md5(this.table.password),
        },
        (res) => {
          if (res.data.code === 200) {
            this.$message({ message: res.data.message, type: "success" });
            this.$router.push("/login");
          } else {
            if (res.data.message === "The account format is not valid.") {
              return this.state.username = res.data.message;
            }
            this.$message({ message: res.data.message, type: "warning" });
          }
        },'post',true,false
      );
    },
  },
  created() {
    this.hei = innerHeight;
    window.onresize = () => {
      this.hei = innerHeight;
    };
  },
};
</script>

<style scoped>
.all {
  background-color: rgba(50, 65, 87);
  display: flex;
  justify-content: center;
  align-items: center;
}
.con {
  background-color: white;
  /* height: 370px; */
  width: 500px;
  margin: auto;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 40px;
}
.con p {
  font-size: 12px;
  text-align: left;
  /* padding: 0 12px; */
  color: #f56c6c;
  height: 30px;
  margin-top: 5px;
}
.name {
  margin-bottom: 6px;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
}
.t1 {
  text-align: left;
  color: black;
  font-weight: 800;
  margin: 10px 0;
  font-size: 20px;
  /* margin-left: 20px; */
}
.el-button {
  width: 100%;
  margin-top: 30px;
}
.end-con {
  color: #409eff;
  font-size: 12px;
  display: flex;
  flex-direction: row-reverse;
  margin: auto;
  margin-top: 10px;
}
.end-con > div {
  cursor: pointer;
}
</style>