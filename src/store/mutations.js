import { findById, upsert } from '@/helpers'

export default {
  setItem (state, { resource, item }) {
    upsert(state[resource], item)
  },
  appendPostToThread: makeAppendParentToChildMutation({ parent: 'threads', child: 'posts' }),
  appendThreadToForum: makeAppendParentToChildMutation({ parent: 'forums', child: 'threads' }),
  appendThreadToUser: makeAppendParentToChildMutation({ parent: 'users', child: 'threads' }),
  appendContributorToThread: makeAppendParentToChildMutation({ parent: 'threads', child: 'contributors' })
}

function makeAppendParentToChildMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    if (!resource) {
      console.warn(`Appending ${child} to ${parent} ${parentId} failed because the parent didn't exist`)
      return
    }
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
