<template>
    <header>
      <div class="menu-icon" @click="toggleMenu">
        <font-awesome-icon icon="fa-solid fa-clock" style="margin-top:1px;" @click="callParentFunction"/>
      </div>
      <div>
        <img src="../assets/logo.png" alt="Company" style="height:90%; width:45%;"/>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name:'Mobilehheader',
    methods: {
      toggleMenu() {
        // Implement your menu toggle logic here
      },
      callParentFunction() {
      this.childFunction(); // Call the parent function
    }
    },
    props: {
    childFunction: Function // Define a prop named "childFunction" of type Function
  },
  }
  </script>
  
  <style scoped>
    /* Add your CSS styles for the header here */
    header {
      display: flex;
      justify-content: flex-start;
      align-items: left;
      padding: 5%;
    }
    *{
      font-family: 'Oswald';
    }
  
  
    .company-logo {
      height: 5%;
      width: 15%
    }
  </style>
  