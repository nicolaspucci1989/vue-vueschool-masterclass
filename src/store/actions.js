import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch
} from '@firebase/firestore'
import { db } from '@/firebase'

export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = serverTimestamp()

    const batch = writeBatch(db)
    const postRef = doc(collection(db, 'posts'))
    const threadRef = doc(db, 'threads', post.threadId)
    const userRef = doc(db, 'users', state.authId)
    batch.set(postRef, post)
    batch.update(threadRef,
      'posts', arrayUnion(postRef.id),
      'contributors', arrayUnion(state.authId))
    batch.update(userRef, 'postsCount', increment(1))
    await batch.commit()
    const newPost = await getDoc(postRef)
    commit('setItem', { resource: 'posts', item: { ...newPost.data(), id: newPost.id } })
    commit('appendPostToThread', { childId: newPost.id, parentId: post.threadId })
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },
  async updatePost ({ commit, state }, { text, id }) {
    const post = {
      text,
      edited: {
        at: serverTimestamp(),
        by: state.authId,
        moderated: false
      }
    }
    const postRef = doc(db, 'posts', id)
    await updateDoc(postRef, post)
    const updatedPost = await getDoc(postRef)
    commit('setItem', { resource: 'posts', item: updatedPost })
  },
  /**
   * Fetch Single Resource
   **/
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id }),
  /**
   * Fetch Multiple Resources
   **/
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'categories' }),
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
  },
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
