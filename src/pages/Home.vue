<template>
  <h1>Welcome to the forum</h1>
  <forum-list
    v-for="category in categories"
    :key="category.id"
    :name="category.name"
    :forums="getForums(category.id)"
  />
</template>

<script>
import sourceData from '@/data.json'
import ForumList from '@/components/ForumList'

export default {
  name: 'PageHome',
  components: { ForumList },
  data () {
    return {
      categories: sourceData.categories
    }
  },
  methods: {
    getForums (id) {
      return sourceData.forums.filter(forum => forum.categoryId === id)
    }
  }
}
</script>
