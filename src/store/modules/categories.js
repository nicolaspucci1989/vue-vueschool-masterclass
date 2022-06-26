import { collection, onSnapshot, query } from '@firebase/firestore'
import { db } from '@/firebase'

export default {
  state: {
    items: []
  },
  actions: {
    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id }),
    fetchAllCategories ({ commit }) {
      console.log('Fetching all categories')
      return new Promise((resolve, reject) => {
        onSnapshot(
          query(collection(db, 'categories')),
          {
            next: (snap) => {
              const categories = snap.docs.map(doc => {
                const item = { id: doc.id, ...doc.data() }
                commit('setItem', { resource: 'categories', item })
                return item
              })
              resolve(categories)
            },
            error: (error) => {
              console.log('error ', error)
              reject(error)
            }
          }
        )
      })
    }
  },
  mutations: {},
  getters: {}
}
