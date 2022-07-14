<template>
  <div class="profile-card">
    <VeeForm @submit="save">

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

      <UserProfileCardEditorRandomAvatar @hit="activeUser.avatar = $event"/>

      <AppFormField v-model="activeUser.username" name="username" label="Username" :rules="`required|unique:users,username,${user.username}`"/>
      <AppFormField v-model="activeUser.name" name="name" label="Name" rules="required"/>
      <AppFormField v-model="activeUser.bio" name="text" as="textarea" label="Bio" cols="30" rows="10" placeholder="Write a few words about yourself."/>

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr>

      <AppFormField v-model="activeUser.website" name="website" label="Website" rules="url"/>
      <AppFormField v-model="activeUser.email" name="email" label="Email" :rules="`required|email|unique:users,email,${user.email}`"/>
      <AppFormField v-model="activeUser.location" name="location" label="Location" list="locations" @mouseenter="loadLocationOptions"/>
      <datalist id="locations">
        <option v-for="location in locationOptions" :value="location.name.common" :key="location.name.common"/>
      </datalist>

      <div class="btn-group space-between">
        <button :disabled="processing" class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button :disabled="processing" type="submit" class="btn-blue">
          <Appspinner :style="{ paddingLeft: '6px', paddingRight: '6px' }" v-if="processing" size="sm"/>
          Save
        </button>
      </div>
    </VeeForm>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppSpinner from '@/components/AppSpinner'
import UserProfileCardEditorRandomAvatar from '@/components/UserProfileCardEditorRandomAvatar'

export default {
  name: 'UserProfileCardEditor',
  components: {
    UserProfileCardEditorRandomAvatar,
    AppSpinner
  },
  props: {
    user: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      uploadingImage: false,
      activeUser: { ...this.user },
      processing: false,
      locationOptions: []
    }
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    async loadLocationOptions () {
      if (this.locationOptions.length) return
      const res = await fetch('https://restcountries.com/v3/all')
      this.locationOptions = await res.json()
    },
    async handleAvatarUpload (e) {
      this.uploadingImage = true
      const file = e.target.files[0]
      const uploadedImage = await this.uploadAvatar({ file })
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar
      this.uploadingImage = false
    },
    async handleRandomAvatarUpload () {
      const randomAvatarGenerated = this.activeUser.avatar.startsWith('https://pixabay')
      if (randomAvatarGenerated) {
        const image = await fetch(this.activeUser.avatar)
        const blob = await image.blob()
        this.activeUser.avatar = await this.uploadAvatar({ file: blob, filename: 'random' })
      }
    },
    async save () {
      console.log('save')
      this.processing = true
      await this.handleRandomAvatarUpload()
      this.$store.dispatch('users/updateUser', { ...this.activeUser })
      this.processing = false
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
