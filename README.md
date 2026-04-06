# TrustView Widget

Widget embebible de reviews para tiendas de [TiendaNube](https://www.tiendanube.com/). Se inyecta automaticamente en las tiendas que instalan TrustView y muestra reviews de productos en distintos formatos.

## Que es TrustView Widget

Es un bundle JavaScript IIFE que se carga en tiendas TiendaNube via un loader script. Usa Shadow DOM para aislar completamente sus estilos del tema de la tienda. Expone `window.Trustview` con funciones de montaje para 4 widgets diferentes.

### Ecosistema

| Proyecto | Descripcion |
|----------|-------------|
| **TrustView-web** | Landing page, panel SaaS, panel admin interno, billing |
| **TrustView-widget** (este repo) | Widget embebible para tiendas TiendaNube |
| **TrustView-Core** | API REST backend (Express + Supabase + Stripe) |

## Widgets Disponibles

| Widget | Donde se muestra | Descripcion |
|--------|------------------|-------------|
| `GridReviews` | Pagina de producto (PDP) | Grid de reviews del producto con modal para crear nueva review |
| `LastReviews` | Home de la tienda | Carrusel/grid de las ultimas 9 reviews de la tienda |
| `ProductRating` | PDP junto al precio | Estrellas de rating promedio del producto |
| `ProductRatingCard` | Listados de productos | Mini rating compacto en cada tarjeta de producto |

## Tech Stack

- **React 19** con TypeScript 5.9
- **Vite 7** compilando a bundle IIFE unico
- **Tailwind CSS 4** inlineado en Shadow DOM
- **TanStack Query 5** para data fetching y cache
- **React Hook Form 7** para el formulario de nueva review
- **Shadow DOM** para aislamiento total de estilos

## Como Funciona

```
TiendaNube Store
    │
    │ 1. HTML de la tienda incluye loader script (inline JS)
    ▼
Loader (docs/test.js)
    │
    │ 2. Lee window.LS.store.id (global de TiendaNube)
    │ 3. Detecta tipo de pagina (PDP, listado, home)
    │ 4. Inyecta trustview-widget.bundle.js desde Vercel CDN
    ▼
window.Trustview
    │
    │ 5. Llama a mount functions segun contexto:
    │    - PDP: mountGridReviews + mountProductRating
    │    - Listado: mountProductRatingCard (por cada producto)
    │    - Home: mountLastReviews
    ▼
Shadow DOM
    │
    │ 6. Cada widget crea su propio Shadow Root
    │ 7. CSS de Tailwind inyectado inline dentro del shadow
    │ 8. Fetch de datos via TrustView-Core /widget/* endpoints
    ▼
Reviews visibles en la tienda
```

## Instalacion y Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build del bundle IIFE
npm run build
```

## Build

El build produce un archivo unico: `dist/trustview-widget.bundle.js`

Configuracion en `vite.config.ts`:
- Formato: IIFE
- Nombre global: `Trustview`
- CSS inlineado (no archivo CSS separado)
- Sin source maps en produccion

## Estructura del Proyecto

```
src/
├── main.tsx                    # Entry point — expone window.Trustview
├── widgets/                    # Los 4 widgets
│   ├── GridReviews.tsx         # Grid de reviews en PDP
│   ├── LastReviews.tsx         # Ultimas reviews en home
│   ├── ProductRating.tsx       # Rating junto al precio
│   ├── ProductRatingCard.tsx   # Mini rating en listados
│   └── components/
│       ├── CreateReview/       # Boton + Modal para crear review
│       ├── ReviewCard/         # Tarjeta de review individual
│       └── StarsRating/        # Componente de estrellas
├── hooks/
│   ├── config/                 # useGetConfig (carga widget config)
│   └── widgets/                # useProductReviews, useLastReviews, useProductRating
├── services/
│   ├── widgetRequester.ts      # Fetch wrapper con base URL
│   ├── queryClient.ts          # QueryClient singleton
│   └── widgets/                # Funciones de API por widget
├── styles/
│   └── index.css               # Tailwind base (inyectado en Shadow DOM)
└── utils/
    └── formatDate.ts           # Formateo de fechas relativas
```

## API del Widget

El bundle expone `window.Trustview` con estas funciones:

```typescript
window.Trustview = {
  mountGridReviews(config: { storeId: number, productId: string, container: HTMLElement }),
  mountLastReviews(config: { storeId: number, container: HTMLElement }),
  mountProductRating(config: { storeId: number, productId: string, container: HTMLElement }),
  mountProductRatingCard(config: { storeId: number, productId: string, container: HTMLElement }),
}
```

## Loader Script

El loader (`docs/test.js`) es el snippet que los comerciantes instalan en su tienda TiendaNube. Se encarga de:

1. Detectar el `store.id` de TiendaNube
2. Identificar el tipo de pagina
3. Cargar el bundle del widget desde CDN
4. Montar los widgets apropiados en los contenedores correctos
5. Observar cambios DOM para productos cargados dinamicamente (MutationObserver)

**URL de produccion del bundle**: `https://trust-view-widget.vercel.app/trustview-widget.bundle.js`

## Variables de Entorno

```env
VITE_WIDGET_API=    # URL base del backend (TrustView-Core)
```

## Documentacion

- [Arquitectura y Flujos](./docs/ARCHITECTURE.md)
- [Auditoria de Seguridad y Optimizacion](./docs/SECURITY-AUDIT.md)
- [Problemas y Soluciones](./ISSUES.md)

## Licencia

Software propietario de **TrustView**. Todos los derechos reservados 2025 TrustView.
