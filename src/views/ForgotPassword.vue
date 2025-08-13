<template>
    <div class="vue-tempalte" translate="no">
      <particles-bg type="cobweb" :canvas="{ backgroundColor: '#97bf0d' }" :bg="true" /><!--vue particle background-->
      <div class="vertical-center">
        <div class="inner-block">
          <img
              class="img-responsive"
              src="-"
              height="70"
              href="https://www.katma-clean.de/"
              target="_blank"
              style="margin:auto; display:flex;"
            />
            <br/>
            <br/>
          
      <form>
        <h3 id="header">{{$t('forgotPassword')}}</h3>
  
        <div class="form-group">
         
          <input type="email" placeholder="Ihre E-Mail eingeben" class="form-control form-control-lg" v-model="email"/><!--email label-->
        </div>
  
        <button type="submit" class="btn btn-primary" @click.prevent="resetPassword">
        <div v-if="loading" class="spinner-border spinner-border-sm"></div>
          {{$t('updatePassword')}}
        </button> <!--Reset Password-->
        <br/>
        {{ updates }}
      </form>
      </div></div>
    </div>
  </template>
  
  <script>
  import { ParticlesBg } from "particles-bg-vue";
  import axios from "axios";
  export default {
    data() {
      return {
        email:'',
        updates:'',
        loading:false
      };
    },
    components: {
      ParticlesBg,
    },
    methods:{
      resetPassword(){
        this.loading = true
        axios.post(process.env.VUE_APP_HOST +'/resetpassword',{
          email: this.email

        }).then((res)=>{
          if(res.status === 200){
            this.$router.push('/resetpassword')
            this.loading = false
          }
        },
        (err) => {
          this.updates = "User not found!";
          this.loading = false
        })
      }
    }
  };
  </script>

<style scoped>

* {
  font-family: 'Oswald';
}
.btn-primary{
  border-radius: 10px !important;
  background-color:#97bf0d!important;
  border: none;
  display: table;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;

  font: 1em;
}
h3{
  color: #97bf0d;
  
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
p{
  text-align: center;
}
@media (max-width: 575.98px) {
  .inner-block{
    height: auto;
    width: auto;
    margin-top: 100px;
    display: table;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: auto;
    font-size: small;
  }
}
@media (max-width: 575.98px) {
  .img-responsive {
    height: 60px;
    width: 140px;
    display: table;
    margin-left: auto;
    margin-right: auto;
  }
  .btn-primary{
    height: auto;
    width: auto;
    font-size: smaller;
  }
  .form-control{
    display: table;
    margin-left: auto;
    margin-right: auto;
  }
  
 
  

}
</style>