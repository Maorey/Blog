<template>
  <template v-if="data">
    <template v-if="data.l">
      <li v-if="menu">
        <a :href="data.l">{{ data.text }}</a>
      </li>
      <a v-else :href="data.l">{{ data.text }}</a>
    </template>

    <ul v-if="data.children">
      <template v-for="child in data.children">
        <Menu v-if="child.l" :key="child.l" :menu="child" />

        <li v-else-if="isValid(child)" :key="child.link">
          <a :href="child.link">{{ child.text }}</a>
        </li>
      </template>
    </ul>
  </template>
</template>

<script lang="ts">
import { useSiteData } from 'vitepress'

const REG_TRIM_END = /\/index.html$/
function resolveRootPathByLang(locales, lang) {
  for (let rootPath in locales) {
    if (lang === locales[rootPath].lang) {
      return rootPath
    }
  }
}
function resolveRootPathData({ nav, sidebar }) {
  const children = []

  for (let i = 0, len = nav.length, item; i < len; i++) {
    item = { ...nav[i] }
    item.l && (item.children = sidebar[item.l])
    children.push(item)
  }

  return { children }
}
function resolveSidebarSubData(sidebarDatas, pathname, deep) {
  const len = sidebarDatas && sidebarDatas.length
  if (!len) {
    return
  }

  let result

  if (!deep) {
    deep = 0
    resolveSidebarSubData.l = -1
  }

  for (let i = 0, sidebarData, deepSidebarData, link; i < len; i++) {
    sidebarData = sidebarDatas[i]
    link = sidebarData && sidebarData.l

    if (link) {
      if (pathname === link) {
        return { children: sidebarData.children, e: 1 /** 标记相等 */ }
      }

      if (pathname.startsWith(link)) {
        deepSidebarData = resolveSidebarSubData(
          sidebarData.children,
          pathname,
          deep + 1
        )
        if (deepSidebarData && deepSidebarData.e) {
          return deepSidebarData
        }

        if (deep > resolveSidebarSubData.l) {
          resolveSidebarSubData.l = deep
          result = sidebarData
        }
      }
    }
  }

  return result
}
function resolveSidebarData(sidebar, pathname) {
  for (let uri in sidebar) {
    if (pathname === uri) {
      return { children: sidebar[uri] }
    }

    if (pathname.startsWith(uri)) {
      return resolveSidebarSubData(sidebar[uri], pathname)
    }
  }
}
function resolveSiteData({
  lang,
  locales,
  themeConfig: { isProd, locales: themeLocales },
}) {
  if (isProd) {
    return
  }

  const rootPath = resolveRootPathByLang(locales, lang)
  if (rootPath) {
    const config = themeLocales[rootPath]

    if (config) {
      const pathname = location.pathname.replace(REG_TRIM_END, '/')

      if (pathname === rootPath) {
        return resolveRootPathData(config)
      }

      if (pathname.startsWith(rootPath) && config.sidebar) {
        return resolveSidebarData(config.sidebar, pathname)
      }
    }
  }
}
function isValid(leaf) {
  return !REG_TRIM_END.test(leaf.link)
}

export default {
  name: 'Menu',
  props: {
    menu: { type: Object },
  },
  setup(props) {
    return {
      data: props.menu || resolveSiteData(useSiteData().value),
      isValid,
    }
  },
}
</script>