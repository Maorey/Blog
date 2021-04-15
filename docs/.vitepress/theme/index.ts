import { Theme, inBrowser } from 'vitepress'

import Layout from './App.vue'
import NotFound from './components/NotFound.vue'
import Menu from './components/Menu.vue'

import './global.scss'

export default {
  Layout,
  NotFound, // () => '啥都没得', // <- this is a Vue 3 functional component
  enhanceApp({ app }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.

    if (!inBrowser) {
      app.config.isCustomElement = () => true
      app.config.errorHandler = () => {}
    }

    // 注册全局组件
    app.component('Menu', Menu)
  },
} as Theme
