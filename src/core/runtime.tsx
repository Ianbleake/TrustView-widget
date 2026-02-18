import { render } from 'preact'
import App from '../ui/App'

type WidgetConfig = {
  storeId: string
  mode?: 'rating' | 'reviews'
  target?: string
}


export class WidgetRuntime {
  private config: WidgetConfig
  private shadow: ShadowRoot
  private appRoot: HTMLElement

  constructor(config: WidgetConfig, shadow: ShadowRoot, appRoot: HTMLElement) {
    this.config = config
    this.shadow = shadow
    this.appRoot = appRoot
  }

  async init() {
    try {
      const data = await this.bootstrap()
      this.render(data)
    } catch (error) {
      console.error('[TrustView]', error)
    }
  }

  private async bootstrap() {
    // aquí luego irá fetch real
    return {
      storeId: this.config.storeId,
      reviews: [],
      remoteConfig: {}
    }
  }

  private render(data: any) {
    render(
      <App
        storeId={data.storeId}
        reviews={data.reviews}
        mode={data.remoteConfig.mode}
      />,
      this.appRoot
    )
  }
}
