# TrustView Widget — Arquitectura y Flujos de Operacion

## Vision General

TrustView Widget es un bundle JavaScript IIFE disenado para ser inyectado en tiendas TiendaNube. Su arquitectura esta optimizada para:

1. **Aislamiento total** — Shadow DOM para encapsular estilos
2. **Bundle unico** — Sin chunks, sin CSS externo, un solo archivo
3. **Minima huella** — Se carga en tiendas que no controla
4. **Deteccion automatica** — El loader detecta la pagina y monta lo que corresponda

## Stack Arquitectonico

```
┌─────────────────────────────────────────┐
│          Tienda TiendaNube              │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │       Loader Script (inline)     │   │
│  │  - Lee window.LS.store.id        │   │
│  │  - Detecta tipo de pagina        │   │
│  │  - Inyecta bundle desde CDN      │   │
│  └──────────────┬───────────────────┘   │
│                 │                       │
│  ┌──────────────▼───────────────────┐   │
│  │    window.Trustview (IIFE)       │   │
│  │                                  │   │
│  │  ┌────────────────────────────┐  │   │
│  │  │    Shadow DOM (por widget) │  │   │
│  │  │  ┌──────────────────────┐  │  │   │
│  │  │  │   React 19 App       │  │  │   │
│  │  │  │   + Tailwind CSS     │  │  │   │
│  │  │  │   + TanStack Query   │  │  │   │
│  │  │  └──────────────────────┘  │  │   │
│  │  └────────────────────────────┘  │   │
│  └──────────────┬───────────────────┘   │
│                 │ fetch()               │
└─────────────────┼───────────────────────┘
                  │
          ┌───────▼──────────┐
          │  TrustView-Core  │
          │  /widget/*       │
          └──────────────────┘
```

## Patron de Arquitectura: IIFE + Shadow DOM

### Por que IIFE

El widget necesita cargarse como un unico script en un entorno hostil (temas de TiendaNube con CSS y JS desconocidos). Un bundle IIFE:

- No necesita module system
- Se ejecuta inmediatamente
- Expone una API global controlada (`window.Trustview`)
- No conflicta con otros scripts

### Por que Shadow DOM

Las tiendas de TiendaNube tienen estilos CSS variados y a menudo globales. Shadow DOM:

- Encapsula completamente el CSS del widget
- Previene que estilos del tema afecten al widget
- Previene que estilos del widget afecten al tema
- El CSS de Tailwind se inyecta con `?inline` de Vite dentro de cada Shadow Root

## Ciclo de Vida del Widget

### 1. Carga e Inicializacion

```
1. Tienda carga HTML
    │
    ▼
2. Loader script (inline en el HTML)
    │
    │ a. Verifica window.LS.store.id
    │ b. Detecta tipo de pagina:
    │    - productDetail (PDP)
    │    - productList (listados)
    │    - home
    │    - other (ignora)
    │
    ▼
3. Inyecta <script src="bundle.js"> en <head>
    │
    ▼
4. Bundle se ejecuta → window.Trustview disponible
    │
    ▼
5. Loader llama mount functions segun pagina:
    │
    ├── PDP:
    │   ├── mountGridReviews({ storeId, productId, container })
    │   └── mountProductRating({ storeId, productId, container })
    │
    ├── Listado:
    │   └── mountProductRatingCard({ storeId, productId, container }) x N productos
    │       └── MutationObserver para productos cargados dinamicamente
    │
    └── Home:
        └── mountLastReviews({ storeId, container })
```

### 2. Montaje de un Widget

```
mountGridReviews({ storeId, productId, container })
    │
    │ 1. Crea <div> host dentro del container
    │ 2. Adjunta Shadow Root (mode: "open")
    │ 3. Inyecta <style> con CSS de Tailwind inline
    │ 4. Crea React root dentro del Shadow Root
    │ 5. Renderiza:
    │    <QueryClientProvider client={queryClient}>
    │      <GridReviews storeId={storeId} productId={productId} />
    │    </QueryClientProvider>
    │
    ▼
Widget visible y funcional
```

### 3. Flujo de Datos

```
Widget Component (GridReviews, etc.)
    │
    ▼
Custom Hook (useProductReviews, etc.)
    │
    ▼
TanStack Query (useQuery)
    │ enabled: !!storeId
    │ staleTime: 5 minutos
    │ refetchOnWindowFocus: false
    │
    ▼
Service Function (getProductReviews, etc.)
    │
    ▼
widgetRequester({ path, body })
    │
    ▼
fetch(VITE_WIDGET_API + path, { method: "POST", body: JSON.stringify(body) })
    │
    ▼
TrustView-Core: POST /widget/product/reviews
    │
    ▼
Supabase → reviews table
```

## Estructura de Componentes

```
                    ┌──────────────────┐
                    │   main.tsx       │
                    │  (mount funcs)   │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐  ┌────────▼────────┐  ┌────────▼────────┐
│  GridReviews  │  │  LastReviews    │  │ ProductRating   │
│  (PDP)        │  │  (Home)         │  │ (PDP + Cards)   │
└───────┬───────┘  └────────┬────────┘  └─────────────────┘
        │                   │
        ├── ReviewCard ◄────┘
        │   ├── StarsRating
        │   └── <a href={productUrl}>
        │
        └── CreateReview
            ├── (Boton "Deja una resenia")
            └── ReviewModal
                └── Form (rating + name + review)
```

## Endpoints del Widget

Todos los endpoints se comunican via POST con body JSON al backend:

| Endpoint | Body | Respuesta |
|----------|------|-----------|
| `POST /widget/config` | `{ storeId }` | Widget config (colores, estilos) |
| `POST /widget/lastreviews` | `{ storeId }` | 9 ultimas reviews aprobadas |
| `POST /widget/product/rating` | `{ storeId, productId }` | Rating promedio + cantidad |
| `POST /widget/product/reviews` | `{ storeId, productId }` | Todas las reviews aprobadas del producto |
| `POST /widget/newReview` | `{ store_external_id, product_external_id, author_name, rating, content, product_url }` | Review creada |

## Configuracion del Widget

La configuracion visual se gestiona desde el panel web (`/platform/widget`) y se almacena en `stores.widget_config` en Supabase. El widget la carga via `POST /widget/config` al montar.

```
widget_config: {
  primaryColor: string,     // Color principal
  secondaryColor: string,   // Color secundario
  productColor: string,     // Color de links de producto
  starsColor: string,       // Color de estrellas
  // ... mas opciones de estilo
}
```

## Deteccion de Tipo de Pagina

El loader identifica el contexto de TiendaNube inspeccionando:

- `document.querySelector('.js-product-detail')` → PDP
- `document.querySelector('.js-product-list, .js-search-results')` → Listado
- Analisis de URL patterns
- Fallback: home si no matchea nada

## MutationObserver para Productos Dinamicos

En paginas de listado, TiendaNube puede cargar productos via AJAX (infinite scroll, filtros). El loader crea un `MutationObserver` en `document.body` para detectar nuevos nodos de producto y montar `ProductRatingCard` en ellos automaticamente.

## Build Pipeline

```
src/main.tsx
    │
    ▼
Vite 7 (build)
    │
    │ - Format: IIFE
    │ - Name: "Trustview"
    │ - CSS: inlined via ?inline import
    │ - No external dependencies
    │ - No code splitting
    │ - No source maps (prod)
    │
    ▼
dist/trustview-widget.bundle.js (archivo unico)
    │
    ▼
Deploy a Vercel
    │
    ▼
CDN: https://trust-view-widget.vercel.app/trustview-widget.bundle.js
```

## Consideraciones de Rendimiento

### Cache Strategy

- TanStack Query con `staleTime: 5min` evita refetches innecesarios
- QueryClient singleton compartido entre todos los widgets de la pagina
- Cache por query key unica (`[tipo, storeId, productId]`)

### Shadow DOM Performance

- Cada widget tiene su propio Shadow Root
- CSS duplicado en cada Shadow Root (area de mejora: adoptedStyleSheets)
- React root independiente por widget
