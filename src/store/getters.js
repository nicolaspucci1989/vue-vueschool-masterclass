import { findById } from '@/helpers'

export default {
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
