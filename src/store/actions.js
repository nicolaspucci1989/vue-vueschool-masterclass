import {
  doc,
  onSnapshot as firebaseOnSnapshot
} from '@firebase/firestore'
import { db } from '@/firebase'
import { findById } from '@/helpers'

export default {
  fetchItem: ({ state, commit }, { id, resource, handleUnsubscribe = null, once = false, onSnapshot = null }) => {
    console.log('Fetching ', resource, ':', id)
    return new Promise((resolve, reject) => {
      const unsubscribe = firebaseOnSnapshot(
        doc(db, resource, id),
        {
          next: (snap) => {
            console.log('snapshot', snap)
            if (once) {
              unsubscribe()
              console.log('unsubscribing for once option', snap)
            }
            if (snap.exists()) {
              const item = { ...snap.data(), id: snap.id }

              let previousItem = findById(state[resource].items, id)
              previousItem = previousItem ? { ...previousItem } : null

              commit('setItem', { resource, id, item })

              if (typeof onSnapshot === 'function') {
                const isLocal = snap.metadata.hasPendingWrites
                onSnapshot({ item: { ...item }, previousItem, isLocal })
              }

              resolve(item)
            } else {
              resolve(null)
            }
          },
          error: (error) => {
            console.log('error ', error)
            reject(error)
          }
        }
      )
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe)
      } else {
        commit('appendUnsubscribe', { unsubscribe })
      }
    })
  },
  fetchItems: ({ dispatch }, { ids, resource, onSnapshot = null }) => {
    ids = ids || []
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, onSnapshot })))
  },
  unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearUnsubscribes')
  },
  clearItems ({ commit }, { modules = [] }) {
    commit('clearItems', { modules })
  }
}
