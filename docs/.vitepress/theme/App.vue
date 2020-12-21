<template>
  <Layout />

  <template v-if="inBrowser">
    <teleport to=".theme>main">
      <Comment />
    </teleport>
    <teleport to=".theme>main">
      <footer class="b">Copyright © 2020-2021 毛瑞</footer>
    </teleport>
  </template>
</template>

<script lang="ts">
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useSiteData, usePageData, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/dist/client/theme-default'
import lozad from 'lozad'
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

let siteData
let pageData
let resizeECharts
const REG_MD = /(?:(\/)index)?\.md$/
const lazyLoadImgs =
  'undefined' !== typeof HTMLImageElement && 'loading' in HTMLImageElement.prototype
    ? () => {
        for (
          let i = 0, lazyImgs = getDom('.lazy'), len = lazyImgs.length, element;
          i < len;
          i++
        ) {
          element = lazyImgs[i]

          element.setAttribute('src', element.getAttribute('data-src'))
        }
      }
    : () => {
        lozad('.lazy').observe()
      }
function initPage() {
  const page = pageData.value

  page.title ||
    (page.title = getTitle(
      (siteData || (siteData = useSiteData())).value,
      page.relativePath.replace(REG_MD, '$1')
    ))

  lazyLoadImgs()

  const echartsBlocks = getDom('.echarts')
  echartsBlocks &&
    echartsBlocks.length &&
    import('echarts').then(echarts => {
      echarts = echarts.default || echarts

      for (let i = 0, len = echartsBlocks.length, element, options; i < len; i++) {
        element = echartsBlocks[i]

        try {
          options = eval(`(${element.textContent})`)
          echarts.init(element).setOption(options)
          element.className = 'graph'
        } catch (e) {
          element.outerHTML = `<pre class="language-jsstacktrace">图表异常: ${e.stack}</pre>`
        }
      }

      if (!resizeECharts) {
        resizeECharts = () => {
          for (
            let i = 0,
              blocks = getDom('[_echarts_instance_]'),
              len = blocks.length,
              chart;
            i < len;
            i++
          ) {
            chart = echarts.getInstanceByDom(blocks[i])
            chart && chart.resize()
          }
        }

        window.addEventListener('resize', resizeECharts)
      }
    })

  const flowchartBlocks = getDom('.flowchart')
  flowchartBlocks &&
    flowchartBlocks.length &&
    import('./libs/flowchart.min').then(flowchart => {
      flowchart = flowchart.default || flowchart

      for (let i = 0, len = flowchartBlocks.length, element, chart; i < len; i++) {
        element = flowchartBlocks[i]

        try {
          chart = flowchart.parse(element.textContent)
          element.innerHTML = ''
          element.className = 'graph'
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
        mermaidBlocks[i].className = 'graph'
      }

      mermaid.init(undefined, mermaidBlocks)
    })
}

export default {
  components: {
    Layout: DefaultTheme.Layout,
    Comment,
  },
  setup() {
    onMounted(initPage)

    onUnmounted(() => {
      window.removeEventListener('resize', resizeECharts)
    })

    watch(pageData || (pageData = usePageData()), () => {
      nextTick(initPage)
    })

    return { inBrowser }
  },
}
</script>

<style>
* {
  scrollbar-width: thin;
  scroll-behavior: smooth;
  scrollbar-arrow-color: var(--c-brand);

  scrollbar-base-color: var(--c-divider-light);
  scrollbar-color: var(--c-brand-light) transparent;
  scrollbar-darkshadow-color: var(--c-brand);
  scrollbar-face-color: var(--c-brand-light);
  scrollbar-highlight-color: var(--c-divider-light);
  scrollbar-shadow-color: var(--c-brand-light);
  scrollbar-track-color: var(--c-divider-light);
}
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background: none;
  border-radius: 4px;
  transition: 0.3s;
}
::-webkit-scrollbar-thumb {
  min-width: 15px;
  min-height: 15px;
  background: var(--c-brand-light);
  border-radius: 4px;
  transition: 0.3s;
}
::-webkit-scrollbar-button {
  display: none;
}
::-webkit-scrollbar:hover {
  background: var(--c-divider-light);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--c-brand);
}

.page > .container {
  max-width: 73rem;
}

br + br {
  display: none;
}

.katex-display {
  max-width: 100%;
  overflow: auto hidden;
}

.loading {
  position: relative;
  max-width: 100%;
  min-width: 400px;
  min-height: 300px;
  overflow: hidden;
}

.loading::before {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: val(--z-index-sidebar);
  background: url('./assets/loading.jpg') center center no-repeat #062734;
  background-size: contain;
}

.graph {
  text-align: center;
  box-sizing: border-box;
  overflow: auto hidden;
}

.vssue {
  margin: 0 1.5rem;
  width: auto !important;
}

.b {
  margin: 2.25rem 1.5rem 0;
  padding: 2rem 1.5rem 2.25rem;
  border-top: 1px solid var(--c-divider);
  text-align: center;
  font-size: 0.9rem;
  color: var(--c-text-light);
}
</style>
