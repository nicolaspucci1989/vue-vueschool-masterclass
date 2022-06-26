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
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    async createPost ({ commit, state, rootState }, post) {
      post.userId = rootState.auth.authId
      post.publishedAt = serverTimestamp()

      const batch = writeBatch(db)
      const postRef = doc(collection(db, 'posts'))
      const threadRef = doc(db, 'threads', post.threadId)
      const userRef = doc(db, 'users', rootState.auth.authId)
      batch.set(postRef, post)
      batch.update(threadRef,
        'posts', arrayUnion(postRef.id),
        'contributors', arrayUnion(rootState.auth.authId))
      batch.update(userRef, 'postsCount', increment(1))
      await batch.commit()
      const newPost = await getDoc(postRef)
      commit('setItem', { resource: 'posts', item: { ...newPost.data(), id: newPost.id } }, { root: true })
      commit('threads/appendPostToThread', { childId: newPost.id, parentId: post.threadId }, { root: true })
      commit('threads/appendContributorToThread', { childId: rootState.auth.authId, parentId: post.threadId }, { root: true })
    },
    fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id }, { root: true }),
    fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'posts' }, { root: true }),
    async updatePost ({ commit, state, rootState }, { text, id }) {
      const post = {
        text,
        edited: {
          at: serverTimestamp(),
          by: rootState.auth.authId,
          moderated: false
        }
      }
      const postRef = doc(db, 'posts', id)
      await updateDoc(postRef, post)
      const updatedPost = await getDoc(postRef)
      commit('setItem', { resource: 'posts', item: updatedPost }, { root: true })
    }
  },
  mutations: {},
  getters: {}
}
