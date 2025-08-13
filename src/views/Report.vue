<template>
    <div class="hello">
      <Sidebar />
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
      <div class="main" v-else>
        <div class="frame-23">
      <div>Nachhaltigkeitsbericht</div>
    </div>
        <div style="background-color:#97bf0d; border-radius: 10px !important;" id="firstContainer"> 
          <br v-if="tablet"/>
      
       
        <p style="color:white; font-size:25px;">Sie haben gespart:</p>
        <div class="container">
          <div class="item item1-left">
            <div class="big-number">
              <img src="https://container-hygiene.de/webapps/customerapp/Icon1.png" alt="Icon1" id="flask">
            </div>
            <div class="item-content">
              <br v-if="tablet"/>
              <h2>{{ totalSales*50 - totalSales*20 }}</h2>
              <h3 class="item-text">LITER <br v-if="tablet"/>CHEMIE</h3>
            </div>
          </div>
          <div class="item-separator"></div>
  
          <div class="item item1-left">
            <div class="big-number">
              <img src="https://container-hygiene.de/webapps/customerapp/Icon2.png" alt="Icon2" id="flask" />
            </div>
            <div class="item-content">
              <br v-if="tablet"/>
              <h2>{{ totalSales*60 - totalSales*40 }}</h2>
              <h3 class="item-text">LITER <br v-if="tablet"/>WASSER</h3>
            </div>
          </div>
          <div class="item-separator"></div>
  
          <div class="item item1-left">
            <div class="big-number">
              <img src="https://container-hygiene.de/webapps/customerapp/Icon3.png" alt="Icon3" id="flask" />
            </div>
            <div class="item-content">
              <br v-if="tablet"/>
              <h2>{{ totalSales*30 - totalSales*10 }}</h2>
              <h3 class="item-text">KW/H <br v-if="tablet"/>ENERGIE </h3>
            </div>
          </div>
        </div>
      </div>
  
        <div class="container2">
       
        </div>
        <div style="background-color:#97bf0d; border-radius: 10px !important; display: flex; flex-direction: column; justify-content: flex-start;">
          <div style="display: flex; flex-direction:row">
          <div style="display: flex; justify-content: flex-start; margin: 2% 0% 0% 3%;">
            <div class="dropdown left-dropdown">
                <select id="left-select" v-on:change = "dayWiseReport" v-model="selectedYear" @change="yearlyReport">
                  <option disabled="true" value="">Jahr</option>
                  <option value="4">ALL</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
            </div>
          </div>
          <div style="display: flex; justify-content: flex-start; margin: 2% 0% 0% 3%;" v-if="selectedYear !='' && selectedYear != '4'">
            <div class="dropdown left-dropdown">
                <select id="left-select" v-model="selectedMonth"  @change="monthlyReport">
                  <option value="" disabled="true">Monat</option>
                  <option value='1'>January</option>
                  <option value='2'>February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>

                </select>
            </div>
          </div>
        </div>
        
        <div class="container3">
         
          <div class="item item-left" id="chartContainer">
            <div class="box">
              <p style="color:#828282">Chemieverbrauch</p>
              <div style="color:black; font-size:24px;">{{  chemicalData.datasets[0].data[0]+' Liter Chemie' }}</div>
              <BarChart :chart-data="chemicalData" :width="chartWidth" :height="chartHeight" />
  
            </div>
          </div>
          <div class="item" id="chartContainer">
           
            <div class="box">
              <p style="color:#828282">Wasserverbrauch</p>
              <div style="color:black; font-size:24px;">{{  waterData.datasets[0].data[0]+' Liter Wasser' }}</div>
              <PieChart :chart-data="waterData" :width="chartWidth" :height="chartHeight" />
            </div>
          </div>
          <div class="item" id="chartContainer">

            <div class="box">
              <p style="color:#828282"> Energieverbauch</p>
              <div style="color:black; font-size:24px;">{{ energyData.datasets[0].data[0]+' KW/H' }}</div>
              <BarChart :chart-data="energyData" :width="chartWidth" :height="chartHeight" />
            </div>
          </div>
          
        </div>
        <br v-if="tablet"/>
          <br v-if="tablet"/>
          <br v-if="tablet"/>
      </div>
      </div>
    </div>
  </template>
    
  <script>
  import axios from 'axios';
  import Sidebar from '@/components/Sidebar.vue';
  import BarChart from '@/components/BarChart.vue';
  import PieChart from '@/components/PieChart.vue'
  export default {
    name: 'HelloWorld',
    props: {
      msg: String
    },
    components: { Sidebar, BarChart, PieChart },
    data() {
      return {
        isLoading:true,
        ownerCustomer: false,
        chartWidth:250,
        chartHeight:250,
        selectedMonth:'',
        selectedYear: '',
        machineId:'',
        countDay:'',
        owner:{},
        chemicalPercentage: '',
        waterPercentage: '',
        totalSales: '',
        energyPercentage: '',
        chemicalData: {
          labels: ['Chemical Usage'],
          
          datasets: [
            {
              label: 'Company',
              backgroundColor: "#97bf0d", // Set the background color for bars in this dataset
              data: [],
              borderWidth: 2 ,
              borderRadius: 10 ,
              borderSkipped: false,
             
            },
            {
              label: 'Hochdruck-reiniger',
              backgroundColor: '#8C8C8C', // Set a different background color for bars in this dataset
              data: [],
              borderWidth: 2 ,
              borderRadius: 10 ,
              borderSkipped: false ,
              legend: {
                display: false
              } ,
              scales: {
                x: {
                  display: false
                },
                y: {
                  display: false
                }
              }
            }
          ]
        },
        energyData: {
          labels: ['Energy Usage'],
          datasets: [
            {
              label: 'Company',
              backgroundColor: '#97bf0d', // Set the background color for bars in this dataset
              data: [],
              borderWidth: 2 ,
              borderRadius: 10 ,
              borderSkipped: false 
            },
            {
              label: 'Hochdruck-reiniger',
              backgroundColor: '#8C8C8C', // Set a different background color for bars in this dataset
              data: [],
              borderWidth: 2 ,
              borderRadius: 10 ,
              borderSkipped: false 
            }
          ]
        },
        waterData: {
          labels: ['Company', 'Hochdruck-reiniger' ],
          datasets: [
            {
              data: [],
              backgroundColor: ['#97bf0d', '#8C8C8C'] // Colors for each data point
            }
          ]
        },
        tablet: false,
  
      };
    },
    methods:{
      allReport(){
          this.isLoading = true
        axios.post(process.env.VUE_APP_HOST + '/suntainability', {
        sessionToken: localStorage.getItem('token')
      }).then((res)=>{
        this.totalSales = ''
        this.chemicalData.datasets[0].data =[]
        this.chemicalData.datasets[1].data =[]
        this.energyData.datasets[0].data  =[]
        this.energyData.datasets[1].data =[]
        this.waterData.datasets[0].data =[]
        this.totalSales = res.data.total;
        this.chemicalData.datasets[0].data.push(res.data.total * 20);
        this.chemicalData.datasets[1].data.push(res.data.total * 50);
        this.energyData.datasets[0].data.push(res.data.total * 10);
        this.energyData.datasets[1].data.push(res.data.total * 30);
        this.waterData.datasets[0].data.push(res.data.total * 40, res.data.total * 60);
        this.energyPercentage = ((res.data.total * 10) / (res.data.total * 30)) *100
        this.waterPercentage = ((res.data.total * 40) / (res.data.total * 60)) * 100
        this.chemicalPercentage = ((res.data.total * 20)  /(res.data.total * 50)) *100
        
        console.log(this.energyPercentage);
          this.isLoading = false
        console.log(res.data);
      }).catch((err)=>{
        console.log(err);
      })
      },
      getOwnerCustomerReport(){
          this.isLoading = true
        axios.post(process.env.VUE_APP_HOST + '/getownercustomersustainability', {
        sessionToken: localStorage.getItem('token')
      }).then((res)=>{
        this.totalSales = ''
        this.chemicalData.datasets[0].data =[]
        this.chemicalData.datasets[1].data =[]
        this.energyData.datasets[0].data  =[]
        this.energyData.datasets[1].data =[]
        this.waterData.datasets[0].data =[]
        this.totalSales = res.data.total;
        this.chemicalData.datasets[0].data.push(res.data.total * 20);
        this.chemicalData.datasets[1].data.push(res.data.total * 50);
        this.energyData.datasets[0].data.push(res.data.total * 10);
        this.energyData.datasets[1].data.push(res.data.total * 30);
        this.waterData.datasets[0].data.push(res.data.total * 40, res.data.total * 60);
        this.energyPercentage = ((res.data.total * 10) / (res.data.total * 30)) *100
        this.waterPercentage = ((res.data.total * 40) / (res.data.total * 60)) * 100
        this.chemicalPercentage = ((res.data.total * 20)  /(res.data.total * 50)) *100
        
        console.log(this.energyPercentage);
          this.isLoading = false
        console.log(res.data);
      }).catch((err)=>{
        console.log(err);
      })
      },
      //yearlysuntainabilityownercustomer
      yearlyReportCustomer(year, month){
          this.isLoading = true
        axios.post(process.env.VUE_APP_HOST + '/yearlysuntainability', {
        sessionToken: localStorage.getItem('token'), year: this.selectedYear, month: this.selectedMonth
      }).then((res)=>{
        this.totalSales = ''
        this.chemicalData.datasets[0].data =[]
        this.chemicalData.datasets[1].data =[]
        this.energyData.datasets[0].data  =[]
        this.energyData.datasets[1].data =[]
        this.waterData.datasets[0].data =[]
        this.totalSales = res.data.total;
        this.chemicalData.datasets[0].data.push(res.data.total * 20);
        this.chemicalData.datasets[1].data.push(res.data.total * 50);
        this.energyData.datasets[0].data.push(res.data.total * 10);
        this.energyData.datasets[1].data.push(res.data.total * 30);
        this.waterData.datasets[0].data.push(res.data.total * 40, res.data.total * 60);
        this.energyPercentage = ((res.data.total * 10) / (res.data.total * 30)) *100
        this.waterPercentage = ((res.data.total * 40) / (res.data.total * 60)) * 100
        this.chemicalPercentage = ((res.data.total * 20)  /(res.data.total * 50)) *100
        
        console.log(this.energyPercentage);
          this.isLoading = false
        console.log(res.data);
      }).catch((err)=>{
        console.log(err);
      })
      },
      yearlyReportOwnerCustomer(year, month){
          this.isLoading = true
        axios.post(process.env.VUE_APP_HOST + '/yearlysuntainabilityownercustomer', {
        sessionToken: localStorage.getItem('token'), year: this.selectedYear, month: this.selectedMonth
      }).then((res)=>{
        this.totalSales = ''
        this.chemicalData.datasets[0].data =[]
        this.chemicalData.datasets[1].data =[]
        this.energyData.datasets[0].data  =[]
        this.energyData.datasets[1].data =[]
        this.waterData.datasets[0].data =[]
        this.totalSales = res.data.total;
        this.chemicalData.datasets[0].data.push(res.data.total * 20);
        this.chemicalData.datasets[1].data.push(res.data.total * 50);
        this.energyData.datasets[0].data.push(res.data.total * 10);
        this.energyData.datasets[1].data.push(res.data.total * 30);
        this.waterData.datasets[0].data.push(res.data.total * 40, res.data.total * 60);
        this.energyPercentage = ((res.data.total * 10) / (res.data.total * 30)) *100
        this.waterPercentage = ((res.data.total * 40) / (res.data.total * 60)) * 100
        this.chemicalPercentage = ((res.data.total * 20)  /(res.data.total * 50)) *100
        
        console.log(this.energyPercentage);
          this.isLoading = false
        console.log(res.data);
      }).catch((err)=>{
        console.log(err);
      })
      },
      yearlyReport(){
        if(this.selectedYear == '4'){
          if(this.ownerCustomer){
            console.log('ownerCustomer');
            this.getOwnerCustomerReport();
          }
          else{
            this.allReport();
          }
        }else{
            if(this.selectedMonth !=''){
              this.selectedMonth = ''
        }
        if(this.ownerCustomer){
          this.yearlyReportOwnerCustomer(this.selectedYear, this.selectedMonth)
        }
        else{
          this.yearlyReportCustomer(this.selectedYear, this.selectedMonth)
        }
  
      }
      },
      monthlyReport(){
        if(this.selectedYear == '4'){
          //this.allReport()
          if(this.ownerCustomer){
            console.log('ownerCustomer');
            this.getOwnerCustomerReport();
          }
          else{
            this.allReport();
          }
        }else{
          if(this.ownerCustomer){
          this.yearlyReportOwnerCustomer(this.selectedYear, this.selectedMonth)
        }
        else{
          this.yearlyReportCustomer(this.selectedYear, this.selectedMonth)
        }  
      
    }
      },
      // dayWiseReport(){
        
      //   if(this.countDay == 5){
      //     this.previousFiveDaysReport();
      //   }
      //   else if(this.countDay == 15){
      //     this.previousFifteenDaysReport();
      //   }
      //   else if(this.countDay == 30){
      //     this.previousThirtyDaysReport();
      //   }
      //   else{
      //     this.allReport();
      //   }
        
      // },
      // previousFiveDaysReport(){
      //   const currentTimestamp = Date.now()
      //   const currentTime = new Date(currentTimestamp);
  
      //   const day   = currentTime.getDate()-5;
      //   const month = currentTime.getMonth();
      //   const year  = currentTime.getFullYear();
      //   const dateTimeStamp = new Date(year, month, day);
      //   console.log(new Date(dateTimeStamp));
      //   axios.post(process.env.VUE_APP_HOST + '/suntainabilityDaywise', {
      //   token: localStorage.getItem('token'),
      //   date: dateTimeStamp
      //   }).then((res)=>{
      //     this.totalSales = ''
      //     this.totalSales = res.data.total;
  
      //     this.chemicalData.datasets[0].data =[]
      //   this.chemicalData.datasets[1].data =[]
      //   this.energyData.datasets[0].data  =[]
      //   this.energyData.datasets[1].data =[]
      //   this.waterData.datasets[0].data =[]
  
      //   this.chemicalData.datasets[0].data.push(res.data.total * 20);
      //   this.chemicalData.datasets[1].data.push(res.data.total * 50);
      //   this.energyData.datasets[0].data.push(res.data.total * 10);
      //   this.energyData.datasets[1].data.push(res.data.total * 30);
      //   this.waterData.datasets[0].data.push(res.data.total * 40, res.data.total * 60);
      //   this.energyPercentage = (res.data.total *30 + res.data.total*10 )/100
      //   this.waterPercentage = (res.data.total *60 + res.data.total*60 )/100
      //   this.chemicalPercentage = (res.data.total *20 + res.data.total*50 )/100
      //   })
       
      // },
      // previousFifteenDaysReport(){
      //   const currentTimestamp = Date.now()
      //   const currentTime = new Date(currentTimestamp);
  
      //   const day   = currentTime.getDate()-15;
      //   const month = currentTime.getMonth();
      //   const year  = currentTime.getFullYear();
      //   const dateTimeStamp = new Date(year, month, day);
      //   console.log(new Date(dateTimeStamp));
      //   axios.post(process.env.VUE_APP_HOST + '/suntainabilityDaywise', {
      //   sessionToken: localStorage.getItem('token'),
      //   date: dateTimeStamp
      //   }).then((res)=>{
      //     this.totalSales = ''
      //     this.totalSales = res.data.total;
  
      //     this.chemicalData.datasets[0].data =[]
      //   this.chemicalData.datasets[1].data =[]
      //   this.energyData.datasets[0].data  =[]
      //   this.energyData.datasets[1].data =[]
      //   this.waterData.datasets[0].data =[]
  
      //   this.chemicalData.datasets[0].data.push(res.data.total * 20);
      //   this.chemicalData.datasets[1].data.push(res.data.total * 50);
      //   this.energyData.datasets[0].data.push(res.data.total * 10);
      //   this.energyData.datasets[1].data.push(res.data.total * 30);
      //   this.waterData.datasets[0].data.push(res.data.total * 40, res.data.total * 60);
      //   this.energyPercentage = (res.data.total *30 + res.data.total*10 )/100
      //   this.waterPercentage = (res.data.total *60 + res.data.total*60 )/100
      //   this.chemicalPercentage = (res.data.total *20 + res.data.total*50 )/100
      //   })
      // },
      // previousThirtyDaysReport(){
      //   const currentTimestamp = Date.now()
      //   const currentTime = new Date(currentTimestamp);
  
      //   const day   = currentTime.getDate()-29;
      //   const month = currentTime.getMonth();
      //   const year  = currentTime.getFullYear();
      //   const dateTimeStamp = new Date(year, month, day);
      //   console.log(new Date(dateTimeStamp));
      //   axios.post(process.env.VUE_APP_HOST + '/suntainabilityDaywise', {
      //   sessionToken: localStorage.getItem('token'),
      //   date: dateTimeStamp
      //   }).then((res)=>{
      //     this.totalSales = ''
      //     this.totalSales = res.data.total;
  
      //     this.chemicalData.datasets[0].data =[]
      //   this.chemicalData.datasets[1].data =[]
      //   this.energyData.datasets[0].data  =[]
      //   this.energyData.datasets[1].data =[]
      //   this.waterData.datasets[0].data =[]
  
      //   this.chemicalData.datasets[0].data.push(res.data.total * 20);
      //   this.chemicalData.datasets[1].data.push(res.data.total * 50);
      //   this.energyData.datasets[0].data.push(res.data.total * 10);
      //   this.energyData.datasets[1].data.push(res.data.total * 30);
      //   this.waterData.datasets[0].data.push(res.data.total * 40, res.data.total * 60);
      //   this.energyPercentage = (res.data.total *30 + res.data.total*10 )/100
      //   this.waterPercentage = (res.data.total *60 + res.data.total*60 )/100
      //   this.chemicalPercentage = (res.data.total *20 + res.data.total*50 )/100
      //   })
      // }
    }, 
     mounted() {
     
        axios.get(process.env.VUE_APP_HOST + '/user', {
        headers: {
          token: localStorage.getItem('token')
        }
      }).then((res)=>{
        this.owner = res.data;
        console.log(res.data);
        this.ownerCustomer = res.data.user.ownerCustomer
        if(res.data.user.ownerCustomer){
        console.log('ownerCustomer');
        this.getOwnerCustomerReport();
      
      }
      else{
        this.allReport();
   
      }
      }).catch((err)=>{
        console.log(err);
      })
      
      
     
    },
    created() {
       //get tablet size
       if (window.innerWidth >= 950 && window.innerWidth < 1224) {
        this.tablet = true;
        // this.chartHeight = '170';
        // this.chartWidth = '170';
        console.log('tablet');
    } 

    }
  }
  </script>
    
    <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .frame-23,
.frame-23 * {
  box-sizing: border-box;
}
.frame-23 {
    background: #97bf0d;
  color: white;
  height: auto;
  width: 430px;
  font-size: 36px;
  margin:10px auto;
  font-weight: bold;
  border-radius:10px;
  text-align: center;
  display: flex;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
  #left-select{
    width: 103px;
  }

* {
  font-family: 'Oswald';
}
.main{
    margin-top: 5px;
    margin-left: 2%;
    margin-right: 2%;
    margin-bottom: 200px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-y: scroll;

  }
  .hello {
    overflow: hidden;
    
  
  }
  
  h2 {
    font-size: 1.5em;
    font-weight: bold;
  }
  
  .item-separator {
    border-left: 2px solid white;
    /* Change color, width, or other properties as needed */
    margin: 0 10px;
    /* Adjust the margin between items if needed */
  }
  
  .item1-left {
    display: flex;
    align-items: center;
  }
  
  .big-number {
    font-size: 2em;
    /* Adjust the font size as needed */
    margin-right: 10px;
    /* Optional: Add some space between icon and text */
  }
  
  .item-content {
    display: flex;
    flex-direction: column;
  }
  
  .item-content h3 {
    margin: 0;
    /* Optional: To remove default margin from h3 */
  }
  
  h1 {
    color: white;
    text-align: center;
    font-weight: 400;
  }
  

  
  
  .container {
    display: flex;
    justify-content: flex-start;
    height: 20vh;
    margin-top: 15px;
    border-radius: 10px;
    background-color: #97bf0d;
    padding: 10px;
  }
  
  .container3 {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: auto;
    height:auto;
    
  
  
    /* Align items at the start (top) of the container */
  
  }
  
  .item {
  
    text-align: center;
    padding: 20px;
    color: white;
    border-radius: 10px;
  
  }
  
  .item {
  
    text-align: center;
  }
  
  
  h3 {
    font-weight: bolder;
  }
  
  .container2 {
    padding: 5px;
    background-color: white;
    width: 100%;


    /* Align items at the start (top) of the container */
  
  }
  
  progress {
    /* Set the color of the progress bar */
    background-color: red;
    /* Gray background color */
  }
  
  .dropdown {
    display: inline-block;
    margin-right: 20px;
    width: 103px;
  }
  
  .box p {
    margin-right: 3px;
    /* Add space between the text and the progress bar */
  }
  
  progress {
    flex: 1;
    /* Allow the progress bar to fill the available space */
  }
  
  label {
    font-weight: bold;
  }
  
  select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  #flask {
    width: 100%;
    height: 140px;
  }
  
  .box {
    width: auto;
    height: auto;
    background-color: white;
    margin: 10px 0;
    margin-left: 14px;
    border-radius: 10px;
    text-align: left;
    padding: 10px;
  }
  
  .box1 {
    display: flex;
    align-items: center;
    width: 200px;
    background-color: white;
    margin: 10px 0;
    margin-left: 200px;
    margin-bottom: 10px;
  }
  
  p {
    color: black;
  }
  
  progress {
  
    height: 30px;
    margin-bottom: 10px;
    border-radius: 0;
    /* Adjust height as needed */
  }

@media  (max-width:1024px){
  .frame-23 {
  background: #97bf0d;
  color: white;
  height: auto;
  width: 260px;
  font-size: 26px;
  margin:10px auto;
  border-radius:10px;
  text-align: center;
  display: flex;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
  .box {
    width: auto;
    height: auto;
    background-color: white;
    margin: 0px 0;
    margin-left: 0px;
    border-radius: 10px;
    text-align: left;
    padding: 5px;
  }
  #chartContainer{
    max-width:70%;
  }
  .item {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
  }
  #flask {
    width:100%;
    height:100%;
    aspect-ratio: 2/2;
  }
  .container {
    height: auto;
    padding: 10px;

  }
  .container3 {
    display: flex;
    justify-content: center;
    margin-left: 0;
   
  }
  .main{
    margin-top: 5px;
    margin-left: 2%;
    margin-right: 2%;
    margin-bottom: 200px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-y: scroll;

  }
}
@media (max-width: 750px) {
  .frame-23 {
  background: #97bf0d;
  color: white;
  height: auto;
  width: 260px;
  font-size: 26px;
  margin:10px auto;
  border-radius:10px;
  text-align: center;
  display: flex;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
  #firstContainer{
    border-radius: 10px;
  }
  .main{
    margin-top: 2%;
    margin-left: 2%;
    margin-right: 2%;
    margin-bottom: 200px;
    overflow-y: scroll;
    height: auto;
  }
  h1{
   
    font-weight: bold;
    margin-top: 10px;
  

  }
  .container {
    flex-direction: column; /* Stack items vertically */
    align-items: flex-start; /* Align items to the start of the container */
    margin-left: 0; /* Remove left margin */
    padding-left: 15px; /* Optionally add some padding for better mobile spacing */
    border-radius: 10px;
    height: auto;

  }
  .container3 {
    display: flex;
    flex-direction: column; /* Stack items vertically */
    justify-content: flex-start;
    margin-left: 0; /* Remove left margin */
    border-radius: 10px !important;
    background-color:#97bf0d;
  }

  .container2{
    flex-direction: column;
    align-items: center;
  }
  #chartContainer{
    max-width:40%;
  }
  #flask {
    width:70%;
    height: 150px;
    aspect-ratio: 3/1;
  }
  

}
  </style>
    