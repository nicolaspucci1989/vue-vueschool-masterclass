import { docToResource, findById, makeAppendParentToChildMutation } from '@/helpers'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from '@firebase/firestore'
import { db } from '@/firebase'

export default {
  state: {
    items: []
  },
  actions: {
    fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id }),
    async updateUser ({ commit }, user) {
      const updates = {
        avatar: user.avatar || null,
        username: user.username || null,
        name: user.name || null,
        bio: user.bio || null,
        website: user.website || null,
        email: user.email || null,
        location: user.location || null
      }
      const userRef = doc(db, 'users', user.id)
      await updateDoc(userRef, updates)
      commit('setItem', { resource: 'users', item: user })
    },
    fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'users' }),
    async createUser ({ commit }, { id, email, name, username, avatar = null }) {
      const registeredAt = serverTimestamp()
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = { avatar, email, name, username, usernameLower, registeredAt }
      const userRef = doc(db, 'users', id)
      await setDoc(userRef, user)
      const newUser = await getDoc(userRef)
      commit('setItem', { resource: 'users', item: newUser })
      return docToResource(newUser)
    }
  },
  mutations: {
    appendThreadToUser: makeAppendParentToChildMutation({ parent: 'users', child: 'threads' })
  },
  getters: {
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
            return user.postsCount || 0
          },
          get threads () {
            return state.threads.filter(thread => thread.userId === user.id)
          },
          get threadsCount () {
            return user.threads?.length || 0
          }
        }
      }
    }
  }
}