import { docToResource, findById } from '@/helpers'
import { collection, doc, onSnapshot, query, arrayUnion, writeBatch, serverTimestamp, getDoc, increment, updateDoc } from '@firebase/firestore'
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
  updateUser ({ commit }, user) {
    commit('setItem', { resource: 'users', item: user })
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
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    const userId = state.authId
    const publishedAt = serverTimestamp()
    const threadRef = doc(collection(db, 'threads'))
    const thread = { forumId, title, publishedAt, userId, id: threadRef.id }

    const userRef = doc(db, 'users', userId)
    const forumRef = doc(db, 'forums', forumId)
    const batch = writeBatch(db)

    batch.set(threadRef, thread)
    batch.update(userRef, 'threads', arrayUnion(threadRef.id))
    batch.update(forumRef, 'threads', arrayUnion(threadRef.id))
    await batch.commit()
    const newThread = await getDoc(threadRef)

    commit('setItem', { resource: 'threads', item: { ...newThread.data(), id: newThread.id } })
    commit('appendThreadToUser', { parentId: userId, childId: threadRef.id })
    commit('appendThreadToForum', { parentId: forumId, childId: threadRef.id })
    await dispatch('createPost', { thread, threadId: threadRef.id, text })
    return findById(state.threads, threadRef.id)
  },
  async updateThread ({ commit, state }, { title, text, id }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
    let newThread = { ...thread, title }
    let newPost = { ...post, text }

    const threadRef = doc(db, 'threads', id)
    const postRef = doc(db, 'posts', post.id)

    const batch = writeBatch(db)
    batch.update(threadRef, newThread)
    batch.update(postRef, newPost)
    await batch.commit()
    newThread = await getDoc(threadRef)
    newPost = await getDoc(postRef)

    commit('setItem', { resource: 'threads', item: newThread })
    commit('setItem', { resource: 'posts', item: newPost })
    return docToResource(newThread)
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
      const unsubscribe = onSnapshot(
        doc(db, resource, id),
        {
          next: (snap) => {
            if (!snap.exists()) reject(new Error('Resource does not exists'))
            const item = { ...snap.data(), id: snap.id }
            commit('setItem', { resource, id, item })
            setTimeout(() => resolve(item), 500)
          },
          error: (error) => {
            console.log('error ', error)
            reject(error)
          }
        }
      )
      commit('appendUnsubscribe', { unsubscribe })
    })
  },
  fetchItems: ({ dispatch }, { ids, resource }) => Promise.all(ids.map(id => dispatch('fetchItem', { id, resource }))),
  unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearUnsubscribes')
  }
}
