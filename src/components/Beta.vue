<template>
    <div id="beta">
        <img width="12" height="12" src="https://img.icons8.com/ios-filled/50/FFFFFF/v.png" alt="v" v-if="!mobileTrue"/>
      Beta-0.0.1
    </div>
</template>
<script>
export default {
  name: 'Beta',
  data(){
    return {
      mobileTrue: false
    }
  },
  mounted(){
    if (window.innerWidth < 767) {
      this.mobileTrue = true
    }
    else {
      this.mobileTrue = false
    }
  }
}
</script>
<style scoped>
#beta {
  position: fixed;
  bottom: 0;
  right: 10px;
  color: white;
  padding: 0px;
  font-size: 8px;
}
</style>
