<template>
  <div translate="no">
    <div class="popup center" v-bind:class="{ active: isActive }">
      <br />

      <div class="title">
        <h2 style="color:#97bf0d">Wir verwenden Cookies</h2>
        <p>Unsere Website verwendet Cookies, um wesentliche Dienste und Funktionen auf unserer Website bereitzustellen und
          um Daten darüber zu sammeln, wie Besucher mit unserer Website, unseren Produkten und Dienstleistungen
          interagieren. Wenn Sie auf "Akzeptieren" klicken, erklären Sie sich mit der Verwendung dieser Analysetools
          einverstanden und stimmen unserer Cookie-Richtlinie zu.</p>

        <div class="cancelButton ">
          <button class="btn btn-primary btn-lg" id="book" style="background-color:#97bf0d" v-on:click="acceptCookies">
            Akzeptieren
          </button>
        </div>
        <br />
      </div>
    </div>
    <particles-bg type="cobweb" :canvas="{ backgroundColor: '#97bf0d' }" :bg="true" /><!--vue particle background-->

    <div class="inner-block">
      <img class="img-responsive" src="" height="70" href=""
        target="_blank" />
      <br />
      <div id="loginForm">
        <!-- <h3 id="board">{{ $t('login') }}</h3> -->
         <br/>
         <br/>

        <form class="mx-1 mx-md-4">
          <div class="d-flex flex-row align-items-center mb-4 mt-2">
          <!-- &#xf0e0; -->
            <div class="form-outline flex-fill mb-0">
              <input type="email" id="form3Example1c" class="form-control" v-model="customerID"
                placeholder="Email" />
              <!--email label-->
            </div>
          </div>

          <!-- <div class="d-flex flex-row align-items-center mb-4">

          <div class="form-outline form-group flex-fill mb-0 input-group">
            
              <input v-if="showPassword"  class="form-control" v-model="password"
                placeholder="&#xf084; passwort" >
              <input v-else type="password" class="form-control" v-model="password"
                placeholder="&#xf084; passwort" >
            <span>
              <button type="button" class="showPassword" @click="toggleShow">
                <i class="fas" :class="{ 'fa-eye-slash': showPassword, 'fa-eye': !showPassword }"></i>
              </button>
            </span>
           
            </div>
          </div> -->

          <!-- sda -->

          <div class="d-flex flex-row align-items-center mb-4">

            <div class="form-outline form-group flex-fill mb-0 input-group">
              <div id="passwordForm">
                <div>
                <!-- &#xf084; -->
                  <input v-if="showPassword" id="showPassword" class="form-control" v-model="password"
                    placeholder=" passwort">
                  <input v-else type="password" id="showPassword" class="form-control" v-model="password"
                    placeholder=" Passwort">
                </div>
                <div>
                  <button type="button" class="showPassword" id="togglePassword" @click="toggleShow">
                    <img :src="getIconSource" alt="Password Icon" id="eyeIcon"/>
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
            <button type="submit" class="btn btn-primary btn-lg" @click.prevent="login"  :class="{notaccepted:!termsAccepted}">
              <div v-if="loading" class="spinner-border spinner-border-sm"></div>
              {{ $t("login") }}
            </button>
          </div>
          <div>
            <p>
              {{ $t("noAccout") }}
              <router-link to="registration" style="color:#97bf0d">Registrieren</router-link><!--routing to signupp-->
            </p>
          </div>
          <div>
            <p>
              {{ $t("forgotPassword") }}
              <router-link to="forgotpassword" style="color:#97bf0d;">{{ $t("click") }}</router-link><!--routing to forogt password-->
            </p>
          </div>
        </form>
        <p class="update">{{ updates }}</p>
      </div>
    </div>
    <Beta />
  </div>
</template>
<script>
import axios from "axios";
import { ParticlesBg } from "particles-bg-vue";
import Fingerprint2 from 'fingerprintjs2';
import Beta from "../components/Beta.vue";


export default {
  name: "Login",
  data() {
    return {
      customerID: "",
      password: "",
      showPassword: false,
      updates: "",
      loading: false,
      isActive: false,
      fingerprint: '',
      termsAccepted: false,

    };
  },
    computed: {
    getIconSource() {
      return this.showPassword
        ? "https://container-hygiene.de/webapps/customerapp/icons8-eye-100.png"
        : "https://container-hygiene.de/webapps/customerapp/icons8-closed-eye-50.png";
    },

  },
  methods: {
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    login() {
      if(!this.termsAccepted){
        this.isActive = true
      }
      else{
      this.loading = true
      let customer = {
        customerID: this.customerID,
        password: this.password,
        fingerprint: this.fingerprint
      };
      axios.post(process.env.VUE_APP_HOST + "/login", customer).then(
        (res) => {
          if (res.status === 200) {
            console.log(res.data)
            localStorage.setItem("token", res.data);
            //if localstorage has calendar=true then redirect to certificates page
            //get the localstorage value and check if it is true
            if (localStorage.getItem("calendar") == "true") {
              this.$router.push("/certificates");
              this.loading = false
            } else {
            this.$router.push("/home");
            this.loading = false
            }
          }
        },
        (err) => {
          this.updates = err.response.data;
          this.loading = false

        }
      );
      }
    },
    acceptCookies() {
      localStorage.setItem("cookies", "accepted");
      this.termsAccepted = true;
      this.isActive = false
    }
  },
  components: {
    ParticlesBg,
    Beta
  },
  mounted() {
    Fingerprint2.get((components) => {
      const values = components.map(component => component.value);
      const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
      this.fingerprint = fingerprint;
      let sessionData = {
        fingerprint: fingerprint,
        token: localStorage.getItem('token')
      }
      axios.post(process.env.VUE_APP_HOST + '/sessionCheck', sessionData).then((res) => {
        if (res.status === 200) {
          this.$router.push('/home')
        }
      })
    })
    if (localStorage.getItem("cookies") == "accepted") {
      this.isActive = false
      this.termsAccepted = true
    }
    else {
      this.isActive = true
    }
    console.log(this.isActive, this.termsAccepted)

   
  },
}
</script>
  
  
  
<style scoped>
/*
input::placeholder {

  font-family: 'Font Awesome 6 Free';
  font-weight: 900; /* 900 for solid icons 
  font-size:10px;
 }
  */
.notaccepted{
  background-color: #6c757d;
  border-color: #6c757d;
  opacity: 0.5;
}
@media (min-width: 1600px) {
  .inner-block{
    margin-top:10% !important;
  }
}
#eyeIcon{
  width: 20px;
  height: 20px;
  margin-top: 5px;
  margin-right: 5px;
  margin-left: 5px;
  margin-bottom: 5px;
  transform: translateX(2px);
}

* {
  font-family: 'Oswald' 'Sans-serif';
}
h3 {
  margin-top: 5px;
}

#passwordForm {
  margin: 0px;
  padding: 0px;
  width: 100%;
  outline: none;

}

/* #showPassword{
  flex-grow:2;
  border:none;
} */
#togglePassword {
  position: absolute;
  top: 0;
  border-radius: 5px;
  background: none;
  right: 15px;

  border: none;
  top: 4px;
  height: 30px;
  cursor: pointer;
  color: #97bf0d;
  transform: translateX(2px);


}

/* .showPassword{
  background: none;
  border: none;
  margin-top: 9px;
} */
.form-control {
  padding-left: 10px;
  font-family: 'Oswald',Avenir, Helvetica, Arial, sans-serif, fontawesome;

}

.inner-block {

  width: 450px;
  height: 530px;
  margin-left: auto;
  margin-right: auto;
  text-align: center !important;
  margin-top: 80px;
  background: #ffffff;
  box-shadow: 0px 14px 80px rgba(68, 223, 12, 0.2);
  padding: 40px 55px 45px 55px;
  border-radius: 15px;
  transition: all 0.3s;
  z-index: 266;
}


.vertical-center .form-control:focus {
  border-color: #97bf0d;
  box-shadow: none;
}

.vertical-center h3 {
  text-align: center;
  margin: 0;
  line-height: 1;
  padding-bottom: 20px;
}
button{
  border-radius: 5px;
}

.btn-primary {
  background-color: #97bf0d !important;
  border-color: #97bf0d;
}

#board {
  color: #97bf0d;
}

.update {
  text-transform: uppercase;
  color: red;
  font-weight: 100;
  font-size: medium;
}

#passwordFields {
  display: flex;
  flex-direction: row;
}

.img-responsive{
  margin-top: 10px;
}

.popup {
  background: #f5f5f5;
  position: absolute;
  width: 30%;
  top: 45%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  border: 2px solid #97bf0d;
  box-sizing: border-box;

  text-align: center;
  opacity: 0;
  z-index: -1;

}

.active {
  opacity: 1;
  z-index: 1;
  justify-content: center;
  align-items: center;
  -webkit-transition: opacity 0.3s ease-out, bottom 1s ease-out;
  -moz-transition: opacity 0.3s ease-out, bottom 1s ease-out;
  -o-transition: opacity 0.3s ease-out, bottom 1s ease-out;
  transition: opacity 0.3s ease-out, bottom 1s ease-out;
}

h1 {
  text-transform: uppercase;
}

.center {
  position: absolute;
}

@media (max-width: 575.98px) {
  .inner-block {
    height: 500px;
    width: 350px;
    font-size: small;
    z-index: 266;

  }

  .popup {
    position: absolute;

    width: 80%;

    top: 60%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    font-size: small;
    opacity: 0;
    z-index: -1;


  }

  .active {
    opacity: 1;
    z-index: 1;
    justify-content: center;
    align-items: center;
    -webkit-transition: opacity 0.3s ease-out, bottom 1s ease-out;
    -moz-transition: opacity 0.3s ease-out, bottom 1s ease-out;
    -o-transition: opacity 0.3s ease-out, bottom 1s ease-out;
    transition: opacity 0.3s ease-out, bottom 1s ease-out;
  }
}

@media (max-width: 575.98px) {
  .img-responsive {
    height:75px;
    width: 190px;
    display:table;
    margin-left:auto;
    margin-right:auto;
  }
}
@media (max-width: 1024px) {
  .popup {
    position: absolute;

    width: 80%;

    top: 40%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    font-size: small;
    opacity: 0;
    z-index: -1;


  }
  .active {
    opacity: 1;
    z-index: 1;
    justify-content: center;
    align-items: center;
    -webkit-transition: opacity 0.3s ease-out, bottom 1s ease-out;
    -moz-transition: opacity 0.3s ease-out, bottom 1s ease-out;
    -o-transition: opacity 0.3s ease-out, bottom 1s ease-out;
    transition: opacity 0.3s ease-out, bottom 1s ease-out;
  }
}
</style>