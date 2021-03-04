<template>
  <div>
    <Featured/>
    <gs-content/>
  </div>
</template>

<script>
import Featured from "@/components/Home/Featured";
import gsContent from "@/components/Home/Content";

export default {
  name: "Home",
  components: {
    Featured,
    gsContent
  }
}
</script>

<style scoped>

</style>
