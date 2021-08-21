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
        <li v-if="child.f" :key="child.link">
          <a :href="child.link">{{ child.text }}</a>
        </li>

        <Menu v-else :key="child.l" :menu="child" />
      </template>
    </ul>
  </template>
</template>

<script lang="ts">
// @ts-nocheck
import { useData } from 'vitepress'

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
        deepSidebarData = resolveSidebarSubData(sidebarData.children, pathname, deep + 1)
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
function resolveRootPathData({ nav, sidebar }) {
  const children = []

  for (let i = 0, len = nav.length, item; i < len; i++) {
    item = { ...nav[i] }
    item.l && (item.children = sidebar[item.l])
    children.push(item)
  }

  return { children }
}
function resolveSiteData() {
  const data = useData()
  const pathname = ('/' + data.page.value.relativePath).replace(/\/index?\.md$/, '/')
  const { base, themeConfig } = data.site.value

  if (pathname === base) {
    return resolveRootPathData(themeConfig)
  }

  if (pathname.startsWith(base) && themeConfig.sidebar) {
    return resolveSidebarData(themeConfig.sidebar, pathname)
  }
}

export default {
  name: 'Menu', // for 递归
  props: { menu: Object },
  setup: props => ({
    data: props.menu || resolveSiteData(),
  }),
}
</script>
