<template>
  <div class="form-group">
    <label :for="name">{{label}}</label>
    <VeeField
      :id="name"
      :label="label"
      :modelValue="modelValue"
      :name="name"
      class="form-input"
      v-bind="$attrs"
      @input="$emit('modelUpdate', $event)"
    />
    <VeeErrorMessage :name="name" class="form-error" />
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: String, default: '' }
  }
}
</script>
