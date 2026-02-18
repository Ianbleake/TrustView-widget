import styles from '../ui/styles/tailwind.css?inline'
import { WidgetRuntime } from '../core/runtime'



export function mountWidget(config: {
  storeId: string
  mode?: 'rating' | 'reviews'
  target?: string
}) {
  const container = document.createElement('div')
  container.className = 'tv-widget-root'

  const shadow = container.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent = styles
  shadow.appendChild(style)

  const appRoot = document.createElement('div')
  shadow.appendChild(appRoot)

  if (config.target) {
    const targetEl = document.querySelector(config.target)
    targetEl?.insertAdjacentElement('afterend', container)
  } else {
    document.body.appendChild(container)
  }

  const runtime = new WidgetRuntime(config, shadow, appRoot)
  runtime.init()
}

