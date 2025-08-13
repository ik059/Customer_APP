<template>
  <div translate="no">
    <div class="popup center" v-bind:class="{ active: isActive }">
        <div class="title">
          <h2>{{ $t("querySent") }}</h2>
        </div>

        <p>{{ $t("messageSent") }}</p>

        <div class="cancelButton">
          <button class="btn btn-outline-secondary" v-on:click="close">
            {{ $t("close") }}
          </button>
        </div>
      </div>
      <div v-bind:class="{ 'disabled': isActive }" id="fullContactContainer">
      <sidebar @search-input-emit="search" /><!--sidebar component-->

    <div class="card">
      <div class="card-header">
        <h2 style="margin-top: 4px;">Service</h2>
      </div>
      <div class="card-body">
        <section class="">
          <div class="container">
            <div class="column">
              <img
                id="employeerheight"
                src="../assets/f.png"
                alt="Ellipse-2"
                border="0"
                class="imgmain"
              />
            <div>
              <h4>Felix Kathöfer</h4>
              <div class="information">
                <strong class="textnew">Key Account Manager & Founder</strong>
                <div>
                    <font-awesome-icon icon="phone" style="margin-right: 5px;" />
                    <p class="phone" style="display: inline;">+49 1627543842</p>
                </div>
                  <div>
                  <font-awesome-icon icon="envelope" class="envelope" style="margin-right: 5px;"/>
                  <a class="phone" style="display: inline;" href="mailto:-">-</a>
                  </div>
              
              </div>
            </div>
            </div>
            <div class="column">
                <img
                id="employeerheight"
                src="https://container-hygiene.de/webapps/customerapp/Ausbildung-roh.jpg"
                alt="Ellipse-2"
                border="0"
                class="imgmain"
              />
            <div>
              <h4>Service</h4>
              <div class="information">
                <strong class="textnew">Service</strong>
                <div>
                    <font-awesome-icon icon="phone" style="margin-right: 5px;" />
                    <p class="phone" style="display: inline;">05244 9066943</p>
                </div>
                  <div>
                  <font-awesome-icon icon="envelope" class="envelope" style="margin-right: 5px;"/>
                  <a class="phone" style="display: inline;" href="mailto:-">-</a>
                  </div>
              
              </div>
            </div>
             </div>
          </div>
          <br />
          <div class="textnew">{{ $t("mailus") }}</div>
          <br />

          <div id="message">
            <div class="">
              <form id="contact-form" name="contact-form">
                <div class="row">
                  <div class="">
                    <div class="">
                      <label for="subject" class="">{{ $t("subject") }}</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        class="form-control"
                        v-model="subject"
                      />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="">
                    <div class="md-form">
                      <label for="message">{{ $t("message") }}</label>
                      <textarea
                        type="text"
                        id="message"
                        name="message"
                        rows="5"
                        class="form-control md-textarea"
                        v-model="message"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>

              <div class="text-center text-md-left">
                <a class="btn btn-primary" @click.prevent="sendMessage">{{
                  $t("send")
                }}</a>
              </div>
              <p style="color: red; font-weight: bold" id="showUpdates">{{ updates }}</p>
            </div>
          </div>
        </section>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
   
    </div>
  </div>

    <!-- <Footer /> -->
  </div>
</template>
<script>
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Contact",
  data() {
    return {
      mobileTrue: false,
      customerID: "",
      customerLastName: "",
      subject: "",
      message: "",
      updates: "",
      isActive: false,
    };
  },
  components: {
    Sidebar,
    Footer,
  },
  methods: {
    sendMessage() {
      const messageDetails = {
        customerID: this.customerID,
        customerlastname: this.customerLastName,
        subject: this.subject,
        message: this.message,
      };
      if (this.subject == 0 || this.message == 0) {
        this.updates = "Der Betreff oder die Nachricht darf nicht leer sein!";
        setInterval(() => {
          this.updates = "";
        }, 5000);
       
      } else {
        this.isActive = true;
        axios
          .post(process.env.VUE_APP_HOST + "/sendemail", messageDetails)
          .then((res) => {
            this.subject = "";
            this.message = "";
          });
      }
    },
    close() {
      this.isActive = false;
    },
  },
  mounted() {
    if (window.innerWidth < 767) {
      this.mobileTrue = true;
    } else {
      this.mobileTrue = false;
    }
    axios
      .get(process.env.VUE_APP_HOST + "/user", {
        headers: { token: localStorage.getItem("token") },
      })
      .then((res) => {
        this.customerLastName = res.data.user.lastName;
        this.customerID = res.data.user.customerID;
      });
  },
};
</script>

<style scoped>
@media(min-width: 1600px){
  .container {
    margin-left: 30% !important;
  }
}
  
* {
  font-family: 'Oswald';
}
  .disabled{
    pointer-events: none;
    opacity: 0.6;
}
.container {
  display: flex;
  text-align: left;
  margin-left: 10%;

}

.column {
    width: 45%;
  margin-bottom: 20px;
  padding: 20px;
}

.imgmain {
  max-width: 50%; /* Make sure the image doesn't exceed its container */
  height: auto;
  border: 5px solid #97bf0d;
  border-radius: 50%;
}
  h4 {
    margin-top: 10px;
  }

  .information {
    margin-top: 10px;
  }

  .textnew {
    font-weight: bold;
  }

  .phone,
  .envelope {
    display: inline;
    margin-right: 5px;
  }
.footer {
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
#copyright {
  font-size: 10px;
  color: white;
}
.links {
  font-size: 9px;
  color: white;
}
h2 {
  font-weight: bold;
}

#message {
  display: flex;
  justify-content: center;
}

.card-header {
  background: #97bf0d;
  color: white;
  height: auto;
  width: 430px;
  font-size: 36px;
  margin:10px auto;
  border-radius:10px;
  text-align: center;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.btn-group {
  margin-top: 20px;
}
.card {
  margin-top: 20px;
  position: relative;
  height: auto;
  width: auto;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 100px;
  border:none;
}
.row {
  width: 400px;
}
.btn-secondary {
  border-radius: 4px !important;
  background-color: #97bf0d !important;
  border-color: #97bf0d;
  margin-right: 5px;
  height: auto;
  width: auto;
  text-align: center;
}

#phone {
  color: #97bf0d;
}
button{
  border-radius: 5px;
}
.btn-primary {
  background-color: #97bf0d !important;
  border-color: #97bf0d;
  margin-top: 5px;

}

.svg-inline--fa {
  display: inline;
  margin: 0 auto;
}

.btn-group {
  text-align: center;
}

#delete {
  height: 70px;
  width: 45px;
}

.popup {
  background: #f5f5f5;
  width: 350px;
  height: 240px;
  margin-top: 10px;
  border-radius: 10px;
  border: 2px solid #97bf0d;
  box-sizing: border-box;
  z-index: 1000;
  text-align: center;
  opacity: 0;
  top: -200%;
}

.active {
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
ul {
  margin-right: 30px;
}


.popup .cancelButton {
  margin-top: 50px;
}

.popup .cancelButton button {
  padding: 10px 20px;

  font-size: 16px;
  font-weight: 600;
  outline: none;
  border-radius: 10px;
  transition: all 300ms ease-in-out;
  cursor: pointer;
  margin-left: 10px;
}

.textnew {
  color: #97bf0d;
}

@media (max-width: 575.98px) {

#showUpdates{
  max-width: 60%;
  margin: auto;
}
  .column {
    width: 110%;
  margin-bottom: 20px;
  padding: 10px;
  font-size: 8px;
}
  .container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: left;

  }
  .phone {
    font-size: smaller;
  }
  .imgmain {
  max-width: 50%; /* Make sure the image doesn't exceed its container */
  height: auto;
  border: 3px solid #97bf0d;
  border-radius: 50%;
}
  .textnew {
    font-size: small;
  }
  .card {
    height: auto;
    width: 280px;
    margin-top: 10px;
    margin-bottom: 30px;
    margin-left: 10px;
    font-size: small;
    margin-right: 10px;
    position: absolute;
  }
  .card-header {
    background: #97bf0d;
  color: white;
  height:50px;
  width: 260px;
  font-size: 48px;
  border-radius: 10px;
  margin: auto;
  display: flex;
  justify-content: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }

  .mb-4 {
    font-size: small;
  }

  .popup {
    margin-left: 50px;
    height: 250px;
    width: 250px;
    font-size: small;
  }
  .form-control {
    width: 250px;
    display: table;
    margin-left: auto;
    margin-right: auto;
  }
  .btn-primary {
    margin-bottom: 10px;
  }
}
@media only screen and (min-width: 600px) {
  .card {
    width: auto;
    margin-left: 10px;
    margin-right: 10px;
  }
}
@media (min-width: 601px) and (max-width: 1199px) {
    .column {
    width: 110%;
  margin-bottom: 15px;
  padding: 20px;
  font-size: small;
}
.column a{
    font-size: smaller; 
}
  .container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: left;
  margin-left: 3%;

  }
  .phone {
    font-size: small;
  }
  .imgmain {
  max-width: 70%; /* Make sure the image doesn't exceed its container */
  height: auto;
  border: 3px solid #97bf0d;
  border-radius: 50%;
}
}
</style>
