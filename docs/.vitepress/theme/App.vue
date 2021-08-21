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
import { useData, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import lozad from 'lozad'

import Layout = DefaultTheme.Layout
import Comment from './components/Comment.vue'

const getContentDom = query => document.querySelectorAll('.content ' + (query || ''))

const lazyLoadImages =
  'undefined' !== typeof HTMLImageElement && 'loading' in HTMLImageElement.prototype
    ? () => {
        for (
          let i = 0, lazyImgs = getContentDom('.lazy'), len = lazyImgs.length, element;
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
    const promises = [import('./libs/viewer')]
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
    import('./libs/echarts').then(echarts => {
      echarts = echarts.default || echarts

      for (let i = 0, len = echartsBlocks.length, element, options; i < len; i++) {
        element = echartsBlocks[i]

        try {
          options = eval(`(${element.textContent})`)
          echarts.init(element, 'dark').setOption(options)
          element.className = 'graph'
        } catch (e) {
          element.outerHTML = `<pre class="language-jsstacktrace">图表异常: ${e.stack}</pre>`
        }
      }

      if (!resizeECharts) {
        resizeECharts = () => {
          for (
            let i = 0, blocks = getContentDom('[_echarts_instance_]'), len = blocks.length, chart;
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
    import('./libs/flowchart').then(flowchart => {
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
    import('./libs/mermaid').then(mermaid => {
      mermaid = mermaid.default || mermaid
      mermaid.mermaidAPI.initialize({ theme: 'dark' })

      for (let i = 0, len = mermaidBlocks.length; i < len; i++) {
        mermaidBlocks[i].className = 'graph'
      }

      mermaid.init(mermaidBlocks)
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

      imageViewer = resizeECharts = null
    })

    watch(useData().page, () => {
      nextTick(initPage)
    })

    return { i: inBrowser }
  },
}
</script>
