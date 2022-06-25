import { makeAppendParentToChildMutation } from '@/helpers'

export default {
  state: {
    items: []
  },
  actions: {
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id }),
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'forums' })
  },
  mutations: {
    appendThreadToForum: makeAppendParentToChildMutation({ parent: 'forums', child: 'threads' })
  },
  getters: {}
}
