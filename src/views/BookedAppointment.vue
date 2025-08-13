<template>
  <div translate="no">
  
    <!-- <Help /> -->

    <!--delete popup-->
    <div class="popup center" v-bind:class="{ active: isActive }">
      <div class="title">Bestätigt?</div>
      <div v-if="appointmentDeleting">
        <img id="delete" src="../assets/delete-181.png" />
        <p>{{ $t("deleteAppointmentAlert") }}</p>

        <div class="cancelButton">
          <button class="btn btn-success" id="close" v-on:click="close">
            {{ $t("close") }}
          </button>
          <button class="btn btn-success" id="deletebutton" @click="confirmDelete">
            {{ $t('delete') }}
          </button>
        </div>
      </div>
      <div v-else>

        <div class="spinner-grow text-danger" role="status" style="margin-top: 15%;"> </div>
      </div>
    </div>
    <div v-bind:class="{ 'disabled': isActive }">
      <sidebar @search-input-emit="search" /><!--sidebar component-->
    <div v-if="isLoading">
    <div class="spinner-grow text-success image" role="status" style="margin-top: 25%; color: #97bf0d !important; height: 100px; width: 100px; opacity: 0.6;"></div>
    

    </div>
    <div v-else>
    <div class="card">
      <div>
        <!-- <div v-if="isTablet" id="sorts">
          <DigitalClock  id="clock"/> 
          <div>
            <div id="calendar">
              <label id="datelab">Datum: </label>
              <input type="date" v-model="date" @change="getDateAppointments" />
            </div>
            <br />
            <div>
              <form v-if="searchbylice" id="search" @submit.prevent="searchAppointment">
                <input type="text" placeholder=" Lizenznummer" v-model="licenseNumber"
                  style="margin-left:2px; border: 1px solid; height: 28px; width: 180px;" />
                <button class="btn btn-primary" style="background-color: #97bf0d !important;  " type="submit">
                  Suche</button>
              </form>
            </div>
          </div>

        </div> -->
        <!-- <div v-else>
         

          <div v-if="deleteShowing">
            <br />
            <div id="calendar">
              <label id="datelab">Datum: </label>
              <input type="date" v-model="date" @change="getDateAppointments" />
            </div>
            <br />
            <div>
              <form @submit.prevent="searchAppointment">
                <input type="text" placeholder=" Lizenznummer" v-model="licenseNumber"
                  style="margin-left:2px; border: 1px solid; height: 28px; width: 150px;" />
                <button class="btn btn-primary" style="background-color: #97bf0d !important;  " type="submit">
                  Suche</button>
              </form>
            </div>
          </div>


        </div> -->
       
      </div>
      <div class="card-header">

        <h2 id="headerText">Kalender</h2>

      </div>
      <div style="display:flex; justify-content:center; margin-top:10px;">
        <font-awesome-icon icon="fa-solid fa-calendar" style="margin-top:5px; color:#97bf0d; height: 34px;"/>
          <p  id="calenderDate">{{ todaysDate }}</p>
      </div>
      <!--appointment table-->
      <div v-if="noAppointments">
        {{ updates }}
        <br />
        <br />
        <router-link to="machines">
          <button type="button" id="route" class="btn btn-primary">Termin Buchen</button>
        </router-link>
      </div>
      <div v-else>
        <div v-if="hasAppointments">
          <p>Leider keine Termine mit dieser Kennzeichennummer/Datum gefunden!</p>
          <button class="btn btn-primary" style="background-color: #97bf0d !important; margin-bottom: 5px;"
            @click.prevent="accendingDate">Alle Termine anzeigen</button>
        </div>
        <div v-else>
          <Calendar/>
          <hr/>
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col"> Adresse </th>
                <th scope="col">Datum</th>
                <th scope="col">Uhrzeit</th>
                <th scope="col">Kennzeichen</th>


                <th scope="col">Stornieren</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="date in details">
                <td>{{ date.machineAdress.split(',')[0] +', '+date.machineAdress.split(',')[1]+' '+date.machineAdress.split(',')[2] }}</td>
                <td>{{ date.date.split('T')[0] }}</td>
                <td>{{ date.time }}</td>
                <td>{{ date.licenseNumber }}</td>
                <td>
                  <!-- Call to action buttons -->
                  <ul class="list-inline m-0">
                    <li class="list-inline-item">

                    </li>
                    <li class="list-inline-item">
                      <button class="btn btn-danger btn-sm" type="button" data-toggle="tooltip"
                        data-placement="top" title="Delete" v-on:click="deleteAppointment" @click="all = date">
                        <font-awesome-icon icon="fa-solid fa-trash" style="border-radius:5px;"/>
                      </button>
                    </li>
                  </ul>
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
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import Help from "@/components/Help.vue";
import DigitalClock from '@/components/clock.vue'
import Footer from '@/components/Footer.vue';
import Calendar from '@/components/Calendar.vue'

export default {
  name: "BookedAppointment",
  components: {
    Sidebar,
    Help,
    DigitalClock,
    Footer,
    Calendar
  },
  created() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let monthinEnglish = '';
    if (month === 1) {
      monthinEnglish = 'Jan'
    }
    else if (month === 2) {
      monthinEnglish = 'Feb'
    }
    else if (month === 3) {
      monthinEnglish = 'März'
    }
    else if (month === 4) {
      monthinEnglish = 'Apr'
    }
    else if (month === 5) {
      monthinEnglish = 'Mai'
    }
    else if (month === 6) {
      monthinEnglish = 'Jun'
    }
    else if (month === 7) {
      monthinEnglish = 'Jul'
    }
    else if (month === 8) {
      monthinEnglish = 'Aug'
    }
    else if (month === 9) {
      monthinEnglish = 'Sep'
    }
    else if (month === 10) {
      monthinEnglish = 'Okt'
    }
    else if (month === 11) {
      monthinEnglish = 'Nov'
    }
    else if (month === 12) {
      monthinEnglish = 'Dez'
    }
    this.todaysDate = day + '. ' + monthinEnglish + ' ' + year;
  },
  data: () => ({
    todaysDate: '',
    mobileTrue: false,
    date: "",
    time: "",
    year: "",
    timestamp: "",
    fulldatetime: "",
    customerID: "",
    customerRole: "",
    customerLastname: "",
    machines: {},
    isActive: false,
    details: {},
    all: {},
    allData: [],
    noAppointments: false,
    updates: '',
    licenseNumber: '',
    hasAppointments: false,
    notSearch: true,
    date: '',
    deleteShowing: true,
    isTablet: false,
    searchbylice: true,
    appointmentDeleting: true,
    isLoading:true
  }),
  mounted() {
    if (window.innerWidth < 767) {
      this.mobileTrue = true
    }
    else {
      this.mobileTrue = false
    }
    axios.get(process.env.VUE_APP_HOST +"/customerprofile", {
      headers: { token: localStorage.getItem("token") },
    })
      .then((res) => {
        this.customerID = res.data.user.customerID,
          this.allData = res.data.user
          

      }).then(() => {
        this.updatingAppointments()
        this.accendingDate()
        this.isLoading = false
      })
    if (window.innerWidth < 767) {
      this.deleteShowing = false
    }
    if (window.innerWidth > 767 && window.innerWidth < 1280) {
      this.isTablet = true
      this.searchbylice = false
    }




  },
  methods: {
    searchAppointment() {
      axios.post(process.env.VUE_APP_HOST +"/searchappointments", {
        license: this.licenseNumber,
        customerId: this.customerID
      }).then((res) => {

        if (res.data.length == 0) {
          this.hasAppointments = true
        }
        else {
          this.details = res.data


        }

      })
    },

    deleteAppointment() {
      this.isActive = true;

    },
    close() {
      this.isActive = false;
    },
    confirmDelete() {
      this.appointmentDeleting = false
      const deleteAppointment = {
        all: this.all,
        customerID: this.customerID
      }

      axios.post(process.env.VUE_APP_HOST + "/deleteappointment", deleteAppointment).then(()=>{
        this.appointmentDeleting = true
        this.isActive = false
      window.location.reload()
      })

     
    },
    accendingDate() {
      this.hasAppointments = false
      axios.post(process.env.VUE_APP_HOST +"/accendingappointments", { customerId: this.customerID }).then((res) => {
        this.details = res.data
        console.log(this.details)
        if (this.details.length === 0) {
          this.noAppointments = true
          this.updates = "Sie haben derzeit keinen gebuchten Termin. Wenn Sie einen neuen Termin buchen, wird dieser hier automatisch angezeigt."
        }
      })
    },
    updatingAppointments() {
      axios.post(process.env.VUE_APP_HOST +"/updateappointments", { customerId: this.customerID })
    },
    getDateAppointments() {
      axios.post(process.env.VUE_APP_HOST +"/searchbydate", {
        date: this.date,
        customerId: this.customerID,
      }).then((res) => {
        if (res.data.length == 0) {

          this.hasAppointments = true
        }
        else {
          this.hasAppointments = false
          this.details = res.data
          console.log(this.details)


        }
      })
    }

  },
};
</script>

<style scoped>
.title{
  font-size: 30px !important;
  font-weight: bold !important;
  margin-top: 5px;
  margin-bottom: 5px;
}
#headerText{
  margin-top: 4px;
}
* {
  font-family: 'Oswald';
}
.disabled{
    pointer-events: none;
    opacity: 0.6;
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
h2 {
  font-weight: bold;
}


#sorts {
  display: flex;
  flex-direction: row;
  justify-content: space-around;

}

.card {
  height: auto;
  width: auto !important;
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 5%;
  border:none;
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

#route {
  margin-bottom: 10px;
}
button{
  border-radius: 5px;
}
.btn-primary {
  border-color: #97bf0d;
  background-color: #97bf0d;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 2px;
}

#datelab{
  margin-right: 10px;
}

#delete {
  height: 70px;
  width: 45px;
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

#close {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  border-radius: 10px;
  transition: all 300ms ease-in-out;
  cursor: pointer;
  margin-left: 10px;
}

#deletebutton {
  padding: 9px 20px;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  border-radius: 10px;
  transition: all 300ms ease-in-out;
  cursor: pointer;
  margin-left: 10px;
  background-color: red !important;
}

.btn-success {
  background-color: #97bf0d !important;
  border: #97bf0d !important;
  width: auto;

}

#clock{
  margin-top: 10px;
}

@media (max-width: 575.98px) {
  .table {
    font-size: 9px;
    width: auto;
  }
  #clock{
    margin-right:45px;
  }
  .card {

    width: fit-content;
    margin-top: 10px;
    display: table;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 5%;
  }

  .popup {
    margin-left: 40px !important;
    height: 250px;
    width: 250px;
    font-size: small;
  }

  #close {
    width: 120px;
    text-align: center;
  }

  #deletebutton {
    width: 120px;
    text-align: center;
  }

  .btn-success {
    font-size: x-small;
    margin-bottom: 15px;
  }

  .cancel-button {
    font-size: x-small;
    margin-bottom: 10px;
    width: max-content;
  }

  .btn-danger {
    font-size: small;
  }

}
#calendarImage{
  margin-top: 5px;;
  width: 40px;
  height: 37px;
}
#calenderDate{
  font-size:32px;
  margin-left:10px;
  color:black;
}

@media (max-width: 900px) {
  #calenderDate{
    font-size: 22px;
  }
  .active {
  opacity: 1;
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 40%;
  transform: translate(-50%, -50%) ;
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
  padding: 10px;
  height: auto;
  color:black;
}

  #calendarImage{
    width: 30px;
    height: 30px;
  }
 #headerText{
  margin-top: 0;
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
  .card {
    width: fit-content;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 25%;
  }


  .popup {

    margin-left: 120px;
  }



}
</style>