<template>
  <div class="post-list">

    <div v-for="post in posts" :key="post.id" class="post">

      <div class="user-info">
        <a href="#" class="user-name">{{ userById(post.userId).name }}</a>

        <a href="#">
          <img class="avatar-large" :src="userById(post.userId).avatar" alt="">
        </a>

        <p class="desktop-only text-small">107 posts</p>

      </div>

      <div class="post-content">
        <div>
          <p>
            {{ post.text }}
          </p>
        </div>
      </div>

      <div class="post-date text-faded">
        <app-date :timestamp="post.publishedAt"/>
      </div>

    </div>

  </div>
</template>

<script>

import { findById } from '@/helpers'

export default {
  name: 'PostList',
  props: {
    posts: {
      required: true,
      type: Array
    }
  },
  computed: {
    users () {
      return this.$store.state.users
    }
  },
  methods: {
    postById (postId) {
      return findById(this.posts, postId)
    },
    userById (userId) {
      return findById(this.users, userId)
    }
  }
}
</script>

<style scoped>

</style>
