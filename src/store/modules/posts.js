import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc,
  writeBatch
} from '@firebase/firestore'
import { db } from '@/firebase'

export default {
  state: {
    items: []
  },
  actions: {
    fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id }),
    fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'posts' }),
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
    }
  },
  mutations: {},
  getters: {}
}
