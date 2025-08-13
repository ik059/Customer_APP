<template>
  <div translate="no">
    <sidebar :isMenuOpen="sidebarOpen" /><!--sidebar component-->

  </div>
  <div>
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

    <!--license table-->

    <div v-else>
      <div v-if="noMachines">
        <div class="card">
          <div class="card-header">
            <h2 style="margin-top: 10px;">{{ $t("machines") }}</h2>
          </div>
          <p>{{ updates }}</p>
        </div>
      </div>
      <div v-if="!mapView">
        <div>
          <form @submit.prevent="searchPostcode">
            <input
              type="text"
              placeholder=" Postleitzahl"
              v-model="postCode"
              @input="searchPostcode"
              style="margin-left: 2px; border: 1px solid"
            />
            <button
              class="btn btn-primary"
              style="background-color: #97bf0d !important"
              type="submit"
              id="sortingButtons"
            >
              Suche
            </button>
          </form>
          <br />
          <div class="card">
            <div class="card-header">
              <h2>{{ $t("machines") }}</h2>
            </div>
            <div>
              <table class="table table-striped table-hover table-responsive">
                <thead>
                  <tr>
                    <th scope="col">{{ $t("machineName") }}</th>
                    <th scope="col">{{ $t("location") }}</th>
                    <th scope="col">{{ $t("appointment") }}?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="machine in machines">
                    <td>{{ machine.machineName }}</td>
                    <td>
                      {{ machine.currentAddress[0].street }},
                      {{ machine.currentAddress[0].city }},
                      {{ machine.currentAddress[0].postcode }}
                    </td>
                    <td>
                      <!-- Call to action buttons -->
                      <ul class="list-inline m-0">
                        <li class="list-inline-item">
                          <button
                            class="btn btn-success btn-sm rounded-0"
                            type="button"
                            data-toggle="tooltip"
                            data-placement="top"
                            @click="value = machine.machineID"
                            v-on:click="bookAppointment(machine)"
                          >
                            <font-awesome-icon
                              icon="fa-solid fa-calendar-check"
                            /><!--delete license-->
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
      <div v-if="mapView" >
        <div class="card">
          <div class="card-header2">
            <h2 style="margin-top: 10px;">WO MÖCHTEN SIE WASCHEN?</h2>
            </div>
            <DigitalClock id="clock" />
            
          </div>
     
          <Map id="map"/>
        
      </div>
    </div>

    <!-- <Footer v-if="!isLoading"/> -->
  </div>
</template>

<script>
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import Map from "@/components/Map.vue";
import Footer from "@/components/Footer.vue";
import DigitalClock from "@/components/clock.vue";

import Help from "@/components/Help.vue";
export default {
  name: "Profile",
  data() {
    return {
      details: "",
      machines: [],
      isActive: false,
      ongoingDeletedLicense: "",
      value: "",
      tableView: true,
      mapView: true,
      updates: "",
      postCode: "",
      noMachines: false,
      isLoading: true,
      sidebarOpen: true,
    };
  },
  components: {
    Sidebar,
    Map,
    Help,
    Footer,
    DigitalClock,
  },
  mounted() {
    if (window.innerWidth < 767) {
      this.mobileTrue = true;
    } else {
      this.mobileTrue = false;
    }
    axios.get(process.env.VUE_APP_HOST + "/machinelist").then((res) => {
      this.machines = res.data;
      this.isLoading = false;
    });
  },
  methods: {
    searchPostcode() {
      axios
        .post(process.env.VUE_APP_HOST + "/searchmachinebypostcode", {
          postcode: this.postCode,
        })
        .then((res) => {
          if (res.data.length == 0) {
            this.noMachines = true;
            this.updates = "Keine Maschinen mit dieser Postleitzahl gefunden";
          } else {
            this.noMachines = false;
            this.machines = res.data;
          }
        });
    },
    bookAppointment(machine) {
      this.$router.push({
        path: "appointment",
        query: {
          machine: machine.machineID,
          location:
            machine.currentAddress[0].street +
            " " +
            machine.currentAddress[0].streetNumber +
            "," +
            machine.currentAddress[0].postcode +
            " " +
            machine.currentAddress[0].city,
        },
      });
    },
    viewMap() {
      console.log("S");
      this.tableView = false;
      this.mapView = true;
      this.sidebarOpen = !this.sidebarOpen;
      //this.sidebarOpen = false
      this.sidebarOpen = false;
      console.log("Sidebar state:", this.sidebarOpen);
    },
    viewTable() {
      this.mapView = false;
      this.tableView = true;
    },
  },
};
</script>

<style scoped>
#map{
  margin: 1%;
}

* {
  font-family: 'Oswald';
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
.btn-primary {
  margin-left: 10px;
  border-radius: 0 !important;
  border-color: #97bf0d;
}
h2 {
  font-weight: bold;
}

.btn-secondary {
  border-radius: 0 !important;
}

.btn-success {
  border-radius: 0 !important;
  background-color: #97bf0d !important;
  border-color: #97bf0d;
}

.card {
  height: auto;
  width: auto;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  border:none;
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
.card-header2{
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

#delete {
  height: 70px;
  width: 45px;
}

.popup {
  background: #f5f5f5;
  width: 350px;
  height: 200px;

  border-radius: 10px;
  border: 2px solid #97bf0d;
  box-sizing: border-box;
  z-index: -1;
  text-align: center;
  opacity: 0;
  top: -200%;
}

.active {
  opacity: 1;
  z-index: 1;
  position: absolute;
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

#machineButton {
  margin: 1%;
}

@media (max-width: 575.98px) {
  #sortingButtons {
    margin-top: 5px;
  }
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
}
  .card {
    height: auto;
    width: auto;
    margin-left: 10px;
    margin-right: 10px;
    font-size: small;
  }
  #machineButton {
    margin-top: 10px;
  }

  .table {
    height: auto;
    font-size: x-small;
  }

  .popup {
    margin-left: 70px;
    height: auto;
    width: 250px;
  }
}
@media (max-width: 800px) {
  .card-header2 {
    background: #97bf0d;
  color: white;
  height:auto;
  width: 280px;
  font-size: 14px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
h2{
  font-size: 18px;
}
  .card {
    height: auto;
    width: auto;
    margin-left: 10px;
    margin-right: 10px;
  }
}

@media only screen and (min-width: 600px) {
  .card {
    height: auto;
    width: auto;
    margin-left: 10px;
    margin-right: 10px;
  }
}
@media (max-width:900px){
  .card-header{
    background: #97bf0d;
  color: white;
  height:50px;
  width: 280px;
  font-size: 48px;
  border-radius: 10px;
  margin: auto;
  justify-content: center;
  font-size: 14px !important;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }
}
</style>
