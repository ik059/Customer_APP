<template>
    <div id="verify" translate="no">
        <img id="ourlogo" src="-" /><br /><br />
        <!--email after succesful registration-->
        <div v-if="verified">
       
        <h3>Vielen Dank! </h3>
       
        <h3>Ihr Konto kann jetzt benutzt werden.</h3>
        <br />
        <!-- <p>Ihr Konto ist jetzt verifiziert!</p> -->
       
        <br />
        <p>Bitte melden Sie sich an, um fortzufahren:</p>
        <br/>
        <a href="/" class="btn btn-primary" role="button">{{$t('login')}}</a>
        </div>
        <div v-else>
     
      
            <p style="color:red;">{{$t('linkExpired')}}</p>
            <br/>
         
            <a href="/" class="btn btn-primary" role="button">{{$t('login')}}</a>
        </div>
        {{ ok }}

    </div>
</template>
<script>
import axios from 'axios'
export default {
    nmae: 'verifiyToken',
    data(){
        return{
            token:'',
            verified: true,
            ok:''

        }  
    },
    mounted(){
        axios.post(process.env.VUE_APP_HOST +'/verifications', {token: this.$route.params.token}).then((res)=>{
            if(res.data != "Email Confirmed! Please log in to your account."){
                this.verified = false
            }
        })

    }

}

</script>
<style scoped>

* {
  font-family: 'Oswald';
}
a{
    background-color: #97bf0d !important;
    border:none;
}
#ourlogo {
    height: 100px;
    widows: 200px;
    margin-top: 10%;
}
</style>