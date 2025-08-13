<template>
  <div class="app" >
    <div class="content">
      <!-- Your main content here -->
    </div>
    <footer class="footer">
      <div class="left-section">
        <p id="copyright">

          <span >© {{ new Date().getFullYear() }} Copyright:<br v-if="!phoneshowing"/></span>
          <a
            class="text-white"
            :href="`${process.env.VUE_APP_HOST}`"
            target="_blank"
            id="title"
            > Company</a
          >
        </p>
      </div>
      <div class="center-section" v-if="phoneshowing">
          <a href="/#/contact" v-if="phoneshowing" style="text-align: center;">Kontakt |</a>

          <a :href= "`${process.env.VUE_APP_HOST}/#/impressum`"target="_blank" id="impress"> Impressum </a>
          <a :href= "`${process.env.VUE_APP_HOST}/#/tremsandconditions`" target="_blank" id="impress">| Datenschutzerklärung</a>
      </div>
      <div v-if="!phoneshowing">
        <a :href= "`${process.env.VUE_APP_HOST}/#/tremsandconditions`" target="_blank" id="impress"> Datenschutzerklärung</a>
        <br/>
          <a :href= "`${process.env.VUE_APP_HOST}/#/impressum`" target="_blank" id="impress" style="margin-left: 10%;">Impressum</a>
      
      </div>
      
    </footer>
    <Beta />
  </div>
</template>
<script>
import Beta from "./Beta.vue";
export default {
  name: "Help",
  data() {
    return {
      phoneshowing: true,
      footerwidth:''+'px',
    };
  },
  components: {
    Beta,
  },
  mounted() {
    if (window.innerWidth < 800) {
      this.phoneshowing = false;
    }
    this.footerwidth = window.innerWidth
  },
};
</script>
<style scoped>
*{
  font-family: 'Oswald';
}
#socialIcons{
  height: 30px;
  width: 30px;
  margin-left: 5px;
}
.center-section{
 display: flex;
 flex-direction: row;
}
.app {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #97bf0d;
  z-index: 111;
}


.footer {
  display: flex;
  background-color: #97bf0d;
  height: 54px;
  align-items: center;
  justify-content:space-evenly;
  width: 90%;
}

.left-section,
.center-section,
.right-section {

  color: #fff;
}

.left-section {
  /* Additional styles for the left section */

  margin-top: 16px;
  margin-right: 5px;
}

a {
  margin-right: 5px;
  text-align: center;
  font-size: medium;
  color: white;
  text-decoration: none;
  cursor: pointer;
}
 
@media (max-width: 576px) {
  #copyright {
    font-size: 10px;
  }
  .app {
    height: 54px;
    max-width: 82%;
    position: fixed;
    text-align: center;
    z-index: 111;
  }
  
.footer{
  margin: auto;
}
  .left-section {
    font-size: small;
    display: table;
    text-align: center;
  }

  a {
    font-size: 10px;
  }
#impress{
  margin-left: 10%;
}

  .links {
    font-size: 8px;
    text-align: center;
   
  }
}

@media (max-width: 1024px)  {
  .app{
      height: 60px;
      width: 100%;
      position: fixed;
      font-size: 12px;
      z-index: 98;
  }
  .footer {
  display: flex;
  background-color: #97bf0d;
  height: 54px;
  align-items: center;
  justify-content:space-evenly;
}
  #copyright {
    font-size: 12px;
  }
  a{
    font-size: 12px;
  }
 
}
</style>
