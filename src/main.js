import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import FontAwesome from '@/plugins/FontAwesome'
import ClickOutside from '@/plugins/ClickOutsideDirective'
import PageScroll from '@/plugins/PageScrollDirective'

const forumApp = createApp(App)
forumApp.use(router)
forumApp.use(store)
forumApp.use(FontAwesome)
forumApp.use(ClickOutside)
forumApp.use(PageScroll)

const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  forumApp.component(baseComponentName, baseComponentConfig)
})

forumApp.mount('#app')
