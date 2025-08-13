<template>
  <div translate="no">
    <Sidebar @search-input-emit="search" /><!--sidebar component-->
    <div v-if="showNotification" id="notofication">
      <img width="30" height="30" src="https://img.icons8.com/ios-filled/100/FFFFFF/info.png" alt="info" style="margin-top:10px;"/>
      <p style="color:white; margin-left: 15px; margin-top:10px;">Kein Zertifikat für diesen Monat gefunden!</p>
    </div>

    <div v-if="isLoading">
      <div
        class="spinner-grow text-success image"
        role="status"
        style="
          margin-top: 25%;
          color: #97bf0d !important;
          height: 100px;
          width: 100px;
          opacity: 0.6;
        "
      ></div>
    </div>
    <div v-else>
      <!--delete popup-->
      <div class="card">
        <div class="card-header">
          <h2 id="headerText">{{ $t("certificate") }}</h2>
        </div>
        <div style="margin-top:15px; font-size: 24px;">
          <p>Gesamtanzahl der Wäscht: <span style="color:#97bf0d"> {{ certificates.length }}</span></p>
        </div>
        <div>
          <select v-if="!ownerCustomer" style="margin-bottom:15px;width:130px;height:35px;border-radius:10px; background-color:#97bf0d; border:none;color:white;font-weight:bold;" v-model="selectedLicense" @change="filterByLicenseNumber">
             <option value="" selected style="padding:15px; margin-left: 10px;">Alle Fahrzeuge</option>
          <option v-for="license in licenses" :key="license" :value="license.licenseNumber">{{ license.licenseNumber }} </option>

      </select>
   
        </div>
        <div id="certificateBody">
          <div>
            <!-- dispay current yeat -->
            <button @click="prevMonth" class="nav-button" @click.prevent="gotoPreviouseyear(selectedYear-1)"> {{ "< "+(selectedYear-1) }}</button>
            
            <button @click="nextMonth" class="nav-button2" v-if="selectedYear!=currentYear" @click.prevent="gotoNextyear(selectedYear+1)"> {{ selectedYear+1 + " >" }}</button>
          </div>
          <h2 class="nav-center">{{ selectedYear }}</h2>
          <!-- display months four month in a row -->
          <div id="monthContainer">
            <div id="threeMonths">
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '1',januaryCertificate)" :class="{gray:januaryCertificate.length == 0}">
                 <h6 style="font-size:32px;">Januar</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px;"> {{ januaryCertificate.length+" Zertifikate" }}</p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '2',februaryCertificate)" :class="{gray:februaryCertificate.length == 0}">
                 <h6 style="font-size:32px;">Februar</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px;"> {{ februaryCertificate.length+" Zertifikate" }}</p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '3',marchCertificate)" :class="{gray:marchCertificate.length == 0}">
                 <h6 style="font-size:32px;">März</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px;"> {{ marchCertificate.length+" Zertifikate" }}</p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '4',aprilCertificate)" :class="{gray:aprilCertificate.length == 0}">
                 <h6 style="font-size:32px;">April</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px;"> {{ aprilCertificate.length+" Zertifikate" }}</p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            </div>
            <div id="threeMonths">
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '5',mayCertificate)" :class="{gray:mayCertificate.length == 0}">
                 <h6 style="font-size:32px;">Mai</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px;"> {{ mayCertificate.length+" Zertifikate" }}</p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '6',juneCertificate)" :class="{gray:juneCertificate.length == 0}">
                 <h6 style="font-size:32px;">Juni</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px;"> {{ juneCertificate.length+" Zertifikate" }}</p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '7',julyCertificate)" :class="{gray:julyCertificate.length == 0}">
                 <h6 style="font-size:32px;">Juli</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px;"> {{ julyCertificate.length+" Zertifikate" }}</p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '8',augustCertificate)" :class="{gray:augustCertificate.length == 0}">
                 <h6 style="font-size:32px;">August</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px;"> {{ augustCertificate.length+" Zertifikate" }}</p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            </div>
            <div id="threeMonths">
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '9',septemberCertificate)" :class="{gray:septemberCertificate.length == 0}">
                 <h6 style="font-size:32px;">September</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px;"> {{ septemberCertificate.length+" Zertifikate" }}</p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '10',octoberCertificate)" :class="{gray:octoberCertificate.length == 0}">
                 <h6 style="font-size:32px;">Oktober</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px;"> {{ octoberCertificate.length+" Zertifikate" }}</p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '11',novemberCertificate)" :class="{gray:novemberCertificate.length == 0}">
                 <h6 style="font-size:32px;">November</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px;"> {{ novemberCertificate.length+" Zertifikate" }}</p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            <div class="col-md-3" @click.prevent="gotocertificates(selectedYear, '12', decemberCertificate )" :class="{gray:decemberCertificate.length == 0}">
                 <h6 style="font-size:32px;">Dezember</h6>
                 <div style="margin:auto;">
                  <div  style="display: flex; justify-content:center; height: 40px; width: 180px; padding: 5px;; border:1px solid white; border-radius:10px;">
                     <p style="font-size:20px; display:flex; flex-direction: row;"> {{ decemberCertificate.length+" Zertifikate" }} </p>
                     <img src="https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png" style="width:22px; height:22px; margin:5px;"/>
                  </div>
                </div>
            </div>
            </div>
          </div>

        </div>
         <!-- <div v-if="certificates.length == 0">
            <p>Derzeit haben Sie keine Zertifikate. Wenn ein neues Zertifikat für Sie ausgestellt wird, dann wird es automatisch angezeigt!</p>
        </div> -->
        <!-- <div v-else>
        <p>Gesamtzahl der Zertifikate: <strong style="color:#97bf0d">{{certificates.length}}</strong></p>
        <p>Gesamtzahl der Zertifikate {{months[selectedMonth - 1] +", "+ selectedYear}}: <strong style="color:#97bf0d" :class="{noCertificate: monthlyCertificate.length ==0}">{{monthlyCertificate.length}}</strong></p>
        <div v-if="mobileTrue">
            <label for="yearSelect">Bitte wählen Sie das Jahr: &nbsp;</label>
            <br/>
          <select v-model="selectedYear" class="year-select">
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <br/>
          <br/>
          <label for="monthSelect">Bitte Monat auswählen: &nbsp; </label>
          <br/>
          <select v-model="selectedMonth" class="month-select" @change="getMonthlyCertificate">
            <option
              v-for="(month, index) in months"
              :key="index"
              :value="index + 1"
            >
              {{ month }}
            </option> 
          </select>
          <br/>
          <br/>
          <p>Ausgewähltes Jahr: {{ selectedYear }}</p>
            <p>Ausgewählter Monat: {{ months[selectedMonth - 1] }}</p>
        </div>
        <div v-else>
            <label for="yearSelect">Bitte Jahr auswählen: &nbsp;</label>
          <select v-model="selectedYear" class="year-select">
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <br/>
          <label for="monthSelect">Bitte Monat auswählen: &nbsp; </label>
          <select v-model="selectedMonth" class="month-select" @change="getMonthlyCertificate">
            <option
              v-for="(month, index) in months"
              :key="index"
              :value="index + 1"
            >
              {{ month }}
            </option>
          </select>
          <br/>
          <br/>
          <p>Ausgewähltes Jahr: {{ selectedYear }}, Ausgewählter Monat: {{ months[selectedMonth - 1] }}</p>
        </div>   
          <br />
          <br />
        <div v-if="noCertificates || monthlyCertificate.length==0">
          <p>Im {{months[selectedMonth - 1] +", "+ selectedYear}} wurde keine Bescheinigung ausgestellt!</p>
        </div>
        <div v-else>
        
          <table class="table table-striped table-hover table-responsive">
            <thead>
              <tr>
                <th scope="col">{{ $t("certificate") }} Id</th>
                <th scope="col">{{ $t("machine") }}</th>
                <th scope="col">{{ $t("licenseNumber") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="certificate in monthlyCertificate">
                <td
                  id="certificateId"
                  @click.prevent="certificatePdf($event)"
                >
                  {{ certificate.certificateID }}
                </td>
                <td>{{ certificate.machineID }}</td>
                <td>{{ certificate.licenseNumber }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> -->
    </div>
    </div>

    <!-- <Footer v-if="!isLoading"/> -->
  </div>
</template>
<script>
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";
import Footer from "@/components/Footer.vue";

import Help from "@/components/Help.vue";
export default {
  name: "Certificate",
  data() {
    return {
      showNotification: false,
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      years: Array.from(
        { length: 2 },
        (_, index) => new Date().getFullYear() - 1 + index
      ), // Years for the dropdown
      currentYear: new Date().getFullYear(),
      months: [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
      ],
      selectedLicense:"",
      phoneshowing: true,
      mobileTrue: false,
      certificates: [],
      monthlyCertificate:[],
      updates: "",
      noCertificates: false,
      isLoading: true,
      januaryCertificate: [],
    februaryCertificate: [],
    marchCertificate: [],
    aprilCertificate: [],
    mayCertificate: [],
    juneCertificate: [],
    julyCertificate: [],
    augustCertificate: [],
    septemberCertificate: [],
    octoberCertificate: [],
    novemberCertificate: [],
    decemberCertificate: [],
    licenses: [],
    customerID: "",
    ownerCustomer: false,
    ownerID: "",
    };
   
  },
  components: {
    Sidebar,
    Help,
    Footer,
  },
  methods: {
    gotocertificates(year,month, length){
      if(length == 0){
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
      else{
      
      if(this.selectedLicense != ''){
        this.$router.push({ name: "CertificateList", query: { year: year, month: month, licenseNumber: this.selectedLicense } });
      }
      else{
      this.$router.push({ name: "CertificateList", query: { year: year, month: month } });
      }
    }

    },
    gotoPreviouseyear(year) {
      this.selectedYear = this.selectedYear - 1;
      this.januaryCertificate = []
      this.februaryCertificate = []
      this.marchCertificate = []
      this.aprilCertificate = []
      this.mayCertificate = []
      this.juneCertificate = []
      this.julyCertificate = []
      this.augustCertificate = []
      this.septemberCertificate = []
      this.octoberCertificate = []
      this.novemberCertificate = []
      this.decemberCertificate = []
      if(this.selectedLicense != ''){
        this.filterByLicenseNumber()
      }
      else{
        console.log(this.ownerCustomer)
        if(this.ownerCustomer){
          this.getOwnerCustomerYear(year)
        }
        else{
          this.getCertificates(year)
        }
      }
    },
    gotoNextyear(year) {
      this.selectedYear = this.selectedYear + 1;
      this.januaryCertificate = []
      this.februaryCertificate = []
      this.marchCertificate = []
      this.aprilCertificate = []
      this.mayCertificate = []
      this.juneCertificate = []
      this.julyCertificate = []
      this.augustCertificate = []
      this.septemberCertificate = []
      this.octoberCertificate = []
      this.novemberCertificate = []
      this.decemberCertificate = []
      if(this.selectedLicense != ''){
        this.filterByLicenseNumber()
      }
      else{
        console.log(this.ownerCustomer)
        if(this.ownerCustomer){
          this.getOwnerCustomerYear(year)
        }
        else{
          this.getCertificates(year)
        }
      }
    },
    getOwnerCustomerYear(year){
      this.isLoading = true;
      //console.log("THis",year, this.certificates)
      axios.post(process.env.VUE_APP_HOST+'/certificatefilterbyOwnerID',{token:localStorage.getItem("token")}).then((res)=>{
       // console.log(res.data)
        this.certificates = res.data;
          for (let i=0; i<res.data.length; i++){
           // console.log( new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +2)
            if(year == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear()){
                this.monthlyCertificate.push(res.data[i])
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 1){
                    this.januaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 2){
                    this.februaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 3){
                    this.marchCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 4){
                    this.aprilCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 5){
                    this.mayCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 6){
                    this.juneCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 7){
                    this.julyCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 8){
                    this.augustCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 9){
                    this.septemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 10){
                    this.octoberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 11){
                    this.novemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 12){
                    this.decemberCertificate.push(res.data[i])
                }

            }
          }
          this.isLoading = false;
        })

    },
    getMonthlyCertificate(){
        this.monthlyCertificate = []
        console.log( this.selectedYear, new Date(parseInt(this.certificates[0].CreatedAttimeStamp)).getFullYear())
        console.log(this.selectedMonth, new Date(parseInt(this.certificates[0].CreatedAttimeStamp)).getMonth()+1)
        for (let i=0; i<this.certificates.length; i++){

            if(this.selectedYear == new Date(parseInt(this.certificates[i].CreatedAttimeStamp)).getFullYear() && this.selectedMonth == new Date(parseInt(this.certificates[i].CreatedAttimeStamp)).getMonth()+1){
                console.log( new Date(parseInt(this.certificates[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(this.certificates[i].CreatedAttimeStamp)).getMonth()+1)
                this.monthlyCertificate.push(this.certificates[i])
            }
            //
          } 
    },
    certificatePdf(e) {
      this.certificateId = e.target.innerHTML;
      //this.$router.push({ path: '/certificate/pdf', query: { certificate: this.certificateId } })
      let route = this.$router.resolve({
        path: "/certificate/pdf",
        query: { certificate: this.certificateId },
      });
      window.open(route.href);
    },
    getCertificates(year){
      this.isLoading = true;
      axios.get(process.env.VUE_APP_HOST + "/customercertificates", {
        headers: { token: localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.length === 0) {
          this.noCertificates = true;
          this.isLoading = false;
        } else {
          this.certificates = res.data;
          console.log(this.selectedMonth, this.selectedYear)
          console.log(res.data[0])
          for (let i=0; i<res.data.length; i++){
            console.log( new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +2)
            if(year == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear()){
               // this.monthlyCertificate.push(res.data[i])
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 1){
                    this.januaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 2){
                    this.februaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 3){
                    this.marchCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 4){
                    this.aprilCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 5){
                    this.mayCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 6){
                    this.juneCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 7){
                    this.julyCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 8){
                    this.augustCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 9){
                    this.septemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 10){
                    this.octoberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 11){
                    this.novemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 12){
                    this.decemberCertificate.push(res.data[i])
                }

            }
            //
          }
          console.log(this.januaryCertificate, this.februaryCertificate.length, this.marchCertificate, this.aprilCertificate, this.mayCertificate, this.juneCertificate, this.julyCertificate, this.augustCertificate, this.septemberCertificate, this.octoberCertificate, this.novemberCertificate, this.decemberCertificate)
          this.isLoading = false;
        }
      });
    },
    filterByLicenseNumber(){
      this.isLoading = true;
      this.januaryCertificate = []
      this.februaryCertificate = []
      this.marchCertificate = []
      this.aprilCertificate = []
      this.mayCertificate = []
      this.juneCertificate = []
      this.julyCertificate = []
      this.augustCertificate = []
      this.septemberCertificate = []
      this.octoberCertificate = []
      this.novemberCertificate = []
      this.decemberCertificate = []
      if(this.selectedLicense == ""){
        axios
      .get(process.env.VUE_APP_HOST + "/customercertificates", {
        headers: { token: localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.length === 0) {
          this.certificates = res.data;
          this.noCertificates = true;
          this.isLoading = false;
        } else {
          this.certificates = res.data;
          for (let i=0; i<res.data.length; i++){
            console.log( new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +2)
            if(this.selectedYear == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear()){
                this.monthlyCertificate.push(res.data[i])
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 1){
                    this.januaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 2){
                    this.februaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 3){
                    this.marchCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 4){
                    this.aprilCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 5){
                    this.mayCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 6){
                    this.juneCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 7){
                    this.julyCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 8){
                    this.augustCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 9){
                    this.septemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 10){
                    this.octoberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 11){
                    this.novemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 12){
                    this.decemberCertificate.push(res.data[i])
                }

            }
            //
          }
          console.log(this.januaryCertificate, this.februaryCertificate.length, this.marchCertificate, this.aprilCertificate, this.mayCertificate, this.juneCertificate, this.julyCertificate, this.augustCertificate, this.septemberCertificate, this.octoberCertificate, this.novemberCertificate, this.decemberCertificate)
          this.isLoading = false;
        }
      });
    axios.get(process.env.VUE_APP_HOST + "/customerprofile", {
      headers: { token: localStorage.getItem("token") },
     }).then((res)=>{
      console.log(res.data)
      this.licenses = res.data.user.licenses
      this.customerID  = res.data.user.customerID
      console.log(this.customerID)
     })
      }
      else{
      axios.post(process.env.VUE_APP_HOST+'/certificatefilterbyLicenseNumber',
      {licenseNumber: this.selectedLicense,customerID:this.customerID}).then((res)=>{
        console.log(res.data)
        if(res.data.length === 0){
          this.certificates = res.data;
          this.noCertificates = true;
          this.isLoading = false;
          this.januaryCertificate = [];
          this.februaryCertificate = [];
          this.marchCertificate = [];
          this.aprilCertificate = [];
          this.mayCertificate = [];
          this.juneCertificate = [];
          this.julyCertificate = [];
          this.augustCertificate = [];
          this.septemberCertificate = [];
          this.octoberCertificate = [];
          this.novemberCertificate = [];
          this.decemberCertificate = [];

        }else{
          this.certificates = res.data;
          this.isLoading = false;
          for (let i=0; i<res.data.length; i++){
            console.log( new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +2)
            if(this.selectedYear == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear()){
                this.monthlyCertificate.push(res.data[i])
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 1){
                    this.januaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 2){
                    this.februaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 3){
                    this.marchCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 4){
                    this.aprilCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 5){
                    this.mayCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 6){
                    this.juneCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 7){
                    this.julyCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 8){
                    this.augustCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 9){
                    this.septemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 10){
                    this.octoberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 11){
                    this.novemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 12){
                    this.decemberCertificate.push(res.data[i])
                }

              }
            }

        }
      })
    }

    },
    getOwnerCustomer(){
      axios.post(process.env.VUE_APP_HOST+'/certificatefilterbyOwnerID',{token:localStorage.getItem("token")}).then((res)=>{
       // console.log(res.data)
        this.certificates = res.data;
          for (let i=0; i<res.data.length; i++){
            //console.log( new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +2)
            if(this.selectedYear == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear()){
                this.monthlyCertificate.push(res.data[i])
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 1){
                    this.januaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 2){
                    this.februaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 3){
                    this.marchCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 4){
                    this.aprilCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 5){
                    this.mayCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 6){
                    this.juneCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 7){
                    this.julyCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 8){
                    this.augustCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 9){
                    this.septemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 10){
                    this.octoberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 11){
                    this.novemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 12){
                    this.decemberCertificate.push(res.data[i])
                }

            }
            //
            this.isLoading = false;
          }
      })
    },
    getOnlyCustomer(){
      axios.get(process.env.VUE_APP_HOST + "/customercertificates", {
        headers: { token: localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.length === 0) {
          this.certificates = res.data;
          this.noCertificates = true;
          this.isLoading = false;
        } else {
          this.certificates = res.data;
          for (let i=0; i<res.data.length; i++){
            console.log( new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +2)
            if(this.selectedYear == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear()){
                this.monthlyCertificate.push(res.data[i])
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 1){
                    this.januaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 2){
                    this.februaryCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 3){
                    this.marchCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 4){
                    this.aprilCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 5){
                    this.mayCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 6){
                    this.juneCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 7){
                    this.julyCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 8){
                    this.augustCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 9){
                    this.septemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 10){
                    this.octoberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 11){
                    this.novemberCertificate.push(res.data[i])
                }
                if(new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1 == 12){
                    this.decemberCertificate.push(res.data[i])
                }

            }
            //
          }
          console.log(this.januaryCertificate, this.februaryCertificate.length, this.marchCertificate, this.aprilCertificate, this.mayCertificate, this.juneCertificate, this.julyCertificate, this.augustCertificate, this.septemberCertificate, this.octoberCertificate, this.novemberCertificate, this.decemberCertificate)
          this.isLoading = false;
        }
      });
    },
  },
   mounted() {
    //getting the query parameter
    //localStorage.removeItem("calendar");
    let query = this.$route.query;
              console.log(query)
                if(query.calendar=="true"){
                  localStorage.setItem("calendar", "true");
                }
    //clear the local storage calendar after 60 seconds
    setTimeout(() => {
      localStorage.removeItem("calendar");
    }, 1200000);
    if (window.innerWidth < 900) {
      this.phoneshowing = false;
    }
    if (window.innerWidth < 767) {
      this.mobileTrue = true;
    } else {
      this.mobileTrue = false;
    }
   
      let ownerCustomer = false;
      let ownerID = "";
     axios.get(process.env.VUE_APP_HOST + "/customerprofile", {
      headers: { token: localStorage.getItem("token") },
     }).then((res)=>{
      console.log(res.data)
      this.licenses = res.data.user.licenses
      this.customerID  = res.data.user.customerID
      this.ownerID = res.data.user.ownerID
      this.ownerCustomer = res.data.user.ownerCustomer
      console.log(res.data.user.ownerCustomer)
      if(res.data.user.ownerCustomer){
        this.getOwnerCustomer()
      }
      else{
        this.getOnlyCustomer()
      }
      console.log(this.customerID)
     })
     // reload in every 5 minutes
      setInterval(() => {
       console.log("reloading", this.selectedYear, this.selectedMonth, this.ownerCustomer)
       if(this.ownerCustomer){
        this.januaryCertificate = []
      this.februaryCertificate = []
      this.marchCertificate = []
      this.aprilCertificate = []
      this.mayCertificate = []
      this.juneCertificate = []
      this.julyCertificate = []
      this.augustCertificate = []
      this.septemberCertificate = []
      this.octoberCertificate = []
      this.novemberCertificate = []
      this.decemberCertificate = []
          this.getOwnerCustomerYear(this.selectedYear)
        }
        else{
          this.januaryCertificate = []
      this.februaryCertificate = []
      this.marchCertificate = []
      this.aprilCertificate = []
      this.mayCertificate = []
      this.juneCertificate = []
      this.julyCertificate = []
      this.augustCertificate = []
      this.septemberCertificate = []
      this.octoberCertificate = []
      this.novemberCertificate = []
      this.decemberCertificate = []
          this.getCertificates(this.selectedYear)
        }
      }, 120000);
      //set interval in two minutes
    
  },
  created() {
     
  },
};
</script>
<style scoped>
#notofication{
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: red;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.gray{
  background-color: grey !important;
}
#threeMonths{
  display:flex; 
  flex-direction: row; 
  justify-content: center;
}
.row{
 display: flex;
 flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.col-md-3{
  background-color: #97bf0d;
  color: white;
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
  text-align: center;
  width: 20%;
  height: 18vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;

}
.col-md-3:hover{
  background-color: #97bf0d;
  color: white;
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
  text-align: center;
  height: 18vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 30px 0 #97bf0d;
}
.nav-button {
    background-color: #97bf0d; /* Green button background */
    color: #fff; /* White text */
    border: none;
    padding: 8px 12px;
    margin-bottom: 10px;;
    font-size: 14px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: larger;
    float: left;
    margin: 10px;
    
  }
  .nav-center{
    color: #97bf0d; /* White text */
    border: none;
    padding: 8px 12px;
    margin-bottom: 10px;;

    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-align: center;
    margin: 10px;
  }
  .nav-button2 {
    background-color: #97bf0d; /* Green button background */
    color: #fff; /* White text */
    border: none;
    padding: 8px 12px;
    margin-bottom: 10px;;
    font-size: 14px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: larger;
    float: right;
    margin: 10px;
    
  }
#certificateBody{
  background-color: white; /* Gray background */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 90%;
    min-height: 70vh;
    margin: auto;
    margin-left: auto;
    margin-right: auto;
    border: 3px solid #97bf0d;
    display: flex;
    flex-direction: column;
}

* {
  font-family: 'Oswald';
}
.footertemp {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #97bf0d;
}
.noCertificate{
    color: red !important;
}
.content {
  flex: 1;

  /* Add additional styles for the main content */
}

.footer {
  display: flex;
  background-color: #97bf0d;
  height: 54px;
  align-items: center;
  justify-content: space-between;
}

.left-section,
.center-section,
.right-section {
  flex: 1;
  text-align: center;
  color: #fff;
}

.left-section {
  /* Additional styles for the left section */
  flex: 1;
  margin-top: 16px;
}

.center-section {
  /* Additional styles for the center section */
  flex: 1;
}

.right-section {
  /* Additional styles for the right section */
  float: right;
  margin-right: 100px;
}

a {
  margin-right: 5px;
  text-align: center;
  font-size: medium;
  color: white;
  text-decoration: none;
  cursor: pointer;
}

@media (max-width: 576px) {
  #copyright {
    font-size: 10px;
  }

  .footertemp {
    height: 62px;
    width: auto !important;
    position: fixed;
  }

  .left-section {
    font-size: small;
    display: table;
  }

  a {
    font-size: 10px;
  }

  .links {
    font-size: 8px;
    display: table;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 900px) {
  #monthContainer {
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  #threeMonths{
  display:flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 5%;
}
  .col-md-3{
  background-color: #97bf0d;
  color: white;
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
  text-align: center;
  width: 90%;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;

}
  
  .row{
  margin: auto;
  }
  #copyright {
    font-size: 10px;
  }

  .footertemp {
    height: 62px;
    width: 100%;
    position: fixed;
  }

  .left-section {
    display: table;
  }

  a {
    font-size: 10px;
  }

  .links {
    display: table;
    margin-left: auto;
    margin-right: auto;
  }
}

.card {
  height: auto;
  width: auto;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  border: none;
  margin-bottom: 200px;
  text-align: center;
}

.card-header {
  background: #97bf0d;
  color: white;
  height:64px;
  width: 360px;
  font-size: 48px;
  border-radius: 10px;
  margin: auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

}
#headerText{
  margin-top:2px
}

h2 {
  font-weight: bold;
}

#delete {
  height: 70px;
  width: 45px;
}

.popup {
  background: #f5f5f5;
  width: 350px;
  height: 320px;

  border-radius: 10px;
  border: 2px solid #97bf0d;
  box-sizing: border-box;

  text-align: center;
  opacity: 0;
  top: -200%;
}

.active {
  opacity: 1;
  top: 50%;
  left: 59%;
  transform: translate(-80%, -60%) scale(1);
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
}

.center {
  position: absolute;
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

#certificateId {
  cursor: pointer;
}

.table {
  margin-bottom: 70px;
}
@media (max-width: 767px) {
  .card {
    height: auto;
    width: 75%;
    margin-left: 10px;
    margin-right: 10px;
    position: absolute;
    margin-top: 10px;
  }

  .table {
    height: auto;
    font-size: x-small;
    word-wrap: break-word;
    margin-bottom: 90px;
  }

  .popup {
    margin-left: 70px;
    height: auto;
    width: 250px;
  }

  .jumbotron {
    width: max-content;
  }

  #certificateId {
    word-wrap: break-word;
  }
}

@media  (max-width: 991px) {
  #headerText{
    margin-top:0px
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
  margin: auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

}
#certificateBody{
  background-color: white; /* Gray background */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 90%;
    min-height: 70vh;
    margin: auto;
    margin-left: auto;
    margin-right: auto;
    border: 3px solid #97bf0d;
    display: flex;
    flex-direction: column;
}
  
}
</style>
