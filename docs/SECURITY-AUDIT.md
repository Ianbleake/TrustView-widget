# TrustView Widget — Auditoria de Seguridad y Optimizacion

> Fecha: 2026-04-05  
> Stack: React 19 + Vite 7 IIFE + Shadow DOM + TanStack Query 5

---

## Resumen

| Categoria | Alta | Media | Baja | Total |
|-----------|------|-------|------|-------|
| Seguridad | 5 | 4 | 2 | **11** |
| Optimizacion | 2 | 6 | 2 | **10** |
| **Total** | **7** | **10** | **4** | **21** |

---

## Hallazgos de Seguridad

### ALTOS

| ID | Issue | Archivos | Impacto |
|----|-------|----------|---------|
| SEC-01 | CORS `origin: true` — todos los origenes aceptados | `TrustView-Core/src/app.js` | Cualquier sitio puede llamar a la API del widget |
| SEC-02 | Sin rate limiting en `/widget/newReview` | `widgetRoutes.js` | Spam masivo de reviews falsas desde cualquier IP |
| SEC-03 | Sin middleware de validacion en rutas del widget — `validateMiddleware.js` vacio | `widgetRoutes.js`, `validateMiddleware.js` | Payloads malformados llegan a la DB |
| SEC-04 | XSS via `productUrl` en `<a href>` sin sanitizacion de protocolo | `ReviewCard/index.tsx` | `javascript:` URLs ejecutadas en tiendas de clientes |
| SEC-05 | `storeId` tipo `number` en loader vs `string` en hooks — cache keys inconsistentes | `main.tsx`, hooks, `types.d.ts` | Requests duplicados, queries que no ejecutan |

### MEDIOS

| ID | Issue | Archivos | Impacto |
|----|-------|----------|---------|
| SEC-06 | Shadow DOM `mode: "open"` — accesible por scripts del tema | `main.tsx` | Scripts de terceros pueden leer/mutar el widget |
| SEC-07 | Sin SRI hash en carga del bundle — supply chain risk | `docs/test.js` | Bundle comprometido se carga silenciosamente |
| SEC-08 | `window.Trustview` global callable por cualquier script | `main.tsx` | Mount con storeId arbitrarios, requests extra |
| SEC-09 | 4 High + 1 Moderate npm vulnerabilities (build deps) | `package.json` | Rollup path traversal en CI comprometido |

### BAJOS

| ID | Issue | Archivos | Impacto |
|----|-------|----------|---------|
| SEC-10 | Version leak `console.log("v.2.3")` en loader | `docs/test.js` | Fingerprinting de version para ataques dirigidos |
| SEC-11 | Links sin `rel="noopener noreferrer"` | `ReviewCard/index.tsx` | Opener reference + referer leak |

---

## Hallazgos de Optimizacion

### ALTOS

| ID | Issue | Archivos | Impacto |
|----|-------|----------|---------|
| OPT-01 | `moment.js` +70KB gzip en bundle IIFE | `formatDate.ts`, `package.json` | Mayor cuello de botella de tamanio del bundle |
| OPT-02 | `MutationObserver` nunca desconectado — fire en cada DOM mutation | `docs/test.js` | Memory leak perpetuo, CPU drain en paginas activas |

### MEDIOS

| ID | Issue | Archivos | Impacto |
|----|-------|----------|---------|
| OPT-03 | `QueryClient` singleton sin `gcTime` — 50 cached entries en listados | `queryClient.ts` | Memoria acumulada sin GC rapido |
| OPT-04 | `staleTime` duplicado en config global Y cada hook | `queryClient.ts`, todos los hooks | Config global es dead code, riesgo de mantenimiento |
| OPT-05 | Sin paginacion en `getProductReviews` — carga todas las reviews | `widgetService.js`, `GridReviews.tsx` | Productos con 500+ reviews cargan todo en cada page load |
| OPT-06 | `react-hook-form` (+25KB) para modal raramente usado | `ReviewModal/index.tsx` | Bundle bloat para 3 campos de formulario |
| OPT-07 | CSS de Tailwind inyectado en cada Shadow Root (x50 en listados) | `styles/index.css`, `main.tsx` | 50 copias del mismo CSS en memoria |
| OPT-08 | `position: fixed` en Shadow DOM — rompe con `transform` en ancestros | `ReviewModal/index.tsx` | Modal no cubre viewport en ciertos temas |

### BAJOS

| ID | Issue | Archivos | Impacto |
|----|-------|----------|---------|
| OPT-09 | `animate-fade-in`/`animate-scale-in` no definidas | `ReviewModal/index.tsx` | Modal sin animacion, silenciosamente |
| OPT-10 | `src/app/index.tsx` scaffold de Vite sobrante | `src/app/index.tsx` | Dead code que confunde a contribuidores |

---

## Metricas de Bundle (estimadas)

| Dependencia | Tamanio gzip (aprox) | Necesaria? |
|-------------|---------------------|------------|
| React 19 + ReactDOM | ~40KB | Si |
| TanStack Query 5 | ~12KB | Si |
| react-hook-form | ~25KB | Reemplazable |
| moment.js + locale | ~70KB | Reemplazable |
| Tailwind CSS (purged) | ~5-10KB | Si |
| Codigo del widget | ~10KB | Si |
| **Total estimado** | **~160-170KB** | - |
| **Sin moment + RHF** | **~65-75KB** | Objetivo |

Reemplazar `moment.js` y `react-hook-form` reduciria el bundle a menos de la mitad.

---

## Recomendaciones Inmediatas

1. **Reemplazar moment.js** — Usar `Intl.DateTimeFormat` nativo o `date-fns` tree-shaked
2. **Rate limit + validacion Zod en widget routes** — Prevenir spam y XSS
3. **Sanitizar productUrl** — Whitelist solo http/https en backend + frontend
4. **Debounce + disconnect MutationObserver** — Performance en tiendas activas
5. **Estandarizar storeId como string** — Prevenir bugs de cache y queries
