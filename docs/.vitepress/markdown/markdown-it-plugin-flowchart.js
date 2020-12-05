module.exports = md => {
  const originalFence = md.renderer.rules.fence.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]

    if (token.info === 'flowchart') {
      return `<pre class="flowchart loading">${token.content.trim()}</pre>`
    }

    return originalFence(tokens, idx, options, env, slf)
  }
}
