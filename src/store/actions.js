import {
  doc,
  onSnapshot
} from '@firebase/firestore'
import { db } from '@/firebase'

export default {
  fetchItem: ({ commit }, { id, resource, handleUnsubscribe = null }) => {
    console.log('Fetching ', resource, ':', id)
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        doc(db, resource, id),
        {
          next: (snap) => {
            console.log('snapshot', snap)
            if (snap.exists()) {
              const item = { ...snap.data(), id: snap.id }
              commit('setItem', { resource, id, item })
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
  fetchItems: ({ dispatch }, { ids, resource }) => Promise.all(ids.map(id => dispatch('fetchItem', { id, resource }))),
  unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearUnsubscribes')
  },
  async unsubscribeAuthUserSnapshot ({ state, commit }) {
    if (state.authUserUnsubscribe) {
      state.authUserUnsubscribe()
      commit('setAuthUserUnsubscribe', null)
    }
  }
}
