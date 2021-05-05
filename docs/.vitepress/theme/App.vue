<template>
  <Layout>
    <template v-if="i" #page-bottom>
      <Comment />

      <footer class="foot">Copyright © 2020-2021 毛瑞</footer>
    </template>
  </Layout>
</template>

<script lang="ts">
// @ts-nocheck
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useSiteData, usePageData, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import lozad from 'lozad'

import Layout = DefaultTheme.Layout
import Comment from './components/Comment.vue'

let siteData
let pageData

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
function setTitle() {
  const page = pageData.value
  page.title ||
    (page.title = getTitle(
      (siteData || (siteData = useSiteData())).value,
      page.relativePath.replace(/(?:(\/)index)?\.md$/, '$1')
    ))
}

const getContentDom = query => document.querySelectorAll('.content ' + (query || ''))

const lazyLoadImages =
  'undefined' !== typeof HTMLImageElement && 'loading' in HTMLImageElement.prototype
    ? () => {
        for (
          let i = 0,
            lazyImgs = getContentDom('.lazy'),
            len = lazyImgs.length,
            element;
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

let imageViewer
function initImageViewer() {
  const imgs = getContentDom('img')
  let i = imgs.length
  if (i) {
    import('viewerjs/dist/viewer.min.css')
    const promises = [import('viewerjs/dist/viewer.esm')]
    const attribute = 'data-o'

    const reg = /(.*\/)/
    const replaceStr = '$1_o_'
    const fetchOptions = { method: 'HEAD' }
    while (i--) {
      const img = imgs[i]
      if (!img.getAttribute(attribute)) {
        const originalSrc = img.src.replace(reg, replaceStr)
        promises.push(
          fetch(originalSrc, fetchOptions)
            .then(res => {
              res.ok && img.setAttribute(attribute, originalSrc)
            })
            .catch()
        )
      }
    }

    Promise.all(promises).then(([viewer]) => {
      if (imageViewer) {
        imageViewer.update()
      } else {
        imageViewer = new (viewer.default || viewer)(getContentDom()[0], {
          url: img => img.getAttribute(attribute) || img.src,
        })
      }
    })
  }
}

let resizeECharts
function initEcharts() {
  const echartsBlocks = getContentDom('.echarts')
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
              blocks = getContentDom('[_echarts_instance_]'),
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
}

function initFlowchart() {
  const flowchartBlocks = getContentDom('.flowchart')
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
}

function initMermaid() {
  const mermaidBlocks = getContentDom('.mermaid')
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

const querySelector = (dom, selector) => dom && dom.querySelector(selector)
function reLayout() {
  // I know it's sucks
  const page = querySelector(document, '.page')
  const container = page && querySelector(page, '.container')
  if (container) {
    let element = querySelector(container, '#c') || querySelector(container, '.vssue')
    element && page.appendChild(element)

    element = querySelector(container, '.foot')
    element && page.appendChild(element)
  }
}

function initPage() {
  setTitle()

  lazyLoadImages()

  setTimeout(initImageViewer, 99) // 让请求往后排
  initEcharts()
  initFlowchart()
  initMermaid()

  inBrowser && reLayout()
}

/** 【只有一个实例】 */
export default {
  components: { Layout, Comment },
  setup() {
    onMounted(initPage)
    onUnmounted(() => {
      imageViewer && imageViewer.destroy()
      window.removeEventListener('resize', resizeECharts)

      imageViewer = resizeECharts = pageData = siteData = null
    })

    watch(pageData || (pageData = usePageData()), () => {
      nextTick(initPage)
    })

    return { i: inBrowser }
  },
}
</script>
