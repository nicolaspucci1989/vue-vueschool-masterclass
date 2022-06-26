export default {
  state: {
    items: []
  },
  actions: {
    fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id }),
    fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'posts' })
  },
  mutations: {},
  getters: {}
}
