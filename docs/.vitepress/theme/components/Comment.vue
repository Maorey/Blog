<template>
  <div id="c" />
</template>

<script lang="ts">
import { onMounted, watchEffect } from 'vue'
import { VssueAPI } from 'vssue'
import { usePageData } from 'vitepress'

const options: VssueAPI.Options = {
  owner: 'Maorey',
  repo: 'Blog',
  clientId: 'f1ada006b51b19ef3424',
  clientSecret: '5e4149693c9e4b3f660672aa56e2a27ae1598199',
  state: 'r5A3$K_7',
  labels: ['comments'],
  prefix: '[comments] ',
  // autoCreateIssue: process.env.NODE_ENV === 'production', // 未创建issue的会跳转登陆...
  issueContent: ({ url }) =>
    `This issue is comments of the blog [${document.title
      .split('|')[0]
      .trim()}](${url})`,
}

export default {
  props: { title: String, class: String, style: String },
  setup(props) {
    import('vssue/dist/vssue.min.css')
    const libs = [import('../libs/vue2.min'), import('../libs/vssue.min')]
    const pendingLibs = Promise.all(libs) // 省掉 libs 变量, 打包会报错, 咱也惹不起啊

    const pageData = usePageData()
    onMounted(() => {
      pendingLibs.then(res => {
        const Vue2 = res[1].default(res[0].default)

        const reactiveData = Vue2.observable({ t: 0, k: 0 })
        watchEffect(() => {
          const page = pageData.value
          const relativePath = page.relativePath

          reactiveData.k = relativePath
          reactiveData.t = props.title || page.title || relativePath
        })

        new Vue2({
          el: '#c',
          render: h =>
            h('keep-alive', [
              h('vssue', {
                key: reactiveData.k,
                class: props.class,
                style: props.style,
                props: { title: reactiveData.t, options },
              }),
            ]),
        })
      })
    })
  },
}
</script>
