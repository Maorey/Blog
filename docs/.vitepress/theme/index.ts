import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import Menu from './components/Menu.vue'

export default {
  Layout,
  NotFound, // () => '啥都没得', // <- this is a Vue 3 functional component
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    app.component('Nfd', NotFound)
    app.component('Menu', Menu)
  },
}
