import { mountWidget } from './mount'

function init() {

  console.log('🔥 TrustView bundle loaded')

  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[src*="widget.js"]'
  )

  const script = scripts[scripts.length - 1]
  if (!script) return

  const storeId = script.dataset.store
  if (!storeId) {
    console.warn('[TrustView] Missing data-store attribute')
    return
  }

  mountWidget({ storeId })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
