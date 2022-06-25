import { createStore } from 'vuex'
import getters from '@/store/getters'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
import threads from './modules/threads'
import auth from './modules/auth'

export default createStore({
  modules: {
    threads,
    auth
  },
  state: {
    unsubscribes: [],
    categories: [],
    forums: [],
    posts: [],
    users: []
  },
  getters,
  actions,
  mutations
})
