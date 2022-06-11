<template>
  <h1>{{category.name}}</h1>
  <forum-list :title="category.name" :forums="getForumsFromCategory(category)"/>
</template>

<script>
import ForumList from '@/components/ForumList'

export default {
  name: 'CategoryShow',
  components: { ForumList },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    category () {
      return this.$store.state.categories.find(category => category.id === this.id)
    }
  },
  methods: {
    getForumsFromCategory (category) {
      return this.$store.state.forums.filter(forum => forum.categoryId === category.id)
    }
  }
}
</script>

<style scoped>

</style>
