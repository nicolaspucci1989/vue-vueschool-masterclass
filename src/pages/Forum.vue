<template>
  <div v-if="asyncDataStatus_ready" class="col-full">
    <div class="col-full push-top">

      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
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
      <v-pagination
        v-model="page"
        :pages="totalPages"
        active-color="#57AD8D"
      />
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
  data () {
    return {
      page: 1,
      perPage: 5
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums.items.find(forum => forum.id === this.id)
    },
    threads () {
      if (!this.forum) return []
      if (!this.forum.threads) return []
      return this.$store.state.threads.items
        .filter(thread => thread.forumId === this.forum.id)
        .map(thread => this.$store.getters['threads/thread'](thread.id))
    },
    threadCount () {
      return this.forum.threads.length
    },
    totalPages () {
      if (!this.threadCount) return 0
      return Math.ceil(this.threadCount / this.perPage)
    }
  },
  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['fetchThreadsByPage']),
    ...mapActions('users', ['fetchUsers'])
  },
  async created () {
    const forum = await this.fetchForum({ id: this.id })
    if (forum.threads) {
      const threads = await this.fetchThreadsByPage({
        ids: forum.threads,
        page: this.page,
        perPage: this.perPage
      })
      await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
    }
    this.asyncDataStatus_fetched()
  },
  watch: {
    async page (page) {
      const threads = await this.fetchThreadsByPage({
        ids: this.forum.threads,
        page: this.page,
        perPage: this.perPage
      })
      await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
    }
  }
}
</script>
