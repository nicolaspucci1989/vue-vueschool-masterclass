import { createStore } from 'vuex'
import { findById, upsert } from '@/helpers'
import { doc, onSnapshot, collection, query } from '@firebase/firestore'
import { db } from '@/firebase'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'L664y3qZSubDbT1R6npC0EEybJ73'
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: state => {
      return (id) => {
        const user = findById(state.users, id)
        if (!user) return null
        return {
          ...user,
          get posts () {
            return state.posts.filter(post => post.userId === user.id)
          },
          get postsCount () {
            return this.posts.length
          },
          get threads () {
            return state.threads.filter(thread => thread.userId === user.id)
          },
          get threadsCount () {
            return this.threads.length
          }
        }
      }
    },
    thread: state => {
      return (id) => {
        const thread = findById(state.threads, id)
        return {
          ...thread,
          get author () {
            return findById(state.users, thread.userId)
          },
          get repliesCount () {
            return thread.posts.length - 1
          },
          get contributorsCount () {
            return thread.contributors?.length ? thread.contributors.length : 0
          }
        }
      }
    }
  },
  actions: {
    createPost ({ commit, state }, post) {
      post.id = 'gggg' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setItem', { resource: 'posts', item: post })
      commit('appendPostToThread', { childId: post.id, parentId: post.threadId })
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
    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id })
    },
    fetchUser ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'users', id })
    },
    fetchPost ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'posts', id })
    },
    fetchItem ({ commit }, { id, resource }) {
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
    fetchUsers ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { ids, resource: 'users' })
    },
    fetchThreads ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { ids, resource: 'threads' })
    },
    fetchForums ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { ids, resource: 'forums' })
    },
    fetchPosts ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { ids, resource: 'posts' })
    },
    fetchItems ({ dispatch }, { ids, resource }) {
      return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource })))
    },
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
  mutations: {
    setItem (state, { resource, item }) {
      upsert(state[resource], item)
    },
    appendPostToThread: makeAppendParentToChildMutation({ parent: 'threads', child: 'posts' }),
    appendThreadToForum: makeAppendParentToChildMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: makeAppendParentToChildMutation({ parent: 'users', child: 'threads' }),
    appendContributorToThread: makeAppendParentToChildMutation({ parent: 'threads', child: 'contributors' })
  }
})

function makeAppendParentToChildMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
