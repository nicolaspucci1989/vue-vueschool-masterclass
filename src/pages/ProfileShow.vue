<template>
  <div class="container" style="width: 100%">
    <div class="flex-grid">
      <div class="col-3 push-top">

        <user-profile-card v-if="!edit" :user="user"/>
        <user-profile-card-editor v-else :user="user"/>

        <p class="text-xsmall text-faded text-center">Member since june 2003, last visited 4 hours ago</p>

      </div>

      <div class="col-7 push-top">

        <div class="profile-header">
                  <span class="text-lead">
                      {{ user.username }} recent activity
                  </span>
          <a href="#">See only started threads?</a>
        </div>

        <hr>

        <post-list :posts="user.posts"/>
        <AppInfiniteScroll
          @load="fetchUserPosts"
          :done="user.posts.length === user.postsCount"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import { mapGetters } from 'vuex'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileCardEditor from '@/components/UserProfileCardEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import AppInfiniteScroll from '@/components/AppInfiniteScroll'

export default {
  name: 'ProfileShow',
  components: {
    AppInfiniteScroll,
    UserProfileCardEditor,
    UserProfileCard,
    PostList
  },
  mixins: [asyncDataStatus],
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('auth', { user: 'authUser' }),
    lastPostFetched () {
      if (this.user.posts.length === 0) return null
      return this.user.posts[this.user.posts.length - 1]
    }
  },
  methods: {
    fetchUserPosts () {
      return this.$store.dispatch('auth/fetchAuthUserPosts', { startAfterPost: this.lastPostFetched })
    }
  },
  async created () {
    await this.fetchUserPosts()
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
