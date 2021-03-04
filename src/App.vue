<template>
  <div>
    <Header/>
    <router-view />
    <Footer/>
  </div>
</template>

<script>

import Header from "@/components/Header_Footer/Header";
import Footer from "@/components/Header_Footer/Footer";

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  created() {
    this.$store.dispatch('admin/refreshToken');
  }
}
</script>

<style>
  @import "./assets/style.css";
</style>
