<template>
  <h1>Welcome to the forum</h1>
  <ThreadList
    :threads="threads"
  />
</template>

<script>
import sourceData from '@/data.json'
import ThreadList from '@/components/ThreadList'

export default {
  name: 'PageHome',
  components: { ThreadList },
  data () {
    return {
      threads: sourceData.threads
    }
  },
  methods: {
    postById (postId) {
      return this.posts.find(p => p.id === postId)
    },
    userById (userId) {
      return this.users.find(p => p.id === userId)
    }
  }
}
</script>
