<template>
  <div class="container dashboard_container">
    <div class="admin_nav">
      <ul>
        <li>
          <router-link :to="{name: 'add-post'}">Add post</router-link>
        </li>
        <li>
          <router-link :to="{name: 'list-posts'}">Manage posts</router-link>
        </li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: "Dashboard"
  }
</script>

<style scoped>

</style>
