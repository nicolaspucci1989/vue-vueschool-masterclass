<template>
  <VeeForm @submit="save">
    <AppFormField v-model="form.title" label="Title" name="title" rules="required"/>
    <AppFormField v-model="form.text" as="textarea" cols="140" label="Text" name="text" rows="8" rules="required"/>

    <div class="btn-group">
      <button class="btn btn-ghost" @click.prevent="$emit('cancel')">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">{{existing ? 'Update' : 'Publish'}} </button>
    </div>
  </VeeForm>
</template>

<script>
export default {
  name: 'ThreadEditor',
  props: {
    text: { type: String, default: '' },
    title: { type: String, default: '' }
  },
  data () {
    return {
      form: {
        title: this.title,
        text: this.text
      }
    }
  },
  computed: {
    existing () {
      return !!this.title
    }
  },
  methods: {
    save () {
      this.$emit('clean')
      this.$emit('save', { ...this.form })
    }
  },
  watch: {
    form: {
      handler () {
        if (this.form.title !== this.title || this.form.text !== this.text) {
          this.$emit('dirty')
        } else {
          this.$emit('clean')
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
