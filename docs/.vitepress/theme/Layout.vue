<template>
  <Layout>
    <!-- <template #navbar-search>
      <SearchBox :options="$site.themeConfig.algolia" />
    </template>
    <template #sidebar-top></template>
    <template #sidebar-bottom></template>
    <template #home-hero></template>
    <template #home-features></template>
    <template #home-footer></template>
    <template #page-top></template> -->
    <template #page-bottom>
      <Comment />
    </template>
  </Layout>
</template>

<script lang="ts">
import { watch } from 'vue'
import { useSiteData, usePageData } from 'vitepress'
import DefaultTheme from 'vitepress/dist/client/theme-default'
// import SearchBox from './components/SearchBox.vue'
import Comment from './components/Comment.vue'

function resolveRootPathByLang(locales, lang) {
  for (let rootPath in locales) {
    if (lang === locales[rootPath].lang) {
      return rootPath
    }
  }
}
function resolveSidebarData(sidebarDatas, relativePath) {
  for (let i = 0, len = sidebarDatas.length, sidebarData; i < len; i++) {
    sidebarData = sidebarDatas[i]

    if (relativePath === sidebarData.link) {
      return sidebarData.text
    }

    if (relativePath.startsWith(sidebarData.link)) {
      return sidebarData.children
        ? resolveSidebarData(sidebarData.children, relativePath)
        : sidebarData.text
    }
  }
}

function getTitle(
  { lang, locales, themeConfig: { locales: themeLocales } },
  relativePath
) {
  let title

  const rootPath = resolveRootPathByLang(locales, lang)

  if (rootPath) {
    const config = themeLocales[rootPath]

    if (config) {
      relativePath.startsWith(rootPath) || (relativePath = rootPath + relativePath)

      title = resolveSidebarData(config.nav, relativePath)
      if (!title) {
        const sidebar = config.sidebar

        for (let path in sidebar) {
          if (relativePath.startsWith(path)) {
            title = resolveSidebarData(sidebar[path], relativePath)
            break
          }
        }
      }
    }
  }

  return title || relativePath
}

export default {
  components: {
    Layout: DefaultTheme.Layout,
    // SearchBox,
    Comment,
  },
  setup() {
    const pageData = usePageData()
    const siteData = useSiteData()
    const REG_MD = /(?:(\/)index)?\.md$/

    watch(pageData, page => {
      page.title ||
        (page.title = getTitle(
          siteData.value,
          page.relativePath.replace(REG_MD, '$1')
        ))
    })
  },
}
</script>
