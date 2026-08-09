# trustview-widget

Embeddable product review widget for TrustView. Injected into TiendaNube merchant storefronts via a vanilla JS loader script. Renders isolated inside a Shadow DOM so it never conflicts with the merchant's existing styles.

---

## What it is

A React 19 application compiled to a single IIFE bundle (`trustview-widget.bundle.js`). Merchants include the loader script on their storefront; the loader fetches the bundle and mounts the appropriate widgets based on the current page type (home, product list, product detail).

---

## Widget types

| Widget | Component | Description |
|---|---|---|
| Grid of reviews | `GridReviews` | 3-column grid of approved reviews with pagination |
| Last reviews | `LastReviews` | Most recent approved reviews |
| Product rating | `ProductRating` | Average star rating for a product |
| Product rating card | `ProductRatingCard` | Compact rating card with review count |
| Review graph | `ReviewGraph` | Horizontal bar chart showing rating distribution (1★–5★) |
| Review slider | `ReviewSlider` | Horizontal carousel of reviews |

---

## How it works

```
Merchant storefront (TiendaNube)
    │
    └─► <script src="https://trust-view-widget.vercel.app/trustview-widget.bundle.js">
              │
              └─► Reads data attributes on the script tag:
                    data-store-id       — TiendaNube store ID
                    data-widget-type    — which widget to mount
                    data-product-id     — (optional) product external ID
              │
              └─► Creates Shadow DOM host element
              └─► Injects Tailwind CSS into Shadow DOM
              └─► Mounts React widget inside Shadow DOM
              └─► Calls TrustView Core API (GET /widget/*) to fetch data
```

The widget communicates with TrustView Core via public GET endpoints. No authentication is required — the widget identifies itself by `storeId` (validated server-side via `widgetStoreMiddleware`).

All read endpoints use query params:
- `GET /widget/lastreviews?store={id}`
- `GET /widget/product/rating?store={id}&product={id}`
- `GET /widget/product/reviews?store={id}&product={id}`
- `GET /widget/config?store={id}`
- `POST /widget/newReview` — write endpoint (stays POST)

---

## Tech stack

| Aspect | Choice |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite (IIFE library mode) |
| Styling | Tailwind CSS v4 — injected into Shadow DOM |
| Isolation | Shadow DOM (no custom elements, no iframe) |
| i18n | `i18next` (es / en / pt) — translations bundled inline, no async loading |
| Dates | Native `Intl.DateTimeFormat` — no moment.js |
| Deploy | Vercel (`trust-view-widget.vercel.app`) |

---

## Directory structure

```
src/
├── main.tsx             # Mount functions exported per widget type
├── widgets/
│   ├── GridReviews.tsx
│   ├── LastReviews.tsx
│   ├── ProductRating.tsx
│   ├── ProductRatingCard.tsx
│   ├── ReviewGraph.tsx
│   ├── ReviewSlider.tsx
│   ├── components/      # Shared sub-components (stars, review card, etc.)
│   └── types.d.ts       # Shared widget types
├── services/            # API calls to TrustView Core
├── hooks/               # Data-fetching hooks
├── i18n/                # i18next config + locales (es / en / pt)
├── styles/              # Tailwind base styles (injected into Shadow DOM)
└── utils/               # Shared utilities

docs/
└── test.js              # Vanilla JS loader script
```

---

## Build

```bash
npm install
npm run build
```

Output: `dist/trustview-widget.bundle.js` — single IIFE file, ready to serve.

---

## Development

```bash
npm run dev
```

Starts a Vite dev server. Use `docs/test.js` and the `index.html` to test widget mounting locally against a running instance of TrustView Core.

---

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | TrustView Core API base URL (production) |
| `VITE_DEV_API_URL` | TrustView Core API base URL (development) |

---

## Loader script (`docs/test.js`)

The loader is a vanilla JS script merchants embed on their storefront. It:

1. Reads the store ID and current page type (home / product list / product detail)
2. Calls `GET /widget/config?store={id}` to determine which widgets are enabled for the current view
3. Creates a `<div>` host element and attaches a Shadow DOM
4. Injects the widget bundle
5. Calls the appropriate mount function from `main.tsx`

---

## i18n

The widget detects the merchant's locale from the storefront HTML `lang` attribute or the TrustView store config. Supported languages:

| Code | Language |
|---|---|
| `es` | Spanish (neutral) |
| `en` | English |
| `pt` | Portuguese (Brazilian) |

Translations are bundled inside the IIFE — no additional network requests are made for translations.
