import { mountWidget } from './mount'

type Modes = 'rating' | 'reviews'

function init() {
  console.log('🔥 TrustView bundle loaded')

  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[src*="widget.js"]'
  )

  scripts.forEach((script) => {
    const storeId = script.dataset.store
    const mode = script.dataset.mode as Modes
    const target = script.dataset.target

    if (!storeId) {
      console.warn('[TrustView] Missing data-store attribute')
      return
    }

    mountWidget({
      storeId,
      mode,
      target
    })
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
