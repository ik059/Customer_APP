<template>
  <div>
  <div class="sidebar" :class="isOpened ? 'open' : ''" :style="cssVars"> <!--sidebar open on load-->
    <div class="logo-details" style="margin: 6px 14px 0 14px;">
      <img v-if="menuLogo" :src="menuLogo" alt="menu-logo" class="menu-logo icon">
      
      <i v-else class="bx icon" :class="menuIcon" />
      <div class="logo_name">

        <img id="top" src="https://container-hygiene.de/webapps/customerapp/logo2.cf910ee3.png" height="35" @click.prevent="gotodashboard" style="cursor:pointer;"/>


      </div>
      <i class="bx" :class="isOpened ? 'bx-menu-alt-right' : 'bx-menu'" id="btn"
        @click="isOpened = !isOpened" /><!--button to open/close sidebar-->
    </div>

    <div
      style="display: flex ; flex-direction:column; justify-content: space-between; flex-grow: 1; max-height: calc(100% - 60px); ">
      <div id="my-scroll" style="margin: 6px 14px 0 14px;">
        <ul class="nav-list" style="overflow: visible; margin-top: 10vh;">

          <!--mapping menu items of sidebar-->
          <span v-for="(menuItem, index) in menuItems" :key="index" v-bind:class="{menudItemsBorder:isOpened, menudItemsclosedBorder:!isOpened}">
            <li style="width: 108%;">
              <a :href="menuItem.link" @click="closeSidebar" :class="{ 'first-item': index === 0 && isOpened,  'last-item': index === menuItems.length - 1 && isOpened , sidebara: isOpened, openedItems:!isOpened}" >
                <!-- <i class="bx" :class="menuItem.icon || 'bx-square-rounded'" /> -->
                <img :src="menuItem.image" id="menuImages" :style="{ width: (menuItem.name === 'Termin buchen' || menuItem.name === 'Service') && isOpened ? '16%' : '10%' }" v-if="isOpened" />
                
                <img :src="menuItem.image"  style="width:150%; height: auto;" id="closedIcons" v-else  @mouseover="showName = menuItem.name" @mouseout="showName = ''"/>
                <br/>
                <p style="color:white" v-if="showName === menuItem.name && isOpened" id="nameMenu">{{showName  }}</p>
                <span class="links_name" v-if="isOpened">{{ menuItem.name }}</span>
              </a>
              <span class="tooltip" v-if="!isOpened" id="namepopup">{{ menuItem.tooltip || menuItem.name }} </span>
            </li>
          </span>
        </ul>
       
        <!-- <div v-if="isOpened && totalSales>0" style="margin-top: 25%;">
          <h6 style="color:white; margin: auto; margin-left: 5%;">Sie haben gerettet</h6>
          <div id="savingdisplay">
              <img src="https://i.ibb.co/LC6zKy1/Icon1.png" alt="Icon1" style="width:30px;">
              {{ totalSales*50 - totalSales*20 }} LITER CHEMIE
          </div>
          <div id="savingdisplay">
              <img src="https://i.ibb.co/HYgcQFC/Icon2.png" alt="Icon2" style="width:30px;"/>
              {{ totalSales*60 - totalSales*40 }} LITER WASSER
            </div>
            <div id="savingdisplay">
              <img src="https://i.ibb.co/bJqtQFw/Icon3.png" alt="Icon3" style="width:30px;" />
              {{ totalSales*30 - totalSales*10 }} KW/H ENERGIE
          </div>
        </div> -->
        <div v-if="isprofileMenuOpen" class="menu">
      <!-- List of items in the menu -->
        <p>Profile</p>
      
    </div>
      </div>
    
      <!--sidebar footer with customer id and logout-->
      <div v-if="isLoggedIn" class="profile">
        <div class="profile-details">
          <!-- <img id=sidebarProfile v-bind:src="profilePic" alt="profileImg"   @mouseover="toggleMenu" @mouseleave="toggleMenu" @click.prevent="gototprofile" src="profile-picture.jpg" style="cursor: pointer;"> -->
     
          <div class="name_job">
            <div class="name" @mouseover="toggleMenu" @mouseleave="toggleMenu" @click.prevent="gototprofile" style="cursor:pointer;">
              {{ organizationName }}
            </div>
            <div class="job">
              {{ customerID }}
            </div>
            <!-- <img id="logo" src="../Logo-Kuehlmann.png" alt="profileImg" @mouseover="toggleMenu" @mouseleave="toggleMenu" @click.prevent="gototprofile" style="cursor: pointer;"> -->
          </div>
        </div>
        <i v-if="isExitButton" class="bx bx-log-out" id="log_out" @click.prevent="logout"></i>
      </div>
    </div>
  </div>
  <div>
    <Footer/>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import Fingerprint2 from 'fingerprintjs2';
import Footer from '@/components/Footer.vue'
export default {
  name: 'SidebarMenu',
  props: {
    //! Menu settings
    isMenuOpen: {
      type: Boolean,
      default: true,
    },
    menuTitle: {
      type: String,
      default: 'Company',
    },

    isPaddingLeft: {
      type: Boolean,
      default: true,
    },
    menuOpenedPaddingLeftBody: {
      type: String,
      default: '250px'
    },
    menuClosedPaddingLeftBody: {
      type: String,
      default: '78px'
    },
    //! Menu items
    menuItems: {
      type: Array,
      default: () => [
        // {
        //   link: '/#/home',
        //   name: "Dashboard",
        //   icon: 'bx-grid-alt',
        // },
        {
          link: '/#/machines',
          name: 'Termin buchen',
          image: 'https://container-hygiene.de/webapps/customerapp/icons8-person-calendar-100-2.png',
        },
        {
          link: '/#/bookedappointment',
          name: 'Kalender',
          image: 'https://container-hygiene.de/webapps/customerapp/icons8-tear-off-calendar-100.png',
        },
        // {
        //   link: '/#/profile',
        //   name: 'Profil',
        //   icon: 'bx-user',
        // },
        {
          link: '/#/license',
          name: 'Fuhrpark',
          image: 'https://container-hygiene.de/webapps/customerapp/icons8-truck-100.png',
        },
        // {
        //   link: '/#/addlicense',
        //   name: 'Lizenzen hinzufügen',
        //   icon: 'bx-add-to-queue',
        // },
        // {
        //   link: '/#/machines',
        //   name: 'Maschinen',
        //   icon: 'bx bxs-bot',
        // },
      
      
        {
          link: '/#/certificates',
          name: 'Zertifikate',
          image: 'https://container-hygiene.de/webapps/customerapp/icons8-certificate-100.png',
        },
        // {
        //   link: '/#/report',
        //   name: 'Nachhaltigkeit',
        //   icon: 'bx-book',
        // },
       
         {
           link: '/#/messages',
           name: 'Nachrichten',
           image: 'https://img.icons8.com/ios/100/FFFFFF/download-mail.png',
        },
        {
          link: '/#/report',
          name: 'Nachhaltigkeit',
          image: 'https://container-hygiene.de/webapps/customerapp/icons8-leaf-100-1.png',
        },
        {
          link: '/#/contact',
          name: 'Service',
          image: 'https://container-hygiene.de/webapps/customerapp/icons8-support-100.png',
        },
       
        

      ],
    },
    isExitButton: {
      type: Boolean,
      default: true,
    },
    isLoggedIn: {
      type: Boolean,
      default: true,
    },
    //! Styles
    bgColor: {
      type: String,
      default: '#11101d',
    },
    secondaryColor: {
      type: String,
      default: '#1d1b31',
    },
    homeSectionColor: {
      type: String,
      default: '#e4e9f7',
    },
    logoTitleColor: {
      type: String,
      default: '#fff',
    },
    iconsColor: {
      type: String,
      default: '#fff',
    },
    itemsTooltipColor: {
      type: String,
      default: '#e4e9f7',
    },
    searchInputTextColor: {
      type: String,
      default: '#fff',
    },
    // menuItemsHoverColor: {
    //   type: String,
    //   default: 'crimson',
    // },
    menuItemsTextColor: {
      type: String,
      default: '#fff',
    },
    menuFooterTextColor: {
      type: String,
      default: '#333',
    },
  },
  data() {
    return {
      currentOrientation: this.getOrientation(),
      isprofileMenuOpen: false,
      isOpened: false,
      customerID: '',
      customerRole: '',
      profilePic: '',
      fingerprint: '',
      totalSales: '',
      showName:'',
      organizationName: '',
    }
  },
  components:{
    Footer
  },
  mounted() {
    axios.post(process.env.VUE_APP_HOST + '/suntainability', {
        sessionToken: localStorage.getItem('token')
      }).then((res)=>{
        this.totalSales = ''
        this.totalSales = res.data.total
      })
    if (window.innerWidth < 1200) {
      this.isOpened = !this.isMenuOpen
      window.document.body.style.paddingLeft = this.isOpened && this.isPaddingLeft ? this.menuOpenedPaddingLeftBody : this.menuClosedPaddingLeftBody
    }
    else {
      this.isOpened = this.isMenuOpen
    }
    axios.get(process.env.VUE_APP_HOST + '/user', { headers: { token: localStorage.getItem('token') } }).then(res => {
     if(res.status === 200){
        this.customerID = res.data.user.customerID
        this.lastName = res.data.user.lastName
        this.customerRole = res.data.user.role
        this.profilePic = res.data.user.profilePicture
        let tempName = res.data.user.organizationName.split(' ')
        this.organizationName = ''
        for (let i = 0; i < tempName.length; i++) {
          if (i < 0) {
            this.organizationName += tempName[i]
          }
          else {
            this.organizationName += tempName[i].charAt(0)  
          }
        }
        console.log(this.organizationName)
     }
    }, (err)=>{
      this.$router.push('/').then(() => {
        window.location.reload()
      })
    })
  },
  computed: {
    cssVars() {
      return {
        // '--padding-left-body': this.isOpened ? this.menuOpenedPaddingLeftBody : this.menuClosedPaddingLeftBody,
        '--bg-color': this.bgColor,
        '--secondary-color': this.secondaryColor,
        '--home-section-color': this.homeSectionColor,
        '--logo-title-color': this.logoTitleColor,
        '--icons-color': this.iconsColor,
        '--items-tooltip-color': this.itemsTooltipColor,
        '--serach-input-text-color': this.searchInputTextColor,
        '--menu-items-hover-color': this.menuItemsHoverColor,
        '--menu-items-text-color': this.menuItemsTextColor,
        '--menu-footer-text-color': this.menuFooterTextColor,
      }
    },
  },
  watch: {
    isOpened() {
    if (window.innerWidth < 767) {
      if (this.isOpened) {
        // For mobile view, when the sidebar is open, set the body's paddingLeft to 0.
        window.document.body.style.paddingLeft = '10';
      } else {
        // For mobile view, when the sidebar is closed, set the body's paddingLeft to the menu's width.
        window.document.body.style.paddingLeft = '10';
      }
    } else {
      // For desktop view, reset the body's paddingLeft to its default value.
      window.document.body.style.paddingLeft = this.isOpened && this.isPaddingLeft ? this.menuOpenedPaddingLeftBody : this.menuClosedPaddingLeftBody

    }
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
    gotodashboard(){
      this.$router.push('home')
    },
    gototprofile(){
      this.$router.push('profile')
    },
    toggleMenu() {
      this.isprofileMenuOpen = !this.isprofileMenuOpen;
    },
    logout() {
      axios.post(process.env.VUE_APP_HOST + '/logout', { fingerprint: this.fingerprint, sessionToken: localStorage.getItem('token') }).then((res) => {
        console.log('logout', res)
      })
      window.document.body.style.paddingLeft = '0px'

      localStorage.setItem('token',"")

      this.$router.push('/')

    },

    closeSidebar() {
      if (window.innerWidth < 767) {
        this.isOpened = false
        window.document.body.style.paddingLeft = this.isOpened && this.isPaddingLeft ? this.menuOpenedPaddingLeftBody : this.menuClosedPaddingLeftBody

      }
    }
  },
  created() {
    if (localStorage.getItem('token') === null) {
      let query = this.$route.query;
              console.log(query)
                if(query.calendar=="true"){
                  //setting the localstorage for re routing to the calendar page
                  localStorage.setItem('calendar', 'true')
                  this.$router.push('/').then(() => {
             window.location.reload()
      })
                }
                else{
                  this.$router.push('/').then(() => {
        window.location.reload()
      })
                }

      
    }
    else {
      Fingerprint2.get((components) => {
        const values = components.map(component => component.value);
        const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
        this.fingerprint = fingerprint;
        let sessionData = {
          fingerprint: fingerprint,
          token: localStorage.getItem('token')
        }
        axios.post(process.env.VUE_APP_HOST + '/sessionCheck', sessionData).then((res, err) => {
          if (res.status === 200) {
            console.log("Ok")
          }
        },
          (err) => {
            //alert('Sitzung beendet! Bitte loggen Sie sich erneut ein.')
            this.$router.push('/').then(() => {
               //alert('Bitte loggen Sie sich ein')
              window.document.body.style.paddingLeft = '0px'
              let query = this.$route.query;
              console.log(query)
                if(query.calendar=="true"){
                  //setting the localstorage for re routing to the calendar page
                  localStorage.setItem('calendar', 'true')
                }
              //clear only token
              localStorage.setItem('token', "")
            })
          })
      })
    }
    window.addEventListener('orientationchange', this.handleOrientationChange);

  },
  destroyed() {
    // Remove the event listener when the component is destroyed
    window.removeEventListener('orientationchange', this.handleOrientationChange);
  },

}
</script>

<style>
#namepopup{
  background-color: #97bf0d;
  color: white;
}
 .first-item {
    font-size: 30px !important;
    border: 3px solid white;
   

  }
  .last-item{
    font-size: 30px !important;
    border: 3px solid white;


  }

#closedIcons:hover{
  cursor: pointer;
  background-color: transparent;
}
.a{
  font-family: 'Oswald';

}
.menudItemsclosedBorder a{
  margin-bottom:127%; 
}
.menudItemsBorder a{
  padding: 3%;
  border-radius: 12px;
  
  margin-bottom:7%; 
  background-color:#7d9f08;


}
#menuImages{
  margin-right: 4%;
}

.menu {
  position: absolute;
  top: 90%;
  left: 10%;
  color: white;
}


.menu:hover {
  background-color: #97bf0d;
  color: white;
  cursor: pointer;
}
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
@import url('https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css');
#savingdisplay {
  color: #eeeeee;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Oswald', sans-serif;
}

#sidebarProfile {
  height: 48px;
  width: 48px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
  border-radius: 48%;
}
#sidebarProfile:hover {
  height: 49px;
  width: 49px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
  border-radius: 48%;
}

body {
  transition: all 0.5s ease;
}

.menu-logo {
  width: 30px;
  margin: 0 10px 0 10px;
  background: #97bf0d;
}

.sidebar {

  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  min-height: min-content;
  /* overflow-y: auto; */
  width: 78px;
  background: #97bf0d;
  /* padding: 6px 14px 0 14px; */
  z-index: 111;
  transition: all 0.5s ease;
}

.sidebar.open {
  width: 250px;
}

.sidebar .logo-details {
  height: 60px;
  display: flex;
  align-items: center;
  position: relative;
}

.sidebar .logo-details .icon {
  opacity: 0;
  transition: all 0.5s ease;
}

.sidebar .logo-details .logo_name {
  color: white;
  font-size: 20px;
  font-weight: 600;
  opacity: 0;
  transition: all 0.5s ease;
}

.sidebar.open .logo-details .icon,
.sidebar.open .logo-details .logo_name {
  opacity: 1;
}

.sidebar .logo-details #btn {
  position: absolute;
  top: 50%;
  right: 0;

  transform: translateY(-50%);
  font-size: 22px;
  transition: all 0.4s ease;
  font-size: 22px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s ease;
}

.sidebar.open .logo-details #btn {
  text-align: right;
  color: white;
}

.sidebar i {
  color: white;
  height: 60px;
  min-width: 35px;
  font-size: 28px;
  text-align: center;
  line-height: 60px;
}

.sidebar .nav-list {
  margin-top: 80px;
  position: relative;
  right: 20px
    /* margin-bottom: 60px; */
    /* height: 100%; */
    /* min-height: min-content; */
}

.sidebar li {
  position: relative;
  margin: 6px;
  list-style: none;
  margin-left: 2px;
}

.sidebar li .tooltip {
  position: absolute;
  top: -20px;
  left: calc(100% + 15px);
  z-index: 3;
  background: var(--items-tooltip-color);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 15px;
  opacity: 0;
  white-space: nowrap;
  pointer-events: none;
  transition: 0s;
}

.sidebar li:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
  transition: all 0.4s ease;
  top: 50%;
  transform: translateY(-50%);
}

.sidebar.open li .tooltip {
  display: none;
}

.sidebar input {
  font-size: 15px;
  color: var(--serach-input-text-color);
  font-weight: 400;
  outline: none;
  height: 50px;
  width: 100%;
  width: 50px;
  border: none;
  border-radius: 12px;
  transition: all 0.5s ease;
  background: var(--secondary-color);
}





.sidebar li a {
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  margin-left: 0;
  align-items: center;
  text-decoration: none;


}
.openedItems:hover{
  background: transparent !important;
  background-color: #97bf0d !important;
  font: 'Oswald' !important;
  width: 100%;
  z-index: 1;
}
.sidebar li a:hover {
  background: #eeeeee;
  font: 'Oswald' !important;
  width: 100%;
}
.sidebar li a .links_name {
  color: white;
  position: relative;
  font-size: 14px;
  font-weight: 500;
  white-space: wrap;
  opacity: 0;
  pointer-events: none;
  transition: 0.4s;
}


.sidebar.open li a .links_name {
  opacity: 1;
  pointer-events: auto;

  text-align: left;
}

.sidebar li a:hover .links_name,
.sidebar li a:hover i {
  transition: all 0.5s ease;
  color: #97bf0d;
}

.sidebar li i {
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  border-radius: 12px;
}


.sidebar div.profile {
  position: relative;
  height: 54px;
  width: 78px;
  /* left: 0;
    bottom: 0; */
  padding: 10px 14px;
  background: white;
  transition: all 0.5s ease;
  overflow: hidden;
}

.sidebar.open div.profile {
  width: 250px;
}

.sidebar div .profile-details {
  display:flex;
  align-items: center;
  flex-wrap: nowrap;
}

#logo {
 
  width: 50%;
  aspect-ratio: 3/1;
  object-fit: cover;
  text-align: left;
  float: left;


}
#logo:hover {
  height: 48px;
  width: 48px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 30px;
  cursor: pointer;

}

.sidebar div.profile .name,
.sidebar div.profile .job {
  font-size: 15px;
  font-weight: 400;
  color: #97bf0d;
  white-space: nowrap;
  text-align: left;
}

.sidebar div.profile .job {
  font-size: 12px;
}

#log_out{
  height: 100px;
}
.sidebar .profile #log_out {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: #e7071d;
  width: 100%;
  height: 60px;
  line-height: 60px;
  border-radius: 0px;
  transition: all 0.5s ease;
  cursor: pointer;
}
#menuImages{
  margin-right: 4%;
}


.sidebar.open .profile #log_out {
  width: 50px;
  background: #e7071d;
  opacity: 1;
}

.sidebar.open .profile:hover #log_out {
  opacity: 1;
}

.sidebar.open .profile #log_out:hover {
  opacity: 1;
  color: white;
}

.sidebar .profile #log_out:hover {
  color: red;
}

.home-section {
  position: relative;
  background: var(--home-section-color);
  min-height: 100vh;
  top: 0;
  left: 78px;
  width: calc(100% - 78px);
  transition: all 0.5s ease;
  z-index: 2;
}

.sidebar.open~.home-section {
  left: 250px;
  width: calc(100% - 250px);
}

.home-section .text {
  display: inline-block;
  color: var(--bg-color);
  font-size: 25px;
  font-weight: 500;
  margin: 18px;
}

#sidebarName{
  margin-right: 10px;
  margin-bottom: 10px;
}

#my-scroll::-webkit-scrollbar {
  display: none;
  /* background-color: rgba(255, 255, 255, 0.2); 
    width: 10px;
    border-radius:5px  */
}



/* #my-scroll::-webkit-scrollbar-thumb{
    background-color: red;
    border-radius:5px 
  }
  #my-scroll::-webkit-scrollbar-button:vertical:start:decrement{
    display:none;
  }
  #my-scroll::-webkit-scrollbar-button:vertical:end:increment{
    display:none;
  } */
@media (max-width: 575.98) {
  .sidebar li .tooltip {
    display: none;
  }
  .sidebar div.profile {
    height: 60px;
    text-align: left;
  }

  .sidebar .profile #log_out {
    height: 63px;
  }
}

@media (max-width: 575.98) {
  .sidebar {
    width: 200px;
    height: 100vh;
    position: relative;
    z-index: 111;
  }

  .sidebar a {
    float: left;
  }

  div.content {
    margin-left: 0;
  }
  .sidebar div.profile {
    height: 90px;
    text-align: left;
  }
  .sidebar .profile #log_out {
    height: 63px;
  }
}

#log_out {
  background-color: #97bf0d;
}

.profile-details {
  margin-bottom: 50px;
}
</style>

