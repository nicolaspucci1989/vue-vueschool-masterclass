import { createStore } from 'vuex'
import actions from '@/store/actions'
import mutations from '@/store/mutations'

import auth from './modules/auth'
import users from './modules/users'
import forums from './modules/forums'
import threads from './modules/threads'
import categories from './modules/categories'
import posts from './modules/posts'

export default createStore({
  modules: {
    auth,
    users,
    forums,
    threads,
    posts,
    categories
  },
  state: {
    unsubscribes: []
  },
  actions,
  mutations
})
