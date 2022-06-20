<template>
<div v-if="asyncDataStatus_ready" class="col-full">
  <div class="col-full push-top">

    <div class="forum-header">
      <div class="forum-details">
        <h1>{{forum.name}}</h1>
        <p class="text-lead">{{forum.description}}</p>
      </div>
      <router-link
        :to="{name: 'ThreadCreate', params: {forumId: forum.id}}"
        class="btn-green btn-small"
      >
        Start a thread
      </router-link>
    </div>
  </div>

  <div class="col-full push-top">
    <thread-list :threads="threads"/>
  </div>
</div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'PageForum',
  components: { ThreadList },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums.find(forum => forum.id === this.id)
    },
    threads () {
      if (!this.forum) return []
      if (!this.forum.threads) return []
      return this.forum.threads.map(threadId => this.$store.getters.thread(threadId))
    }
  },
  methods: {
    ...mapActions(['fetchForum', 'fetchThreads', 'fetchUsers'])
  },
  async created () {
    const forum = await this.fetchForum({ id: this.id })
    if (forum.threads) {
      const threads = await this.fetchThreads({ ids: forum.threads })
      await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
    }
    this.asyncDataStatus_fetched()
  }
}
</script>
