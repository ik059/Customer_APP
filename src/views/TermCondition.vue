<template>
    <div class="main">
  
      <!-- Start a new page -->
      <div id="background">
      <div class="content">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
</p>
     
      </div>
      
  
      <div class="page-break"></div>
      <!-- Start a new page -->
  
      
     
  
      <div class="page-break"></div>
      <div class="page-break"></div>
      <br/>
      <br/>
  </div>
       
  
    </div>
  </template>
  
  <script>
  import Sidebar from "@/components/Sidebar.vue";
  import Footer from "@/components/Footer.vue";
  
  
  import axios from "axios";
  export default {
    name: "Contract",
    components: {
      Sidebar,
      Footer
    },
    methods: {}
  
  };
  </script>
  
  <style scoped>
  @media(min-width: 1600px){
    .content{
      width: 45% !important;
    }
  }

* {
  font-family: 'Oswald';
  color: black;
}
@font-face {
  font-family: 'Oswald';
  font-weight: normal;
  font-style: normal;
  src: url('../../public/fonts/Oswald-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'Oswald';
  font-weight: bold;
  font-style: normal;
  src: url('../../public/fonts/Oswald-Bold.ttf') format('truetype');
}

.content {
  font-family: 'Oswald';
}
  #listItem{
    margin-left: 3.4%;
  }
  li{
    width:88%;
    font-family: 'Oswald';
  }
  #contactHeading{
    font-weight: bold;
  }
  #pageNumber{
    font-size: x-small;
    margin-left: 90%;
    margin-right: 10px;
    margin-bottom: 20px;
  }
  .footernew {
    bottom: 0;
    width: 100%;
  }
  
  /* Add page breaks before each footer */
  .page-break {
    page-break-before: always;
    background-color: gray;
  
    margin-bottom: 40px;
  }
  
  .img-responsive {
    height:auto; 
    width:30%;
    float: right;
    margin-right: 10px;
  }
  
  .textone {
    margin-top: 100px;
    margin-left: 70px;
  }
  
  .bold {
    font-weight: bold;
  }
  .foot {
    margin-left: 70px;
    font-family: 'Oswald';
    font-size: small;
  }
  .para {
    text-align: justify;
    margin-right: 10px;

  }
  .foot {
    display: flex;
    justify-content: space-between;
    width: 80%;
  }
  
  .overline{
      display: inline;
      margin-right: 50px;
      width: 120px;
  }
  
  .contact-left {
    flex: 1;
     /* Expands to take available space on the left */
  }
  
  .contact-center {
    flex: 1; /* Expands to take available space in the center */
    text-align: center; /* Center-align the text within this block */
  }
  
  .contact-right {
    flex: 1; /* Expands to take available space on the right */
    text-align: right; /* Right-align the text within this block */
  }
  
  .overline{
      text-decoration: overline;
  }
  
  .greenbox{
    margin: 0;
      width: 30%;
  }
  
  .btn-primary{
      display: table;
      margin-left: auto;
      margin-right: auto;
      background-color: #97bf0d;
      border-radius: 0;
      border-color: #97bf0d;
      width: 60%;
  }
  .content{
    max-width: 60%;
    margin: auto;
    border-left: 1px solid gray ;
    border-right: 1px solid gray ;
    background-color: white;
    text-align: left;
    align-items: left;
  
  }
  
  #background{
      background-repeat: no-repeat, repeat;
      background-color: gray;
      background-size: cover;
      background-position: 10% 10%;
      background-size: 100% 100%; 
    }
    p{
      width:85%;
      font-family: 'Oswald';
    }
    @media (max-width: 575.98px) {
      .content{
    max-width: 100%;
    background-color: white;
  
    }
    #pageNumber{
    font-size: 9px;
    margin-left: 80%;
    margin-right: 10px;
    margin-bottom: 20px;
  }
  
  .contact-left {
    flex: 1;
    font-size:2px;
     /* Expands to take available space on the left */
  }
  .contact-center {
    flex: 1; /* Expands to take available space in the center */
    text-align: center;
    font-size:7px; /* Center-align the text within this block */
  }
  
  .contact-right {
    flex: 1; /* Expands to take available space on the right */
    text-align: right;
    font-size:7px; /* Right-align the text within this block */
  }
    .footernew {
    bottom: 0;
    width: 90%;
    font-size:7px;
  }
    p{
      width:95%;
      font-size: x-small;
    }
    li{
        font-size: x-small; 
        font-family: 'Oswald';
    }
    .img-responsive {
    height:6vh; 
    width:20vw;
    float: right;
    margin-right: 10px;
  }
    .foot {
    display: flex;
    justify-content: space-between;
   
    width: 100%;
    margin-left: 10px;
    font-size:7px;
  }
  
  .textone {
    margin-top: 50px;
    margin-left: 10px;
  }
  #contactHeading{
    font-weight: bold;
  }
  }
  @media (max-width: 900px) {
    .content{
    max-width: 100%;
    background-color: white;
  
    }
    .contact-left {
    flex: 1;
    font-size:10px;
     /* Expands to take available space on the left */
  }
  .contact-center {
    flex: 1; /* Expands to take available space in the center */
    text-align: center;
    font-size:10px; /* Center-align the text within this block */
  }
  
  .contact-right {
    flex: 1; /* Expands to take available space on the right */
    text-align: right;
    font-size:10px; /* Right-align the text within this block */
  }
    .footernew {
    bottom: 0;
    width: 90%;
    font-size:10px;
  }
} 
    
  </style>
  