<template>
  <div v-if="thread && text" class="col-full push-top">

    <h1>Editing <i>{{ thread.title }}</i></h1>

    <thread-editor
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'

export default {
  name: 'ThreadEdit',
  components: { ThreadEditor },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return this.$store.state.threads.find(thread => thread.id === this.id)
    },
    text () {
      const post = this.$store.state.posts.find(post => post.id === this.thread.posts[0])
      return post ? post.text : ''
    }
  },
  methods: {
    async save ({ title, text }) {
      const thread = await this.$store.dispatch('updateThread', {
        id: this.id,
        title,
        text
      })
      await this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.id } })
    }
  },
  async created () {
    const thread = await this.$store.dispatch('fetchThread', { id: this.id })
    this.$store.dispatch('fetchPost', { id: thread.posts[0] })
  }
}
</script>

<style scoped>

</style>
