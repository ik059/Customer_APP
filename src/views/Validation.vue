<template>
    <div>
      
        <br/>
            <br/>
       
        <div v-if="formOpen">
            <div v-if="showValidationForm">
                <h1 id="headerText"> CERTIFICATE VALIDATION</h1>
                <p>Type in your certificate-ID to validate your certificate.</p>
                <input type="text" v-model="certificateID" placeholder="Enter Certificate ID" id="inputText" />
                <br />
                <button id="validateButton2" @click.prevent="checkCertificate" :disabled="certificateID == ''">Check Certificate</button>
            </div>
            <div id="loadinng" v-if="showLoading">
                <div class="loading-container">
                    <div class="dot" v-for="n in 5" :key="n"></div>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div>
                 <img src="-" alt="logo" width="100" height="100" id="katLogo">
            </div>
        </div>
        <div v-else>
            <!-- <div>
                    <button id="validateButton" @click.prevent="formOpen = true,showLoading=false,showValidationForm = true">Check Again</button>
            </div> -->
            <div v-if="certificateNotValid">
                <br/>
                <h3>YOUR CERTIFICATE ID: {{ certificateID }}</h3>
                <br/>
                <br/>
                <div id="invalidDiv">
                    <p id="invalidX">X</p>
                </div>
                <br/>
                <br/>

                <h3>THE CERTIFICATE-ID DOES NOT EXIST.</h3>
                <br/>
                <p>CHECK FOR POSSIBLE SPELLING ERRORS AND TRY AGAIN.</p>
                <br/>
                <br/>
                <div>
                    <button id="validateButton" @click.prevent="formOpen = true,showLoading=false,showValidationForm = true, certificateID = ''">TRY AGAIN</button>
                    <button id="validateButton" @click.prevent="gotocertificatecsupport"> SUPPORT</button>
                </div>
                <br/>
                <br/>
        
                <div>
                 <img src="-" alt="logo" width="100" height="100" id="katLogo">
                </div>


            </div>
            <div v-else id="certificateContainer">
                <br/>
                <h3>YOUR CERTIFICATE ID: {{ certificateID }}</h3>
                <br/>
                <br/>
                <div id="validDiv">
                    <p id="validTick">&#10003;</p>
                </div>
                <br/>
                <br/>
                <h3>THE CERTIFICATE-ID IS VALID.</h3>
                <p>THE TRUCK WITH THE LICENSE PLATE {{ certificateDetails.license }} WAS CLEANED ON {{new Date(parseInt(certificateDetails.issuedDate)).toLocaleDateString()}} AT {{ new Date(parseInt(certificateDetails.issuedDate)).toLocaleTimeString().slice(0,-3) }}.</p>
                <br/>
                    <div>
                        <qrcode-vue
                        :value="`${process.env.VUE_APP_HOST}/#/certificate/pdf/?certificate=${certificateDetails.certificateID}`"
                        :size="size"
                        level="H"
                        />
                     </div>
                <br/>
              
                <div>
                    <button id="validateButton" @click.prevent="formOpen = true,showLoading=false,showValidationForm = true, certificateID = ''">NEXT CERTIFICATE</button>
                    <button id="validateButton" @click.prevent="gotocertificatecsupport"> SUPPORT</button>
                </div>
                <br/>
                <br/>
        
                <div>
                 <img src="-" alt="logo" width="100" height="100" id="katLogo">
                </div>
            
            </div>
           

        </div>

    
    </div>
</template>
<script>
import QrcodeVue from "qrcode.vue";
import axios from 'axios';
export default {
    name: 'Validation',
    data() {
        return {
            certificateID: '',
            showValidationForm: true,
            showLoading: false,
            formOpen: true,
            certificateNotValid: false,
            size: 50,
            certificateDetails:{}

        }
    },
    components: {
        QrcodeVue
    },
    methods: {
        gotocertificatecsupport(){
            this.$router.push({ name: 'CertificateContact' });
        },
        checkCertificate() {
            this.showLoading = true;
            this.showValidationForm = false;
           setTimeout(() => {
            axios
            .post(process.env.VUE_APP_HOST + "/certificatedetails", {
                certificateID: this.certificateID,
            }).then((response) => {
                console.log(response.data);
                    if(response.status == 200){
                    this.certificateNotValid = false;
                    this.certificateDetails = response.data;
                    this.showLoading = false;
                    this.formOpen = false;
                    }
            }).catch((error) => {
                console.log(error);
                    this.formOpen = false;
                this.showLoading = false;
                this.certificateNotValid = true;
            });
              }, 2000);
       
        }
    }
}
</script>
<style scoped>

#validTick{
    font-size: 70px;
    color: white;
    text-align: center;
    font-weight: 700;

}
#validDiv{
    width: 105px;
    height: 100px;
    background-color: #97bf0d;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    box-shadow:  0 0 10px 0 rgba(0, 0, 0, 0.2);
}
#invalidX{
    font-size: 70px;
    color: white;
    text-align: center;
    font-weight: 700;

}
#invalidDiv{
    width: 105px;
    height: 100px;
    background-color: red;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    box-shadow:  0 0 10px 0 rgba(0, 0, 0, 0.2);
}
#headerText{
    text-align: center;
    font-size: 70px;
    color: #97bf0d;
}
#katmaText{
    font-weight: 400;
    color: #97bf0d;
}
#certificateLoggo{
    width: 300px;
    aspect-ratio: 3/1;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px !important;
    display: block;
}
#detailsContainer{
    text-align: left;
    padding: 2%;
}
#certificateSticker{
    width: 60%;
    aspect-ratio: 3/0.6;
    float: right;
    margin-bottom: 20px;
}
#verificationImage{
    width: 100px;
    aspect-ratio: 3/3;
    float:right;
}
#certificateImage{
    width: 100px;
    aspect-ratio: 3/3;

}
#detailsContainer{
    width: 60%;
}
#QrContainer{
    width: 38%;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: center;

}
#certificateContainer{
    display: flex;
    flex-direction: column;

    justify-content: center;
    margin-top: 50px;
}
#verticalLine{
    border-left: 2px solid black;
    height: 65vh;
}
#notValidImage{
    width: 100px;
    aspect-ratio: 3/3;
    margin-left: auto;
    margin-right: auto;
    display: block;
    animation: heartbeat 5s infinite;
}
@keyframes heartbeat {
  from {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  to {
    transform: scale(1);
  }
}
#loadinng {
 display: flex;
    justify-content: center;
    align-items: center;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100px;
  height: 100px;
}

.dot {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: #97bf0d;
  border-radius: 50%;
  animation: bounce 1.5s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: -0.6s;
}

.dot:nth-child(2) {
  animation-delay: -0.4s;
}

.dot:nth-child(3) {
  animation-delay: -0.2s;
}

.dot:nth-child(4) {
  animation-delay: 0s;
}

.dot:nth-child(5) {
  animation-delay: 0.2s;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
}
#validateButton {
    width: 15%;
    height: 50px;
    font-size: 20px;
    margin-top: 20px;
    margin-left:5px;
    margin-right:5px;
    border-radius: 10px;
    background-color: #97bf0d;
    color: white;
    border: none;
}
#validateButton2 {
    width: 20%;
    height: 50px;
    font-size: 20px;
    margin-top: 20px;
    margin-left:auto;
    margin-right:auto;
    border-radius: 10px;
    background-color: #97bf0d;
    color: white;
    border: none;
}
#inputText {
    width: 50%;
    height: 50px;
    font-size: 20px;
    margin-top: 20px;
    margin-left:auto;
    margin-right:auto;
    border-radius: 10px;
    border: 1px solid #97bf0d;
}
#horizontalLine {
    width: 100%;
    height: 3px;
    background-color: #97bf0d;
}
#contactNumber {
    font-size: 30px;
    margin-top: 15px;
    margin-right: 10px;
}
    #header {
       display: flex;
         justify-content: space-between;
       padding: 2%;
       height: 10%;
       background-color: white;
    }
    #katLogo {
        width: 25%;
        aspect-ratio: 3/0.8;
        height: 5%;
  
    }
    #social{
        display: flex;
        justify-content: center;
       
       
    }
    #socialIcons{
        padding: 10px;
        background-color: #97bf0d;
        border-radius: 5px;
        width: 50px;
        height: 50px;
        aspect-ratio: 1/1;
        margin: 10px;
    }
    #numberandsocial{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    h1 {
        text-align: center;
    }

@media  (max-width: 1024px){

#validateButton{
    width: 70%;

}
#validateButton2{
    width: 70%;
}
#inputText{
    width: 70%;
    padding: 5px;
}
#headerText{
    font-size: 50px;
}
    
}
</style>