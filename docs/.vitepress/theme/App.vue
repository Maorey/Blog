<template>
  <Layout>
    <!--
      <template #navbar-search></template>
      <template #sidebar-top></template>
      <template #sidebar-bottom></template>
      <template #home-hero></template>
      <template #home-features></template>
      <template #home-footer></template>
      <template #page-top-ads></template>
      <template #page-top></template>
      <template #page-bottom></template>
      <template #page-bottom-ads></template>
    -->
    <template #page-bottom>
      <Comment v-if="$themeConfig.isProd" />
    </template>
  </Layout>

  <footer class="b">Copyright © 2020-2021 毛瑞</footer>
</template>

<script lang="ts">
import { watch, onMounted } from 'vue'
import { useSiteData, usePageData } from 'vitepress'
import DefaultTheme from 'vitepress/dist/client/theme-default'
import Comment from './components/Comment.vue'

import 'markdown-it-latex/dist/index.css'

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

function getDom(query) {
  return document.querySelectorAll(query)
}

let pageData
let siteData
export default {
  components: {
    Layout: DefaultTheme.Layout,
    Comment,
  },
  setup() {
    const REG_MD = /(?:(\/)index)?\.md$/
    watch(pageData || (pageData = usePageData()), page => {
      page.title ||
        (page.title = getTitle(
          (siteData || (siteData = useSiteData())).value,
          page.relativePath.replace(REG_MD, '$1')
        ))
    })

    onMounted(() => {
      const echartsBlocks = getDom('.echarts')
      echartsBlocks &&
        echartsBlocks.length &&
        import('echarts').then(echarts => {
          echarts = echarts.default || echarts

          for (
            let i = 0, len = echartsBlocks.length, element, options;
            i < len;
            i++
          ) {
            element = echartsBlocks[i]

            try {
              options = eval(`(${element.textContent})`)
              echarts.init(element).setOption(options)
              element.className = ''
            } catch (e) {
              element.outerHTML = `<pre class="language-jsstacktrace">图表异常: ${e.stack}</pre>`
            }
          }
        })

      const flowchartBlocks = getDom('.flowchart')
      flowchartBlocks &&
        flowchartBlocks.length &&
        import('./libs/flowchart.min').then(flowchart => {
          flowchart = flowchart.default || flowchart

          for (
            let i = 0, len = flowchartBlocks.length, element, chart;
            i < len;
            i++
          ) {
            element = flowchartBlocks[i]

            try {
              chart = flowchart.parse(element.textContent)
              element.className = element.innerHTML = ''
              chart.drawSVG(element)
            } catch (e) {
              element.outerHTML = `<pre class="language-jsstacktrace">流程图异常: ${e.stack}</pre>`
            }
          }
        })

      const mermaidBlocks = getDom('.mermaid')
      mermaidBlocks &&
        mermaidBlocks.length &&
        import('./libs/mermaid.min').then(mermaid => {
          mermaid = mermaid.default || mermaid

          for (let i = 0, len = mermaidBlocks.length; i < len; i++) {
            mermaidBlocks[i].className = ''
          }

          mermaid.init(undefined, mermaidBlocks)
        })
    })
  },
}
</script>

<style>
.loading {
  position: relative;
  min-width: 400px;
  min-height: 300px;
}

.loading::before {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 666;
  background: url('./assets/loading.jpg') center center no-repeat #062734;
  background-size: contain;
}

.b {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 2.25rem;
  border-top: 1px solid var(--c-divider);
  text-align: center;
  line-height: 1.4;
  font-size: 0.9rem;
  color: var(--c-text-light);
}
</style>
