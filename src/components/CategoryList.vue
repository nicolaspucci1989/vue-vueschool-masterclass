<template>
  <forum-list
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsFromCategory(category)"
    :title="category.name"
    :categoryId="category.id"
  />
</template>

<script>
import ForumList from '@/components/ForumList'
import sourceData from '@/data.json'

export default {
  categoryName: 'CategoryList',
  components: { ForumList },
  props: {
    categories: {
      required: true,
      type: Array
    }
  },
  methods: {
    getForumsFromCategory (category) {
      return sourceData.forums.filter(forum => forum.categoryId === category.id)
    }
  }
}
</script>

<style scoped>

</style>
