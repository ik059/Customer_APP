<template>
    <div id="email" translate="no">
        <img id="ourlogo" src="-" /><br /><br />
        <font-awesome-icon icon="fa-solid fa-check" id="success" />
        <!--email after succesful registration-->
        <h3>{{$t('registeredSuccessful')}}</h3>
        <br/>
        <!-- <p>{{$t('verifyEmailsent')}}</p> -->
        <p>{{$t('thankYou')}}!</p>
        <br />
        <br />
        <a href="/" class="btn btn-primary" style="border: none;" role="button">{{$t('login')}}</a>

    </div>
</template>
<script>
export default {
    name: 'Confirm',
    data() {
        return {
            customerID: ''
        }
    }
}
</script>
<style scoped>
* {
    font-family: 'Oswald';
}
#ourlogo {
    height: 100px;
    widows: 200px;
    margin-top: 10%;
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
a{
    background-color: #97bf0d !important;
}
body {
    background-color: #97bf0d;
    ;
}

#logo {
    margin-top: 20px;
    height: 150px;
    width: 450px;
    padding: 5px;
}

#success {
    height: 100px;
    color: white;
    border: 2px solid grey;
    padding: 10px;
    border-radius: 50%;
    background-color: #97bf0d;
}

#customer {
    color: brown
}

#link {
    text-decoration: none;
    height: 50px;
    color: aliceblue;
    cursor: pointer;
}
button{
  border-radius: 5px;
}

.btn-primary {
    margin: auto;
    text-align: center;
    font-weight: 300;
    font-size: 20px;
}
@media (max-width: 768px) {
    #logo {
        margin: 15px auto;
        height: 100px;
        width: 60%;
    }
    #success {
        height: 50px;
        width: 50px;
    }
    #customer {
        font-size: 20px;
    }
    #link {
        font-size: 20px;
    }
    .btn-primary {
        font-size: 15px;
    }
    #email{
        padding: 10px;
    }
}
</style>