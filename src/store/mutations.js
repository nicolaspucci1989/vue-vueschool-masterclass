import { docToResource, upsert } from '@/helpers'

export default {
  setItem (state, { resource, item }) {
    upsert(state[resource].items, docToResource(item))
  },
  appendUnsubscribe (state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe)
  },
  clearUnsubscribes (state) {
    state.unsubscribes = []
  },
  clearItems (state, { modules = [] }) {
    modules.forEach(module => {
      state[module].items = []
    })
  }
}
