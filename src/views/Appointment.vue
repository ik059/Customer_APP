<template>
    <div translate="no">
        <div class="popup center" v-bind:class="{ active: isActive }">

<div class="title">
    <h2>{{ $t('confirmBooking') }}</h2>
</div>
<div v-if="confirming">
<div>
    <font-awesome-icon icon="fa-solid fa-calendar-check" style="color:#97bf0d; height: 45px;" />
</div>
<br/>
<div class="cancelButton ">
    <button class="btn btn-secondary" id="close" v-on:click="close">
        {{ $t('close') }}
    </button>
    <button class="btn btn-success" id="book" v-on:click="booking">
        Bestätigen
    </button>
</div>
</div>
<div v-else>
<div class="spinner-grow text-success" role="status"  style="margin-top: 15%; color: #97bf0d !important;"></div>

</div>
</div>

  
    <div v-bind:class="{ 'disabled': isActive }">
        <sidebar @search-input-emit="search" />
    <!-- Appointment Pop Up Confirmation -->

    <!-- <Help /> -->
            <div v-if="hasLicense">
                <br/>
                <img id="ourlogo" src="-" /><br /><br />
                <br/>
                Bitte fügen Sie Kennzeichen hinzu, um einen Termin zu buchen.
                <br/>
                <br/>
                <button class="btn btn-success" @click.prevent="gotolicense">Kennzeichen hinzufügen</button>

            </div>
            <div v-else>
                <div id="bookedUpdate" v-if="bookedShowing"> {{ appointmentUpdate }}</div>
                <div class="card">

                    <div class="card-header">
                        <h2> {{ $t('appointment') }}</h2>
                    </div>
                    <div class="card-body" v-if="dropdown">
                        <div class="dropdowns">
                            <button class="btn btn-outline-secondary btn-sm" @click.prevent="selectMachine">
                                {{ $t('selectMachine') }}</button>

                        </div>
                    </div>
                    <!-- Appointment Booking Start -->


                    <div v-if="machineselected">
                        <br/>
                        <div>
                            <div v-if="machineShowing">
                                <div  id="machineLocationpreview">
                            <GMapMap class="map" :center="currentPosition" :clickable="true" :draggable="true" :zoom="12" map-type-id="terrain"
                                style="width: 50vw; height: 200px; border-radius:5px;margin-bottom:10px;">
                                <GMapMarker  :key="index" :position="currentPosition" :clickable="true" :draggable="true" :icon='{
                                url: "https://container-hygiene.de/webapps/customerapp/Maschine-icon-1.png",
                                scaledSize: { width: 27, height: 27 },
                                labelOrigin: { x: 16, y: -10 }}' >
                                </GMapMarker>
                            </GMapMap>
                            </div>
                            <!-- <div>
                                <ul>
                                    <li>
                                    <div id="machinelistieminAppointment">
                                        <img src="https://container-hygiene.de/webapps/customerapp/Maschine-icon-1.png" style="height: 5%; width:2.5%; margin-right: 1%;">
                                        <strong style="color:black; text-align: center;" id="machienLcoationtext">{{machineLocation }}</strong>
                                        </div>
                                    <hr style="margin:auto"/>
                                    </li>
                                </ul>
                            </div> -->
                        </div>
                        </div>

                        <div v-if="machineSeleted">
                            <p style="color:black;"> Ausgewählte Maschine: <strong style="color:#97bf0d">{{ machineLocation }}&nbsp;&nbsp;</strong>
                                <font-awesome-icon icon="fa-solid fa-xmark" @click.prevent="selectMachine" style="color:red" />
                            </p>
                        </div>

                        <div v-if="dateSelectedDone">
                        <div id="dateandtime">
                            <div id="dateStyle">
                                <Datepicker  placeholder="Datum auswählen"
                                    v-model="date"
                                    :enable-time-picker="false"
                                    :min-date="new Date()"
                                    inline
                                    auto-apply
                                    @select="handleDateSelect"
                                    class="vue-datepicker"
                                    style="font-family: 'Oswald',  !important; color: #97bf0d !important;">
                                </Datepicker>
                               
                            </div>
                            <div class="timeStyle">
                               
                                    <h5 style="color:black;">Uhrzeit</h5>
                                <hr/>
                                    <div v-if="date === ''" style="color: red;">
                                        Bitte wählen Sie zuerst das Datum!
                                    </div>
                                   
                                    <div v-else>
                                        <ul>
                                            <li v-for="time in freeSlots1" @click="selectedTime = time" @click.prevent="showDropdown" class="custom-li">
                                                <font-awesome-icon icon="fa-solid fa-clock" style="height: 15px;" />{{" "+ time +" Uhr"}}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                           
                        </div>
                        </div>
                    </div>
                    <div v-if="dateAlreadySelected">
                        <p style="margin:5px auto;">
                        <p style="color:black;" >Ausgewähltes Datum und Uhrzeit: <strong style="color:#97bf0d">{{ chosenDate+', '+selectedTime }}&nbsp;&nbsp;</strong>
                            <font-awesome-icon icon="fa-solid fa-xmark" @click.prevent="cancelDate" style="color:red" /></p>
                        </p>
                    </div>
                    <div v-if="showLicense">
                        <div v-if="licenseSelected">
                            <label>Fahrzeug auswählen: &nbsp;&nbsp;&nbsp;</label>
                            <select v-model="lNumber" id="trailerDesignation" @change.prevent="showBookButton">
                                <option disabled value="">Auswahl</option>
                                <option v-for="license in licenses">{{ license.licenseNumber }}</option>

                            </select>
                        </div>
                        <div v-else>
                            <p style="color:black;"> Ausgewählte Kennzeichen: &nbsp;<strong style="color:#97bf0d">{{ lNumber }}&nbsp;&nbsp;</strong>
                                <font-awesome-icon icon="fa-solid fa-xmark" @click.prevent="cancelLicense" style="color:red" /></p>
                        </div>
                    </div>
                    <div v-if="programAlreadtSelcted">
                        <div v-if="programSelected">
                            <label style="margin-bottom:10px;color:black;">Programm: &nbsp;&nbsp;&nbsp;</label>
                            <!-- <select v-model="programName" id="trailerDesignation" @change.prevent="showBookButton2">
                                <option disabled value="">Programm</option>
                                <option value="Doppelstockbalken">Doppelstockbalken</option>
                                <option value="Fleischhängebahn">Fleischhängebahn</option>
                            </select> -->
                            <div>
                                <button class="programTypeButton" style="border-radius: 5px; margin-right:10px;" @click.prevent="selectedType ='Doppelstockbalken';showFirstPrograms()" :class="{slecetedProgram: selectedType == 'Doppelstockbalken'}">Doppelstockbalken</button>
                                <button class="programTypeButton" @click.prevent="selectedType ='Fleischhängebahn';showSecondProgram()" style="border-radius: 5px; margin-left:10px;" :class="{slecetedProgram: selectedType == 'Fleischhängebahn'}">Fleischhängebahn</button>
                            </div>
                            <div v-if="firstProgramShowing" style="display:flex; justify-content: center; flex-wrap: wrap;">
                               <button class="programTypeButton2" @click.prevent="programName = 'Doppelstockbalken - Basic'; showBookButton2()" style="border-radius: 5px;margin-top:5px;" :class="{slecetedProgram: programName == 'Basic'}"><h4>Basic</h4><ul><li>Boden (nur Wasser)</li><li>Dauer - ca. 3min</li><li style="list-style:none !important;">&nbsp;</li><li style="list-style:none !important;">&nbsp;</li><li style="list-style:none !important;">&nbsp;</li></ul> </button>
                               <button class="programTypeButton2" @click.prevent="programName = 'Doppelstockbalken - Professional'; showBookButton2()" style="border-radius: 5px; margin-top:5px" :class="{slecetedProgram: programName == 'Professional'}"><h4>Professional</h4><ul><li>Boden, Seiten</li><li>Decke und Planfläche<br/>inkl. Chemie</li><li style="list-style:none !important;">&nbsp;</li><li style="list-style:none !important;">&nbsp;</li></ul> </button>
                               <button class="programTypeButton2" @click.prevent="programName = 'Doppelstockbalken - Professional+1'; showBookButton2()" style="border-radius: 5px;margin-top:5px" :class="{slecetedProgram: programName == 'Professional +1'}"><h4>Professional+1</h4><ul><li>Boden</li><li>Seiten</li><li> Decke und Planfläche + weiterer Ausspülgang<br/>inkl. Chemie</li></ul></button>
                            </div>
                            <div v-if="secondProgramShowing" style="display:flex; justify-content: center; flex-wrap: wrap;">
                                <button class="programTypeButton2" @click.prevent="programName = 'Fleischhängebahn - Basic'; showBookButton2()" style="border-radius: 5px;margin-top:5px;" :class="{slecetedProgram: programName == 'Basic'}"><h4>Basic</h4><ul><li>Boden (nur Wasser)</li><li>Dauer - ca. 3min</li><li style="list-style:none !important;">&nbsp;</li><li style="list-style:none !important;">&nbsp;</li><li style="list-style:none !important;">&nbsp;</li></ul> </button>
                                <button class="programTypeButton2" @click.prevent="programName = 'Fleischhängebahn - Professional'; showBookButton2()" style="border-radius: 5px; margin-top:5px" :class="{slecetedProgram: programName == 'Professional'}"><h4>Professional</h4><ul><li>Boden, Seiten</li><li>Decke und Planfläche<br/>inkl. Chemie</li><li style="list-style:none !important;">&nbsp;</li><li style="list-style:none !important;">&nbsp;</li></ul> </button>
                                <button class="programTypeButton2" @click.prevent="programName = 'Fleischhängebahn - Professional+1'; showBookButton2()" style="border-radius: 5px;margin-top:5px" :class="{slecetedProgram: programName == 'Professional +1'}"><h4>Professional+1</h4><ul><li>Boden</li><li>Seiten</li><li> Decke und Planfläche + weiterer Ausspülgang<br/>inkl. Chemie</li></ul></button>
                            </div>

                        </div>
                        <div v-else>
                            <p style="color:black;"> Ausgewähltes Programm: &nbsp;<strong style="color:#97bf0d">{{ programName }}&nbsp;&nbsp;</strong>
                                <font-awesome-icon icon="fa-solid fa-xmark" @click.prevent="cancelProgram" style="color:red" /></p>
                        </div>

                    </div>
<br/>
                    <div>
                            <button v-if="lNumber !== '' && chosenDate !== '' && selectedTime !==''&& machineID!=='' && programName !==''" v-on:click="confirmAppointment" class="btn btn-success">
                                {{ $t('bookAppointment') }}</button>
                        </div>

                        <br/>
          


                </div>
            </div>
          
    </div>
    <!-- <Footer  /> -->

    <br/>
            <br/>
            <br/>

</div>
</template>

<script>

import Calendar from "@/components/Calendaar.vue";
import axios from 'axios'
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Sidebar from "@/components/Sidebar.vue";
import Map from '@/components/Map.vue'
import { Tooltip } from 'bootstrap/dist/js/bootstrap.esm.min.js'
import Help from '@/components/Help.vue';
import Footer from '@/components/Footer.vue';



export default {
    components: { Sidebar, Datepicker, Map, Help,Footer , Calendar},
    data() {
        return {
            selectedType: '',
            firstProgramShowing: false,
            secondProgramShowing: false,
            programName:'',
            programAlreadtSelcted: false,
            selectedTime:'',
            machineShowing: false,
            machineLocation:'',
            apiKey:process.evn.MAP_API,
            currentPosition:{},
            mobileTrue: false,
            date: '',
            lNumber: '',
            dropdownShowing: false,
            time: "",
            shift: "",
            booked1: [],
            booked2: [],
            booked3: [],
            booked4: [],
            firstShowing: false,
            secondShowing: false,
            thirdShowing: false,
            fourShowing: false,
            buttonVisible: false,
            buttonVisible2: false,
            buttonVisible3: false,
            buttonVisible4: false,
            machineListShowing: false,
            dateShowing: false,
            dropdown: true,
            shiftshowing: false,
            postcodeMachineShowing: false,
            searchShowing: false,
            noNearby: false,
            machineselected: false,
            updates: '',
            machineID: '',
            postCode: '',
            isActive: false,
            mapView: false,
            machineSeleted: false,
            shiftSeleceted: false,
            firstSlotselected: true,
            secondSlotselected: true,
            thirdSlotselected: true,
            fourthSlotselected: true,
            dateSelectedDone: true,
            confirming:true,
            values1: [
                "00:00",
                "00:30",
                "01:00",
                "01:30",
                "02:00",
                "02:30",
                "03:00",
                "03:30",
                "04:00",
                "04:30",
                "05:00",
                "05:30",
                "06:00",
                "06:30",
                "07:00",
                "07:30",
                "08:00",
                "08:30",
                "09:00",
                "09:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",
                "12:00",
                "12:30",
                "13:00",
                "13:30",
                "14:00",
                "14:30",
                "15:00",
                "15:30",
                "16:00",
                "16:30",
                "17:00",
                "17:30",
                "18:00",
                "18:30",
                "19:00",
                "19:30",
                "20:00",
                "20:30",
                "21:00",
                "21:30",
                "22:00",
                "22:30",
                "23:00",
                "23:30",
            ],
            freeSlots1: [],
            machines: [],
            m: [],
            postUpdates: "",
            details: '',
            appointmentUpdate: '',
            bookedShowing: false,
            searchUpdate: '',
            licenses: [],
            showLicense: false,
            hasLicense: false,
            licenseSelected: true,
            programSelected: true,

        };
    },
    watch:{
    date(newValue, oldValue) {
      // This function will be called whenever myVariable changes
      console.log('myVariable changed from', oldValue, 'to', newValue);

      if(oldValue !== newValue){
       this.getTimesfordate()
    }

  },
  lNumber(newValue, oldValue){
    if(oldValue !== newValue){
        this.showBookButton()
    }
    if(newValue == ''){
        this.cancelLicense()
    }
  }
  },
    methods: {
        showFirstPrograms(){
            this.firstProgramShowing = true
            this.secondProgramShowing = false
            this.programName = ''
        },
        showSecondProgram(){
            this.firstProgramShowing = false
            this.secondProgramShowing = true
            this.programName = ''
        },
        showBookButton2(){
            this.programSelected = false
        },
        gotolicense(){
            this.$router.push({name: 'License'})
        },
        createTimestamp(time, date) {
              // Combine selected time with the predefined date and convert to timestamp
              const dateObject = new Date(date);
              const year = dateObject.getFullYear();
                const month = dateObject.getMonth() + 1; // Months are zero-based, so add 1
                const tag = dateObject.getDate();
                let monthFormat = ''
                if(month<10){
                    monthFormat = `0${month}`
                }
                else{
                    monthFormat = month
                }
                let dayFormat = ''
                if(tag<10){
                    dayFormat = `0${tag}`
                }
                else{
                    dayFormat = tag
                }
                const day = year+"-"+monthFormat+"-"+dayFormat
             const datetimeString = `${day}T${time}:00`;
             this.some =datetimeString
             const timestamp = Date.parse(datetimeString);
            //  this.some = timestamp
             this.some2 = Date.now()
             return timestamp;
            },
        showBookButton(){
            this.licenseSelected = false
            this.programAlreadtSelcted = true
        },
        handleDateSelect(){
            console.log(this.date)
            
        },
        cancelLicense() {
            this.lNumber = ''
            this.licenseSelected = true
            this.shiftshowing = false
        },
        cancelProgram(){
            this.programName = ''
            this.programSelected = true
            this.firstProgramShowing = false
            this.secondProgramShowing = false
            this.shiftshowing = false
        },
        cancelDate() {
            this.date = ''
            this.selectedTime = ''
            this.chosenShift = ''
            this.slot = ''
            this.dateAlreadySelected = false
            this.dateSelectedDone = true
            this.shiftshowing = false

            this.shiftshowing = false
            this.buttonVisible4 = false
            this.buttonVisible3 = false
            this.buttonVisible2 = false
            this.buttonVisible = false

        },
        cancelSlotFour() {
            this.fourthSlotselected = true
            this.slot = ''
            this.buttonVisible4 = false
        },
        cancelSlotThree() {
            this.thirdSlotselected = true
            this.slot = ''
            this.buttonVisible3 = false
        },
        cancelSlotTwo() {
            this.secondSlotselected = true
            this.slot = ''
            this.buttonVisible2 = false
        },
        cancelSlotOne() {
            this.firstSlotselected = true
            this.slot = ''
            this.buttonVisible = false
        },
        cancelShift() {
            this.shift = '',
                this.chosenShift = ''
            this.slot = ''
            this.shiftshowing = true
            this.shiftSeleceted = false

            this.buttonVisible4 = false
            this.buttonVisible3 = false
            this.buttonVisible2 = false
            this.buttonVisible = false


        },
        confirmAppointment() { //confirm booking popup
            const validation = {
                time: this.slot,
                date: this.date,
                machineID: this.machineID,
                licenseNumber: this.lNumber
            }
            axios.post(process.env.VUE_APP_HOST +'/appointmentvalidations', validation).then((res) => {
                if (res.data == 'ok') {
                    this.isActive = true
                    this.updates = ''

                }
                else {
                    this.updates = res.data
                }
            })


        },
        close() {  //close booking popup
            this.isActive = false;
            this.ongoingDeletedLicense = ''
        },
        selectMachine() { //select machine according to id

            this.$router.push('machines')
            axios.get(process.env.VUE_APP_HOST +'/machinelist').then((res) => {
                this.machines = res.data
            })
        },
        searchPostcode() { //search for machine using postcode
            this.postcodeMachineShowing = true,
                this.machineListShowing = false
            this.mapView = false
        },
        showDropdown() { //show dropdown with machine and postcode buttons
            this.chosenDate = this.date.toString().slice(0, 15)
            this.dateSelectedDone = false
            this.dateAlreadySelected = true
            this.showLicense = true
            //this.licenseSelected = true

            if (this.machineID == 0) {
                this.dropdownShowing = true

            }
            this.showLicense = true
            // if(this.lNumber == undefined || this.lNumber == 0 || this.lNumber == ''){
            //     this.showLicense = true
            // }
            // else{
            //     this.showLicense = false
            // } 
        },
        showShift() {
            if (this.chosenShift == undefined || this.chosenShift == 0) {
                this.shiftshowing = true
            }
            else {
                this.shiftshowing = false
            }

            if (this.lNumber == undefined || this.lNumber == 0 || this.lNumber == '') {
                this.licenseSelected = true
            }
            else {
                this.licenseSelected = false
            }


        },
        viewMap() {
            this.$router.push({ path: 'machines', query: { mapView: this.value } })

        },
        selectedMachine(selectedmachine) { //show shifts after selecting machine id
            this.dateShowing = true
            this.machineID = selectedmachine.target.innerHTML
        },
        //show shifts after searching for postcode 
        //just a demo funcation
        //will be updated and related to map
        posctodeSearch() {
            if (this.postCode.length < 5) {
                this.postUpdates = "Please insert a valid post code"
            }
            else {
                this.searchShowing = true
                axios.post(process.env.VUE_APP_HOST +'/postcodesearch', {
                    postcode: this.postCode
                }).then((res) => {
                    this.postUpdates = ''
                    this.m = res.data
                    if (this.m.length === 0) {
                        this.noNearby = true
                        this.searchUpdate = 'Sorry! No Near by Machine found! '
                    }
                    else {
                        this.noNearby = false
                    }

                })
            }
        },
        getTimesfordate(){
            const appointment = {
                date: this.date,
                machineID: this.machineID
            }
            axios.post(process.env.VUE_APP_HOST +'/appointmentbookedslots1', appointment).then((res) => {
                this.booked1 = []
            for (let i in res.data) {
                console.log(res.data[i].time)
                    this.booked1 = res.data[i].time
                }
                if (typeof this.booked1 === "undefined" || this.booked1 === '') {
                    this.freeSlots1 = []
                    //this.freeSlots1 = this.values1
                    for(let k=0;k<this.values1.length;k++){
                        const selectedTimestamp = this.createTimestamp(this.values1[k], this.date.getTime());
                        
                        if(selectedTimestamp >= Date.now()){
                            console.log("IF")
                            this.freeSlots1.push(this.values1[k])
                        }
                    }
                }
                else {
                    this.freeSlots1 = []
                    console.log("Else")
                    const arr1 = this.values1
                    const arr2 = this.booked1
                    console.log(arr1,arr2)
                    let unique1 = arr1.filter((o) => arr2.indexOf(o) === -1);
                    let unique2 = arr2.filter((o) => arr1.indexOf(o) === -1);
                    console.log(unique1,unique2)
                    const unique = unique1.concat(unique2);
                    console.log(unique)
                    for(let k=0;k<unique.length;k++){
                        console.log(new Date().getTime(), this.date.getTime())
                        const selectedTimestamp = this.createTimestamp(unique[k], this.date.getTime());
                        if(selectedTimestamp > new Date().getTime()){
                            console.log("IF")
                            this.freeSlots1.push(unique[k])
                        }
                    }
                   // this.freeSlots1 = unique
                }

            })

        },
        confirmAppointment(){
            this.isActive = true
        },
        booking(){
            this.confirming = false
            const appointment = {
                date: this.date,
                time: this.selectedTime,
                machineID: this.machineID,
                customerID: this.details.customerID,
                licenseNumber: this.lNumber,
                program: this.programName
            }
            axios.post(process.env.VUE_APP_HOST +'/appointment', appointment).then((res) => {
                this.appointmentUpdate = 'Neuer Termin gebucht!'

            }).then(()=>{
                this.buttonVisible = false,
                    this.firstShowing = false,
                    this.secondShowing = false,
                    this.thirdShowing = false,
                    this.fourShowing = false,
                    this.confirming = true
                    this.isActive = false,
                    this.date = '',
                    this.shift = '',
                    this.selectedTime = '',
                    this.machineID = '',
                    this.bookedShowing = true,
                    this.buttonVisible = false,
                    this.buttonVisible2 = false,
                    this.buttonVisible3 = false,
                    this.buttonVisible4 = false,
                    this.machineListShowing = false,
                    this.dropdownShowing = false,
                    this.shiftshowing = false,
                    this.postcodeMachineShowing = false,
                    this.searchShowing = false
                this.$router.replace({})
                this.dropdown = true
                this.machineSeleted = false
                this.dateSelectedDone = false
                this.dateShowing = false
                this.showLicense = false
                this.shiftSeleceted = false
                this.dateAlreadySelected = false
                this.machineShowing = false
                this.$router.push('bookedappointment')

            })

        }
    },

    async mounted() {
        this.machineLocation = this.$route.query.location
        console.log( this.$route.query.location,)
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            address: this.$route.query.location,
            key: this.apiKey,
          },
        });
        console.log(response)

        const location = response.data.results[0].geometry.location;
        this.currentPosition ={
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lng),
        };
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
                this.details = res.data.user
                this.licenses = res.data.user.licenses
                if (this.licenses.length == 0) {
                    this.hasLicense = true
                }
                else {
                    this.hasLicense = false
                }
            });


        if (this.$route.query.machine == null) {
            this.machineShowing = false
            this.machineID = ''
        }
        else {
            this.machineID = this.$route.query.machine
            this.machineShowing = true
            this.machineselected = true
            this.machineSeleted = true
            this.dropdown = false

        }
        Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"]'))
            .forEach(tooltipNode => new Tooltip(tooltipNode))
    }
}
</script>
<style scoped>
ul{
    list-style-type:circle !important;
    text-align: left !important;
    font-style: smaller !important;
}
li{
    list-style-type:circle !important;
    text-align: left !important;
    font-style: smaller !important;

}
.programTypeButton{
    background-color: white;
    border: 1px solid #97bf0d;
    color: #97bf0d;
    padding: 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    height: auto;
    max-width: 250px;
    margin-right:5px;

}
.programTypeButton2{
    background-color: white;
    border: 1px solid #97bf0d;
    color: #97bf0d;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    height: auto;
    min-height: 180px;
    width: 250px;
    margin-right:15px;
    margin-left: 15px;
    text-align: center;
    margin-top: 10px !important;
    

}
.programTypeButton:hover{
    background-color: #97bf0d;
    color: white;
}
.programTypeButton2:hover{
    background-color: #97bf0d;
    color: white;
}
.slecetedProgram{
    background-color: #97bf0d !important;
    color: white !important;

}
.vue-datepicker .datepicker__day--selected, 
.vue-datepicker .active {
    background-color: #97bf0d !important;
    color: white !important;
}
#ourlogo {
    height: 100px;
    widows: 200px;
    margin-top: 10%;
}
.vue-datepicker {
    font-family: 'Oswald' !important;
    color: #97bf0d !important;
}
* {
  font-family: 'Oswald';
}
.custom-li {
  list-style-type: none !important;
  background-color: white;
  border: 1px solid #97bf0d;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  color:#95B634;
}

.custom-li:hover {
  background-color: #97bf0d;
  color: white;
}
.timeStyle{
    overflow-y:scroll;
    height: 277px;
    border: 1px solid lightgray;
    border-radius: 6px;
    width: 245px;
}
.timeStyle li{
   width: 70%;
    margin-left: 9%;
   margin-right: auto;
}
#dateandtime{
    display: flex;
    flex-direction: row;
    justify-content: center;
   
 
}
.disabled{
    pointer-events: none;
    opacity: 0.6;
}

#machinelistieminAppointment{
    display: flex;
    flex-direction: row;
    justify-content: center;
    color:#97bf0d;
    align-items: center;
    margin-top: 5px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
}
#machineLocationpreview{
    display: flex;
    flex-direction: row;
    justify-content: center;
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
#shiftOne:hover{
    background-color: #C3D488;
    color:black;
}
#shiftTwo:hover{
    background-color: #95B634;
    color:black;
}
#shiftThree:hover{
    background-color: #8AAD34; 
    color:black;
}

h2 {

    font-weight: bold;
}


#timeSlots {
    display: flex;
    justify-content: center;
    align-items: center;


}

li {
    list-style: none;
}

#machineButton {
    margin: 2%;

}

.startdate {
    width: 150px;
    margin: auto;
}

.card {
    margin-top: 5px;
    width: 800px;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 550px;
    border:none !important;
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
button{
  border-radius: 5px;
}
.btn-success {
    background-color: #97bf0d !important;
    border-color: #97bf0d;
    width: auto;
    margin: 0;
}

.btn-outline-success {
    margin-top: 5px;
    color: #97bf0d;
    border-radius: 0;
    border-color: #97bf0d;
}

.btn-outline-success:hover {

    color: #f1f1f1;
    background-color: #97bf0d !important;
    border: none;
}

.btn-outline-secondary {
    margin-bottom: 10px;
}



.dropbtn {
    background-color: #4caf50;
    color: white;
    padding: 14px;
    font-size: 16px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    margin-top: 10px;
}

.dropdown {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.btn-secondary:hover{
    background-color: #97bf0d;
}
.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;

    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

.dropdown-content a {
    margin-top: 5px;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

h1 {
    text-transform: uppercase;
}

.dropdown-content a:hover {
    background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown:hover .dropbtn {
    background-color: #97bf0d;
}

.postcode {
    margin-top: 10px;

}

.input {
    padding-right: 10px;
}

.dropdowns {
    margin-top: 10px;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;

}

table {
    border: 2px solid black;
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
}

th {
    border: 3px solid black;
}



td {
    border: 2px solid black;
    cursor: pointer;
}

#trailerDesignation{
    margin-bottom: 10px;
}
.btn-group {
    margin-top: 10px;
    width: 700px;
    margin-bottom: 10px;
   
 
}

.popup {
    background: #f5f5f5;
    width: 300px;
    height: auto;
    margin-top: 10px;
    border-radius: 10px;
    border: 2px solid #97bf0d;
    box-sizing: border-box;
    text-align: center;
    opacity: 0;
    padding: 10px;
    color:black;
}

.map {
    display: table;
    margin-left: auto;
    margin-right: auto;
}

h2 {
    margin-top: 5px;
}

.active {
  opacity: 1;
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 40%;
  transform: translate(-50%, -50%) ;
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
}

.center {
  position: fixed;
}


#book {
    background-color: #97bf0d !important;
    border-color: #97bf0d;

}




#cancelButton {
    margin-top: 150px;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

#bookedUpdate {
    color: #97bf0d;
    font-size: medium;
    font-weight: 800;
    padding: 20px;
    margin: 2px;
    border: 2px solid #97bf0d;

}

#confirm {
    margin-bottom: 5px;
}

#machines {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 1%;
}

#close {
    height: 40px;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  border-radius: 10px;
  transition: all 300ms ease-in-out;
  cursor: pointer;
  margin-right: 10px;
}
#close:hover {
    background-color: red;
    color: white;
    border:none;
}

#book{
    height: 40px;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  border-radius: 10px;
  transition: all 300ms ease-in-out;
  cursor: pointer;
  margin-left: 10px;
}
.hide {
    display: none;
}

.btn-info:hover+.hide {
    display: table;
    color: #97bf0d;
    width: 150px;
    padding: 10px;
    border: 1px solid black;
    margin-top: 2px;
}

.selected {
    font-weight: bolder;
}

@media (max-width: 575.98px) {
    #dateandtime{
    display: flex;
    flex-direction: column;
    justify-content: center;
 
}
.timeStyle{
    overflow-y: scroll;
    height: 277px;
    border: 1px solid grey;
    border-radius: 6px;
    width: 100%;
}
    #machienLcoationtext
    {
        margin-right: 9%;
    }
    .card {
        height: auto;
        width: auto;
        margin-left: 0;
        
        font-size: small;
        margin-top: 10px;
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 5%;
    }
    .btn-group{
    width: fit-content;
    border: 0;
  
    }
   
    .btn-secondary{
        font-size: 7px;
        margin-right: 10px;
        width: 55px;
        text-align: center;
        height: 35px;
      
        

    }
    
}



@media (max-width: 575.98px) {

    .btn-outline-success {
        height: auto;
        width: 70px;
        font-size: x-small;
        margin-top: 5px;
    }

    .dropdowns {
        margin-left: 15px;
    }

    .btn-outline-secondary {
        height: auto;
        width: 90px;
        font-size: x-small;
        margin-left: 5px;
    }

    #close {
        width: auto;
    }

    .table {
        font-size: small;
    }


    .btn-outline-success {
        width: 40px;
        margin: 0;
        font-size: xx-small;
        padding: 2px;
    }

    #confirm {
        width: 70px;
        margin-top: 5px;
    }

    h3 {
        font-size: small;
    }

    .popup {
        margin-left: 40px;
        height: 230px;
        width: 250px;
        font-size: x-small;
    }

    .popup .cancelButton {
        font-size: small;
        display: flex;
        flex-direction: column;
    }
    #close{
        width: 150px;
        height: auto;
        font-size: small;
        display: table;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 5px;
    }
    #book{
        width: 150px;
        height: auto;
        font-size: small;
        display: table;
        margin-left: auto;
        margin-right: auto;
    }

    .btn-info {
        font-size: xx-small;
        display: inline-block;
        padding: 7px;
    }
    .dropdowns{
        display: table;
        margin-left: auto;
        margin-right: auto;
    }



}

@media only screen and (min-width: 600px) {

    .card {
        margin-left: 10px;
        margin-right: 10px;
        width: auto;
    }

    .popup {
        margin-left: 120px;
    }

   

    .btn-secondary {
        height: 50px;
        font-size: smaller;
    }
    .btn-group{
    width: fit-content;
    }
}
@media (max-width: 800px){
    .card-header {
    background: #97bf0d;
  color: white;
  height:50px;
  width: 280px;
  font-size: 14px;
  border-radius: 10px;
  margin: auto;
  display: flex;
  justify-content: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.popup {
        margin-left: 40px;
        height: auto;
        width: 250px;
        font-size: x-small;
        color:black;
    }
}
@media (max-width: 950px){
    .active {
  opacity: 1;
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ;
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
}
}
@media (max-width:1024px){
    .active {
  opacity: 1;
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 40%;
  width:auto;
  transform: translate(-50%, -50%) ;
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
}
.programTypeButton{
    margin-right: 5px;
}
}
</style>
