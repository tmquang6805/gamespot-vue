<template>
  <header>
    <div class="container header_container">
      <div class="logo">
        <router-link :to="{name: 'home'}">GameSpot</router-link>
      </div>
      <div class="login" v-if="!isAuth">
        <router-link :to="{ name: 'signin' }">
          <img :src="require('../../assets/images/login.png')" alt="">
        </router-link>
      </div>
      <div v-else>
        <ul>
          <li><span @click="logout">Logout</span></li>
          <li>
            <router-link :to="{name: 'dashboard'}">Dashboard</router-link>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
  import router from "../../routes";

  export default {
    name: "Header",
    computed: {
      isAuth() {
        return this.$store.getters['admin/isAuth'];
      },
      currentRouteName() {
        return this.$route.name;
      },
    },
    methods: {
      logout(){
        this.$store.dispatch("admin/logout");
        if (this.currentRouteName !== "home") {
          router.push({name: "home"});
        }
      }
    }
  }
</script>

<style scoped>

</style>
