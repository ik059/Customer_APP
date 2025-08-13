<template>
  <div class="vue-tempalte" translate="no">
    <particles-bg type="cobweb" :canvas="{ backgroundColor: '#97bf0d', height:'130%' }" :bg="true" />

    <!--vue partice background-->
    <br/>
    <div class="vertical-center">
      <div class="inner-block" id="signupcontainer">
        <img class="img-responsive" src="-" height="67" href="-"
          target="_blank" />
          <br/>
          <br/>
        <h5 id="board">Rechnungsadresse</h5>
        <form>
          <div class="d-flex flex-row align-items-center ml-5 mb-4 ">
            <div class="form-outline flex-fill mb-0">
              <input type="text" 
              id="form3Example4c" 
              placeholder="&#xf1ad; Firma" 
              class="form-control" 
              required
              v-model="companyName" />
            </div>
          </div>
          <!-- two radio button with heer and frau labeld as situation -->
          <!-- <div class="d-flex flex-row align-items-center ml-5 mb-4">
            <p style="text-align: left; margin: 0 !important;" class="form-check-label" >Aussprache</p>
            <div style="margin-left:10px; display: flex; align-items: center;">
              <label style="margin: 0 10px; font-weight: 100; font-size: small;">
                <input type="radio" v-model="customerSituation" value="Herr" />
                Herr
              </label>
              <label style="margin: 0 10px; font-weight: 100; font-size: small;">
                <input type="radio" v-model="customerSituation" value="Frau" />
                Frau
              </label>
            </div>
          </div> -->
          <div class="d-flex flex-row align-items-center mr-2 mb-4">
            <div class="form-outline flex-fill mb-0" style="margin-right:5px;">
              <input type="text" id="form3Example2F" placeholder="&#xf018; Straße" class="form-control" required
                v-model="street" />

            </div>
            <div class="form-outline flex-fill mb-0">
              <input type="text" id="form3Example2F" placeholder="Hausnummer" class="form-control" required
                v-model="streetnumber" />
            </div>
          </div>
          <div class="d-flex flex-row align-items-center mr-2 mb-4">
            <div class="form-outline flex-fill mb-0" style="margin-right:5px;">
              <input type="email" 
              id="form3Example1F" 
              placeholder="&#xf041; Postleitzahl" 
              class="form-control" 
              required
              :class="{ valid: isvalidPostcode, invalid: !isvalidPostcode }"
                v-model="postCode" />
               
            </div>

            <div class="form-outline flex-fill mb-0">
              <input type="email" id="form3Example4F" placeholder="&#xf64f; Ort" class="form-control names" required
                v-model="city" />


            </div>

          </div>
          <div class="d-flex flex-row align-items-center mb-4">
            <div class="form-outline flex-fill mb-0">
              <input type="email" id="form3Example3c" placeholder="&#xf0e0; Email" class="form-control" required
                v-model="billingemail" />
                <!-- <span id="erroremail" v-if="msg.email">{{msg.email}}</span> -->

            </div>
          </div>
        

        
          <div class="d-flex flex-row align-items-center ml-5 mb-4 ">
            <div class="form-outline flex-fill mb-0">
              <input type="text" 
              id="form3Example4c" 
              placeholder="Umsatzersteuer-ID" 
              class="form-control" 
              required
              v-model="taxidNumber" />
            </div>
          </div>
          
          <h5>Ansprechpartner</h5>
          <div class="form-outline flex-fill mb-0" >
            <select class="form-select" aria-label="Default select example" v-model="customerSituation" required>
              <option selected :disabled="true" value="" style="color:grey !important; font-weight:100;">Anrede</option>
              <option value="Herr" style="color:grey; font-weight:100;">Herr</option>
              <option value="Frau" style="color:grey; font-weight:100;">Frau</option>
            </select>
          </div>
          <br/>
          <div class="d-flex flex-row align-items-center mr-2 mb-4">
            <!-- create a dropdown -->
            

            <div class="form-outline flex-fill mb-0" style="margin-right:5px;">
              <input type="text" id="form3Example2F" placeholder="Vorname" class="form-control" required
                v-model="fname" />

            </div>
            <div class="form-outline flex-fill mb-0">
              <input type="text" id="form3Example2F" placeholder="Nachname" class="form-control" required
                v-model="lname" />
            </div>
          </div>
          <!-- <div class="d-flex flex-row align-items-center  mt-2 mb-4">
             <div class="form-outline flex-fill mb-0">
              <input type="text" id="form3Example1c" placeholder="&#xf007; Vorname" class="form-control"
                v-model="fname" />

            

            </div>
          </div>
          <div class="d-flex flex-row align-items-center mb-4">
            <div class="form-outline flex-fill mb-0">
              <input type="text" id="form3Example2c" placeholder="&#xf5b7;Nachname" class="form-control names" required
                v-model="lname" />

            </div>
          </div> -->
          <div class="d-flex flex-row align-items-center mb-4">
            <div class="form-outline flex-fill mb-0">
              <input type="email" id="form3Example3c" placeholder="&#xf0e0; Email" class="form-control" required
                v-model="email" />
                <span id="erroremail" v-if="msg.email">{{msg.email}}</span>

            </div>
          </div>
          <div class="d-flex flex-row align-items-center ml-5 mb-4 ">
            <div class="form-outline flex-fill mb-0">
              <input type="text" 
              id="form3Example4c" 
              :class="{ valid: isValidPhoneNumber, invalid: !isValidPhoneNumber }"
              placeholder="&#128222; Telefonnummer" 
              class="form-control" 
              required
              v-model="cNumber" />
              <span id="erroremail" v-if="!isValidPhoneNumber">Ungültige Handynummer</span>
            </div>
          </div>
         

          <div class="d-flex flex-row align-items-center ">
            <div class="form-outline flex-fill mb-4">
              <input type="password" id="form3Example6c" placeholder="&#xf023; Passwort" class="form-control" required
                v-model="password" />

            </div>
          </div>

          <div class="d-flex flex-row align-items-center">
            <div class="form-outline flex-fill mb-4">
              <input type="password" id="form3Example4cd" placeholder="&#xf084; Passwort wiederholen" required
                class="form-control" v-model="cPassword" />
            </div>
          </div>
          <div class="col-12">
            <div class="form-check" id="terms">
              <input class="form-check-input" type="checkbox" value="" v-model="accetpted" id="invalidCheck"
                v-bind:class="{ checked: isChecked }" @change="accept">
              <label class="form-check-label" for="invalidCheck">
                Bitte bestätigen Sie, dass Sie mit unseren <span class="conditions"><a target="_blank" href="-" style="color:#97bf0d;">Allgemeinen
                  Geschäftsbedingungen</a></span> einverstanden sind.</label>
              <div class="invalid-feedback">
                You must agree before submitting.
              </div>
            </div>
          </div>
          <!--registration form end-->
          <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
            <button type="button" class="btn btn-primary btn-lg" @click.prevent="signUp">
              <div v-if="loading" class="spinner-border spinner-border-sm"></div> {{ $t("register") }}
            </button> <!--register button-->
          </div>
        </form>
        <div>
          <p class="update">{{ updates }}</p>
        </div>

        <div>
          <p>
            {{ $t('acountExist') }}
            <router-link to="/" style="color:#97bf0d;">{{ $t('login') }} </router-link><!--routing to signup-->
          </p>
          <br/>
        </div>

      </div>
      <div class="popup center" v-bind:class="{ active: isActive }">
        <p> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi, repellendus modi harum libero et, soluta
          dolor ab nulla provident, ullam numquam blanditiis magni ipsam architecto iure tenetur officia! Inventore,
          aliquam.</p>
        <div class="cancelButton">
          <button type="button" class="btn btn-danger" id="close" v-on:click="close">
            {{ $t('close') }}
          </button>
          <button class="btn btn-primary" id="book" @click="accept">
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
    <Beta />
  </div>
</template>
<script>
import axios from "axios";
import { ParticlesBg } from "particles-bg-vue";
import Beta from "../components/Beta.vue";

export default {
  name: "Registration",

  data() {
    return {
      fname: "",
      lname: "",
      email: "",
      cNumber: "",
      street: "",
      city: "",
      postCode: "",
      password: "",
      cPassword: "",
      customerID: "",
      isChecked:false,
      updates: "",
      loading: false,
      msg: [],
      isValidPhoneNumber: true,
      accetpted:'',
      companyName:'',
      isvalidPostcode: true,
      taxidNumber:'',
      customerSituation:'',
      billingemail:'',
    };
  },
  watch: {
    email(value) {
      // binding this to the data value in the email input
      this.email = value;
      this.validateEmail(value);
    },
  
  },
  methods: {
    signUp() {
      this.loading = true
      if (this.password !== this.cPassword) {
        this.updates = "Das Passwort muss dasselbe sein!";
        this.loading = false
       
        
      } 
      else if(this.accetpted != true){
        this.loading = true
        this.updates = "Bitte stimmen Sie unseren Bedingungen zu!";
        this.loading = false
       
      }
      else {
        function generateRandomString(n) {
          let customerID = "";
          let characters = "ABCDEGHIJKLMNOPQRSTUVWXZ0123456789";
          for (let chars = 0; chars < n; chars++) {
            customerID += characters.charAt(
              Math.floor(Math.random() * characters.length)
            );
          }
          return customerID;
        }
        this.customerID = generateRandomString(6);
        const newCustomer = {
          firstName: this.fname,
          lastName: this.lname,
          email: this.email,
          customerID: this.customerID,
          city: this.city,
          street: this.street,
          postcode: this.postCode,
          contactNumber: this.cNumber,
          password: this.password,
          streetnumber: this.streetnumber,
          companyName: this.companyName,
          role: "Customer",
          taxidNumber: this.taxidNumber,
          customerSituation: this.customerSituation,
          billingemail: this.billingemail
        };

        axios
          .post(process.env.VUE_APP_HOST +"/customerregistration", newCustomer)
          .then((res) => {
            if (res.data === 'ok') {
              this.loading = false
              this.$router.push({
                path: "confirmemail",
                query: { customer: this.customerID },
              });
            } else {
              this.updates = res.data
              this.loading = false
            }
          });
      }
    },
    popup() {
      this.isActive = true
    },
    close() {
      this.isActive = false;
    },
    accept() {
      this.isChecked = true


    },
    validateEmail(value) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        this.msg['email'] = '';
      
      } else {
        this.msg['email'] = 'Ungültige E-Mail Adresse';
      }
    },
    validatePhoneNumber() {
      const validationRegex = /^\d{11}$/;
      if (this.cNumber.match(validationRegex)) {
        this.isValidPhoneNumber = true;
      } else {
        this.isValidPhoneNumber = false;
      }
    },
    validatePostcode() {
      const validationRegex = /^\d{4}$/;
      if (this.postCode.match(validationRegex)) {
        this.isvalidPostcode = true;
      } else {
        this.isvalidPostcode = false;
      }
    },
  
   
  },
  components: {
    ParticlesBg,
    Beta,
  },

};
</script>




<style scoped>

* {
  font-family: 'Oswald';
}
.conditions {
  text-decoration: underline;
  cursor: pointer;
  color: blue;
}
.form-select {
            width: 100%;
            color: grey;
            font-weight: 10;
        }

        /* Default option styling */
        .form-select option.default {
            color: grey;
            font-weight: 100 !important;
        }

        /* Style for other options */
        .form-select option {
            color: grey;
            font-weight: 100;
        }
h5 {
  text-align: center;
  color: #97bf0d;
}

#signupcontainer {
  width: 700px;
  height:auto

}

.img-responsive {
  margin-left: 160px;
  margin-top: 0;
}

.vue-tempalte,
.vertical-center {
  width: 100%;
  height: auto;
}

.form-control {
  font-family: Avenir, Helvetica, Arial, sans-serif, fontawesome;
  font-size: small;
}

.navbar-light {
  background-color: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
}

.btn-danger {
  border-radius: 0%;
  margin-right: 5px;
}

.vertical-center {
  display: flex;
  text-align: left;
  justify-content: center;
  flex-direction: column;
}

.inner-block {
  width: 450px;
  height: 820px;
  margin-left: auto;
  margin-right: auto;
  background: #ffffff;
  box-shadow: 0px 14px 80px rgba(68, 223, 12, 0.2);
  padding: 20px 55px 45px 55px;
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

#terms {
  font-size: small;

}

#erroremail{
  color: red;
  font-size: small;
  display: table;
  margin-left: auto;
  margin-right: auto;
}

p {
  text-align: center;
}

button{
  border-radius:5px;
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
  font-weight: bolder;
}

.svg-inline--fa {
  margin-right: 5px;
}

.popup {
  background: #f5f5f5;
  width: 350px;
  height: 200px;
  margin-top: 10px;
  border-radius: 10px;
  border: 2px solid #97bf0d;
  box-sizing: border-box;
  z-index: -1;
  text-align: center;
  opacity: 0;

}


.active {
  opacity: 1;
  z-index: 1;
  top: 50%;
  left: 58%;
  transform: translate(-80%, -60%) scale(1);
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
}

.center {
  position: absolute;
}
@media (min-width: 767px) and (max-width:1100px){
  .vertical-center{
    margin-top: 5%;
  }
}
@media (max-width: 575.98px) {
  h3 {
    font-size: medium;

    margin-left: auto;
    margin-right: auto;
  }

  h5 {
    font-size: medium;
    margin-left: auto;
    margin-right: auto;
  }

  #signupcontainer {
    height: auto;
    width: auto;
    font-size: 9px;
    display: table;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .form-control {
    font-size: 8px;
    display: table;
    margin-top: 0;
    margin-left: auto;
    margin-right: auto;
  }

  #form3Example3F {
    margin-right: 5px;
    width: 100px;


  }


  .img-responsive {
    height: 40px;
    width: 120px;
    display: table;
    margin-left: auto;
    margin-right: auto;
  }

  .btn-primary {
    width: auto;
    height: 30px;
    font-size: x-small;
    text-align: center;
  }
}

.fa-lg {
  font-size: small;
}
@media (min-width: 1600px) {
  .vue-tempalte{
    margin-top:5%;
  }
}
</style>