<template>
  <div class="home" translate="no">
    <sidebar @search-input-emit="search" /><!--sidebar component-->

    <div v-if="isLoading">
      <!-- <div class="spinner-border text-secondary" role="status" style="margin-top: 25%; color: #97bf0d !important; height: 300px;"></div>
     -->
      <img class="image" src="" alt="" width="180" height="120">

    </div>
    <div v-else>
   
      <div class="head"  v-bind:class="{lasndScapeHeader:tableLandScape}">

        <h1 class="title" v-bind:class="{lasndScape:tableLandScape}">
          Hallo {{organization}}!
        </h1>
      </div>
      <DigitalClock id="clock" />
<!--  -->
      <div id="map">
        <Homemap />
      </div>
      <!-- <Footer v-if="!isLoading"/> -->
    </div>
    <!-- Footer -->
  </div>

  
</template>
<script>
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import Homemap from "@/components/HomeMap.vue";
import Help from "@/components/Help.vue";
import DigitalClock from '@/components/clock.vue'
import Footer from "@/components/Footer.vue";
import Mobilehheader from "@/components/MobileHeader.vue"
export default {
  name: "Home",
  components: {
    Sidebar,
    Homemap,
    Help,
    DigitalClock,
    Footer,
    Mobilehheader,
  },
  data() {
    return {
      currentOrientation: this.getOrientation(),
      phoneshowing: true,
      mobileTrue: false,
      customerLicenses: [],
      customerAppointments: [],
      customerCertificates: [],
      customerLastname: "",
      customerFirstname: "",
      machines: {},
      licenseUpdates: '',
      certificateUpdates: '',
      appointmentUpdates: '',
      hasLicense: false,
      hasAppointment: false,
      hasCertificate: false,
      customerID: '',
      isLoading: true,
      tableLandScape:false,
      customerSituation:'',
      organization:''
    }

  },
  methods: {
    handleOrientationChange() {
      // Update the current orientation when orientation changes
      location.reload();
    },
    getOrientation() {
      // Get the current orientation
      return window.orientation === undefined ? 'unknown' : window.orientation;
    },
    toMachine() {
      this.$router.push('machines')
    },
    toAppointments() {
      this.$router.push('bookedappointment')
    },
    toCertficate() {
      this.$router.push('certificates')
    },
    toLicense() {
      this.$router.push('license')
    },
    toBookAppointment() {
      this.$router.push('appointment')
    },
    accendingDate() {

      axios.post(process.env.VUE_APP_HOST + "/accendingappointments", { customerId: this.customerID }).then((res) => {
        if (res.data.length == 0) {
          this.hasAppointment = true
          this.appointmentUpdates = "Sie haben derzeit keinen gebuchten Termin. Wenn Sie einen neuen Termin buchen, wird dieser hier automatisch angezeigt."
        }
        else {
          this.customerAppointments = res.data
        }
      })
    },

  },
  mounted() {
    if (window.innerWidth < 767) {
      this.mobileTrue = true
    }
    else {
      this.mobileTrue = false
    }
    if (innerWidth >= 992 && innerWidth <= 1199) {
      this.tableLandScape = true
    }
    axios.get(process.env.VUE_APP_HOST + "/user", {
      headers: { token: localStorage.getItem("token") },
    })
      .then((res) => {
        this.customerLastname = res.data.user.lastName;
        this.customerFirstname = res.data.user.firstName;
        this.customerSituation = res.data.user.customerSituation
        this.customerID = res.data.user.customerID
        this.isLoading = false
        this.organization = res.data.user.organizationName


      }).then(() => {
        this.accendingDate()

      })
    axios
      .get(process.env.VUE_APP_HOST + "/customercertificates", {
        headers: { token: localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.length === 0) {
          this.hasCertificate = true
          this.certificateUpdates = 'Derzeit haben Sie keine Zertifikate. Wenn ein neues Zertifikat für Sie ausgestellt wird, dann wird es automatisch angezeigt!'
        }
        else {
          this.hasCertificate = false
          this.customerCertificates = res.data
        }

      });
    axios.get(process.env.VUE_APP_HOST + "/machines").then((res) => {
      this.machines = res.data;
      this.isLoading = false
    });

  },
  created() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }
    window.addEventListener('orientationchange', this.handleOrientationChange);
  },
  destroyed() {
    // Remove the event listener when the component is destroyed
    window.removeEventListener('orientationchange', this.handleOrientationChange);
  },
};
</script>

<style scoped>

*{
  font-family: 'Oswald';
}
.lasndScape{
  font-size: medium;
}
#footer{
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  height: 60px;
  font-size: 10px;
  background-color: #97bf0d;
  width: 85%;
  margin: auto;
  color:white;
}
.image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 280px;
  height: 120px;
  margin: -60px 0 0 -60px;
  opacity: 0.6;
  animation: blink 1s step-start 0s infinite;

}

@keyframes blink {
  0% {
    opacity: 0.3;
  }

  50% {
    opacity: 0.0;
  }
}

h1 {

  font-weight: bold;
  text-align: center;
}

.head {
  background: #97bf0d;
  color: white;
  height: auto;
  width: 500px;
  font-size: 36px !important;
 margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  border-radius:10px;
  text-align: center;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

}
.title{
  font-size: 32px;
  margin-top: 10px;
}


.btn-outline-success {
  margin-top: 3px;
}

ol {
  list-style: none;
}

/* Style the counter cards */
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  /* this adds the "card" effect */
  padding: 16px;
  text-align: center;
  background-color: #f1f1f1;
  height: auto;
  width: 550px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
}

.row {
  margin-left: 10px !important;
}

.button5 {

  height: 40px;
  width: 60px;
  border-radius: 12px;
  font-size: x-small;
  background-color: #97bf0d !important;
  border-color: #97bf0d;
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 18px;
}


ul {
  list-style: none;
}

.card-header {
  background: #97bf0d;
  color: white;
  font-weight: bold;
  border-radius: 5px;
}

#singlecard {
  width: 95%
}

#map{
  margin: 1%;
}
#clock{
  margin: auto;
}

@media (max-width: 575.98px) {
  #clock{
margin-right:20px;
  }
  #map {
    margin-bottom: 100px;
  }

  .row {
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .card {
    height: auto;
    width: 270px !important;
    margin: auto;
    font-size: small;
  }


  .list-group-item {
    font-size: xx-small;
  }




  .head {
    background: #97bf0d;
  color: white;
  height: auto;
  width: 430px;
  font-size: 36px;
  margin:20px auto;
  border-radius:10px;
  text-align: center;
  padding: 10px;
  }

  #long {
    word-wrap: break-word;
  }

  h1 {
    margin-top: 10px;
    font-size: small;
  }
}
@media(max-width:1000px){
  .head {
    background: #97bf0d;
  color: white;
  height: auto;
  width: 330px;
  margin:10px auto;
  border-radius:10px;
  text-align: center;
  padding: 10px;

  }

.title{
  font-size: 26px;
}
}

@media (max-width: 800px) {
  #map{
  margin-left: 15%;
}
  .head {
    background: #97bf0d;
  color: white;
  height: auto;
  width: 230px;
  margin:10px auto;
  border-radius:10px;
  text-align: center;
  padding: 10px;

  }

.title{
  font-size: 18px;
}



  .row {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;

  }

  #singlecard {
    width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  #secondcard {
    width: 500px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
  }

  #map {
    margin-left: auto;
    margin-right: auto;
    height: 10px;
  }



}
@media (max-width: 990px){
  h1{
    font-size: 26px;
  }
  .card-header{
    background: #97bf0d;
  color: white;
  height:50px;
  width: 260px;
  font-size: 28px;
  border-radius: 10px;
  margin: auto;
  display: flex;
  justify-content: center;
  }
}
/* Responsive columns - one column layout (vertical) on small screens */
</style>