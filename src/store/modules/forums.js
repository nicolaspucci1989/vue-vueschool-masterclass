import { makeAppendParentToChildMutation, makeFetchItemAction, makeFetchItemsAction } from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    fetchForum: makeFetchItemAction({ resource: 'forums' }),
    fetchForums: makeFetchItemsAction({ resource: 'forums' })
  },
  mutations: {
    appendThreadToForum: makeAppendParentToChildMutation({ parent: 'forums', child: 'threads' })
  },
  getters: {}
}
