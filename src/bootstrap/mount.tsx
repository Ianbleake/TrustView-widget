import styles from '../ui/styles/tailwind.css?inline'
import { WidgetRuntime } from '../core/runtime'

export function mountWidget(config: { storeId: string }) {
  const container = document.createElement('div')
  container.className = 'tv-widget-root'

  const shadow = container.attachShadow({ mode: 'open' })

  // Inyectar estilos
  const style = document.createElement('style')
  style.textContent = styles
  shadow.appendChild(style)

  // Root interno para Preact
  const appRoot = document.createElement('div')
  shadow.appendChild(appRoot)

  document.body.appendChild(container)

  // 👉 Aquí está el cambio importante
  const runtime = new WidgetRuntime(config, shadow, appRoot)
  runtime.init()
}
