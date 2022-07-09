import { collection, onSnapshot, query } from '@firebase/firestore'
import { db } from '@/firebase'
import { makeFetchItemAction, makeFetchItemsAction } from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    fetchCategory: makeFetchItemAction({ resource: 'categories' }),
    fetchCategories: makeFetchItemsAction({ resource: 'categories' }),
    fetchAllCategories ({ commit }) {
      console.log('Fetching all categories')
      return new Promise((resolve, reject) => {
        onSnapshot(
          query(collection(db, 'categories')),
          {
            next: (snap) => {
              const categories = snap.docs.map(doc => {
                const item = { id: doc.id, ...doc.data() }
                commit('setItem', { resource: 'categories', item }, { root: true })
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
