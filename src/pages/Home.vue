<template>
  <h1 class="push-top">Welcome to the forum</h1>
  <category-list :categories="categories"/>
</template>

<script>
import CategoryList from '@/components/CategoryList'

export default {
  name: 'PageHome',
  components: { CategoryList },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  async beforeCreate () {
    const categories = await this.$store.dispatch('fetchAllCategories')
    const forumsIds = categories.map(category => category.forums).flat()
    this.$store.dispatch('fetchForums', { ids: forumsIds })
  }
}
</script>
