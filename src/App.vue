<template>
  <div id="app"><router-view /></div>
</template>

<style>

#app {
  font-family: 'Oswald' !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

@font-face {
  font-family: 'Oswald';
  font-weight: normal;
  font-style: normal;
  src: url('../public/fonts/Oswald-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'Oswald';
  font-weight: bold;
  font-style: normal;
  src: url('../public/fonts/Oswald-Bold.ttf') format('truetype');
}
*{
  font-family: 'Oswald';
}
body {
  font-family: 'Oswald';
}
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
