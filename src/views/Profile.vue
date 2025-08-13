<template>
  <div translate="no" class="profileview">
    

    <div class="popup center" v-bind:class="{ active: isActive }">
      <br/>
      <div class="title">Bitte laden Sie ihr Logo hoch (maximal 4Mb)</div>
      <div v-if="choosing">
        <div>
          <input
            type="file"
            id="file"
            @change="changingFile"
            style="display: none"
            ref="fileInput" 
            accept="image/*"
          />
          <label for="file" class="btn btn-primary" style="align-items:center; margin-top:20%;" v-if="!pictureUlpoaded">Logo hochladen</label>
        </div>
        <br/>
        <div>
          <img
            v-bind:src="value"
            alt="avatar"
            class="logoAlter"
            style="padding: 12px; border: 1px solid #97bf0d"
            v-if="pictureUlpoaded"
          />
          <br  v-if="pictureUlpoaded"/>
          <br/>
        </div>
        <div>
          <button class="btn btn-danger" id="book" style="background-color:red !important; margin:5px;" @click="cancelImage">Abbrechen</button>
          <button class="btn btn-danger" id="book" @click="selectImage" v-if="pictureUlpoaded" style="margin:5px;">Upload</button>
      
        </div>
      </div>

      <div v-else>
        <div
          class="spinner-border text-secondary"
          role="status"
          style="margin-top: 15%; color: #97bf0d !important"
        ></div>
      </div>
    </div>
    <div v-bind:class="{ 'disabled': isActive }">
      <sidebar @search-input-emit="search" /><!--sidebar component-->
    <div class="container">
      <Help />
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
      <div class="card" id="main">
        <div class="card-header" style="margin-top:10px;">
          <h2 >{{ $t("profileSection") }} </h2>
        </div>

        <div class="row">
          <div class="col">
            <div class="card" style="display: flex; justify-content:center;;">
              <div class="card-body text-center">
            
                <p v-if="profilePic == ''" class="logoAlter">L O G O</p>
                    <img
               v-else
                  v-bind:src="profilePic"
                  alt="avatar"
                  class="logoAlter"
                  style="  padding: 12px; border: 1px solid #97bf0d"
                />
                <br />
                <br v-if="profilePic != ''"/>
                <button
                  type="button"
                  class="btn btn-primary"
                  v-if="deleteShowing"
                  @click.prevent="selectAvatar">
                  Logo hochladen</button
                ><!--customer details-->
                <h5 class="">{{ details.role }}</h5>
                <p class="text-muted">{{ $t("customerID") }}:{{ details.customerID }}</p>
                <p v-if="details.organizationName" class="text-muted">{{ details.organizationName }}</p>
                <p class="text-muted">
                  {{ details.street }} {{ details.streetnumber }}, {{ details.postcode }} {{ details.city }} 
                </p>
           
                <div class="d-flex justify-content-center">
                  <a href="#/profile/editprofile"  style="border-radius:10px;">
                    <button type="button" class="btn btn-primary"  style="border-radius:10px;">
                      {{ $t("editProfile") }}
                    </button></a
                  ><!--routing to edit profile-->
                  <a href="#/profile/editprofile">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click.prevent="updatePassword"
                      style="border-radius:10px;"
                    >
                      {{ $t("updatePassword") }}
                    </button></a
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <!--customer information-->
                    <p class="mb-0">{{ $t("fullName") }}</p>
                  </div>
                  <div class="col">
                    <p class="text-muted">
                      {{ details.firstName }} {{ details.lastName }}
                    </p>
                  </div>
                </div>
                <hr />
                <div class="row">
                  <div class="col">
                    <p class="mb-0">Email</p>
                  </div>
                  <div class="col">
                    <p class="text-muted mb-0">{{ details.email }}</p>
                  </div>
                </div>

                <hr />
                <div class="row">
                  <div class="col">
                    <p class="mb-0">{{ $t("mobile") }}</p>
                  </div>
                  <div class="col">
                    <p class="text-muted mb-0">{{ details.contactNumber }}</p>
                  </div>
                </div>
                <hr />
                <div class="row">
                  <div class="col">
                    <p class="mb-0">{{ $t("billingAddress") }}</p>
                  </div>
                  <div class="col">
                    <p class="text-muted mb-0">
                      {{ details.street }} {{ details.streetnumber }}, {{ details.postcode }} {{ details.city }}
                      
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="co">
                <div class="card">
                  <div class="card-body">
                    <p class="mb">{{ $t("license") }}</p>
                    <!--customer licenses-->
                    <p>
                      Anzahl der Kennzeichen:&nbsp;<strong>{{ numberOfLicense }}</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card" id="certcard">
                  <div class="card-body">
                    <p class="">{{ $t("certificate") }}</p>
                    <!--customer certificates-->
                    <p>
                      Anzahl der Bescheinigungen:&nbsp;<strong>{{
                        numberOfCertificates
                      }}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
import Footer from "@/components/Footer.vue";
export default {
  name: "Profile",
  data() {
    return {
      details: "",
      images: [],
      customerId: "",
      isActive: false,
      deleteShowing: true,
      numberOfLicense: "",
      choosing: true,
      isLoading: true,
      pictureUlpoaded: false,
      value: "",
    };
  },
  components: {
    Sidebar,
    Help,
    Footer,
  },
  methods: {
    changingFile(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result; // reader.result contains the Base64 string
        console.log('File as Base64:', base64String);
        this.value = base64String;
        this.pictureUlpoaded = true;

        
        // Optional: Do something with the Base64 string, e.g., store it, send to server, etc.
    };
    
    reader.onerror = (error) => {
        console.error('Error reading file:', error);
    };

    },
    selectImage() {
      this.choosing = false;
      axios
        .post(process.env.VUE_APP_HOST + "/updateProfilepicture", {
          customerId: this.customerId,
          image: this.value,
        })
        .then(() => {
          window.location.reload();
          this.choosing = true;
          this.isActive = false;
        });
    },
    cancelImage() {
      this.isActive = false;
      this.pictureUlpoaded = false;
      this.choosing = true;
      this.value = "";
      this.$refs.fileInput.value = null;
    },
    selectAvatar() {
      this.isActive = true;
    },
    updatePassword() {
      this.$router.push("/updatepassword");
      // let route =  this.$router.resolve({path: '/#/updatepassword',query:{a:'a'}})
      // window.open(route.href);
    },
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
        this.customerId = res.data.user.customerID;
        this.profilePic = res.data.user.profilePicture;

        this.numberOfLicense = res.data.user.licenses.length;
        if(!res.data.user.ownerCustomer){
          this.numberOfCertificates = res.data.user.certificated.length;
          this.isLoading = false;
        }
        else{
          axios.post(process.env.VUE_APP_HOST + "/getCertificatesasowner", {
            customerId: res.data.user.ownerID,
          }).then((res) => {
            this.numberOfCertificates = res.data;
            this.isLoading = false;
          });
        }
      });
      
    // axios.get(process.env.VUE_APP_HOST + "/image").then((res) => {
    //   this.images = res.data;
    //   this.isLoading = true;
    //   this.isLoading = false;
    // });
    if (window.innerWidth < 767) {
      this.deleteShowing = false;
    }
  },
};
</script>

<style scoped>
.logoAlter{
  font-size: 50px;
  color: #97bf0d;
  font-weight: bold;
  padding: 10px;
  border: 1px solid #97bf0d;
  border-radius: 5px;
  width: 250px;
  aspect-ratio: 3/1;
  margin: auto;


}

* {
  font-family: 'Oswald';
}
.disabled{
    pointer-events: none;
    opacity: 0.6;
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

#profielimages {
  display: flex;
  flex-direction: row;
}

#images {
  height: 90px;
  width: 90px;
  border-radius: 48%;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
}

#images:hover {
  border: 3px solid #97bf0d;
}

.popup {
  background: #f5f5f5;
  width: 320px;
  height: 270px;
  margin-top: 10px;
  border-radius: 10px;
  border: 2px solid #97bf0d;
  box-sizing: border-box;
  z-index: 0;
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

h2 {
  font-weight: bold;
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

.card {
  margin-top: 20px;
  height: auto;
  width: auto;
 
}

.btn-primary {
  margin-right: 5px;
  border-radius: 10px !important;
  background-color: #97bf0d !important;
  border:none;
}

#avatar {
  margin-top: 10px;
}

.btn-secondary {
  border-radius: 10px !important;
  background-color: #97bf0d !important;
  border-color: none;
}
button{
  border-radius: 10px !important;
  background-color: #97bf0d !important;
  border:none;
}
#main{
  border: none !important;
}

#certcard {
  margin-bottom: 20px;
}

.container {
  width: auto;
  height: auto;
}

#view {
  display: flex;
  flex-direction: row;
}

.image {
  opacity: 0.6;
}

@keyframes blink {
  0% {
    opacity: 0.3;
  }

  50% {
    opacity: 0;
  }
}

@media (max-width: 575.98px) {
  .card {
    height: auto;
    width: auto;

    margin-left: 10px;
    margin-right: 10px;
    font-size: small;
  }

  #main {
    position: absolute;
  }
}
@media (max-width: 900px){
  .card-header{
    background: #97bf0d;
  color: white;
  height:50px;
  width: 260px;
  font-size: 36px;
  border-radius: 10px;
  margin: auto;
  display: flex;
  justify-content: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }
}

@media (max-width: 575.98px) {
  .card-header {
    background: #97bf0d;
  color: white;
  height:50px;
  width: 260px;
  font-size: 36px;
  border-radius: 10px;
  margin: auto;
  display: flex;
  justify-content: center;
  }
}

@media (max-width: 575.98px) {
  .img-fluid {
    max-width: 75px;
    height: 75px;
  }
}

@media (max-width: 575.98px) {
  .btn-primary {
    width: 80px;
    height: 40px;
    font-size: xx-small;
  }

  .btn-outline-primary {
    width: 70px;
    height: 70px;
    font-size: xx-small;
  }

  #certcard {
    margin-bottom: 100px;
  }

  .btn-secondary {
    width: 100px;
    height: 40px;
    font-size: xx-small;
  }

  .card {
    margin-top: 10px;
  }
}

@media only screen and (min-width: 600px) {
  .card {
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>
