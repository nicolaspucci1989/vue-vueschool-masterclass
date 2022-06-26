import { createStore } from 'vuex'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
import threads from './modules/threads'
import auth from './modules/auth'
import forums from './modules/forums'
import users from './modules/users'

export default createStore({
  modules: {
    auth,
    users,
    forums,
    threads
  },
  state: {
    unsubscribes: []
  },
  actions,
  mutations
})
