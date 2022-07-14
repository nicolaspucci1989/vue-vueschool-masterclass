<template>
  <div class="col-full">
    <VeeForm @submit="save" :key="formKey">
      <AppFormField v-model="postCopy.text" as="textarea" cols="30" name="text" rows="10" rules="required"/>
      <div class="form-actions">
        <button class="btn-blue">{{post.id ? 'Update Post' : 'Submit Post'}}</button>
      </div>
    </VeeForm>
  </div>

</template>

<script>
export default {
  name: 'PostEditor',
  props: {
    post: { type: Object, default: () => ({ text: null }) }
  },
  data () {
    return {
      postCopy: { ...this.post },
      formKey: Math.random()
    }
  },
  methods: {
    save () {
      this.$emit('save', { post: this.postCopy })
      this.postCopy.text = ''
      this.formKey = Math.random()
    }
  }
}
</script>

<style scoped>

</style>
