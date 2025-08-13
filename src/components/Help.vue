<template>
    <div>
        <button class="button button5 oswald-font"  v-if="deleteShowing" @click.prevent="help" >?</button>

    </div>
</template>
<script>
export default {
    name: "Help",
    data(){
        return{
            deleteShowing:true
        }
    },
    methods: {
        help() {
            this.$router.push('contact')
        }
    },
   mounted(){
    if (window.innerWidth<767){
        this.deleteShowing=false
      }
   }
}
</script>
<style scoped>
@font-face {
  font-family: 'Oswald';
  font-weight: normal;
  font-style: normal;
  src: url('../../public/fonts/Oswald-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'Oswald';
  font-weight: bold;
  font-style: normal;
  src: url('../../public/fonts/Oswald-Bold.ttf') format('truetype');
}

body {
  font-family: 'Oswald';
}

.oswald-font {
  font-family: 'Oswald';
}
.button5 {

    width: 50px;
    height: 50px;
    line-height: 40px;
    text-align: center;
    font-size: 20px;
    border-radius:40%;
    border: none;
    z-index: 1000;
  
    font-size: x-large;
    background-color: yellowgreen !important;
    border-color: #97bf0d;
    position: fixed;
    bottom: 80px;
    right: 16px;
    color: aliceblue;
    font-size: 18px;
}

@media (max-width: 575.98px) {
    .button5 {
        position: absolute;
        bottom: 0px;
        width: 25px;
        right: 0px;
    }

}
</style>