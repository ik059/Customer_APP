<template>
  <div>
    <div class="popup center" :class="{appointmentPopup: showAppointments}">
      <span class="close" @click="showAppointments = false, this.popUpAppointments = []" id="closeButton">x</span>
      <table>
        <thead>
          <tr>
            <th>Adresse</th>
            <th>Datum</th>
            <th>Uhrzeit</th>
            <th>Kennzeichen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in popUpAppointments" :key="appointment.id">
            <td>{{ appointment.machineAdress }}</td>
            <td>{{ appointment.date }}</td>
            <td>{{ appointment.time }}</td>
            <td>{{ appointment.licenseNumber }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div :class="{disabled:showAppointments}">
      <div>
        <select style="width:130px;height:35px;border-radius:10px; background-color:#97bf0d; border:none;color:white;font-weight:bold;" v-model="selectedLicense" @change="onlySelectedLicense">
          <option value="" selected style="padding:15px; margin-left: 10px;">Alle Fahrzeuge</option>
          <option v-for="license in licenses" :key="license" :value="license.licenseNumber">{{ license.licenseNumber }} </option>

        </select>
      </div>
      <div class="calendar">
        <div class="header">
          <button @click="prevMonth" class="nav-button"> {{ "< "+prevMonthName }}</button>
          <button @click="nextMonth" class="nav-button">{{ nextMonthName+" >" }} </button>
        </div>
        <div class="days">
        <div v-for="day in daysInMonth" :key="day" class="day" >
          <span><p  :class="{ 'current-day': isCurrentDay(day),'appointmentDate':hasAppointmetn(day) }">{{ day.format('D') }}</p></span>
          <ul v-if="appointments[day.format('YYYY-MM-DD')] && appointments[day.format('YYYY-MM-DD')].length < 2 " class="appointments" v-bind:id="{ulmargin:!isMobile,ulmargin: !isTablet}">
            <li  v-for="appointment in appointments[day.format('YYYY-MM-DD')]" :key="appointment" >
              {{ appointment}}
            </li>
          </ul>
          <ul  v-if="appointments[day.format('YYYY-MM-DD')] && appointments[day.format('YYYY-MM-DD')].length >= 2 " class="appointments" v-bind:id="{ulmargin:!isMobile,ulmargin: !isTablet}" style="height:45%;">
            <li  v-for="(appointment, index) in appointments[day.format('YYYY-MM-DD')]" :key="index" >
              <p v-if="index==0">{{ appointment}}<br/><p style="cursor:pointer;" @click.prevent="showDateAppointment([day.format('YYYY-MM-DD')])" v-if="!isMobile">+Weitere</p><p v-if="isMobile">+{{appointments[day.format('YYYY-MM-DD')].length-1 }}<img width="10" height="10" src="https://img.icons8.com/pastel-glyph/64/FFFFFF/appointment-time.png" alt="appointment-time" style="margin-left:2px; margin-bottom:3px;"/></p></p>
            </li>
            </ul>
        </div>
      </div>
      </div>
  </div>
  </div>
  </template>
  
  <script>
  import moment from 'moment';
  import axios from 'axios'
  
  export default {
    data() {
      return {
        currentMonth: moment(),
        appointments: {},
        isTablet: false,
        isMobile: false,
        licenses: [],
        selectedLicense: "",
        showAppointments: false,
        popUpAppointments: []
      };
    },
    computed: {
      daysInMonth() {
        const startOfMonth = this.currentMonth.clone().startOf('month');
        const endOfMonth = this.currentMonth.clone().endOf('month');
        const days = [];
        let currentDay = startOfMonth.clone();
  
        while (currentDay.isSameOrBefore(endOfMonth, 'day')) {
          days.push(currentDay.clone());
          currentDay.add(1, 'day');
        }
  
        return days;
      },
      prevMonthName() {
        return this.currentMonth.clone().subtract(1, 'month').format('MMMM');
      },
      nextMonthName() {
        return this.currentMonth.clone().add(1, 'month').format('MMMM');
      },
    },
    methods: {
      async showDateAppointment(appointments){
        this.showAppointments = true;
        const response = await axios.get(process.env.VUE_APP_HOST + "/customerprofile", {
      headers: { token: localStorage.getItem("token") },
    });
    let appointment = response.data.user.appointments
    
    this.popUpAppointments = appointment.filter(appointment => appointment.date === appointments[0]);
    console.log(this.popUpAppointments);
      
   
      },
      prevMonth() {
        this.currentMonth = this.currentMonth.subtract(1, 'month').clone();
        //this.fetchAppointments();
      },
      nextMonth() {
        this.currentMonth = this.currentMonth.add(1, 'month').clone();
        //this.fetchAppointments();
      },
      isCurrentDay(day) {
        return day.isSame(moment(), 'day');
      },
      hasAppointmetn(day){
        return this.appointments[day.format('YYYY-MM-DD')] ? true : false
      },
      onlySelectedLicense() {
        if(this.selectedLicense === ""){
          this.fetchAppointments();
        }else{
    let selectedAppointments = {};
    for (const license in this.allAppointment) {
        if (this.allAppointment[license][0] === this.selectedLicense) {
            console.log(license);
            console.log(this.allAppointment[license]);
            selectedAppointments[license] = this.allAppointment[license];
        }
    }
    console.log(selectedAppointments);
    this.appointments = selectedAppointments;
  }
},

      async fetchAppointments() {
  try {
    const response = await axios.get(process.env.VUE_APP_HOST + "/customerprofile", {
      headers: { token: localStorage.getItem("token") },
    });
    this.licenses = response.data.user.licenses

    // Initialize an empty appointments object
    this.appointments = {};
    this.allAppointment = {};
    console.log(response.data.user.appointments)

    response.data.user.appointments.forEach(appointment => {
      const formattedAppointment = {
        date: moment(appointment.date).format('YYYY-MM-DD'),
        title: appointment.licenseNumber,
        time: appointment.time // Replace 'title' with the actual property name for appointment title
      };

      // If the date already exists, push the new appointment title to the existing date's array
      if (this.appointments[formattedAppointment.date]) {
        //this.appointments[formattedAppointment.date].push(formattedAppointment.time,formattedAppointment.title );
        this.appointments[formattedAppointment.date].push(formattedAppointment.title );
       // this.allAppointment[formattedAppointment.date].push(formattedAppointment.time);
      } else {
        // If the date doesn't exist, create a new entry with a new date and a new appointments array
        //this.appointments[formattedAppointment.date] = [formattedAppointment.time, formattedAppointment.title];
        this.appointments[formattedAppointment.date] = [formattedAppointment.title];
        //this.allAppointment[formattedAppointment.date] = [formattedAppointment.time];
      }
      if (this.allAppointment[formattedAppointment.date]) {
        //this.appointments[formattedAppointment.date].push(formattedAppointment.time,formattedAppointment.title );
        //this.appointments[formattedAppointment.date].push(formattedAppointment.title );
        this.allAppointment[formattedAppointment.date].push(formattedAppointment.title);
      } else {
        // If the date doesn't exist, create a new entry with a new date and a new appointments array
        //this.appointments[formattedAppointment.date] = [formattedAppointment.time, formattedAppointment.title];
        //this.appointments[formattedAppointment.date] = [formattedAppointment.title];
        this.allAppointment[formattedAppointment.date] = [formattedAppointment.title];
      }
    });
    console.log(this.appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
      },
      async fetchAppointmentsforTablet(){
        try {
    const response = await axios.get(process.env.VUE_APP_HOST + "/customerprofile", {
      headers: { token: localStorage.getItem("token") },
    });
    console.log("user",response.data)
    this.licenses = response.data.user.licenses

    // Initialize an empty appointments object
    this.appointments = {};

    response.data.user.appointments.forEach(appointment => {
      const formattedAppointment = {
        date: moment(appointment.date).format('YYYY-MM-DD'),
        time: appointment.time // Replace 'title' with the actual property name for appointment title
      };

      // If the date already exists, push the new appointment title to the existing date's array
      if (this.appointments[formattedAppointment.date]) {
        this.appointments[formattedAppointment.date].push(formattedAppointment.time );
      } else {
        // If the date doesn't exist, create a new entry with a new date and a new appointments array
        this.appointments[formattedAppointment.date] = [formattedAppointment.time];
      }
    });
    console.log(this.appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
      }


    },
    created() {
      if (window.innerWidth >= 600 && window.innerWidth <= 1024) {
      this.isTablet = true
      this.fetchAppointments();
      
    }
    else if (window.innerWidth < 767) {
      this.isMobile = true
      this.fetchAppointments();
    }
      else{this.fetchAppointments();
      console.log(this.appointments)
      }
    },
    mounted(){
      if (window.innerWidth >= 600 && window.innerWidth <= 1024) {
      this.isTablet = true
      
    }
    if (window.innerWidth < 767) {
      this.isMobile = true
    }
    }
  };
  </script>
  
  
  
  <style scoped>
  #closeButton{
    position: absolute;
    top: 0;
    right: 10px;
    padding: 0px 4px;
    border-radius:10px;
    cursor: pointer;
    color:red;
    padding:5px;
    font-size: 20px;
  }
  .disabled{
    pointer-events: none;

    opacity: 0.3;
  }
  .popup {
  background: white;
 width: auto;
  max-width: 80%;
  height: auto;
  padding: 20px;
  margin-top: 10px;
  border-radius: 10px;
  border: 2px solid #97bf0d;
  box-sizing: border-box;
  z-index: 1000;
  text-align: center;
  opacity: 0;
  top: -200%;
}
table{
  margin: auto;
}
th{
  text-align: center;
  padding: 10px;
  width: auto
}
td{
  text-align: center;
  padding: 10px;
  width: auto
}

.appointmentPopup {
  opacity: 1;
  z-index: 1;
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%) ;
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
  color: #000;
}
tr{
  border-bottom: 1px solid grey;
}

.center {
  position: fixed;
}
  @media(min-width: 1600px){
    .calendar{
      width: 60%;
    }
    .day{
      height: 190px !important;
    }
  }
  *{
  font-family: 'Oswald';
}
  #ulmargin{
    margin-left:10% !important;
  }
  #appointMachine{
    height: 2vh;
    width: 73%;
  }
  .calendar {

    background-color: white; /* Gray background */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 90%;
    height: 70%;
    margin: auto;
    margin-top: 2%;
    margin-left: auto;
    margin-right: auto;
    border: 3px solid #97bf0d;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px; /* Green header background */
    color: #fff; /* White text */
    padding: 10px;
    border-radius: 4px;
    margin-left:auto;
    margin-right:auto;
    
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
    
  }
  
  .nav-button:hover {
    background-color: #97bf0d; /* Darker green on hover */
  }
  
  .days {
    display: grid;
  
    grid-template-columns: repeat(7, 1fr);
  }
  
  .day {
    background-color: white; /* White background for days */
    transition: background-color 0.3s ease;
    color: black;
    height: 90px;
  }
  

  
  .current-day {
  background-color: black; /* Black background for the current day */
  color: #fff; /* White text */
  border-radius: 50%; /* Make it a full circle */
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
}
.appointmentDate{
  background-color: #97bf0d; /* Black background for the current day */
  color: #fff; /* White text */
  border-radius: 50%; /* Make it a full circle */
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
}
  
  .day span {
    font-weight: bold;
  }
  
  .appointments {
    list-style: none;
    padding: 0;
    background-color: #97bf0d; /* Green background for appointments */
    border-radius: 4px;
    width: 80%;
    margin-left: 10%;
    height: auto;
  }
  
  .appointments li {
    margin-top: 5%;
    margin-left: 15%;
    
    padding: 2px;
    margin-left: auto;
    margin-right: auto;
    color: white;
    font-size: small;
  }

  @media (max-width: 1024px) {
    .popup{
      width: 70%;
    }
    .current-day {
  background-color: black; /* Black background for the current day */
  color: #fff; /* White text */
  border-radius: 50%; /* Make it a full circle */
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
}
.appointmentDate{
  background-color: #97bf0d; /* Black background for the current day */
  color: #fff; /* White text */
  border-radius: 50%; /* Make it a full circle */
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
}
    .calendar {
      width: 100%; /* Adjust the width for smaller screens */
      margin-left: auto;
      margin-right: auto;
    }

    .days {
      grid-template-columns: repeat(7, 1fr); /* Two columns for days on smaller screens */
    }

    .appointments {
      width: auto; /* Full width for appointments on smaller screens */
    }
    .appointments li {
    margin-top: 10%;
    color: white;
    font-size: 10px;
    width: auto;
    text-align: center;
    border-radius: 10px;
  }
  h4{
      margin-top: 2%;
      font-size: 1rem;
    }

  }

  /* Media query for mobile devices */
  @media (max-width: 600px) {
    h4{
      margin-top: 2%;
      font-size: 1rem;
    }
    .calendar {
      width: 100%; /* Full width for mobile screens */
      margin-left: auto;
      margin-right: auto;
    }
      .days {
      grid-template-columns: repeat(5, 1fr); /* Single column for days on mobile screens */
    }
    .appointments {
    list-style: none;
    padding: 0;
    background-color: #97bf0d; /* Green background for appointments */
    border-radius: 5px;
    width: auto;
  }
  .day{
    height: 85px;
  }
  
  .appointments li {
    margin-top: 12%;
    color: white;
    font-size: 10px;
    text-align: center;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    background-color: #97bf0d; /* Green header background */
    color: #fff; /* White text */
    padding: 1px;
    border-radius: 4px;
  }
  }

  </style>
  