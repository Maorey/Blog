module.exports = md => {
  const originalFence = md.renderer.rules.fence.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]

    if (token.info === 'echarts') {
      const code = token.content.trim()

      try {
        const options = eval(`(${code})`)

        return `<div class="echarts loading" style="width:${
          typeof options.width === 'string'
            ? options.width
            : `${options.width || 500}px`
        };height:${
          typeof options.height === 'string'
            ? options.height
            : `${options.height || 400}px`
        }">${code}</div>`
      } catch (e) {
        return `<pre class="language-jsstacktrace">${e.stack}</pre>`
      }
    }

    return originalFence(tokens, idx, options, env, slf)
  }
}
