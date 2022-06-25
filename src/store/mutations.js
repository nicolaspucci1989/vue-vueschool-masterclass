import { docToResource, makeAppendParentToChildMutation, upsert } from '@/helpers'

export default {
  setItem (state, { resource, item }) {
    upsert(state[resource], docToResource(item))
  },
  appendUnsubscribe (state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe)
  },
  clearUnsubscribes (state) {
    state.unsubscribes = []
  },
  appendThreadToUser: makeAppendParentToChildMutation({ parent: 'users', child: 'threads' })
}
