<template>
  <Layout>
    <template #navbar-search>
      <!-- <SearchBox :options="$site.themeConfig.algolia" /> -->
    </template>
    <template #sidebar-top> </template>
    <template #sidebar-bottom> </template>
    <template #home-hero> </template>
    <template #home-features> </template>
    <template #home-footer> </template>
    <template #page-top> </template>
    <template #page-bottom> </template>
  </Layout>
</template>

<script lang="ts">
import DefaultTheme from 'vitepress/dist/client/theme-default'
// import SearchBox from './components/SearchBox.vue'

export default {
  components: {
    Layout: DefaultTheme.Layout,
    // SearchBox,
  },
}
</script>
