<template>
  <div translate="no">
    <sidebar @search-input-emit="search" /><!--sidebar component-->
    <Map /><!--map component-->
  </div>
</template>

<script>
import Map from "@/components/Map.vue";
import Sidebar from "@/components/Sidebar.vue";
export default {
  name: "Home",
  components: {
    Map,
    Sidebar
  },
};
</script>