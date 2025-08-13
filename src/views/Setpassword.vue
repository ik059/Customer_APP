<template>
  <div class="vue-tempalte" translate="no">
    <particles-bg type="cobweb" :canvas="{ backgroundColor: '#97bf0d' }" :bg="true" /><!--vue particle background-->
    <div class="vertical-center">
      <div class="inner-block">
        <img class="img-responsive" src="-" height="100" href="-"
          target="_blank" />

        <form>
          <div v-if="changed">
            <h3>{{ $t('forgotPassword') }}</h3>
          </div>
          
          <div v-if="passwordPassed">
            <div class="form-group">
              <label>{{ $t('newPassword') }}</label>
              <input type="password" class="form-control form-control-lg" v-model="password" /><!--email label-->
            </div>
            <div class="form-group">
              <label>{{ $t('retypePassword') }}</label>
              <input type="password" class="form-control form-control-lg" v-model="cpassword" /><!--email label-->
            </div>

            <button id="button" type="submit" class="
                  btn btn-primary
           
                " @click.prevent="setNewPassword">
              {{ $t('updatePassword') }}
            </button> <!--Reset Password-->
            <br />
            <p id="alert">{{ updates }}</p>

          </div>
          <div v-if="ispasswordupdated" id="cernterd">
            <br/>
            <br/>
            <br/>
            <h4>{{ $t('passwordUpdated') }}</h4>

            <button id="button2" class="
                  btn btn-primary
            
                " @click.prevent="signUp">
                <div v-if="loading" class="spinner-border spinner-border-sm"></div>
              {{ $t('login') }}
            </button>
          </div>
          <div v-if="wentWrong">
            <h3 id="alert">Verzeihung! Link abgelaufen</h3>

          </div>

        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { ParticlesBg } from "particles-bg-vue";
import axios from 'axios'
export default {
  name: 'Setnewpassword',
  data() {
    return {
      token: '',
      password: '',
      cpassword: '',
      updates: '',
      ispasswordupdated: false,
      passwordPassed: true,
      wentWrong: false,
      changed: true,
      loading:false
    }
  },
  components: {
    ParticlesBg,
  },
  methods: {
    setNewPassword() {
      this.loading = true
      let passwordParam = {
        token: this.token,
        password: this.password
      }
      if (this.password === this.cpassword) {
        axios.post(process.env.VUE_APP_HOST +"/setnewpassword", passwordParam).then((res) => {
          if (res.data === 'Ok') {
            this.updates = 'Password updated'
            this.ispasswordupdated = true
            this.password = ''
            this.cpassword = ''
            this.passwordPassed = false
            this.changed = false
            this.loading = false
          }
          else {
            this.passwordPassed = false
            this.wentWrong = true
            this.loading = false
          }
        })
      }
      else {

        this.updates = 'Both password must have to be same!!'
        this.loading = false
      }
    },
    signUp() {
      this.$router.push("/")
    }
  },
  mounted() {
    if (window.innerWidth < 767) {
      this.mobileTrue = true
    }
    else {
      this.mobileTrue = false
    }
    this.token = this.$route.params.token
  }
}
</script>
<style scoped>

* {
  font-family: 'Oswald';
}
.footer{
  background-color: #97bf0d;
  height: 56px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 85%;
  display: flex;
  flex-direction: column;
  text-align: center;

}
#copyright{
  font-size: 10px;
  color:white;
  
}
.links {
        font-size: 9px;
        color:white;


    }
#alert {
  color: red;
}

#cernterd {
  display: table;
  margin-left: auto;
  margin-right: auto;
  height: auto;
  width: auto;
}

#button2 {
  display: table;
  margin-left: auto;
  margin-top: 10px;
  margin-right: auto;
  border-radius: 10px !important;
  background-color: #97bf0d !important;
  border-color: #97bf0d;
}

#button {
  display: table;
  margin-left: auto;
  margin-top: 10px;
  margin-right: auto;
  border-radius: 10px !important;
  background-color: #97bf0d !important;
  border-color: #97bf0d;
}

.vue-tempalte,
.vertical-center {
  width: 100%;
  height: 100%;
}

.navbar-light {
  background-color: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
}

.vertical-center {
  display: flex;
  text-align: left;
  justify-content: center;
  flex-direction: column;
}

.inner-block {
  width: 450px;
  height: 450px;
  margin-left: auto;
  margin-right: auto;

  margin-top: 40px;
  background: #ffffff;
  box-shadow: 0px 14px 80px rgba(68, 223, 12, 0.2);
  padding: 40px 55px 45px 55px;
  border-radius: 15px;
  transition: all 0.3s;
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

p {
  text-align: center;
}

@media (max-width: 575.98px) {
  .inner-block {
    height: auto;
    width: auto;
    margin-top: 100px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: auto;
    font-size: small;
  }
}

@media (max-width: 575.98px) {
  .img-responsive {
    height: 80px;
    width: 160px;
    display: table;
    margin-left: auto;
    margin-right: auto;
  }
  h4{
    display: table;
    margin-left: auto;
    margin-right: auto;
  }

  .btn-primary {
    height: auto;
    width: 80px;
    font-size: smaller;
    margin-left: 70px;
  }

  .form-control {
    height: 30px;
    width: auto;

  }

}
</style>