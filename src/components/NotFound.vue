<template>
    <div>
      <div id="notFoundContainer">
        
        <div id="logo">
          <img src="https://i.ibb.co/G7Q84BB/Logo-wei.png" alt="Logo" />
        </div>
        <h1 id="notfoundAnimation">
          <span class="digit">4</span>
          <span class="digit">0</span>
          <span class="digit">4</span>
        </h1>
        <p>Sorry!</p>
        <p>Page not found!</p>
        <br/>
        <!-- <p><router-link to="/contact" id="back">Home!</router-link></p> -->
      </div>
    </div>
    </template>
    
    <script>
  
    export default {
      name: 'NotFound',
      components:{
  
      },
      mounted(){
            // Check if the page has been reloaded already
            if (!sessionStorage.getItem('reloaded')) {
            // Set a flag in sessionStorage
            sessionStorage.setItem('reloaded', 'true');

            // Reload the page
            window.location.reload();
            }

            // Listen for the page unload event to clear the 'reloaded' flag
            window.addEventListener('beforeunload', function () {
            sessionStorage.removeItem('reloaded');
            });
            setTimeout(() => {
              sessionStorage.removeItem('reloaded');
            }, 10000);

      }
    };
    </script>
    
    <style scoped>
    #notFoundContainer {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      flex-direction: column;
      font-size: 2rem;
      padding: 2%;
      background-color: #97bf0d;
      color: white;
    }
    #back {
      color: white;
      cursor: pointer;
      text-decoration: none;
      padding: 10px;
      background-color: grey;
      border-radius: 10px;
    }
    
    #logo {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 2rem;
     
    }
    
    #logo img {
      width: 200px;
    }
    
    #notfoundAnimation {
      font-size: 10rem;
      margin: 0;
    }
    
    .digit {
      opacity: 0;
      animation: scaleUp 5s infinite;
    }
    
    .digit:nth-child(2) {
      animation-delay: 2.5s;
    }
    
    .digit:nth-child(3) {
      animation-delay: 3s;
    }
    
    @keyframes scaleUp {
      0% {
        transform: scale(1);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: scale(3);
        opacity: 0;
      }
    }
    </style>
    