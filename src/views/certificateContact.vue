<template>
    <div>
    <div class="popup center" :class="{loadpopup:showloadpopup}">
        <div class="loadingcontainer">
            <div class="loader"></div>
        </div>
    </div>
    <div class="backgroundpopup center" :class="{successpopup:showSuccesspopup}">
        <div class="successcontainer">
            <font-awesome-icon icon="check-circle" style="color: #97bf0d; font-size: 50px;"/>
            <h1 style="color: #97bf0d;">SUCCESS</h1>
            <p>We received your messeage!</p>
            <button @click="showSuccesspopup = false" class="sentbutton">OK</button>
        </div>
    </div>
    <div class="backgroundpopup center" :class="{failerpopup:showFailerpopup}">
        <div class="successcontainer">
            <font-awesome-icon icon="times-circle" style="color: #97bf0d; font-size: 50px;"/>
            <h1 style="color: red;">FAILED</h1>
            <p>Sorry something went worng.</p>
            <p>Please try again later!</p>
            <button @click="showFailerpopup = false" class="sentbutton">OK</button>
        </div>
    </div>
    <div id="certificatesupport" :class="{disabled:showloadpopup || showSuccesspopup || showFailerpopup}">
        <h1 style="color:#97bf0d;">CERTIFICATE SUPPORT</h1>
        <br/>
        <div id="contactpersons">
            <div>
            <img
                id="employeerheight"
                src="../assets/keyaccount.png"
                alt="Ellipse-2"
                border="0"
                class="imgmain"
              /> 
              <p id="supportname">Key Accounts</p>
              <p id="supporttype">Report fraud or suspicious activity</p>
              <div class="information">
                <div>
                    <font-awesome-icon icon="phone" style="margin-right: 5px;" />
                    <p class="phone" style="display: inline;">05244 9066943</p>
                </div>
                  <div>
                  <font-awesome-icon icon="envelope" class="envelope" style="margin-right: 5px;"/>
                  <a class="phone" style="display: inline;" href="mailto:-">service@demo.de</a>
                  </div>
              
              </div>
            </div>
          
        </div>
        <div>
            <h3 id="messageheader">OR DESCRIBE YOUR PROBLEM HERE</h3>
        </div>
        <div>
            <form @submit.prevent="sendmessage">
                <div id="inputcontainer">
                    <p id="inputlabel">Name</p>
                    <input type="text" name="name" id="inputtext" v-model="sendername"/>
                </div>  
                <div id="inputcontainer">
                    <p id="inputlabel">Mail</p>
                    <input type="text" name="name" id="inputtext" v-model="senderemail"/>
                </div>  
                <div id="inputcontainer">
                    <p id="inputlabel">Phone</p>
                    <input type="text" name="name" id="inputtext" v-model="senderphone"/>
                </div>  
                <div id="inputcontainer">
                    <p id="inputlabel">Problem or reports</p>
                    <textarea name="message" id="inputtext" rows="4" v-model="senderreport"></textarea>
                </div>
                <div id="checkboxcontainer">
                    <input type="checkbox" id="checkboxtik" name="vehicle1" value=true v-model="acceptterms" >
                    <label for="vehicle1"> Ich habe die Datenschutzerklärung gelesen und akzeptiere sie. Ich akzeptiere, dass -- mich zu Marketingzwecken kontaktiert.</label>
                </div>
                <div id="inputcontainer">
                    <button 
  type="submit" 
  class="sentbutton" 
  :disabled="!acceptterms || sendername === '' || senderemail === '' || senderreport === ''" 
  :class="{ disabledbutton: !acceptterms || sendername === '' || senderemail === '' || senderreport === '' }"
>
  Send
</button>
</div>
            </form>
        </div>
    </div>
</div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            acceptterms: false,
            sendername: '',
            senderemail: '',
            senderphone: '',
            senderreport: '',
            showloadpopup: false,
            showSuccesspopup: false,
            showFailerpopup: false
            
        }
    },
    methods:{
        sendmessage(){
            console.log(this.sendername);
            console.log(this.senderemail);
            console.log(this.senderphone);
            console.log(this.senderreport);
            console.log(this.acceptterms);
            this.showloadpopup = true;
            let data = {
                name: this.sendername,
                email: this.senderemail,
                phone: this.senderphone,
                message: this.senderreport
            }
            axios.post(process.env.VUE_APP_HOST+"/certificatesupport", data).then((res)=>{
                if(res.status === 200){
                    this.showloadpopup = false;
                    this.sendername = '';
                    this.senderemail = '';
                    this.senderphone = '';
                    this.senderreport = '';
                    this.acceptterms = false;
                    this.showSuccesspopup = true;

                }
            }).catch((err)=>{
                this.showloadpopup = false;
                this.showFailerpopup = true;
            })
        }
    },
    mounted() {
   
    }
}

</script>
<style scoped>
.disabled{
    opacity: 0.5;
}
.backgroundpopup{
    background: white;
  width: 350px;
  height: 240px;
  margin-top: 10px;
  border-radius: 10px;
 border: 1px solid #97bf0d;
  box-sizing: border-box;
  z-index: 1000;
  text-align: center;
  opacity: 0;
  top: -200%; 
}
.popup {
  background: transparent;
  width: 350px;
  height: 240px;
  margin-top: 10px;
  border-radius: 10px;
 
  box-sizing: border-box;
  z-index: 1000;
  text-align: center;
  opacity: 0;
  top: -200%;
}
.failerpopup{
    opacity: 1;
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ;
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
  padding: 30px;
  border: 1px solid red;
}
.successpopup{
    opacity: 1;
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ;
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
  padding: 30px;
}

.loadpopup {
  opacity: 1;
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ;
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
}

.center {
  position: fixed;
}
.loadingcontainer{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.loader {
    border: 16px solid #f3f3f3;
    border-top: 16px solid #97bf0d;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
.disabledbutton{
    background-color: grey !important;
    cursor: not-allowed !important;
}
#checkboxtik{
    margin-right: 10px;
    border: 2px solid black;
    margin-top: -18px;
}
#checkboxcontainer{
    text-align: left;
    display: flex;
    width: 60%;
    font-size: small;
    margin-left: 20%;
}
.sentbutton{
    background-color: #97bf0d;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
}
#inputlabel{
    color: black;
    text-align: left;
    margin: 0px !important;
}
#inputcontainer{
    width: 60%;
    text-align: left;
    margin-left: 20%;
}
#inputtext{
    width: 100%;
    padding: 12px 20px;
    margin: 2px 0;
    display: inline-block;
    border: 2px solid black;
    border-radius: 4px;
    box-sizing: border-box;
}
#messageheader{
    margin: 20px 0px;
    color: #97bf0d;
}
#supporttype{
    color: #97bf0d;
    margin: 0px;
}
#supportname{
    text-align: center;
    font-size: 22px;
    color: black;
    margin: 0px;
}
#certificatesupport {
    margin-top: 20px;
    padding: 20px;
    border-radius: 5px;
    max-width: 60%;
    margin: 0 auto;
}
.imgmain{
    max-width: 20%;
    aspect-ratio: 1/0.95;
    border-radius: 50%;
    border:2px solid #97bf0d;
    margin: 10px 0px;
}
#contactpersons{
    align-items: center;
    text-align: center;
    
}
@media only screen and (max-width: 600px) {
    #certificatesupport {
        max-width: 90%;
    }
    #inputcontainer{
        width: 90%;
        margin-left: 5%;
    }
    #checkboxcontainer{
        width: 90%;
        margin-left: 5%;
    }
    #contactpersons{
        margin-left: 5%;
    }
    .imgmain{
        max-width: 50%;
    }
    #contactpersons{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  margin-left: 20%;
    text-align: left;
    
}
#supportname{
    text-align: left;
    font-size: 22px;
    color: black;
    margin: 0px;
}
}
/* media query for tablets */
@media only screen and (min-width: 600px) and (max-width: 768px) {
    #supportname{
    text-align: left;
    font-size: 22px;
    color: black;
    margin: 0px;
}
.imgmain{
        max-width: 50%;
    }
    #certificatesupport {
        max-width: 80%;
    }
    #inputcontainer{
        width: 80%;
        margin-left: 10%;
    }
    #checkboxcontainer{
        width: 80%;
        margin-left: 10%;
    }
    #contactpersons{
        margin-left: 10%;
    }
    .imgmain{
        max-width: 40%;
    }
    #contactpersons{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 20%;
    text-align: left;
    
}
}
@media only screen and (min-width: 768px) and (max-width: 1024px) {
    #supportname{
    text-align: left;
    font-size: 22px;
    color: black;
    margin: 0px;
}
    #certificatesupport {
        max-width: 100%;
    }
    #inputcontainer{
        width: 70%;
        margin-left: 15%;
    }
    #checkboxcontainer{
        width: 70%;
        margin-left: 15%;
    }
    #contactpersons{
        margin-left: 15%;
    }
    .imgmain{
        max-width: 40%;
    }
    #contactpersons{
    display: flex;
 
    justify-content: center;
    align-items: center;
    margin-left: 20%;
    text-align: left;
    
}
}
</style>