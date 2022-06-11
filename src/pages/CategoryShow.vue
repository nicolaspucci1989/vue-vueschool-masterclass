<template>
  <forum-list :name="name" :forums="forums"/>
</template>

<script>
import sourceData from '@/data.json'
import ForumList from '@/components/ForumList'

export default {
  name: 'CategoryShow',
  components: { ForumList },
  props: {
    id: {
      required: true,
      type: Number
    }
  },
  computed: {
    name () {
      return sourceData.categories.find(category => category.id === this.id).name
    },
    forums () {
      return sourceData.forums.filter(forum => forum.categoryId === this.id)
    }
  }
}
</script>

<style scoped>

</style>
