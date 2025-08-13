<template>
    <div translate="no">
      <sidebar @search-input-emit="search" /><!--sidebar component-->
      <div class="container">
        <Help />
      </div>
  
      <div class="popup center" v-bind:class="{ active: isActive }">
        <div class="title">Wählen Sie Ihren Avatar</div>
        <div v-if="choosing">
          <div>
            <div id="profielimages">
              <div v-for="image in images.slice(0, 3)">
                <img id="images" v-bind:src="image" @click="value = image" v-on:click="selectImage">
              </div>
            </div>
            <div id="profielimages">
              <div v-for="image in images.slice(3, 6)">
                <img id="images" v-bind:src="image" @click="value = image" v-on:click="selectImage">
              </div>
            </div>
  
          </div>
          <div>
          <button class="btn btn-danger" id="book" @click="cancelImage">
            Abbrechen
          </button>
        </div>
        </div>
       
       
        <div v-else>
          <div class="spinner-border text-secondary" role="status" style="margin-top: 15%; color: #97bf0d !important;"></div>
        </div>
  
  
      </div>
      <div class="card" id="main">
        <div class="card-header">
          <h2>{{ $t("profileSection") }} : {{ details.lastName }}</h2>
        </div>
  
  
        <div class="row">
          <div class="col">
            <div class="card ">
              <div class="card-body text-center">
                <!-- <img v-bind:src="profilePic" alt="avatar" class="rounded-circle img-fluid" style="width: 150px" /> -->
                 <p>L O G O</p>
                <br />
                <br />
                <button type="button" class="btn btn-primary" v-if="deleteShowing" @click.prevent="selectAvatar">
                  Logo hochladen
                </button><!--customer details-->
                <h5 class="">{{ details.role }}</h5>
                <p class="text-muted ">{{ $t('customerID') }}:{{ details.customerID }}</p>
                <p class="text-muted ">
                  {{ details.street }}, {{ details.city }}, {{ details.postcode }}
                </p>
                <div class="d-flex justify-content-center ">
                  <a href="#/profile/editprofile">
                    <button type="button" class="btn btn-primary">
                      {{ $t("editProfile") }}
                    </button></a><!--routing to edit profile-->
                  <a href="#/profile/editprofile">
                    <button type="button" class="btn btn-secondary" @click.prevent="updatePassword">
                      {{ $t("updatePassword") }}
                    </button></a>
                </div>
              </div>
            </div>
          </div>
  
          <div class="col">
  
            <div class="card ">
  
              <div class="card-body">
  
                <div class="row">
  
                  <div class="col">
                    <!--customer information-->
                    <p class="mb-0">{{ $t("fullName") }}</p>
                  </div>
                  <div class="col">
                    <p class="text-muted ">{{ details.firstName }} {{ details.lastName }}</p>
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
                    <p class="mb-0">{{ $t('mobile') }}</p>
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
                      {{ details.street }}, {{ details.city }}, {{ details.postcode }}, DE
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="co">
                <div class="card ">
                  <div class="card-body">
                    <p class="mb">{{ $t('license') }}</p>
                    <!--customer licenses-->
                    <p>Anzahl der Lizenzen:&nbsp;<strong>{{ numberOfLicense }}</strong></p>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card">
                  <div class="card-body">
                    <p class="">{{ $t('certificate') }}</p>
                    <!--customer certificates-->
                    <p>Anzahl der Bescheinigungen:&nbsp;<strong>{{ numberOfCertificates }}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import Sidebar from "@/components/Sidebar.vue";
  import Help from '@/components/Help.vue';

  export default {
    name: "Profile",
    data() {
      return {
        details: '',
        images: [],
        customerId: '',
        isActive: false,
        deleteShowing: true,
        numberOfLicense: '',
        choosing:true
      }
    },
    components: {
      Sidebar,
      Help
    },
    methods: {
      selectImage() {
        this.choosing = false
        axios.post(process.env.VUE_APP_HOST +'/updateProfilepicture', { customerId: this.customerId, image: this.value }).
          then(() => {
            
            window.location.reload()
            this.choosing = true
            this.isActive = false
          })
      },
      cancelImage() {
        this.isActive = false
      },
      selectAvatar() {
        this.isActive = true
      },
      updatePassword() {
        this.$router.push('/updatepassword')
        // let route =  this.$router.resolve({path: '/#/updatepassword',query:{a:'a'}})
        // window.open(route.href);
      }
    },
    mounted() {
      
   axios.get(process.env.VUE_APP_HOST +"/customerprofile", {
        headers: { token: localStorage.getItem("token") },
      })
        .then((res) => {
          console.log(res.data.user)
          this.details = res.data.user
          this.customerId = res.data.user.customerID
          this.profilePic = res.data.user.profilePicture
  
          this.numberOfLicense = res.data.user.licenses.length
          this.numberOfCertificates = res.data.user.certificated.length
  
        });
      axios.get(process.env.VUE_APP_HOST +'/image').then((res) => {
        this.images = res.data
      })
      
      if (window.innerWidth < 767) {
        this.deleteShowing = false
  
      }

}
  };
  </script>
  
  <style scoped>

* {
  font-family: 'Oswald';
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
    ;
  }
  
  .popup {
    background: #f5f5f5;
    width: 320px;
    height: 270px;
    margin-top: 10px;
    border-radius: 10px;
    border: 2px solid #97bf0d;
    box-sizing: border-box;
    z-index: 1000;
    text-align: center;
    opacity: 0;
  
  }
  
  
  .active {
    opacity: 1;
    top: 50%;
    left: 65%;
    transform: translate(-80%, -60%) scale(1);
    transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
  }
  
  .center {
    position: absolute;
  }
  
  h2 {
    text-transform: uppercase;
    font-weight: bold;
  }
  
  .card-header {
    background: #97bf0d;
    color: white;
  }
  
  .card {
    margin-top: 20px;
    height: auto;
    width: auto;
  
  }
  
  .btn-primary {
    margin-right: 5px;
    border-radius: 0 !important;
    background-color: #97bf0d !important;
    border-color: #97bf0d;
  }
  
  #avatar {
    margin-top: 10px;
  }
  
  .btn-secondary {
    border-radius: 0 !important;
    background-color: #97bf0d !important;
    border-color: #97bf0d;
  }
  
  .container {
    width: auto;
    height: auto;
  }
  
  #view {
    display: flex;
    flex-direction: row;
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
  
  @media (max-width: 575.98px) {
    .card-header {
  
      font-size: xx-small;
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
  }</style>
  