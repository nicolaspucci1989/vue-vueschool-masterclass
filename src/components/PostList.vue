<template>
  <div class="post-list">

    <div v-for="post in posts" :key="post.id" class="post">

      <div v-if="userById(post.userId)" class="user-info">
        <a href="#" class="user-name">{{ userById(post.userId).name }}</a>

        <a href="#">
          <AppAvatarImage class="avatar-large" :src="userById(post.userId).avatar" alt="user avatar"/>
        </a>

        <p class="desktop-only text-small">{{ userById(post.userId).postsCount }} posts</p>
        <p class="desktop-only text-small">{{ userById(post.userId).threadsCount }} threads</p>

      </div>

      <div class="post-content">
        <div class="col-full">
          <PostEditor
            :post="post" v-if="editing === post.id"
            @save="handleUpdate($event)"
          />
          <p v-else>
            {{ post.text }}
          </p>
        </div>
        <a
          v-if="post.userId === $store.state.authId"
          @click.prevent="toggleEditMode(post.id)"
          href="#"
          style="margin-left: auto; padding-left: 10px"
          class="link-unstyled"
          title="Make a change"
        >
          <fa-icon icon="pencil-alt"/>
        </a>
      </div>

      <div class="post-date text-faded">
        <div v-if="post.edited?.at" class="edition-info">edited</div>
        <app-date :timestamp="post.publishedAt"/>
      </div>

    </div>

  </div>
</template>

<script>

import PostEditor from '@/components/PostEditor'
import { mapActions } from 'vuex'
import { findById } from '@/helpers'

export default {
  name: 'PostList',
  components: { PostEditor },
  props: {
    posts: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      editing: false
    }
  },
  computed: {
    users () {
      return this.$store.state.users.items
    }
  },
  methods: {
    ...mapActions('posts', ['updatePost']),
    userById (userId) {
      return findById(this.users, userId) || {}
    },
    toggleEditMode (id) {
      this.editing = id === this.editing ? null : id
    },
    handleUpdate (event) {
      this.updatePost(event.post)
      this.editing = null
    }
  }
}
</script>

<style scoped>

</style>
