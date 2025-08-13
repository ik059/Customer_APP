<template>
  <div translate="no" id="back">
    <div v-if="searching" style="background-color: white ;">
      <div class="saving-overlay">
        <div class="saving-animation">
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
        </div>
      </div>
      <img
        src=""
        alt="logo"
        style="width: 300px; aspect-ratio: 3/1; position: absolute; top:65%; left: 50%; transform: translate(-50%, -50%);"
        
      />
    </div>

    <div v-else>
      <div id="certificate" v-if="certificateDetails.certificateID">
        <div id="headerSection">
        <div id="certificateheading">
            <h1 id="header">REINIGUNGSNACHWEIS</h1>
        </div>
        <div id="logoQr">
              <div>
                <qrcode-vue
                  :value="`${process.env.VUE_APP_HOST}/#/certificate/pdf/?certificate=${certificateID}`"
                  :size="size"
                  level="H"
                />
              </div>
       
        </div>
        <div>
          <img
            id="sticker"
            src="https://container-hygiene.de/webapps/customerapp/Screenshot-2023-11-13-at-15-57-43.png"
            alt="Screenshot-2023-11-13-at-15-57-43"
            border="0"
          />
        </div>
      </div>
        <div id="webLook">
          
          <br />

          <div id="certificationDetails">
            <p id="samefontsize1" style="color: #575656"  v-if="certificateDetails.customerFirstname">
              Folgendes Fahrzeug der Firma :
            </p>
            <p  v-else id="samefontsize1" style="color: #575656">Dieses Zertifikat bezieht sich auf:</p>
            <p class="kunde" v-if="certificateDetails.organizationName">
              {{
                certificateDetails.organizationName
              }}
            </p>
            <p
              class="truck"
              :class="{ kunde: !certificateDetails.organizationName }"
            >
              {{ certificateDetails.license }}
            </p>
            
            <!-- {{ new Date(parseInt(certificateDetails.issuedDate)).toLocaleDateString()}} -->
            <p>
              wurde auf Grund des Grads der Verschmutzung und der Vor- und Nachladung mit folgendem Reinigungs- und Desinfektionsprogramm gereinigt:
            </p>
            <p class="kunde" id="washNAme">
              {{washType}}
            </p>
          </div>
          <p>Nach folgenden Normen und Richtlinien wurde gereinigt:</p>

          <div id="certificateDetails">

            <h3
              class="iso oswald-font"
              style="text-align: left; color: #97bf0d"
            >
              <strong v-html="washText"></strong
              >
            </h3>
          </div>
          <div id="certificationText">
            <div>
              <div class="bottomimage">
                <p class="f" id="paratext">
              {{ certificateText }}
                </p>  
              
              </div>
            </div>
           
          </div>
    
          <div class="container" style="color: #575656" id="crD">
            <div class="row">
             <p>Datum: {{cgangeDateFormat(parseInt(certificateDetails.issuedDate))}}, {{ changeTimeFormat(parseInt(certificateDetails.issuedDate)) }} Uhr</p>
             <p>Maschine: {{machineID}}, {{ machineAddress }}</p>
            </div>
            <div class="row">
              <div class="column">Load 1</div>
              <div class="column">Load 2</div>
            </div>
            <div class="row">
              <div class="column">Load ID</div>
              <div class="column">Load ID</div>
            </div>
          </div>

       
         
          <br />
          <div id="rowField">
        <div style="margin-top: 5px; margin-right: 18% !important">
          <img
          style="width: 180px;aspect-ratio:3/0.9; margin-right: 18% !important; margin-top:-5px"
          src="-"
        />
          <div id="signatureUnderLine"></div>
          <p id="boldText" style="margin: 0 !important">-<br/>-</p>
        </div>
        <div>
          <img
            id="certificateSticker"
            :src="certificateImageUrl"
          />
        </div>
      </div>
          <div>
            <!-- <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus ducimus voluptate unde
                        mollitia et </p> -->
            <br />
       
            <div style="text-align:center !important;">
        <p style="text-decoration:underline;text-align:center !important; font-size: xx-small;">Die Echtheit dieses Zertifikats können Sie auf {{process.env.VUE_APP_HOST}}/#/validate überprüfen
          ID:{{certificateID}}
          </p>
      </div>
            <img id="logo" src="-" />
       
          </div>
        </div>
        
      </div>
      <div v-else id="notFound">
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
          "
        >
          <p id="nocertificatetext">No Certificate Found!</p>
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/017/172/388/small/warning-message-concept-represented-by-exclamation-mark-icon-exclamation-symbol-in-circle-png.png"
            alt="not found"
            style="height: 100px; width: 100px; margin-left: 37%"
            id="cautionANimation"
          />
          <img
            src="-"
            alt="logo"
            style="width: 300px; aspect-ratio: 3/1"
          />
        </div>
      </div>
    </div>
  </div>

  <div>
    <hr />
    <!-- <div>
          <button class="btn btn-primary" style="background-color: #97bf0d;" @click="exportToPDF(certificateDetails)">
            {{ $t("downloadPdf") }}
          </button>
        </div> -->
  </div>
</template>
<script>
import axios from "axios";
import html2pdf from "html2pdf.js";
import QrcodeVue from "qrcode.vue";
import { DateTime } from 'luxon';

export default {
  name: "CertificatePDF",
  components: {
    QrcodeVue,
  },
  data() {
    return {
      certificateText:"",
      washType:"",
      washText:"",
      certificateImageUrl:"",
      searching: true,
      certificateID: "",
      certificateDetails: [],
      machineAddress:'',
      //value: `http://localhost:8080/#/certificate/pdf/?certificate=${certificateID}`,
      size: 100,
      isPhone: false,
      phoneSize: 50,
      isTab: false,
      isBisscreen: false,
      date: "",
      machineName: "",
      machineID:""
    };
  },
  methods: {
    cgangeDateFormat(date){
     //return new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const iso = DateTime.fromMillis(date, { zone: 'Europe/Berlin' });
      return iso.toFormat('dd.MM.yyyy'); // Extract date part in dd.MM.yyyy format
    },
    changeTimeFormat(date) {
      //return new Date(date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false });
      const iso = DateTime.fromMillis(date, { zone: 'Europe/Berlin' });
      return iso.toFormat('HH:mm'); // Extract time part in HH:mm format
    },
    exportToPDF(certificateDetails) {
      console.log(certificateDetails.customerFirstname);
      axios
        .post(`${process.env.VUE_APP_HOST}/downloadcertificate`, {
          certificateDetails: certificateDetails,
          washType: this.washType,
          machineAddress: this.machineAddress,
          machineName: this.machineID,
        },{ responseType: 'blob' })
        .then((response) => {
          // Handle successful response, e.g., downloading the PDF
          // For example, you can create a Blob from the response data and download it
          const blob = new Blob([response.data], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${this.washType}_${certificateDetails.certificateID}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch((error) => {
          // Handle error
          console.error("Error exporting to PDF:", error);
        });
    },
  },
  mounted() {
    console.log("ok");

    if (window.innerWidth < 767) {
      this.isPhone = true;
      this.size = 40;
    } else if (window.innerWidth > 769 && window.innerWidth < 1024) {
      console.log("a");
      this.isTab = true;
    } else {
      this.isBisscreen = true;
    }
    console.log("1", this.$route.query);
    this.certificateID = this.$route.query.certificate;
    console.log("X", this.certificateID);

    axios
      .post(process.env.VUE_APP_HOST + "/certificatedetails", {
        certificateID: this.certificateID,
      })
      .then((res) => {
        this.machineID = res.data.machineID
        if(res.data.trailerType){
          this.washType = res.data.washType +" - " + res.data.trailerType + "" 
        }
        else{
          this.washType = res.data.washType + "" 
        }
        axios.post(process.env.VUE_APP_HOST + "/getMachineAddress", {
          machineID : res.data.machineID
        }).then((res) => {
          this.machineAddress = res.data.address;
          this.machineName = res.data.machineName;
        });
      
        console.log(res.data);
        this.certificateDetails = res.data;
        if(res.data.certificateID == 'ZAB9WpHxC5Ka'){
          this.certificateDetails.customerFirstname = "Tönnies Holding"
          this.certificateDetails.customerLastname = "ApS & Co. KG"
        }
        console.log(res.data);
        let timestamp = new Date(res.data.issuedDate);
        let date = timestamp.getDate();
        let month = timestamp.getMonth() + 1;
        let year = timestamp.getFullYear();
        this.date = date + "/" + month + "/" + year;
        let hours = timestamp.getHours();
        let minutes = timestamp.getMinutes();
        console.log(hours, minutes);
        if(res.data.washType == "Professional_Top_Extra_Water"){
          this.washType = "Doppelstockbalken - Professional +1"
          this.washText = "Verfahren nach DIN 10516 und EN 13486<br/> Gutachten nach DIN EN 1276, 1650, 14476"
          this.certificateImageUrl = "https://container-hygiene.de/webapps/certificate/professionalplus"
          this.certificateText = "Als Reinigungs- und Desinfektionsmittel wurde Lerades® CSR 511 nach Angaben des Herstellers STOCKMEIER Chemie GmbH & Co. KG angewendet. Diese Reinigung entspricht einer Zwischenreinigung groß nach SOP „Reinigungsanweisung für Innenreinigung von Kühlkofferaufbauten im Lebensmitteltransport“ vom Bundesverband Güterkraftverkehr Logistik und Entsorgung e. V. und TRANSFRIGOROUTE DEUTSCHLAND e. V.."
          
        }
        else if(res.data.washType == "Professional_Top"){
          this.washType = "Doppelstockbalken - Professional"
          this.washText = "Verfahren nach DIN 10516 und EN 13486<br/> Gutachten nach DIN EN 1276, 1650, 13697"
          this.certificateImageUrl = "https://container-hygiene.de/webapps/certificate/basic"
          this.certificateText = "Als Reinigungs- und Desinfektionsmittel wurde Lerades® CSR 511 nach Angaben des Herstellers STOCKMEIER Chemie GmbH & Co. KG angewendet. Diese Reinigung entspricht einer Zwischenreinigung groß nach SOP „Reinigungsanweisung für Innenreinigung von Kühlkofferaufbauten im Lebensmitteltransport“ vom Bundesverband Güterkraftverkehr Logistik und Entsorgung e. V. und TRANSFRIGOROUTE DEUTSCHLAND e. V.."   
        }
        else if(res.data.washType == "Basic_Top"){
          this.washType = "Doppelstockbalken - Basic"
          this.washText = "Verfahren nach DIN 10516 und EN 13486<br/> Gutachten nach DIN EN 1276, 1650,14476"
          this.certificateImageUrl = "https://container-hygiene.de/webapps/certificate/basic"
          this.certificateText = "Als Reinigungs- und Desinfektionsmittel wurde Lerades® CSR 511 nach Angaben des Herstellers STOCKMEIER Chemie GmbH & Co. KG angewendet. Diese Reinigung entspricht einer Zwischenreinigung klein nach SOP „Reinigungsanweisung für Innenreinigung von Kühlkofferaufbauten im Lebensmitteltransport“ vom Bundesverband Güterkraftverkehr Logistik und Entsorgung e. V. und TRANSFRIGOROUTE DEUTSCHLAND e. V.."
        }
        else if(res.data.washType == "Basic_Floor"){
          this.washType = "Fleischhängebahn - Basic"
          this.washText = "Verfahren nach DIN 10516 und EN 13486<br/> Gutachten nach DIN EN 1276, 1650,14476"
          this.certificateImageUrl = "https://container-hygiene.de/webapps/certificate/basic"
          this.certificateText = "Als Reinigungs- und Desinfektionsmittel wurde Lerades® CSR 511 nach Angaben des Herstellers STOCKMEIER Chemie GmbH & Co. KG angewendet. Diese Reinigung entspricht einer Zwischenreinigung klein nach SOP „Reinigungsanweisung für Innenreinigung von Kühlkofferaufbauten im Lebensmitteltransport“ vom Bundesverband Güterkraftverkehr Logistik und Entsorgung e. V. und TRANSFRIGOROUTE DEUTSCHLAND e. V.."
        }
        else if(res.data.washType == "Professional_Floor"){
          this.washType = "Fleischhängebahn - Professional"
          this.washText = "Verfahren nach DIN 10516 und EN 13486<br/> Gutachten nach DIN EN 1276, 1650, 13697"
          this.certificateImageUrl = "https://container-hygiene.de/webapps/certificate/basic"
          this.certificateText = "Als Reinigungs- und Desinfektionsmittel wurde Lerades® CSR 511 nach Angaben des Herstellers STOCKMEIER Chemie GmbH & Co. KG angewendet. Diese Reinigung entspricht einer Zwischenreinigung mittel nach SOP „Reinigungsanweisung für Innenreinigung von Kühlkofferaufbauten im Lebensmitteltransport“ vom Bundesverband Güterkraftverkehr Logistik und Entsorgung e. V. und TRANSFRIGOROUTE DEUTSCHLAND e. V.."
        }
        else if(res.data.washType == "Professional_Floor_Extra_Water"){
          this.washType = "Fleischhängebahn - Professional +1"
          this.washText = "Verfahren nach DIN 10516 und EN 13486<br/> Gutachten nach DIN EN 1276, 1650, 14476"
          this.certificateImageUrl = "https://container-hygiene.de/webapps/certificate/professionalplus"
          this.certificateText = "Als Reinigungs- und Desinfektionsmittel wurde Lerades® CSR 511 nach Angaben des Herstellers STOCKMEIER Chemie GmbH & Co. KG angewendet. Diese Reinigung entspricht einer Zwischenreinigung mittel nach SOP „Reinigungsanweisung für Innenreinigung von Kühlkofferaufbauten im Lebensmitteltransport“ vom Bundesverband Güterkraftverkehr Logistik und Entsorgung e. V. und TRANSFRIGOROUTE DEUTSCHLAND e. V.."
        }
        else{
          //this.washType = "Basic"
          //this.washText = "Verfahren nach DIN 10516 und EN 13486<br/> Gutachten nach DIN EN 1276, 1650, 14476"
          //this.certificateImageUrl = "https://container-hygiene.de/webapps/certificate/basic"
          //his.certificateText = "Als Reinigungs- und Desinfektionsmittel wurde Lerades ® CSR 511 nach Angaben des Herstellers STOCKMEIER Chemie GmbH & Co. KG angewendet. Diese Reinigung entspricht einer Zwischenreinigung groß nach SOP„Reinigungsanweisung für Innenreinigung von Kühlkofferaufbauten im Lebensmitteltransport“ vom BundesverbandGüterkraftverkehr Logistik und Entsorgung e. V. und TRANSFRIGOROUTE DEUTSCHLAND e. V.."
          this.washText = "Verfahren nach DIN 10516 und EN 13486<br/> Gutachten nach DIN EN 1276, 1650, 14476"
          this.certificateImageUrl = "https://container-hygiene.de/webapps/certificate/basic"
          this.certificateText = "Als Reinigungs- und Desinfektionsmittel wurde Lerades ® CIP 601 nach Angaben des Herstellers STOCKMEIER Chemie GmbH & Co. KG angewendet. Diese Reinigung entspricht einer Zwischenreinigung klein nach SOP „Reinigungsanweisung für Innenreinigung von Kühlkofferaufbauten im Lebensmitteltransport“ vom Bundesverband Güterkraftverkehr Logistik und Entsorgung e. Vu und TRANSFRIGOROUTE DEUTSCHLAND e. V."      
        
        }
        this.searching = false;

        console.log(date);
      });
  },
};
</script>
<style>
#washNAme{
  font-size: 24px;
  font-weight: bold;
}
#certificateSticker {
        width: 300px;
        max-width: 200px;
        aspect-ratio: 3/1;
        margin-top: -10px;
      }
  #rowField {
        width: 100%;
        white-space: nowrap;
      }
      
      #rowField > div {
        display: inline-block;
        vertical-align: top;
        margin-right: 32%;
      }
      
      #signatureUnderLine {
        width: 150px;
        border-bottom: 1px solid black;
      }
#headerSection{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.saving-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.0); /* Semi-transparent overlay */
  z-index: 1; /* Ensure it's on top of other elements */
  opacity: 1 !important; /* Hide it by default */
}

.saving-animation {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-dot {
  width: 12px;
  height: 12px;
  margin: 0 4px;
  background-color: #97bf0d; /* You can customize the color */
  border-radius: 50%;
  animation: bounce 0.5s ease-in-out infinite alternate;
}

@keyframes bounce {
  to {
    transform: translateY(-8px);
  }
}
@media (min-width: 1600px) {
  #certificate {
    width: 40% !important;
    padding: 5%;
    margin: auto;
    background-color: white;
  }
  #logo {
    width: 25%;
    margin-top: 5% !important;
    margin: auto;
    aspect-ratio: 3/0.9;
  }
}
#cautionANimation {
  animation: caution 1s infinite;
}
@keyframes caution {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
* {
  font-family: "Oswald";
}
#nocertificatetext {
  text-align: center;
  font-size: 20px;
  color: red;
}
#notFound {
  text-align: center;
  font-size: 20px;
  color: red;
  background-color: white;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
}
p {
  text-align: left;
  color:black !important;
}
u {
  text-align: left !important;
  
}
#certificate {
  width: 60%;
  padding: 5%;
  margin: auto;
  background-color: white;
}
#certificationText {
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: left;
  text-align: left;
}
#logoQr {
  margin-top: 1%;
  margin-left: 5%;
}
#certificateheading {
  text-align: left;
}
#sticker {
  height: 130px;
  float: right;
}
#header {
  text-align: left;
  color: #97bf0d;
  text-decoration: underline;
  font-weight: bolder;
  font-size: 40px;
}
#certificationDetails {
  color: #97bf0d;
}
.truck {
  color: #97bf0d !important;
  font-size: 20px;
  font-weight: normal;
  text-align: left;
}
.kunde {
  color: #97bf0d !important;
  font-size: 30px;
  font-weight: bold;
  text-align: left;
}
.textnew {
  color: #97bf0d;
  text-align: left;
}
.container {
  text-align: left;
  display: flex;
  justify-content: flex-start;
  align-items: left;
  text-align: left;
  margin-left: 0;
}
.row {
  margin-left: 0;
  margin-right: 20%;
  color: black !important;
}
.row {
  margin-left: 0;
  margin-right: 10%;
  color: black !important;
}
#signatures {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#signature {
  margin-top: 10%;
  width: 70%;
}
#signandsill {
  display: flex;
  flex-direction: row;
}
.vertical-line {
  border-top: 2px solid #97bf0d; /* Adjust the color as needed */
  width: 87%; /* Adjust the width as needed */
}
#logo {
  width: 25%;
  margin: auto;
  aspect-ratio: 3/0.9;
}
#samefontsize1 {
  font-size: 110%;
}
#back {
  width: 100%;
  height: 100%;
  background-color: grey;
}
#signHolder {
  font-size: 75%;
}
@media (max-width: 1024px) {
  #samefontsize1 {
    font-size: 110%;
  }
  #certificate {
    width: 90%;
    padding: 3%;
    margin: auto;
    background-color: white;
  }
  .vertical-line {
    border-top: 2px solid #97bf0d; /* Adjust the color as needed */
    width: 99%; /* Adjust the width as needed */
  }
  #sticker {
    height: 150px;
    float: right;
  }
  #logo {
    width: 30%;
    height: 5vh;
    aspect-ratio: 3/1.5;
  }
  #signandsill {
    display: flex;
    flex-direction: row;
  }
  #signHolder {
    font-size: 71%;
  }
  #signatures {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-width: 85%;
  }
}
@media (max-width: 575.98px) {
  #washNAme{
    font-size: 16px;
    font-weight: bold;
  }
  #certificate {
    width: 100%;
    padding: 3%;
    margin: auto;
    background-color: white;
  }
  #boldText{
    font-size: smaller;
  }
  .vertical-line {
    border-top: 1px solid #97bf0d; /* Adjust the color as needed */
    width: 70%; /* Adjust the width as needed */
  }
  #samefontsize1 {
    font-size: 8px !important;
  }
  #sticker {
    height: 10px;
    float: right;
  }
  #header {
    text-align: left;
    color: #97bf0d;
    text-decoration: underline;
    font-weight: bolder;
    font-size: 20px;
  }
  #signatures {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-width: 90%;
  }
  .container {
    font-size: 50%;
  }
  #certificationText {
    font-size: 60%;
  }
  .textnew {
    font-size: 100%;
    font-weight: bold;
  }
  .dinge {
    font-size: 80% !important;
  }
  #signHolder {
    font-size: 25%;
  }
  #crD {
    font-size: 55%;
  }
  #certificateSticker {
        width: 100px;
        max-width: 200px;
        aspect-ratio: 3/1;
        margin-top: -30px;
      }
  #rowField {
        width: 100%;
        white-space: nowrap;
      }
      
      #rowField > div {
        display: inline-block;
        vertical-align: top;
        margin-right: 20%;
      }
      
      #signatureUnderLine {
        width: 150px;
        border-bottom: 1px solid black;
      }
      .row {
  margin-left: 0;
  margin-right: 10%;
  color: black !important;
}
#sticker {
  height: 50px;
  float: right;
}
.kunde {
  color: #97bf0d !important;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}
h3{
  font-size: 20px;
}
}
</style>
