<template>
  <div>
    <sidebar
      @search-input-emit="search"
      translate="no"
    /><!--sidebar component-->
    <div>
      <div class="card">
        <h2 class="card-header" style="margin-top: 10px;">Kennwort Aktualisieren</h2>
        <div class="card-body">
          <form>
            <div class="form-group">
              <label>{{ $t("oldPassword") }}</label>
              <input
                type="password"
                class="form-control form-control-lg"
                v-model="opassword"
              /><!--email label-->
            </div>
            <div class="form-group">
              <label>{{ $t("newPassword") }}</label>
              <input
                type="password"
                class="form-control form-control-lg"
                v-model="password"
              /><!--email label-->
            </div>
            <div class="form-group">
              <label>{{ $t("retypePassword") }}</label>
              <input
                type="password"
                class="form-control form-control-lg"
                v-model="cpassword"
              /><!--email label-->
            </div>
            <div id="buttons">
            <a href="#/profile">
              <button
                type="button"
                id="submit"
                name="submit"
                class="btn btn-secondary"
              >
                Zurück
              </button>
            </a>

            <button
              id="button"
              type="submit"
              class="btn btn-primary"
              @click.prevent="updatePassword"
            >
              <div
                v-if="loading"
                class="spinner-border spinner-border-sm"
              ></div>
              {{ $t("updatePassword") }}
            </button>
            </div>
            <br />
            {{ updates }}
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: "UpdatePassword",
  data() {
    return {
      details: "",
      opassword: "",
      password: "",
      cpassword: "",
      updates: "",
      loading: false,
    };
  },
  components: {
    Sidebar,
    Footer,
  },
  methods: {
    updatePassword() {
      this.loading = true;
      if (this.password === this.cpassword) {
        const passwords = {
          oldPassword: this.opassword,
          newPassword: this.password,
          customerID: this.details,
        };
        axios
          .post(process.env.VUE_APP_HOST + "/updatepassword", passwords)
          .then((res) => {
            this.updates = res.data;
            this.opassword = "";
            this.cpassword = "";
            this.password = "";
            this.loading = false;
          });
      } else {
        this.updates = "Neue Passwörter können nicht dasselbe sein!";
        this.loading = false;
      }
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
        this.details = res.data.user.customerID;
      });
  },
};
</script>
<style scoped>
#buttons {
    margin-top: 20px;
  display: flex;
  justify-content: center;
}
* {
  font-family: "Oswald" !important;
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
#button {
  background-color: #97bf0d !important;
  border-radius: 7px !important;
  background-color: #97bf0d !important;
  border-color: #97bf0d;
  margin-left: 5px;

}
h3 {
  font-weight: bold;
}
.card {
  height: auto;
  width: auto;
  margin-top: 20px;
  display: table;
  margin-right: auto;
  margin-left: auto;
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
  display: flex;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

p {
  text-align: center;
}

@media (max-width: 575.98px) {
  .card {
    margin-left: 10px;
    margin-right: 10px;
  }
  .form-group {
    font-size: small;
  }
}
h2{
  
  font-weight: bold;
}

@media (max-width: 900.98px) {
  .card{
    width: 95%;
  }
  .card-header{
    background: #97bf0d;
  color: white;
  height:auto;
  width: 260px;
  font-size: 26px;
  border-radius: 10px;
  text-align: center;
  margin: auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }
}

</style>
