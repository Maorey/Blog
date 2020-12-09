module.exports = md => {
  const originalFence = md.renderer.rules.fence.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]

    if (token.info === 'echarts') {
      const code = token.content.trim()

      try {
        const options = eval(`(${code})`)

        return `<pre v-pre class="echarts loading" style="${
          typeof options.width === 'string'
            ? `width:${options.width};`
            : options.width
              ? `width:${options.width}px;`
              : ''
        }height:${
          typeof options.height === 'string'
            ? options.height
            : `${options.height || 250}px`
        }">${code}</pre>`
      } catch (e) {
        return `<pre class="language-jsstacktrace">${e.stack}</pre>`
      }
    }

    return originalFence(tokens, idx, options, env, slf)
  }
}
