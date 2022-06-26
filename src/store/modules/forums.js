import { makeAppendParentToChildMutation } from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id }, { root: true }),
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'forums' }, { root: true })
  },
  mutations: {
    appendThreadToForum: makeAppendParentToChildMutation({ parent: 'forums', child: 'threads' })
  },
  getters: {}
}
