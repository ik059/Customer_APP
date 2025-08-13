<template>
  <div translate="no">
    

    <!--delete popup-->
    <div class="popup center" v-bind:class="{ active: isActive }">
      <div class="title" style="color:black; font-size: larger; margin: 15px 0px;">Kennzeichen löschen</div>
      <div v-if="deleting">
        <img id="delete" src="../assets/delete-181.png" />
        <br/>
        <br/>
        <div class="cancelButton">
          <button type="button" class="btn btn-success" id="close" v-on:click="close">
            {{ $t("close") }}
          </button>

          <button type="button" class="btn btn-success" id="book" @click="confirmDelete">
            {{ $t("delete") }}
          </button>
        </div>
      </div>
      <div v-else>
        <div class="spinner-grow text-danger" role="status" style="margin-top: 15%"></div>
      </div>
    </div>
    <div  v-bind:class="{ 'disabled': isActive }">
      <sidebar /><!--sidebar component-->
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
      <div class="card">
      
        <div class="card-header">
          <h2 id="headerText">Fahrzeuge</h2>
        </div>
        <br/>
        <div v-if="noLicense">
          {{ $t("noLicense") }}
          <br />
          <br />
          <router-link to="addlicense">
            <button type="button" id="addlicense" class="btn btn-primary">
              {{ $t("addLicense") }}
            </button>
          </router-link>
        </div>
        <!--license table-->
        <div v-else style="border:3px solid #97bf0d; border-radius:10px;">
          <table class="table table-striped table-hover table-responsive">
            <thead>
              <tr>
                <th scope="col">Kennzeichen</th>
                <th scope="col">{{ $t("trailerDesignation") }}</th>
                <th scope="col" v-if="deleteShowing">{{ $t("model") }}</th>
                <th scope="col">{{ $t("constractedYear") }}</th>
                <th scope="col" v-if="deleteShowing">{{ $t("deleteLicense") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="certificate in certificates">
                <td>{{ certificate.licenseNumber }}</td>
                <td>{{ certificate.trailerDesignation }}</td>
                <td v-if="deleteShowing">{{ certificate.trailerModel }}</td>
                <td>{{ certificate.constractedYear }}</td>

                <td>
                  <!-- Call to action buttons -->
                  <ul class="list-inline m-0">
                    <li class="list-inline-item" v-if="deleteShowing">
                      <button
                        class="btn btn-danger btn-sm"
                        type="button"
                        data-toggle="tooltip"
                        data-placement="top"
                        @click="value = certificate.licenseNumber"
                        v-on:click="deleteLicense"
                      >
                        <font-awesome-icon
                          icon="fa-solid fa-trash"
                        /><!--delete license-->
                      </button>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <div id="addlicenseButton">
          <button class="btn btn-primary" @click.prevent="routeToaddlicense">Fahrzeug hinzufügen</button>
          <br/>
          <br/>
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
import { faL } from "@fortawesome/free-solid-svg-icons";
import Footer from "@/components/Footer.vue";

export default {
  name: "Profile",
  data() {
    return {
      mobileTrue: false,
      details: "",
      certificates: [],
      isActive: false,
      ongoingDeletedLicense: "",
      value: "",
      updates: "",
      noLicense: false,
      deleteShowing: true,
      deleting: true,
      isLoading: true,
    };
  },
  components: {
    Sidebar,
    Help,
    Footer,
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
        this.details = res.data.user;
        if (this.details.licenses.length === 0) {
          this.noLicense = true;
          this.isLoading = false;
        }
        this.certificates = this.details.licenses;
        this.isLoading = false;
      });
    if (window.innerWidth < 767) {
      this.deleteShowing = false;
    }
  },

  methods: {
    routeToaddlicense(){
      this.$router.push('addlicense')
    },
    deleteLicense(e) {
      this.isActive = true;
    },
    close() {
      this.isActive = false;
      this.ongoingDeletedLicense = "";
    },
    confirmDelete() {
      this.deleting = false;
      const deleteLicense = {
        licenseNumber: this.value,
        customerID: this.details.customerID,
      };
      axios.post(process.env.VUE_APP_HOST + "/deleteLicense", deleteLicense).then(() => {
        this.deleting = true;
        this.isActive = false;
        window.location.reload();
      });
    },
  },
};
</script>

<style scoped>
.btn-danger{
  margin: 0;
  width: auto;
}

* {
  font-family: 'Oswald';
}
.disabled{
    pointer-events: none;
    opacity: 0.6;
}
#addlicenseButton{
  width: 98%;
   text-align: right;
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
#cancelButton {
  display: flex;
  flex-direction: row;
}
#deletingPicture {
  height: 100px;
  width: 250px;
}
h2 {

  font-weight: bold;
}

#addlicense {
  margin-bottom: 10px;
}

.card {
  height: auto;
  width: auto;
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 10px;
  border:none;
  margin-bottom: 100px;
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

#delete {
  height: 70px;
  width: 45px;
  background: none;
}
button{
  border-radius: 5px;
}
.btn-primary {
  background-color: #97bf0d !important;
  border-color: #97bf0d;
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
  position: fixed;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%) ;
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
}

.center {
  position: fixed;
}

.btn-success {
  margin-right: 5px;
  background-color: #97bf0d !important;
  border: #97bf0d !important;
  width: auto;
  margin: 0;
}

#close {
  border-radius: 10px;
  margin-left:10px;
}

#book {
  border-radius: 10px;
  margin-left:10px;
  background-color: red !important;
}
#headerText{
  margin-top: 2px;
}

@media (max-width: 767px) {
  .card {
    height: auto;
    width: 100%;
    margin-left: 10px;
    position: absolute;
    margin-right: 10px;
    font-size: small;
    margin-top: 10px;
  }
  #addlicenseButton{
  width: 93%;
   text-align: right;
}
  .table {
    height: auto;
  }

  .popup {
    margin-left: 40px;
    height: 250px;
    width: 250px;
    font-size: small;
  }

  .btn-success {
    font-size: xx-small;
    margin-bottom: 15px;
  }

  .btn-danger {
    font-size: xx-small;
  }

  .cancel-button {
    font-size: x-small;
    margin-bottom: 10px;
  }
  .card {
    width: 75%;
    margin-left: 10px;
    margin-right: 10px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  #searchBar {
    display: flex;
    flex-direction: column;
  }

  .card {
    width: auto;
    
    margin-left: 10px;
    margin-right: 10px;
  }

  .table {
    font-size: x-small;
  }

  .popup {
    margin-left: 120px;
  }
  .card-header{
    background: #97bf0d;
  color: white;
  height:50px;
  width: 260px;
  font-size: 48px;
  border-radius: 10px;
  margin: auto;
  display: flex;
  justify-content: center;
  }
  #headerText{
  margin-top: 0px;
}
}
@media (max-width: 900px) {
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
  .active {
  opacity: 1;
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 40%;

  transform: translate(-50%, -50%) ;
  transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
}
  #copyright {
    font-size: 10px;
  }
  #headerText{
  margin-top: -4px;

}
  .app {
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

</style>
