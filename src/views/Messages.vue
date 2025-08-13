<template>
    <div>
        <div class="popup center" v-bind:class="{ active: isMessagePopupOpen }">
      <br />
      <div id="popupclose" @click.prevent="isMessagePopupOpen = false, message={}, alreadyAgreed=false,agreedTime=''">X</div>

      <div class="title">
        <h4 style="color:#97bf0d; text-align: left;">{{message.subject}}</h4>
        <br/>
        <h6 style="text-align: left;">{{new Date(parseInt(message.date)).toLocaleDateString()}}, {{new Date(parseInt(message.date)).toLocaleTimeString().slice(0,-3)  }}</h6>
        <br/>
        <p v-html="message.message" style="text-align: left;"></p>
        <br/>
        <p v-if="alreadyAgreed"> Already Agreed on {{ new Date(parseInt(agreedTime)).toLocaleDateString() }}, {{ new Date(parseInt(agreedTime)).toLocaleTimeString() }}</p>

        <div class="cancelButton">
          <button id="popupclosebutton" v-if="consentmessageshowing && !alreadyAgreed" @click.prevent="isMessagePopupOpen = false, message={}, alreadyAgreed=false,agreedTime=''">
            Ablehnen
          </button>
          <button id="popuopenbutton" v-if="consentmessageshowing && !alreadyAgreed" @click.prevent="agreeOnconcent(message)">Akzeptieren</button>
        </div>
        <br />
      </div>
    </div>
        <div :class="{disabled:isMessagePopupOpen }">
            <Sidebar />
  
            <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="frame-23">
                            <div>Nachrichten</div>
                        </div>
                        <div v-if="messages.length == 0" class="card-body">
                            <h4>No messages!</h4>
                        </div>
                        <div class="card-body" v-else>
                            <div class="table-responsive">
                                <table>
                                    <thead class=" text-primary">
                                        <th>
                                            &nbsp;
                                        </th>

                                    </thead>
                                    <tbody >
                                        <tr id="tableBody" v-for="(message, index) in messages" :key="message.messageID" :class="{unread:!message.isRead}">
                                            <td id="indexTable"><span id="indexStryle">{{ index + 1 }}</span></td>
                                            <td id="subjectTable" @click.prevent="openMessage(message)">{{ message.subject }}</td>
                                            <td id="dateTable">{{ new Date(parseInt(message.date)).toLocaleDateString() }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
            </div>
        </div>
    </div>
</template>
<script>
import Sidebar from '@/components/Sidebar.vue'
import axios from 'axios'
export default {
    components: {
        Sidebar
    },
    data() {
        return {
            messages: [],
            customer: {},
            isMessagePopupOpen: false,
            message: {},
            currentMessage:'',
            consentmessageshowing: false,
            alreadyAgreed: false,
            agreedTime: ''
        }
    },
    created() {
     
        axios.get(process.env.VUE_APP_HOST +"/customerprofile", {
            headers: { token: localStorage.getItem("token") },
            
        }).then((res)=>{
            console.log(res.data)
            this.customer = res.data.user
            axios.post(process.env.VUE_APP_HOST+'/customermessages',{customerId: res.data.user.customerID}).then((res)=>{
                console.log(res.data)
                this.messages = res.data
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
        
    },
    methods: {
        agreeOnconcent(message){
            console.log(message)
            axios.post(process.env.VUE_APP_HOST+'/agreeonconsent',{messageID: message.subject, customerID: this.customer.customerID, currentID: message.date}).then((res)=>{
                console.log(res.data)
                this.isMessagePopupOpen = false
                this.message = {}
            }).catch((err)=>{
                console.log(err)
            })
        },
        openMessage(message) {

            this.isMessagePopupOpen = true
            console.log(message)
            this.message = message
            // use the /n to split the message into paragraphs
            this.message.message = this.message.message.replace(/(?:\r\n|\r|\n)/g, '<br>')
            if (message.subject.includes("Consent")){
                this.consentmessageshowing = true
                if (message.isAgreed){
                    this.alreadyAgreed = true
                    this.agreedTime = message.agreedTime
                }
            }
            axios.post(process.env.VUE_APP_HOST+'/readmessage',{messageID: message.date, customerID: this.customer.customerID}).then((res)=>{
                console.log(res.data)
            }).catch((err)=>{
                console.log(err)
            })
        }
    }
}
</script>
<style scoped>
#popupclose{
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: grey;
    padding: 3px 7px;
    border-radius: 5px;
    border: 1px solid grey;
}
#popupclose:hover{
    background: grey;
    color: white;
}
table{
    margin: auto;
}
#tableBody{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 10px auto;
}
#indexStryle{
    border: 1px solid #97bf0d;
    border-radius: 5px !important;
    padding: 5px 10px;
}
#subjectTable{
    padding: 3px;
    width:40vw;
    border: 1px solid #97bf0d;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 1%;
    text-align: left;
}
#dateTable{
    padding: 3px 10px;
    border: 1px solid #97bf0d;
    border-radius: 5px;
}
#subjectTable:hover{
    background: #97bf0d;
    color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

  .frame-23,
#indexTable{
    margin-right: 1%;
}

  .frame-23,
.frame-23 * {
  box-sizing: border-box;
}
.frame-23 {
    background: #97bf0d;
  color: white;
  height: auto;
  width: 430px;
  font-size: 36px;
  margin:10px auto;
  font-weight: bold;
  border-radius:10px;
  text-align: center;
  display: flex;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
#popuopenbutton{
    margin: 10px;
    background-color: #97bf0d;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
}
#popupclosebutton{
    margin: 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
}
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 20%;
    left: 35%;
    width: 50%;
    height:auto;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s;
}
.center.active {
    opacity: 1;
    visibility: visible;
    border: 1px solid #97bf0d;
}
.popup {
    background: white;
    border-radius: 10px;
    padding: 20px;
    width: 50%;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.disabled{
    pointer-events: none;
    opacity: 0.4;

}
.unread {
    background: #f0f0f0;
}
.container {
    margin-top: 30px;
}
.card{
    border: none;
}
.card-header {
  background: #97bf0d;
  color: white;
  height:64px;
  width: 360px;
  font-size: 48px;
  border-radius: 10px !important;
  margin: 10px auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 10px;

}
#headerText{
  margin-top:2px
}

@media (max-width: 768px) {
    .frame-23 {
        background: #97bf0d;
  color: white;
  height: auto;
  width: 260px;
  font-size: 26px;
  margin:10px auto;
  border-radius:10px;
  text-align: center;
  display: flex;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    }
    .container {
        margin-top: 30px;
    }
    .card-header {
        width: 100%;
    }
    #headerText{
        margin-top:2px
    }
    #subjectTable{
        padding: 3px;
        width:60vw;
        border: 1px solid #97bf0d;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 1%;
        text-align: left;
        font-size: smaller;
    }
    #dateTable{
        padding: 3px 10px;
        border: 1px solid #97bf0d;
        border-radius: 5px;
        font-size: smaller;
    }
    #indexStryle{
        border: 1px solid #97bf0d;
        border-radius: 5px !important;
        padding: 3px 7px;
        font-size: smaller;
         
    }
    #indexTable{
        margin-right: 1%;
        margin-top: -2px; 
    }
    #subjectTable:hover{
        background: #97bf0d;
        color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    }
    #dateTable{
        padding: 3px 10px;
        border: 1px solid #97bf0d;
        border-radius: 5px;
    }
    .popup {
        background: white;
        border-radius: 10px;
        padding: 20px;
        width: 80%;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    }
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 15%;
        left: 10%;
        width: 80%;
        height:auto;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s;
    }
    
}
@media (min-width:768px) and (max-width: 1024px){
    .frame-23 {
  background: #97bf0d;
  color: white;
  height: auto;
  width: 260px;
  font-size: 26px;
  margin:10px auto;
  border-radius:10px;
  text-align: center;
  display: flex;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
#subjectTable{
        padding: 3px;
        width:60vw;
        border: 1px solid #97bf0d;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 1%;
        text-align: left;
        font-size: smaller;
    }
    #dateTable{
        padding: 3px 10px;
        border: 1px solid #97bf0d;
        border-radius: 5px;
        font-size: smaller;
    }
    #indexStryle{
        border: 1px solid #97bf0d;
        border-radius: 5px !important;
        padding: 3px 7px;
        font-size: smaller;
         
    }
    #indexTable{
        margin-right: 1%;
        margin-top: -2px; 
    }
    #subjectTable:hover{
        background: #97bf0d;
        color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    }
    #dateTable{
        padding: 3px 10px;
        border: 1px solid #97bf0d;
        border-radius: 5px;
    }
    .popup {
        background: white;
        border-radius: 10px;
        padding: 20px;
        width: 80%;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    }
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 25%;
        left: 23%;
        width: 80%;
        height:auto;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s;
    }
}
</style>
```