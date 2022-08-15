<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    let hei = document.documentElement.clientHeight;
    let wid = document.documentElement.clientWidth;
    this.$store.commit("modifyData", { name: "wid", newdata: wid });
    this.$store.commit("modifyData", { name: "hei", newdata: hei });
    if (wid < 769) {
      document.documentElement.style.fontSize = wid / 20 + "px";
    }
    window.onresize = () => {
      let hei = document.documentElement.clientHeight;
      let wid = document.documentElement.clientWidth;
      this.$store.commit("modifyData", { name: "wid", newdata: wid });
      this.$store.commit("modifyData", { name: "hei", newdata: hei });
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
