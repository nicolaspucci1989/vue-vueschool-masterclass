<template>
  <div class="col-full text-center ">
    <h1>Not Found</h1>
    <router-link :to="{name: 'Home'}">Read some threads</router-link>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound',
  created () {
    this.$emit('ready')
  }
}
</script>

<style scoped>

</style>
