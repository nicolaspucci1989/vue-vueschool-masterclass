<template>
  <img :src="src || '/user-placeholder.png'" :alt="alt"/>
</template>

<script>
export default {
  props: {
    src: { type: String },
    alt: { type: String }
  },
  name: 'AppAvatarImage'
}
</script>

<style scoped>

</style>
