<template>
  <div translate="no">
    
    <!--sidebar component-->
    <div class="popup center" v-bind:class="{ actives: ispopupActive }">
      <div class="title"><h3>{{ $t("model") }}</h3></div>
      <br/>
        <div>
          <h6>Bitte geben Sie das Modell ein</h6>
          <br/>
          <div>
            <input type="text" v-model="custommodel" placeholder="Modell eingeben" style="height: 30px; width: 250px; padding:5px; border:1px solid #97bf0d; border-radius:5px;"/>
          </div>
          <br/>
          <button class="btn btn-danger" id="book" @click="ispopupActive = false, trailerModel = ''" style="margin:5px;">
            Abbrechen
          </button>
          <button class="btn btn-success" id="book" @click="customermodel" style="margin:5px;">
            Speichern
          </button>
          </div>
    </div>
    <div class="popup center" v-bind:class="{ actives: ispopupActive2 }">
      <div class="title"><h3>Marke</h3></div>
      <br/>
        <div>
          <h6>Bitte geben Sie die Marke ein</h6>
          <br/>
          <div>
            <input type="text" v-model="custommarke" placeholder="Marke eingeben" style="height: 30px; width: 250px; padding:5px; border:1px solid #97bf0d; border-radius:5px;"/>
          </div>
          <br/>
          <button class="btn btn-danger" id="book" @click="ispopupActive2 = false, trailerDesignation = ''" style="margin:5px;">
            Abbrechen
          </button>
          <button class="btn btn-success" id="book" @click="customCompany" style="margin:5px;">
            Speichern
          </button>
          </div>
    </div>
    

    <Help />
    <div :class="{disabled: ispopupActive, disabled:ispopupActive2}">
      <sidebar @search-input-emit="search" />
    <div class="card" >
      
      <div class="card-header">
        <h2>Fahrzeug HINZUFÜGEN</h2>
      </div>
      <div class="card-body">
        <form>
          <div class="form-group">
           

            <div v-if="agreement">
              <form @submit.prevent="addnonGermanLicense">
                <label for="nonGermanLicense" id="centre2"
                  ><b>{{ $t("licenseNumber") }}</b></label
                >
                <input
                  type="text"
                  class="form-control"
                  id="nonGermanLicense"
                  aria-describedby="emailHelp"
                  placeholder="Kennzeichennummer"
                  v-model="lNumber"
                  style="height: 30px; width: 250px"
                />
                <br />
                <div id="centre1">
              <label for="agreement"
                ><b>{{ $t("noGermanLicense") }} </b>&nbsp;</label
              >
              <input type="checkbox" v-model="agreement" name="agreement" />

              <br />
              <br />
            </div>
            <br/>
                <div id="trailerBuild">
                  <label for="trailerDesignation" id="centre3"
                    ><b>Marke</b>
                    &nbsp;&nbsp;&nbsp;</label
                  ><br />
                  <select
                    v-model="trailerDesignation"
                    id="trailerDesignation"
                    @change="getModels()"
                    style="height: 30px; width: 250px"
                  >
                    <option disabled value="" >
                      Marke
                    </option>
                    <option
                      v-for="(truck, index) in truckCompanies.names"
                      :key="index"
                      
                    >
                      {{ truck }}
                    </option>
                  </select>
                  <select
                    v-model="trailerModel"
                    id="trailermodel"
                    style="height: 30px; width: 250px"
                    @change.prevent="checkmodel"
                  >
                    <option disabled value="">{{ $t("model") }}</option>
                    <option v-for="truck in models">{{ truck }}</option>
                  </select>
                </div>
                <br />
                <br />
                <label for="buildYear" id="buildYear"
                  ><b>{{ $t("constractedYear") }}</b>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;
                </label>
                <select
                  v-model="buildYear"
                  id="buildYear"
                  v-on:change="dropDown"
                  style="height: 30px; width: 250px"
                >
                  <option disabled value="">{{ $t("constractedYear") }}</option>
                  <option v-for="year in years" :value="year">
                    {{ year }}
                  </option>
                </select>

                <br />
                <br />

                <br />
                <div id="buttonstoback">
                  <button
                    @click.prevent="backtoLicense"
                    class="btn btn-secondary"
                  >
                    Zurück
                  </button>
                  <button type="submit" class="btn btn-primary">
                    <div
                      v-if="loading"
                      class="spinner-border spinner-border-sm"
                    ></div>
                    {{ $t("addLicense") }}
                  </button>
                </div>
                <p :class="{ active: isActive, alert: !isActive }">
                  {{ updates }}
                </p>
                <br/>
              <br/>
              <br/>
              </form>
            </div>

            <div v-else>
              <form @submit.prevent="addLicense" id="germanLicenseform">
                <label for="germanLicenseInput" id="centre2"
                  ><b>{{ $t("licenseNumber") }}</b></label
                >
                <!--add license number-->
                <div id="germanLicenseInput">
                    <div id="inputfileds">
                  <input
                  ref="licenseInput"
                    id="licenseInputs1"
                    type="text"
                    class="form-control"
                    placeholder="AB"
                    :maxlength="3"
                    v-model="licenseCity"
                    v-on:input="convertToUppercase2($event)"
                    v-on:keypress="isLetter($event)"
                  />
                  <input
                    id="licenseInputs2"
                    type="text"
                    class="form-control"
                    placeholder="CDE"
                    :maxlength="2"
                    v-model="licenseChaer"
                    v-on:input="convertToUppercase($event)"
                    v-on:keypress="isLetter($event)"
                  />
                  <input
                    id="licenseInputs3"
                    type="text"
                    class="form-control"
                    placeholder="1234"
                    :maxlength="4"
                    v-model="licenseNumber"
                    v-on:keypress="isNumber($event)"
                  />
                </div>
                </div>

                <br />
                <div id="centre1">
              <label for="agreement"
                ><b>{{ $t("noGermanLicense") }} </b>&nbsp;</label
              >
              <input type="checkbox" v-model="agreement" name="agreement" />

              <br />
              <br />
            </div>
          <br/>
                <div id="trailerBuild">
                  <label for="trailerDesignation" id="centre3"
                    ><b>Marke & Modell</b>
                    &nbsp;&nbsp;&nbsp;</label
                  >
                  <select
                    v-model="trailerDesignation"
                    id="trailerDesignation"
                    @change="getModels()"
                    style="height: 30px; width: 250px"
                  >
                    <option disabled value="">
                      Marke
                    </option>
                    <option
                      v-for="(truck, index) in truckCompanies.names"
                      :key="index"
                    >
                      {{ truck }}
                    </option>
                  </select>
                  <select
                    v-model="trailerModel"
                    id="trailermodel"
                    style="height: 30px; width: 250px"
                    @change.prevent="checkmodel"
                  >
                    <option disabled value="">{{ $t("model") }}</option>
                    <option v-for="truck in models">{{ truck }}</option>
                  </select>
                </div>
                <br />

                <br />
                <label for="buildYear" id="buildLabel"
                  ><b>{{ $t("constractedYear") }}</b>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;</label
                >
                <select
                  v-model="buildYear"
                  id="buildYear"
                  style="height: 30px; width: 250px"
                >
                  <option disabled value="">{{ $t("constractedYear") }}</option>
                  <option v-for="year in years" :value="year">
                    {{ year }}
                  </option>
                </select>

                <br />
                <br />

                <br />
                <div id="buttonstoback">
                  <button
                    @click.prevent="backtoLicense"
                    class="btn btn-secondary">
                    Zurück
                  </button>
                  <button type="submit" class="btn btn-primary">
                    <div v-if="loading" class="spinner-border spinner-border-sm"></div>
                    {{ $t("addLicense") }}
                  </button>
                </div>
                <div v-if="updateRequired">
                  <p :class="{ active: isActive, alert: !isActive }">
                    {{ updates }}
                  </p>
                </div>
                <br/>

              </form>
             
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
    <!-- <Footer /> -->
  </div>
</template>

<script>

import trucks from "../files/truckCompanies.json";
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import Help from "@/components/Help.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: "AddLicense",
  data() {
    return {
      custommarke:'',
      ispopupActive2: false,
      custommodel:'',
      ispopupActive: false,
      mobileTrue: false,
      truckCompanies: trucks,
      lNumber: "",
      details: "",
      agreement: false,
      updates: "",
      noGermanLicense: false,
      trailerDesignation: "",
      buildYear: "",
      licenseCity: "",
      licenseChaer: "",
      licenseNumber: "",
      isActive: false,
      updateRequired: false,
      trailerModel: "",
      models: [],
      loading: false,
      intervalId: null,
      customDiv: false,
    };
  },
  components: {
    Sidebar,
    Help,
    Footer,
  },
  methods: {
  customCompany() {
    // Map custom input to the trailer designation
    this.trailerDesignation = this.custommarke;

    // Close the popup
    this.ispopupActive2 = false;

    // Check if the custom company already exists in the truckCompanies object
    if (!this.truckCompanies[this.custommarke]) {
      // Add the custom company with predefined trailer types
      this.truckCompanies[this.custommarke] = [
          'Kühlauflieger',
          'Trockenfrachtkoffer',
          'Sonderbau',
          'Andere'
        ];

      // Add the new company name to the 'names' array
      this.truckCompanies.names.push(this.custommarke);
      console.log('Company added');
      console.log(this.truckCompanies);
      this.getModels();
    } else {
      // Log a message if the company already exists
      console.log('Company already exists');
    }
},
    customermodel(){
      this.trailerModel = this.custommodel;
      this.ispopupActive = false;
      this.custommodel = '';
      this.models.push(this.trailerModel);
    },
    convertToUppercase(event) {
      this.licenseChaer = event.target.value.toUpperCase();
      if (this.licenseChaer.length >= 3) {
        this.$refs.nextInput.focus();
      }
    },
    checkmodel(){
      this.customDiv = false;
      if(this.trailerModel == "Andere"){
       this.ispopupActive = true;
      }
    },
    convertToUppercase2(event) {

      this.licenseCity = event.target.value.toUpperCase();
      if (this.licenseCity.length >= 2) {
        this.$refs.nextInput.focus();
      }
    },
    getModels() {
      if(this.trailerDesignation == "Andere"){
        this.ispopupActive2 = true;
      }
      else
      {
      this.trailerModel = "";
      let a = this.truckCompanies;
      let b = this.trailerDesignation;
      this.models = a[b];
      }
    },
    backtoLicense() {
      (this.lNumber = ""),
        (this.trailerDesignation = ""),
        (this.buildYear = ""),
        (this.trailerModel = "");
      (this.licenseCity = ""),
        (this.licenseChaer = ""),
        (this.licenseNumber = "");
      (this.trailerDesignation = ""),
        (this.buildYear = ""),
        (this.trailerModel = "");
      this.$router.push("license");
    },
    addnonGermanLicense() {
      this.loading = true;
      if (
        this.lNumber == 0 ||
        this.lNumber == undefined ||
        this.trailerDesignation == 0 ||
        this.trailerDesignation == undefined ||
        this.buildYear == 0
      ) {
        this.updates = "Alle Felder sind Pflichtfelder!";
        this.loading = false;
        this.custommarke = '';
        this.custommodel = '';
        this.truckCompanies = trucks;
        this.intervalId = setInterval(() => {
          this.updateRequired = false;
        }, 4000);
        clearInterval(this.intervalId);
      } else {
        axios
          .post(process.env.VUE_APP_HOST + "/addlicense", {
            customerID: this.details,
            licenseNumber: this.lNumber,
            trailerDesignation: this.trailerDesignation,
            trailerModel: this.trailerModel,
            constractedYear: this.buildYear,
          })
          .then(
            (res) => {
              if (res.status == 200) {
                this.isActive = true;
                this.updateRequired = true;
                this.loading = false;
                this.updates = res.data;
                (this.lNumber = ""),
                  (this.trailerDesignation = ""),
                  (this.buildYear = ""),
                  (this.trailerModel = "");
                setInterval(() => {
                  this.updateRequired = false;
                  //this.$router.push("license");
                }, 4000);
              }
            },
            (error) => {
              this.updateRequired = true;
              this.isActive = false;
              this.loading = false;
              this.updates = "Etwas ist schief gelaufen!";
              (this.licenseCity = ""),
                (this.licenseChaer = ""),
                (this.licenseNumber = "");
              (this.trailerDesignation = ""),
                (this.buildYear = ""),
                (this.trailerModel = "");
              setInterval(() => {
                this.updateRequired = false;
              }, 4000);
            }
          );
      }
    },
    addLicense() {
      this.loading = true;
      if (
        this.licenseCity == 0 ||
        this.licenseChaer == 0 ||
        this.licenseNumber == 0 ||
        this.trailerDesignation == 0 ||
        this.buildYear == 0
      ) {
        console.log(
          this.licenseCity,
          this.licenseChaer,
          this.licenseNumber,
          this.trailerDesignation,
          this.buildYear
        );
        this.updateRequired = true;
        this.updates = "Alle Felder sind Pflichtfelder!";
        this.loading = false;
        this.custommarke = '';
        this.custommodel = '';
        this.truckCompanies = trucks;
        this.intervalId = setInterval(() => {
          this.updateRequired = false;
        }, 4000);
        clearInterval(this.intervalId);
      } else {
        this.loading = true;
        axios
          .post(process.env.VUE_APP_HOST + "/addlicense", {
            customerID: this.details,
            licenseNumber:
              this.licenseCity +"-"+this.licenseChaer +"-"+this.licenseNumber,
            backupLicenseNumber:this.licenseCity +this.licenseChaer +this.licenseNumber,
            trailerDesignation: this.trailerDesignation,
            trailerModel: this.trailerModel,
            constractedYear: this.buildYear,
          })
          .then(
            (res) => {
              if (res.status === 200) {
                this.isActive = true;
                this.updateRequired = true;
                this.loading = false;
                this.updates = res.data;
                (this.licenseCity = ""),
                  (this.licenseChaer = ""),
                  (this.licenseNumber = "");
                (this.trailerDesignation = ""),
                  (this.buildYear = ""),
                  (this.trailerModel = "");
                setInterval(() => {
                  this.updateRequired = false;
                  //this.$router.push("license");
                }, 4000);
              }
            },
            (error) => {
              this.updateRequired = true;
              this.isActive = false;
              this.loading = false;
              this.updates = "Etwas ist schief gelaufen";
              (this.licenseCity = ""),
                (this.licenseChaer = ""),
                (this.licenseNumber = "");
              (this.trailerDesignation = ""),
                (this.buildYear = ""),
                (this.trailerModel = "");
              setInterval(() => {
                this.updateRequired = false;
              }, 4000);
            }
          );
      }
    },
    isLetter(e) {
      let char = String.fromCharCode(e.keyCode); // Get the character
      if (/^[A-Za-z]+$/.test(char)) {
        this.updateRequired = false;
        return true;
      } // Match with regex
      else {
        e.preventDefault();
   
        if(this.agreement == true){
          this.updateRequired = true;
        this.updates = "Es sind nur Buchstaben erlaubt!";
        }
      
        setInterval(() => {
          this.updateRequired = false;
        }, 4000);
      } // If not match, don't add to input text
    },
    isNumber(e) {
      let char = String.fromCharCode(e.keyCode); // Get the character
      if (/^[0-9]+$/.test(char)) {
        this.updateRequired = false;
        return true;
      } // Match with regex
      else {
        e.preventDefault();
        if(this.agreement == true){
        this.updateRequired = true;
        this.updates = "Nur Zahlen sind erlaubt!";
        }
        setInterval(() => {
          this.updateRequired = false;
        }, 4000);
      } // If not match, don't add to input text
    },
  },
  //checking the valide token
  created() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }
  },
  mounted() {
    if (window.innerWidth < 767) {
      this.mobileTrue = true;
    } else {
      this.mobileTrue = false;
    }
    axios
      .get(process.env.VUE_APP_HOST + "/customerprofile", {
        headers: { token: localStorage.getItem("token") },
      })
      .then((res) => {
        this.details = res.data.user.customerID;
      });
  },
  computed: {
    years() {
      const year = new Date().getFullYear();
      return Array.from(
        { length: year - 1999 },
        (value, index) => 2000 + index
      ).reverse();
    },
  },
};
</script>

<style scoped>
.disabled{
  pointer-events: none;
  opacity: 0.4;

}
.popup {
  background: #f5f5f5;
  width: 350px;
  height: auto;
  margin-top: 10px;
  border-radius: 10px;
  border: 2px solid #97bf0d;
  box-sizing: border-box;
  z-index: -1;
  text-align: center;
  opacity: 0;
  padding: 10px;

}

.actives {
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
@media (min-width: 1024px) 
{
  #licenseInputs1{
  border-radius: 4px;
  margin-top: 5px;
  margin-right: 5px;
  width: 80%;
  height: 7.8vh;

}
#licenseInputs2 {
  border-radius: 4px;
  margin-top: 5px;
  margin-right: 5px;
  width: 119%;

}
#licenseInputs3 {
  border-radius: 4px;
  margin-top: 5px;
  margin-right: 10px;
  width: 145%;
}

}
@media (min-width: 1800px){
  #licenseInputs1{
  border-radius: 4px;
  margin-top: 5px;
  margin-right: 5px;
  width: 80%;
  height: 5vh;
  }
  
}
@media (min-width: 3220px){
  #licenseInputs1{
  border-radius: 4px;
  margin-top: 5px;
  margin-right: 5px;
  width: 80%;
  height: 5.8vh;
  }
}
#buttonstoback {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto;
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
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
}

.active {
  color: #97bf0d;
  display: table;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 5%;
}

.alert {
  color: red;
  display: table;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 5%;
}

#nonGermanLicense {
  display: table;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
}

#licenseInputs {
  border-radius: 4px;
  margin-top: 5px;
  margin-right: 10px;
  width: 75px;
}
#licenseInputs1{
  border-radius: 4px;
  margin-top: 5px;
  margin-right: 5px;
  width: 80%;

}
#licenseInputs2 {
  border-radius: 4px;
  margin-top: 5px;
  margin-right: 5px;
  width: 119%;

}
#licenseInputs3 {
  border-radius: 4px;
  margin-top: 5px;
  margin-right: 10px;
  width: 145%;

}

#centre1 {
  display: table;
  margin-left: auto;
  margin-right: auto;
}

#centre2 {
  display: table;
  margin-left: auto;
  margin-right: auto;
}

#centre3 {
  display: table;
  margin-left: auto;
  margin-right: auto;
}

#trailerDesignation {
  display: table;
  margin-left: auto;
  margin-right: auto;
}

#trailermodel {
  display: table;
  margin-left: auto;
  margin-right: auto;
}

#buildYear {
  display: table;
  margin-left: auto;
  margin-right: auto;
}

#buildLabel {
  display: table;
  margin-left: 42%;
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

select {
  margin-top: 15px;
}

.card {
  height: auto;
  width: auto;
  display: table;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  margin-top: 20px;
  margin-bottom: 100px;
 
}
.btn {
  border-radius: 5px;
}
.btn-primary {
  margin-left: 2%;
  background-color: #97bf0d !important;
  border-color: #97bf0d;
}

#germanLicenseInput {
  border-radius: 9px;
  padding: 5%;
  /* background-image: url('https://i.ibb.co/p2cFCYr/sa.jpg'); */
  /* background-size:cover;
  background-position: center; */
  border: 2px solid black;
  background: linear-gradient(to right, blue 13%, white 10%);
  background: url('../assets/112.png') 0 0 / 11.5% auto no-repeat, linear-gradient(to right, white 30%, white 100%);

}
#inputfileds{
  display: flex;
  flex-direction: row;
  width: 93%;
  margin: auto;
  margin-left: 10%;
}
@media(max-width: 676px){
  #centre1 {
  display: table;
  margin-left: auto;
  margin-right: auto;
  font-size: small;
}
  .btn-primary {
  width: 55%;
  margin-left: 2%;
  background-color: #97bf0d !important;
  border-color: #97bf0d;
}
  #germanLicenseInput {
  border-radius: 9px;
  padding: 5%;
  background-image: none;
    min-width: 100%;
    margin: auto;
  }
  #inputfileds{
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: auto;
  }
}
/**mobile styling */
@media (min-width: 677px)and (max-width: 767.98px) {
  #germanLicenseInput {

border-radius: 5px;
padding: 1%;
background-image: url('https://i.ibb.co/p2cFCYr/sa.jpg');
background-size:cover;
background-position: center;
}
  form {
    font-size: smaller;
  }

  #germanLicenseInput {
    display: flex;
    flex-direction: column;
  }
  #licenseInputs1{
  border-radius: 4px;
  margin-right: 5px;
  width: 25%;
  height: 7.5vh;
  }
  #licenseInputs2{
  border-radius: 4px;

  margin-right: 5px;
  width: 35%;
  height: 7.5vh;
  }
  #licenseInputs3{
  border-radius: 4px;

  margin-right: 5px;
  width: 30%;
  height: 7.5vh;
  }

  .card {
    height: auto;
    width: auto;
    display: table;
    margin-left: auto;
    margin-right: auto;
  }
  #buildLabel {
    display: table;
    margin-left: 37%;
  }
  .card-header {
  background: #97bf0d;
  color: white;
  height:50px;
  width: 260px;
  font-size: 24px;
  border-radius: 10px;
  margin: auto;
  display: flex;
  justify-content: center;

}
}

@media  (max-width: 900px) {
  .card-header {
  background: #97bf0d;
  color: white;
  height:auto;
  width: 260px;
  font-size: 24px;
  border-radius: 10px;
  margin: 5px auto;
  display: flex;
  justify-content: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

}
  .card {
    height: auto;
    width: auto;
  }
  

  #germanLicenseInput {
    display: flex;
    flex-direction: column;
  }
  #licenseInputs1{
  border-radius: 4px;
  margin-right: 5px;
  width: 25%;
  height: 5.5vh;
  }
  #licenseInputs2{
  border-radius: 4px;

  margin-right: 5px;
  width: 35%;
  height: 5.5vh;
  }
  #licenseInputs3{
  border-radius: 4px;

  margin-right: 5px;
  width: 30%;
  height: 5.5vh;
  }
}
</style>
