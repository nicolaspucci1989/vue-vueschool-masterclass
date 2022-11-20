<template>
  <VueFinalModal v-model="showModal" classes="modal-container" content-class="modal">
    <div class="modal-content">
      <h4>Login Again to Change Your Email</h4>
      <VeeForm @submit="reauthenticate">
        <AppFormField name="reauth-email" label="Email" v-model="email" rules="email"/>
        <AppFormField name="reauth-password" label="Password" v-model="password" type="password" autocomplete="current-password"/>
        <button class="btn btn-green btn-small">Login</button>
      </VeeForm>
    </div>
  </VueFinalModal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

export default {
  name: 'UserProfileCardEditorReauthenticate',
  components: { VueFinalModal },
  props: {
    modelValue: { type: Boolean, default: false }
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    showModal: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    async reauthenticate () {
      try {
        await this.$store.dispatch('auth/reauthenticate', {
          email: this.email,
          password: this.password
        })
        this.$emit('success')
      } catch (error) {
        console.log(error)
        this.$emit('fail', error)
      }
    }
  }
}
</script>

<style scoped>

</style>
