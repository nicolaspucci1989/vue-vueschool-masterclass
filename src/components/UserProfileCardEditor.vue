<template>
  <div class="profile-card">
    <form @submit.prevent="save">

      <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImage
            :src="activeUser.avatar"
            :alt="`${user.name} profile picture`"
            class="avatar-xlarge img-update"
          />
          <span class="avatar-upload-overlay">
            <AppSpinner color="white" v-if="uploadingImage"/>
            <fa-icon v-else icon="camera" size="3x" :style="{color: 'white', opacity: '.8'}"/>
          </span>
          <input v-show="false" type="file" id="avatar" accept="image/*" @change="handleAvatarUpload">
        </label>
      </p>

      <div class="form-group">
        <input type="text" v-model="activeUser.username" placeholder="Username" class="form-input text-lead text-bold">
      </div>

      <div class="form-group">
        <input type="text" v-model="activeUser.name" placeholder="Full Name" class="form-input text-lead">
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea class="form-input" v-model="activeUser.bio" id="user_bio"
                  placeholder="Write a few words about yourself."></textarea>
      </div>

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr>

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input autocomplete="off" v-model="activeUser.website" class="form-input" id="user_website">
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input autocomplete="off" v-model="activeUser.email" class="form-input" id="user_email">
      </div>

      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <input autocomplete="off" v-model="activeUser.location" class="form-input" id="user_location"></div>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppSpinner from '@/components/AppSpinner'

export default {
  name: 'UserProfileCardEditor',
  components: { AppSpinner },
  props: {
    user: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      uploadingImage: false,
      activeUser: { ...this.user }
    }
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    async handleAvatarUpload (e) {
      this.uploadingImage = true
      const file = e.target.files[0]
      const uploadedImage = await this.uploadAvatar({ file })
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar
      this.uploadingImage = false
    },
    save () {
      console.log('save')
      this.$store.dispatch('users/updateUser', { ...this.activeUser })
      this.$router.push({ name: 'Profile' })
    },
    cancel () {
      this.$router.push({ name: 'Profile' })
    }
  }
}
</script>

<style scoped>

</style>
