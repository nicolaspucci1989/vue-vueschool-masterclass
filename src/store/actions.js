import { findById } from '@/helpers'
import { collection, doc, onSnapshot, query, arrayUnion, writeBatch } from '@firebase/firestore'
import { db } from '@/firebase'

export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)

    const batch = writeBatch(db)
    const postRef = doc(collection(db, 'posts'))
    const threadRef = doc(db, 'threads', post.threadId)
    batch.set(postRef, post)
    batch.update(threadRef,
      'posts', arrayUnion(postRef.id),
      'contributors', arrayUnion(state.authId))
    await batch.commit()

    commit('setItem', { resource: 'posts', item: { ...post, id: postRef.id } })
    commit('appendPostToThread', { childId: postRef.id, parentId: post.threadId })
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },
  updateUser ({ commit }, user) {
    commit('setItem', { resource: 'users', item: user })
  },
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    const id = 'gggg' + Math.random()
    const userId = state.authId
    const publishedAt = Math.floor(Date.now() / 1000)
    const thread = { forumId, title, publishedAt, userId, id }
    commit('setItem', { resource: 'threads', item: thread })
    commit('appendThreadToUser', { parentId: userId, childId: id })
    commit('appendThreadToForum', { parentId: forumId, childId: id })
    dispatch('createPost', { thread, threadId: id, text })
    return findById(state.threads, id)
  },
  async updateThread ({ commit, state }, { title, text, id }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
    const newThread = { ...thread, title }
    const newPost = { ...post, text }
    commit('setItem', { resource: 'threads', item: newThread })
    commit('setItem', { resource: 'posts', item: newPost })
    return newThread
  },
  /**
   * Fetch Single Resource
   **/
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id }),
  fetchAuthUser: ({ dispatch, state }) => dispatch('fetchItem', { resource: 'users', id: state.authId }),
  /**
   * Fetch Multiple Resources
   **/
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'categories' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'forums' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'threads' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'posts' }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'users' }),
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
  fetchItem: ({ commit }, { id, resource }) => {
    console.log('Fetching ', resource, ':', id)
    return new Promise((resolve, reject) => {
      onSnapshot(
        doc(db, resource, id),
        {
          next: (snap) => {
            if (!snap.exists()) reject(new Error('Resource does not exists'))
            const item = { ...snap.data(), id: snap.id }
            commit('setItem', { resource, id, item })
            resolve(item)
          },
          error: (error) => {
            console.log('error ', error)
            reject(error)
          }
        }
      )
    })
  },
  fetchItems: ({ dispatch }, { ids, resource }) => Promise.all(ids.map(id => dispatch('fetchItem', { id, resource })))
}
