<template>
  <div class="swicth-con" @touchstart="data2 = !data2" :style="data2?'background-color:#EF025E':''">
    <div class="swicth-huakuai" :style="data2?'left:23px':''"></div>
  </div>
</template>

<script>
export default {
    props:['data'],
    computed:{
        data2:{
            get(){
                return this.data
            },
            set(val){
                this.$emit('update:data',val)
            }
        },
    },
};
</script>

<style scoped>
.swicth-con {
  width: 51px;
  height: 31px;
  background-color: #dedee0;
  border-radius: 20px;
  position: relative;
  transition: background-color 0.2s;
}
.swicth-huakuai {
  position: absolute;
  background: #ffffff;
  border: 0.5px solid rgba(33, 33, 33, 0.04);
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06);
  width: 27px;
  height: 27px;
  border-radius: 13.5px;
  box-sizing: border-box;
  left: 1px;
  top: 50%;
  margin-top: -13.5px;
  transition: left 0.2s;
}
</style>