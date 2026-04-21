# Streamline — Frontend

React 19 client for the Streamline product administration system. Uses React Router 7's data APIs (loaders and actions) as the primary data layer, Tailwind CSS 4 with a CSS-first configuration, and Zod for schema validation.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Library | React 19 |
| Build tool | Vite 8 |
| Language | TypeScript 6 |
| Routing / Data | React Router 7 (loaders + actions) |
| Styling | Tailwind CSS 4 (CSS-first, no config file) |
| Validation | Zod 4 |

---

## Project Structure

```
src/
├── actions/                          # React Router actions — handle form mutations
│   ├── deleteProduct.action.ts
│   ├── product.actions.ts            # createProductAction
│   ├── toggleAvailability.action.ts
│   └── updateProduct.action.ts
│
├── app/
│   └── router/
│       └── index.tsx                 # createBrowserRouter — all routes, loaders, actions
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── PageHeader.tsx            # Title + optional breadcrumb + CTA slot
│   │   └── Sidebar.tsx
│   └── ui/                           # Design system — domain-agnostic primitives
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── EmptyState.tsx
│       ├── Input.tsx
│       ├── Label.tsx
│       ├── ProductsTableSkeleton.tsx
│       ├── Skeleton.tsx
│       ├── Spinner.tsx
│       ├── Table.tsx
│       └── Toast.tsx
│
├── features/
│   └── products/                     # Everything scoped to the products domain
│       ├── components/
│       │   ├── ProductCard.tsx       # Compact card for dashboard view
│       │   ├── ProductForm.tsx       # Shared create / edit form
│       │   └── ProductsTable.tsx     # Full table with actions
│       ├── loaders/
│       │   └── products.loader.ts    # productsLoader + productByIdLoader
│       └── types/
│           └── products.ts           # Product and ProductFormData types
│
├── layouts/
│   └── MainLayout.tsx                # Shell with Sidebar + Navbar + <Outlet />
│
├── lib/
│   ├── api/
│   │   └── products.ts              # Centralized fetch client — single source of truth
│   └── utils/
│       ├── cn.ts                     # Conditional Tailwind class helper
│       └── formatCurrency.ts         # Intl.NumberFormat wrapper
│
├── pages/
│   ├── DashboardPage.tsx             # Metrics + recent products + quick actions
│   ├── EditProductPage.tsx           # Preloaded edit form
│   ├── ErrorPage.tsx                 # Catches route and loader errors
│   ├── NewProductPage.tsx            # Create form
│   └── ProductsPage.tsx             # Full product table with skeleton and empty state
│
├── schemas/
│   └── product.schema.ts             # Zod schema — shared between create and edit
│
├── index.css                         # @import tailwindcss + @theme custom tokens
└── main.tsx
```

---

## Architecture

### Data flow — React Router 7 data APIs

The app uses React Router 7's loader/action pattern as its primary data layer. There is no global state manager (no Redux, no Zustand, no Context for data).

```
URL change → loader() → component renders with data
Form submit → action() → redirect or return errors → component re-renders
```

**Loaders** fetch data before the component renders. If a loader throws, the nearest `errorElement` catches it.

**Actions** handle all mutations (create, update, delete, toggle). They receive a `Request` object with form data, call the API client, and either redirect on success or return validation errors.

### Centralized API client

All HTTP interactions go through `src/lib/api/products.ts`. Loaders and actions import from this module — never write `fetch` calls inline. This gives one place to manage the base URL, headers, and error responses.

```typescript
// Every loader and action does this:
import { getProducts, updateProduct } from "../lib/api/products";

// Never this:
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
```

### Component boundaries

`src/components/ui/` contains domain-agnostic primitives (Button, Badge, Table, Toast, etc.). These components never import from `features/`. Domain-specific composition happens in `features/products/components/`.

### Tailwind CSS 4 — CSS-first

No `tailwind.config.ts`. All custom design tokens are defined in `src/index.css` under `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-background: #f9fafb;
  --color-foreground: #111827;
}
```

---

## Setup

### Prerequisites

- Node.js 22+
- Streamline backend running on port 3000

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file at the root of `/frontend`:

```env
VITE_API_URL=http://localhost:3000
```

---

## Scripts

```bash
# Start development server (HMR)
npm run dev

# Type-check + production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

---

## Routing

All routes are defined in `src/app/router/index.tsx`.

| Path | Page | Loader | Action |
|------|------|--------|--------|
| `/` | DashboardPage | — | — |
| `/products` | ProductsPage | `productsLoader` | — |
| `/products/new` | NewProductPage | — | `createProductAction` |
| `/products/:id/edit` | EditProductPage | `productByIdLoader` | `updateProductAction` |
| `/products/delete` | — | — | `deleteProductAction` |
| `/products/toggle` | — | — | `toggleAvailabilityAction` |

---

## Key Conventions

**Naming** — actions are named `[verb][Resource].action.ts`. Loaders are colocated in `features/[domain]/loaders/`.

**Forms** — use React Router's `<Form>` component for all mutations. Avoid controlled state for form fields unless validation feedback requires it. Let the action handle the mutation.

**Error handling** — loaders throw `Response` objects for expected errors (e.g. 404). Actions return error objects (not throw) so the form can display field-level messages without losing the user's input.

**Skeletons over spinners** — loading states use `<ProductsTableSkeleton />` rather than a generic spinner, matching the layout of the content about to appear.
