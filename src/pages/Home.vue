<template>
  <div v-if="ready" class="container">
    <h1 class="push-top">Welcome to the forum</h1>
    <category-list :categories="categories"/>
  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList'
import { mapActions } from 'vuex'

export default {
  name: 'PageHome',
  data () {
    return {
      ready: false
    }
  },
  components: { CategoryList },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },
  async created () {
    const categories = await this.fetchAllCategories()
    const forumsIds = categories.map(category => category.forums).flat()
    await this.fetchForums({ ids: forumsIds })
    this.ready = true
  }
}
</script>
