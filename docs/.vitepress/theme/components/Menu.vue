<template>
  <template v-if="init($site)">
    <a v-if="data.l" :href="data.l">{{ data.text }}</a>
    <ul v-if="data.children" class="m">
      <template v-for="item in data.children">
        <li v-if="item.f" :key="item.link">
          <a :href="item.link">{{ item.text }}</a>
        </li>
        <Menu v-else :key="item.l" :menu="item" />
      </template>
    </ul>
  </template>
</template>

<script lang="ts">
import { computed } from 'vue'

export default {
  name: 'Menu',
  props: {
    menu: { type: Object },
  },
  setup(props) {
    let data
    const REG_TRIM_END = /\/index.html$/

    return {
      data: computed(() => data),
      init(siteData) {
        data = props.menu
        if (data) {
          return data
        }

        const {
          lang,
          locales,
          themeConfig: { locales: themeLocales },
        } = siteData

        let rootPath
        for (rootPath in locales) {
          if (lang === locales[rootPath].lang) {
            break
          }
        }

        if (rootPath) {
          const config = themeLocales[rootPath]
          if (config) {
            const pathname = location.pathname.replace(REG_TRIM_END, '/')
            if (pathname === rootPath) {
              const children = []
              for (
                let i = 0, { nav, sidebar } = config, len = nav.length, item;
                i < len;
                i++
              ) {
                item = { ...nav[i] }
                item.l && (item.children = sidebar[item.l])
                children.push(item)
              }
              data = { children }
              return data
            }

            if (pathname.startsWith(rootPath)) {
              let sidebar = config.sidebar
              if (sidebar) {
                let items
                for (let uri in sidebar) {
                  if (pathname === uri) {
                    data = { children: sidebar[uri] }
                    return data
                  }

                  if (pathname.startsWith(uri)) {
                    items = sidebar[uri]
                    break
                  }
                }

                let maxDeep = 0
                const setMostMatchedData = (arr, deep) => {
                  for (let i = 0, len = arr && arr.length, item; i < len; i++) {
                    item = arr[i]
                    if (item && item.l) {
                      if (pathname === item.l) {
                        item.children && (data = { children: item.children })
                        return data
                      }

                      if (pathname.startsWith(item.l)) {
                        if (deep > maxDeep) {
                          maxDeep = deep
                          data = item
                        }

                        if (setMostMatchedData(item.children, deep + 1)) {
                          return data
                        }
                      }
                    }
                  }
                }
                return setMostMatchedData(items, 0)
              }
            }
          }
        }
      },
    }
  },
}
</script>

<style>
.m {
  list-style: none;
}
</style>
