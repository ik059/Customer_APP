<template>
    <div translate="no">
      <Sidebar @search-input-emit="search" /><!--sidebar component-->
  
      <Help />
  
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
          <!-- back button with icon -->

          <div id="backButton">
            <button
              type="button"
              class="btn btn-secondary"
              @click.prevent="gotoCertificate"
              style="margin-top: 10px; margin-left: 10px; background:transparent; border:none"
            >
            <img width="30" height="30" src="https://img.icons8.com/ios-filled/100/97bf0d/left-squared--v1.png" alt="left-squared--v1"/>
              
            </button>
          </div>
        
          <div v-if="certificates.length == 0">
            <p style="font-size:32px">Monat: <span style="color:#97bf0d;">{{ months[selectedMonth - 1] }}</span></p>
             
              <div v-if="!ownerCustomer">
          <select style="margin-bottom:15px;width:130px;height:35px;border-radius:10px; background-color:#97bf0d; border:none;color:white;font-weight:bold;" v-model="selectedLicense" @change="filterByLicenseNumber">
             <option value="all" selected style="padding:15px; margin-left: 10px;">Alle Fahrzeuge</option>
          <option v-for="license in licenses" :key="license" :value="license.licenseNumber">{{ license.licenseNumber }} </option>

      </select>
        </div>
        <p>Derzeit haben Sie keine Zertifikate. Wenn ein neues Zertifikat für Sie ausgestellt wird, dann wird es automatisch angezeigt!</p>
          </div>
          <div v-else>
          <div>
          
            <p style="font-size:32px">Monat: <span style="color:#97bf0d;">{{ months[selectedMonth - 1] }}</span></p>
          </div>   
          <!--license table-->
          <div>
          <select v-if="!ownerCustomer" style="margin-bottom:15px;width:130px;height:35px;border-radius:10px; background-color:#97bf0d; border:none;color:white;font-weight:bold;" v-model="selectedLicense" @change="filterByLicenseNumber">
             <option value="all" selected style="padding:15px; margin-left: 10px;">Alle Fahrzeuge</option>
          <option v-for="license in licenses" :key="license" :value="license.licenseNumber">{{ license.licenseNumber }} </option>

      </select>
        </div>
          <div v-if="noCertificates || monthlyCertificate.length==0">
            <p>Im {{months[selectedMonth - 1] +", "+ selectedYear}} wurde keine Bescheinigung ausgestellt!</p>
          </div>
          <div v-else>
            <Slideshow :images="currentImage" :showImage="showImages" :closeImage="closeImage"/>
          <div id="certificateTable">
            <table class="table table-striped table-hover table-responsive">
              <thead>
                <tr>
                  <th scope="col">Zeit</th>
                  <th scope="col">Wash-ID</th>
                  <th scope="col">{{ $t("machine") }}</th>
                  <th scope="col">{{ $t("licenseNumber") }}</th>
                  <th scope="col">PDF</th>
                  <th scope="col">Bilder</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="certificate in monthlyCertificate">
                  <td>{{ certificate.date }}, {{ certificate.time }} Uhr</td>
                  <td
                    id="certificateId"
                    @click.prevent="certificatePdf($event)"
                  > {{ certificate.certificateID }}
                  </td>
                  <td>{{ certificate.machineID }}</td>
                  <td>{{ certificate.licenseNumber }}</td>
                  <td>
                    <img width="30" height="30" src="https://img.icons8.com/ios-filled/100/97bf0d/certificate.png" alt="certificate"  style="cursor:pointer;" @click.prevent="opencertificatePdf(certificate)"/>
                  </td>
                  <td >
                     <img v-if="certificate.hasImages" @click.prevent="showImage(certificate)"  width="25" height="25" src="https://img.icons8.com/ios-filled/97bf0d/camera--v1.png" alt="camera--v1" style="cursor:pointer;"/>
                      <p v-else>   </p>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
          </div>
        </div>
      </div>
      </div>
  
      <!-- <Footer v-if="!isLoading"/> -->
    </div>
  </template>
  <script>
  import Slideshow from "@/components/Slideshow.vue";
  import Sidebar from "@/components/Sidebar.vue";
  import axios from "axios";
  import Footer from "@/components/Footer.vue";
  
  import Help from "@/components/Help.vue";
  export default {
    name: "Certificate",
    data() {
      return {
        showImages: false,
        currentImage: [],
        selectedLicense: "all",
        licenses: [],
        cutomerID:'',
        selectedYear: this.$route.query.year,
        selectedMonth: this.$route.query.month,
        years: Array.from(
          { length: 2 },
          (_, index) => new Date().getFullYear() - 1 + index
        ), // Years for the dropdown
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
        phoneshowing: true,
        mobileTrue: false,
        certificates: [],
        monthlyCertificate:[],
        updates: "",
        noCertificates: false,
        isLoading: true,
        ownerCustomer: false,
      };
    },
    components: {
      Sidebar,
      Help,
      Footer,
      Slideshow,
    },
    methods: {
      showImage(certificate){
        console.log(certificate.images)
        this.currentImage = certificate.images
        this.showImages = true
      },
      closeImage(){
        this.showImages = false
      },
      gotoCertificate() {
        this.$router.push({ name: "Certificate" });
      },
      getMonthlyCertificate(){
          this.monthlyCertificate = []
          console.log( this.selectedYear, new Date(parseInt(this.certificates[0].CreatedAttimeStamp)).getFullYear())
          console.log(this.selectedMonth, new Date(parseInt(this.certificates[0].CreatedAttimeStamp)).getMonth()+1)
          for (let i=0; i<this.certificates.length; i++){
  
              if(this.selectedYear == new Date(parseInt(this.certificates[i].CreatedAttimeStamp)).getFullYear() && this.selectedMonth == new Date(parseInt(this.certificates[i].CreatedAttimeStamp)).getMonth()+1){
                  console.log( new Date(parseInt(this.certificates[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(this.certificates[i].CreatedAttimeStamp)).getMonth()+1)
                  this.monthlyCertificate.push(this.certificates[i])
                  console.log(this.monthlyCertificate)
              }
              //
            } 
      },
      opencertificatePdf(certificate) {
       let route =  this.$router.resolve({ path: "/certificate/pdf", query: { certificate: certificate.certificateID } });
        window.open(route.href);
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
      filterByLicenseNumber() {
        this.monthlyCertificate = []
        this.isLoading = true;
        if(this.selectedLicense == "all"){
          this.getAllLicense()
        }
        else{
        
        axios
          .post(process.env.VUE_APP_HOST + "/certificatefilterbyLicenseNumber", {
            licenseNumber: this.selectedLicense,
            customerID: this.customerID,
          })
          .then((res) => {
            if (res.data.length === 0) {
              this.noCertificates = true;
              this.isLoading = false;
            } else {
              this.certificates = res.data;
              this.noCertificates = false;
              this.isLoading = false;
              for (let i=0; i<res.data.length; i++){
            console.log( new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1)
            if(this.selectedYear == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear() && this.selectedMonth == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1
            && this.selectedLicense == res.data[i].licenseNumber){
              this.monthlyCertificate.push(res.data[i])
            }
          }
            }
          });
        }
      },
      getAllLicense(){
        axios
        .get(process.env.VUE_APP_HOST + "/customercertificates", {
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
              console.log( new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1)
              if(this.selectedYear == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear() && this.selectedMonth == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1){
                  this.monthlyCertificate.push(res.data[i])
              }
              console.log(this.monthlyCertificate)
              //
            }
            this.isLoading = false;
          }
        });
      },
      getCustomerCertificate(){
        axios
        .get(process.env.VUE_APP_HOST + "/customercertificates", {
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
              console.log( new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1)
              if(this.selectedYear == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear() && this.selectedMonth == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1){
                  this.monthlyCertificate.push(res.data[i])
              }
              console.log(this.monthlyCertificate)
              //
            }
            this.isLoading = false;
          }
        });
      },
      getOwnerCustomerCertificate(){
        axios.post(process.env.VUE_APP_HOST+'/certificatefilterbyOwnerID',{token:localStorage.getItem("token")}).then((res)=>{
          if (res.data.length === 0) {
            this.noCertificates = true;
            this.isLoading = false;
          } else {
            this.certificates = res.data;
            console.log(this.selectedMonth, this.selectedYear)
            console.log(res.data[0])
            for (let i=0; i<res.data.length; i++){
              //console.log( new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1)
              if(this.selectedYear == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear() && this.selectedMonth == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1){
                  this.monthlyCertificate.push(res.data[i])
              }
              //console.log(this.monthlyCertificate)
              //
            }
            this.isLoading = false;
          }
        })
      }
    },
    mounted() {
      if (window.innerWidth < 900) {
        this.phoneshowing = false;
      }
      if (window.innerWidth < 767) {
        this.mobileTrue = true;
      } else {
        this.mobileTrue = false;
      }
      if(this.$route.query.licenseNumber){
        this.selectedLicense = this.$route.query.licenseNumber
      
      axios.get(process.env.VUE_APP_HOST + "/customerprofile", {
      headers: { token: localStorage.getItem("token") },
     }).then((res)=>{
      console.log(res.data)
      this.licenses = res.data.user.licenses
      this.customerID  = res.data.user.customerID
      console.log(this.customerID)
      axios.post(process.env.VUE_APP_HOST+"/certificatefilterbyLicenseNumber", {licenseNumber: this.selectedLicense, customerID: this.customerID}).then((res)=>{
        if(res.data.length === 0){
          this.noCertificates = true;
          this.isLoading = false;
        }
        else{
          this.certificates = res.data;
          this.isLoading = false;
          for (let i=0; i<res.data.length; i++){
            console.log( new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear(),new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1)
            if(this.selectedYear == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getFullYear() && this.selectedMonth == new Date(parseInt(res.data[i].CreatedAttimeStamp)).getMonth() +1
            && this.selectedLicense == res.data[i].licenseNumber){
              this.monthlyCertificate.push(res.data[i])
            }
          }
        }
      })
     })
    }
     else{
      axios.get(process.env.VUE_APP_HOST + "/customerprofile", {
      headers: { token: localStorage.getItem("token") },
     }).then((res)=>{
      console.log(res.data)
      this.licenses = res.data.user.licenses
      this.customerID  = res.data.user.customerID
      this.ownerCustomer = res.data.user.ownerCustomer
      if(res.data.user.ownerCustomer){
        this.getOwnerCustomerCertificate()
      }
      else{
        this.getCustomerCertificate()
      }
     })
   
    }
    setInterval(() => {
      if(this.ownerCustomer){
        this.monthlyCertificate = []
        this.getOwnerCustomerCertificate()
      }
      else{
        this.monthlyCertificate = []
        this.getCustomerCertificate()
      }
    }, 120000);
    },
  };
  </script>
  <style scoped>
  #imageButton{
    cursor:pointer;
    color:#97bf0d;
  }
  #backButton{
    position: absolute;
    top: 10px;
    left: 10px;
  }
  #certificateTable{
    overflow-y:scroll;
    width:90%;
    margin: 0 auto;
    border: 3px solid #97bf0d;
    border-radius: 10px;
    padding: 10px;
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
    #certificateTable{
      width:100%;
    }
    
    #backButton{
    position: absolute;
    top: 45px;
    left: -25px;
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
}

.card-header {
  background: #97bf0d;
  color: white;
  height: 64px;
  width: 360px;
  border-radius: 10px;
  margin: auto;
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
  #headerText{
   margin-top: 0px;
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
      width: 100%;
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
#headerText{
  margin-top: 0px;
}
    .card {
      width: auto;
      display: flex;
        justify-content: center;
    }
  }
  </style>
  