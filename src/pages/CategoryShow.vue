<template>
  <h1>{{category.name}}</h1>
  <forum-list :title="category.name" :forums="getForumsFromCategory(category)"/>
</template>

<script>
import ForumList from '@/components/ForumList'
import { mapActions } from 'vuex'

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
      return this.$store.state.categories.find(category => category.id === this.id) || {}
    }
  },
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums']),
    getForumsFromCategory (category) {
      return this.$store.state.forums.filter(forum => forum.categoryId === category.id)
    }
  },
  async created () {
    const category = this.fetchCategory({ id: this.id })
    this.fetchForums({ ids: category.forums })
  }
}
</script>

<style scoped>

</style>
