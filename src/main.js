import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import FontAwesome from '@/plugins/FontAwesome'
import ClickOutside from '@/plugins/ClickOutsideDirective'
import PageScroll from '@/plugins/PageScrollDirective'
import Vue3Pagination from '@/plugins/Vue3Pagination'
import VeeValidatePlugin from '@/plugins/VeeValidatePlugin'

const forumApp = createApp(App)
forumApp.use(router)
forumApp.use(store)
forumApp.use(FontAwesome)
forumApp.use(ClickOutside)
forumApp.use(PageScroll)
forumApp.use(Vue3Pagination)
forumApp.use(VeeValidatePlugin)

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
