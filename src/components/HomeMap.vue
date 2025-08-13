<template>
  <div>
    <div  id="searchLocation">
    <input
   
      ref="autocompleteInput"
      v-model="locationSuggestion"
      type="text"
      placeholder="  Adresse suchen"
      @input="handleInput"
      style="width:95%; height:32px; border-radius: 12px; border: none;"
    />
    
   
  </div>
  <div class="suggestions">
  <ul v-if="predictions.length>0" v-bind:class="{showSuggestion: predictions.length>0}" id="suggestionList">
      <li v-for="pred in predictions" @click.prevent="plotInMap(pred.description)">
        {{ pred.description }}
     
      </li>
    </ul>
  </div>
  <div id="mapContainerbody" v-if="!isMobile &&!isTablet" :class="{disables:isNotification}">
    <div id="mapContainerMap">
    <GMapMap
      :center="centerPosition"
      :clickable="true"
      :draggable="false"
      :zoom="13"
      map-type-id="terrain"
      style="width: 100%; height: 64vh; border-radius:10px;"
    >
    <GMapMarker
        v-if="centerPositionShow"
        :key="index"
        :position="centerPosition"
        :clickable="false"
        :draggable="false"
        :icon="{
          url: 'https://container-hygiene.de/webapps/customerapp/Ellipse%203.png',
          scaledSize: { width: 17, height: 17 },
          labelOrigin: { x: 16, y: -10 },
        }"
      >
      </GMapMarker>
      <GMapMarker
        :key="index"
        :position="currentPosition"
        :clickable="true"
        :draggable="false"
        :icon="{
          url: 'https://container-hygiene.de/webapps/customerapp/Bildschirmfoto_2024-06-24_um_11.26.58-removebg-preview.png',
          scaledSize: { width: 20, height: 20 },
          labelOrigin: { x: 16, y: -10 },
        }"
      >
      </GMapMarker>

      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        @click="openMarker(m), windowMarker(m.id)"

        :icon="m.isSelected ? katmaselectedIcon : katmaIcon"
      >
        <GMapInfoWindow
          :closeclick="true"
          :opened="openedMarkerID === m.id"
     
        >
          <div>
            <h6>{{ m.distance + "km" }}<button  v-on:click="getDirections(m.position)" id="directionButton"><img  src="https://container-hygiene.de/webapps/customerapp/Near-Me.png"/></button></h6>
            <p>{{ m.ort }}</p>

            <button
              class="btn btn-primary"
              style="background-color: #97bf0d !important; border: none"
              @click="value = m.machineID"
              v-on:click="bookAppointment(m)"
            >
              Buchen
            </button>
          </div>
        </GMapInfoWindow>
      </GMapMarker>
    </GMapMap>
  </div>
  <div id="mapContainerTable" >

          <h2 style="font-size: 24px; text-align: center; font-weight: bold; padding: 3px; color:white; padding:10px;background-color: #97bf0d; border-radius: 10px;">Maschinen in deiner Nähe:</h2>
          <!-- <ul  v-for="machine in sortedMarkers" style="border:1px solid #97bf0d; border-radius:10px;">
            <li style="display:flex; flex-direction:row; justify-content: flex-start; padding:10px; border:1px solid black; margin-right:10%; width:100%;">

            </li>
          </ul> -->
          <div style="height: 57vh;overflow-y:scroll;">
          <div  v-for="machine in sortedMarkers" style="border:1px solid #97bf0d; border-radius:10px; display:flex; flex-direction: row; justify-content: center; padding:10px; margin-bottom:10px; height:auto;">
            <img src="https://container-hygiene.de/webapps/customerapp/Maschine-icon-1.png" style="height: 38px; width:39px;" @click.prevent="machineCenter(machine)" id="machineImage">
                <div v-on:click="bookAppointment(machine)" style="cursor: pointer; width:300px;" id="addreddDiv">
                  <strong style="color:black">{{ machine.ort.split(',')[0] }},</strong>
                  <strong style="color:black">{{ machine.ort.split(',')[1] }}</strong>
                  <div style="display: flex; flex-direction:row; justify-content: center;">
                  <p style="color:#97bf0d" v-if="machine.isActive">{{ machine.distance+"km" }} &nbsp;<img style="margin-bottom:3px;" width="15" height="15" src="https://img.icons8.com/ios-filled/100/97bf0d/navigation.png" alt="navigation"/></p>
                  <p style="color:#97bf0d" v-else>Coming Soon!</p>
                </div>
                </div>
                <button  class="btn btn-success" @click="value = machine.machineID" v-on:click="bookAppointment(machine)" style="border: none;" v-if="machine.isActive"> Buchen</button>
                <button  class="btn btn-success" @click="value = machine.machineID" v-on:click="checkedasInterest(machine)" style="border: none; padding:5px !important; background-color: grey !important;" v-else> Interessiert</button>
          </div>
        </div>
      
     
  </div>
  </div>
  <div v-if="isMobile &&!isTablet" id="mobilecontainermap" :class="{disables:isNotification}">
    <div>
      <br/>
    <GMapMap
      :center="centerPosition"
      :clickable="true"
      :draggable="true"
      :zoom="13"
      map-type-id="terrain"
      style="width: 75vw; height: 55vh; margin:auto;border-radius:7px;"
    >
    <GMapMarker
        v-if="centerPositionShow"
        :key="index"
        :position="centerPosition"
        :clickable="true"
        :draggable="true"
        :icon="{
          url: 'https://container-hygiene.de/webapps/customerapp/Ellipse%203.png',
          scaledSize: { width: 17, height: 17 },
          labelOrigin: { x: 16, y: -10 },
        }"
      >
      </GMapMarker>
      <GMapMarker
        :key="index"
        :position="currentPosition"
        :clickable="true"
        :draggable="true"
        :icon="{
          url: 'https://container-hygiene.de/webapps/customerapp/Bildschirmfoto_2024-06-24_um_11.26.58-removebg-preview.png',
          scaledSize: { width: 17, height: 17 },
          labelOrigin: { x: 16, y: -10 },
        }"
      >
      </GMapMarker>

      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        @click="openMarker(m), windowMarker(m.id)"
        :icon="m.isSelected ? katmaselectedIcon : katmaIcon"
      >
        <GMapInfoWindow
          :closeclick="true"
          :opened="openedMarkerID === m.id"
          @closeclick="handleCloseClick(m)"
        >
          <div>
            <h6>{{ m.distance + "km" }}<button  v-on:click="getDirections(m.position)" id="directionButton"><img  src="https://container-hygiene.de/webapps/customerapp/Near-Me.png"/></button></h6>
            <p>{{ m.ort }}</p>

            <button
              class="btn btn-primary"
              style="background-color: #97bf0d !important; border: none"
              @click="value = m.machineID"
              v-on:click="bookAppointment(m)"
            >
              Buchen
            </button>
          </div>
        </GMapInfoWindow>
      </GMapMarker>
    </GMapMap>
  </div>
  <div id="mapContainerTableMobile">
    <br/>
    <h2 style="font-size: 24px; text-align: center; font-weight: bold; padding: 3px; color:white; padding:10px;background-color: #97bf0d; border-radius: 10px; ">Maschinen in deiner Nähe:</h2>
          <!-- <ul  v-for="machine in sortedMarkers" style="border:1px solid #97bf0d; border-radius:10px;">
            <li style="display:flex; flex-direction:row; justify-content: flex-start; padding:10px; border:1px solid black; margin-right:10%; width:100%;">

            </li>
          </ul> -->
          <div  v-for="machine in sortedMarkers" style="border:1px solid #97bf0d; border-radius:10px; display:flex; flex-direction: row; justify-content: center; padding:10px; margin-bottom:10px; height:103px;">
            <img src="https://container-hygiene.de/webapps/customerapp/Maschine-icon-1.png" style="height: 38px; width:39px;" @click.prevent="machineCenter(machine)" id="machineImage">
                <div v-on:click="bookAppointment(machine)" style="cursor: pointer; width:300px;" id="addreddDiv">
                  <strong style="color:black">{{ machine.ort.split(',')[0] }},</strong>
                  <strong style="color:black">{{ machine.ort.split(',')[1] }}</strong>
                  <div style="display: flex; flex-direction:row; justify-content: center;">
                  <p style="color:#97bf0d" v-if="machine.isActive">{{ machine.distance+"km" }} &nbsp;<img style="margin-bottom:3px;" width="15" height="15" src="https://img.icons8.com/ios-filled/100/97bf0d/navigation.png" alt="navigation"/></p>
                  <p style="color:#97bf0d" v-else>Coming Soon!</p>
                </div>
                </div>
                <button  class="btn btn-success" @click="value = machine.machineID" v-on:click="bookAppointment(machine)" style="border: none;" v-if="machine.isActive"> Buchen</button>
                <button  class="btn btn-success" @click="value = machine.machineID" v-on:click="checkedasInterest(machine)" style="border: none; padding:5px !important; background-color: grey !important;" v-else> Interessiert</button>
          </div>
          <br/>
          <br/>
  </div>

    <br/>
    <br/>

  </div>
  <div v-if="isTablet && !isMobile" id="mapContainerMapTablet" :class="{disables:isNotification}">
  <div id="mapContainerMapTablets">
    <br/>
    <GMapMap
      :center="centerPosition"
      :clickable="true"
      :draggable="true"
      :zoom="13"
      map-type-id="terrain"
      style="width: 100%; height: 45vh;border-radius:8px;"
    >
    <GMapMarker
    v-if="centerPositionShow"
        :key="index"
        :position="centerPosition"
        :clickable="true"
        :draggable="true"
        :icon="{
          url: 'https://container-hygiene.de/webapps/customerapp/Ellipse%203.png',
          scaledSize: { width: 17, height: 17 },
          labelOrigin: { x: 16, y: -10 },
        }"
      >
      </GMapMarker>
      <GMapMarker
        :key="index"
        :position="currentPosition"
        :clickable="true"
        :draggable="true"
        :icon="{
          url: 'https://container-hygiene.de/webapps/customerapp/Bildschirmfoto_2024-06-24_um_11.26.58-removebg-preview.png',
          scaledSize: { width: 17, height: 17 },
          labelOrigin: { x: 16, y: -10 },
        }"
      >
      </GMapMarker>

      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        @click="openMarker(m), windowMarker(m.id)"
        :icon="m.isSelected ? katmaselectedIcon : katmaIcon"
      >
        <GMapInfoWindow
          :closeclick="true"
          :opened="openedMarkerID === m.id"
           @closeclick="handleCloseClick(m)"
        >
          <div>
            <h6>{{ m.distance + "km" }}<button  v-on:click="getDirections(m.position)" id="directionButton"><img  src="https://container-hygiene.de/webapps/customerapp/Near-Me.png"/></button></h6>
            <p>{{ m.ort }}</p>

            <button
              class="btn btn-primary"
              style="background-color: #97bf0d !important; border: none"
              @click="value = m.machineID"
              v-on:click="bookAppointment(m)"
            >
              Buchen
            </button>
          </div>
        </GMapInfoWindow>
      </GMapMarker>
    </GMapMap>
    <br/>
  </div>
  
  <div id="mapContainerTabletablet">
    <h2 style="font-size: 24px; text-align: center; font-weight: bold; padding: 3px; color:white; padding:10px;background-color: #97bf0d; border-radius: 10px; width:auto;">Maschinen in deiner Nähe:</h2>
    <div id="machineContainer" style="display: flex; flex-wrap: wrap; justify-content: center;">
  <div v-for="machine in sortedMarkers" :key="machine.id" class="machine-item">
    <img src="https://container-hygiene.de/webapps/customerapp/Maschine-icon-1.png" style="height: 38px; width:39px;" @click.prevent="machineCenter(machine)" id="machineImage">
    <div @click="bookAppointment(machine)" style="cursor: pointer;">
      <div>
      <strong style="color: black;">{{ machine.ort.split(',')[0] }},</strong>
      <strong style="color: black">{{ machine.ort.split(',')[1] }}</strong>
    </div>
      <div style="display: flex; justify-content: center; margin-bottom:10px;">
        <p style="color: #97bf0d" v-if="machine.isActive">{{ machine.distance + 'km' }}&nbsp;<img style="margin-bottom:3px;" width="15" height="15" src="https://img.icons8.com/ios-filled/100/97bf0d/navigation.png" alt="navigation"/></p>
        <p style="color:#97bf0d" v-else>Coming Soon!</p>
      </div>
    </div>
    <button class="btn btn-success" @click="value = machine.machineID; bookAppointment(machine)" style="border: none;" v-if="machine.isActive">Buchen</button>
    <button  class="btn btn-success" @click="value = machine.machineID" v-on:click="checkedasInterest(machine)" style="border: none; padding:5px !important; background-color: grey !important;" v-else> Interessiert</button>
  </div>
</div>

       
      
     
  </div>
  <br/>
</div>
<br/>
<br/>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      hasLocation: false,
      openedMarkerID: null,
      markers: [],
      currentPosition: {},
      centerPosition:{},
      apiKey:process.env.MAP_API_Key,
      isMobile:false, 
      isTablet: false,
      predictions:[],
      sortedMarkers:[],
      centerPositionShow: false,
      isNotification: false,
    };
  },
  computed: {
    katmaIcon() {
      const icon = {
        url: "https://container-hygiene.de/webapps/customerapp/Maschine-icon-1.png",
        scaledSize: { width: 35, height: 35 },
      };
      return icon;
    },
    
    katmaselectedIcon() {
      const icon = {
        url: "https://container-hygiene.de/webapps/customerapp/Maschine%20Icon%20Grau%201.png",
        scaledSize: { width: 35, height: 35 },
      };
      return icon;
    },
    
  },

  methods: {
    checkedasInterest(machine){
      //show a notification at the top right corner with create a custom dom
      console.log("Checked as Interest", machine)
      //create a custom dom
      this.isNotification = true
      const div = document.createElement('div')
      div.innerHTML = `<div style="background-color: #97bf0d; color: white; padding: 10px; border-radius: 10px; position: absolute; top: 40%; left: 30%; margin: 10px;">Danke! Wir werden Sie informieren, wenn der Standort eröffnet!</div>`
      document.body.appendChild(div)
      setTimeout(()=>{
        div.remove()
        this.isNotification = false
      }, 4000)
    },
    handleCloseClick(m){
      console.log("Close Clicked", m)
      this.openedMarkerID = null
      m.isSelected = false
    },
    async plotInMap(address){
      this.searchLocation = ''
      this.predictions = ''
      this.centerPositionShow = true
      this.centerPosition= await this.getGeolocation(address)
      this.locationSuggestion = address
    },
    handleInput() {
     axios.post(process.env.VUE_APP_HOST+'/locationSuggestion',{location:this.locationSuggestion}).then((res)=>{
      this.predictions = res.data.predictions
     })
    },
    machineCenter(machine){
      this.centerPosition = ''
      this.centerPosition = 
      {
        lat : machine.position.lat,
        lng: machine.position.lng
      }
    },
    async fetchCurrentPosition() {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        this.hasLocation = true;
        this.centerPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.currentPosition = {
          lat: parseFloat(position.coords.latitude),
          lng: parseFloat(position.coords.longitude),
        };
        //console.log("Current Position:", this.currentPosition);
        if( this.currentPosition.lat =='' || this.currentPosition.lng == '' ){
          this.currentPosition = {
          lat: 51.780058,
          lng:  8.479448,
        };
        this.centerPosition = {
          lat: 51.780058,
          lng:  8.479448,
        };
        }
      } catch (error) {
       // console.log("Error getting geolocation:", error.message);
        this.hasLocation = false;
        this.currentPosition = {
          lat: 51.780058,
          lng:  8.479448,
        };
        this.centerPosition = {
          lat: 51.780058,
          lng:  8.479448,
        };
      }
    },
    calculateDistance(origin, destination) {
      const rad = (x) => (x * Math.PI) / 180;
      const R = 6371; // Earth's radius in kilometers
      const dLat = rad(destination.lat - origin.lat);
      const dLon = rad(destination.lng - origin.lng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(origin.lat)) *
          Math.cos(rad(destination.lat)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance.toFixed(1); // Round to 2 decimal places
    },
    async loadMarkers() {
  try {
    const response = await axios.get(process.env.VUE_APP_HOST + "/machinelist");

    const markerPromises = response.data.map(async (machine, i) => {
      const address = `${machine.currentAddress[0].street} ${machine.currentAddress[0].streetNumber}, ${machine.currentAddress[0].postcode} ${machine.currentAddress[0].city}`;

      const location = await this.getGeolocation(address);
      const distance = this.calculateDistance(this.currentPosition, location);

      return {
        id: i,
        machineID: machine.machineID,
        ort: address,
        distance: distance,
        position: location,
        currentPosition: this.currentPosition,
        isActive: machine.isActive,
      };
    });

    this.markers = await Promise.all(markerPromises);

    // Sort the markers by distance in descending order
    this.sortedMarkers = this.markers.sort((a, b) => a.distance - b.distance);
    console.log("Sorted Markers:", this.sortedMarkers);

    console.log("Markers:", this.markers);
  } catch (error) {
    console.error("Error fetching machine list:", error);
  }
},
async getOwnersMachines(ownerID) {
  try {
    const response = await axios.post(process.env.VUE_APP_HOST + "/getownerMachine", {
      ownerID: ownerID,
    });

    const markerPromises = response.data.map(async (machine, i) => {
      const address = `${machine.currentAddress[0].street} ${machine.currentAddress[0].streetNumber}, ${machine.currentAddress[0].postcode} ${machine.currentAddress[0].city}`;

      const location = await this.getGeolocation(address);
      const distance = this.calculateDistance(this.currentPosition, location);

      return {
        id: i,
        machineID: machine.machineID,
        ort: address,
        distance: distance,
        position: location,
        currentPosition: this.currentPosition,
        isActive: machine.isActive,
      };
    });

    this.markers = await Promise.all(markerPromises);

    // Sort the markers by distance in descending order
    this.sortedMarkers = this.markers.sort((a, b) => a.distance - b.distance);
    console.log("Sorted Markers:", this.sortedMarkers);

    console.log("Markers:", this.markers);
  } catch (error) {
    console.error("Error fetching machine list:", error);
  }
},
    async getGeolocation(address) {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            address: address,
            key: this.apiKey,
          },
        });

        const location = response.data.results[0].geometry.location;
        this.searchLocation = ''
      this.predictions = ''
        return {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lng),
        };
      } catch (error) {
       // console.error("Error fetching LatLng:", error);
        return null;
      }
    },
    bookAppointment(m) {
      this.$router.push({
        path: "appointment",
        query: { machine: m.machineID , location: m.ort },
      });
    },

    openMarker(marker) {
      console.log("Clicked Marker:" , marker);
      if (marker) {
        this.markers.forEach(m => {
          m.isSelected = m.id == marker.id;
        });
      } else {
        this.markers.forEach(m => {
          m.isSelected = false;
        });
      }

    },
    windowMarker(id) {
      this.openedMarkerID = id;
    },
  },
  async mounted() {
    if (innerWidth >= 768 && innerWidth <= 991) {
      this.isTablet = true
      
    }
    if (window.innerWidth < 767) {
      this.isMobile = true
    }
    if (innerWidth >= 992 && innerWidth <= 1199) {
      this.tableLandScape = true
    }
    await this.fetchCurrentPosition();
    axios.post(process.env.VUE_APP_HOST+'/getusersituation',{token:localStorage.getItem('token')}).then(async (res)=>{
     if(res.data.userSituation == true){
      //console.log("User Situation", res.data)
      this.getOwnersMachines(res.data.ownerID)

     }
     else{
      await this.loadMarkers();
     }
    })
    
  },
};
</script>
<style>
.disables{
  pointer-events: none;
  opacity: 0.4;
}
.machine-item {
  border: 1px solid #97bf0d;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height:110px;
  
  padding: 10px;
  margin: 5px;
  width: calc(50% - 5px); /* Adjust as needed */
  max-width: 48.5%;
   /* Adjust as needed */
}

input{
  padding-left: 10px; ;
}
#machinelistiem{
  border: 1px solid #97bf0d;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  margin: 5px;
  padding: 10px;
  margin-right: 20px;
  height: auto;
  width: 100%;
  margin-left: -2%;
}
#mapContainerMapTablet {
   display: flex;
   flex-direction:column;
    justify-content: center;
    width: 100%;
    margin-bottom: 5%;
  }

#machineImage{/* Float left to make it side by side */
  width: 12%; /* Width set to 60% */
  margin-top: 20px;
}
#addreddDiv{
  display: flex; /* Float left to make it side by side */
  flex-direction: column;
  width: 70%; /* Width set to 60% */
  margin: 5px;
  text-align: center;
} 
.btn-success{

  width: 28%; /* Width set to 60% */
  height: 40px;
  margin-top: 20px;
}
.card-header111{
  background-color: #97bf0d;
  color: white;
  font-size: 20px;
  font-weight: 600;
  padding: 10px;
  border-radius: 10px;
  margin-bottom:  auto;

}
#mapContainerbody {
  display: block; /* Ensures block-level display */
  width: 100%; /* Ensures full width */
  margin-bottom: 550px !important;
}

#mapContainerMap {
  float: left; /* Float left to make it side by side */
  width: 66.5%; /* Width set to 60% */
  margin: 5px;
}


#mapContainerTable {
  float: left; /* Float left to make it side by side */
  width: 30%; /* Width set to 40% */
  margin: 5px;
}
*{
  font-family: 'Oswald';
}

#mapContainerTableMobile{
  width: 95%;
  margin: auto;

}
#suggestionList{
background-color: white;
text-align: center;
width: 40%;
margin: auto;
z-index: 999;
}
#suggestionList li{
  margin: 1%;
  border-radius: 12px;
}
#suggestionList li:hover{
  background-color: #97bf0d;
  color: aliceblue;
  cursor: pointer;
}
.showSuggestion{
  position: absolute;
  left: 37%;
  z-index: 999;
  margin: auto;
  align-items: center;
  border: #97bf0d 1px solid;
}
#searchLocation{
  background-color: #97bf0d;
  width: 60%;
  margin: auto;
  border-radius: 12px;
  padding: 10px;
}
 body {
    margin: 0;
  }
#directionButton{
  background: none;
  border: none;
  background-color: transparent;
}

  li{
    list-style: none;
  }

button{
  border-radius: 12px;
}

.btn-success {
    background-color: #97bf0d !important;
    border-color: #97bf0d;
}
@media (max-width: 961px){
  #suggestionList{
    width: 60%;
    z-index: 999;
  }
  .showSuggestion{
  position: absolute;
  left: 30%;
  z-index: 999;
  margin: auto;
  align-items: center;
  width: 50%;
}
#mapContainerMapTablet {
   display: block;
    width: 100%;
    margin-bottom: 5%;
  }
  #machinelistiem{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    background-color: aliceblue;
    padding: 5px;
    background-color: white;
    border: 1px solid #97bf0d;
    margin-top: 5%;
    margin-left: -30px !important;
    margin-right: 16%;
    font-size: medium;
    width: 110%;
    position: relative;
    left: 5px;
  
  }
  #machinelistiemTablet{
 border:1px solid #97bf0d;
 border-radius: 10px;
 display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    background-color: aliceblue;
    padding: 5px;
    background-color: white;
    border: 1px solid #97bf0d;
    margin-top: 5%;

    
    font-size: medium;
    width: 90%;
    position: relative;
    left: 5px;
  }

  .card-header111 {
  background: #97bf0d;
  color: white;
  height: 50px;
  margin: auto;
  margin-top: 2%;
  width: 90%;
}
li{
  align-items: center;
  text-align: center;
}
#mapContainerMap{
    flex: 2; /* Takes up 3/4 of the available space */
    background-color: transparent;
    padding: 10px; /* Add padding as needed */
    margin-left: 2%;
    margin-top:10px
  }

}
</style>
