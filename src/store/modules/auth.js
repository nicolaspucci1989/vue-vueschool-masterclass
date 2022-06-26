import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup, signOut
} from '@firebase/auth'
import { collection, doc, getDoc, getDocs, query, where } from '@firebase/firestore'

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId)
    }
  },
  actions: {
    initAuthentication ({ commit, state }) {
      return new Promise((resolve) => {
        if (state.authObserverUnsubscribe) state.authObserverUnsubscribe()
        const unsubscribe = onAuthStateChanged(
          auth, async (user) => {
            console.log('The user has changed: ', user)
            this.dispatch('auth/unsubscribeAuthUserSnapshot')
            if (user) {
              await this.dispatch('auth/fetchAuthUser')
              resolve(user)
            } else {
              resolve(null)
            }
          }
        )
        commit('setAuthObserverUnsubscribe', unsubscribe)
      })
    },
    async registerUserWithEmailAndPassword ({ dispatch }, { avatar = null, email, name, username, password }) {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await dispatch('users/createUser', { id: result.user.uid, email, name, username, avatar }, { root: true })
    },
    signInWithEmailAndPassword (context, { email, password }) {
      return signInWithEmailAndPassword(auth, email, password)
    },
    async signInWithGoogle ({ dispatch }) {
      const provider = new GoogleAuthProvider()
      const response = await signInWithPopup(auth, provider)
      const user = response.user
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        return dispatch('users/createUser',
          {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            username: user.email,
            avatar: user.photoURL
          },
          { root: true })
      }
    },
    async signOut ({ commit }) {
      await signOut(auth)
      commit('setAuthId', null)
    },
    fetchAuthUser: async ({ dispatch, commit }) => {
      const userId = auth.currentUser?.uid
      if (!userId) return
      await dispatch('fetchItem', {
        resource: 'users',
        id: userId,
        handleUnsubscribe: (unsubscribe) => {
          commit('setAuthUserUnsubscribe', unsubscribe)
        }
      },
      { root: true })
      commit('setAuthId', userId)
    },
    async fetchAuthUserPosts ({ commit, state }) {
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('userId', '==', state.authId))
      const posts = await getDocs(q)
      posts.forEach(item => {
        commit('setItem', { resource: 'posts', item }, { root: true })
      })
    },
    async unsubscribeAuthUserSnapshot ({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe()
        commit('setAuthUserUnsubscribe', null)
      }
    }
  },
  mutations: {
    setAuthId (state, id) {
      state.authId = id
    },
    setAuthUserUnsubscribe (state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe
    },
    setAuthObserverUnsubscribe (state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe
    }
  }
}
