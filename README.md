# Streamline — Product Administration System

A production-grade full stack application for product inventory management. Built as a portfolio project demonstrating clean architecture, strict TypeScript, and modern tooling across the entire PERN stack.

---

## Tech Stack

**Backend**
- Node.js + Express 5 (native async error handling)
- TypeScript 6 with strict mode
- Sequelize + sequelize-typescript (PostgreSQL / SQLite for tests)
- Native Node.js test runner + supertest + c8
- Swagger / OpenAPI 3.0

**Frontend**
- React 19 + Vite 8
- React Router 7 (loaders, actions, typed routes)
- Tailwind CSS 4 (CSS-first, no config file)
- Zod (schema validation)

---

## Project Structure

```
streamline/
├── backend/
│   └── src/
│       ├── config/
│       │   ├── db.ts                     # Sequelize instance (Postgres / SQLite)
│       │   └── swagger.ts                # OpenAPI 3.0 spec
│       ├── controllers/
│       │   └── product.controllers.ts    # Thin HTTP handlers — no try-catch
│       ├── middlewares/
│       │   ├── error.middleware.ts       # Global error handler (must be last)
│       │   └── validation.middleware.ts  # express-validator short-circuit
│       ├── models/
│       │   └── Product.model.ts          # Sequelize-TypeScript with decorators
│       ├── routes/
│       │   └── product.routes.ts         # Routes + Swagger JSDoc
│       ├── services/
│       │   └── product.service.ts        # Business logic layer
│       ├── tests/
│       │   ├── product.test.ts           # Integration tests (full CRUD)
│       │   └── setup.ts                  # SQLite in-memory lifecycle helpers
│       ├── types/
│       │   ├── AppError.ts               # Typed operational error class
│       │   └── product.dto.ts            # CreateProductDTO / UpdateProductDTO
│       ├── index.ts                      # Bootstrap — DB then HTTP
│       └── server.ts                     # Express app + middleware order
│
├── frontend/
│   └── src/
│       ├── actions/                      # React Router actions (CRUD mutations)
│       ├── app/router/                   # createBrowserRouter + typed loaders
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.tsx
│       │   │   ├── PageHeader.tsx        # Title + breadcrumb + CTA slot
│       │   │   └── Sidebar.tsx
│       │   └── ui/                       # Design system base components
│       │       ├── Badge.tsx
│       │       ├── Button.tsx
│       │       ├── Card.tsx
│       │       ├── EmptyState.tsx
│       │       ├── Input.tsx
│       │       ├── Label.tsx
│       │       ├── ProductsTableSkeleton.tsx
│       │       ├── Skeleton.tsx
│       │       ├── Spinner.tsx
│       │       ├── Table.tsx
│       │       └── Toast.tsx
│       ├── features/
│       │   └── products/
│       │       ├── components/
│       │       │   ├── ProductCard.tsx
│       │       │   ├── ProductForm.tsx
│       │       │   └── ProductsTable.tsx
│       │       ├── loaders/
│       │       │   └── products.loader.ts
│       │       └── types/
│       │           └── products.ts
│       ├── layouts/
│       │   └── MainLayout.tsx
│       ├── lib/
│       │   ├── api/
│       │   │   └── products.ts           # Centralized API client
│       │   └── utils/
│       │       ├── cn.ts                 # Conditional class helper
│       │       └── formatCurrency.ts     # Intl.NumberFormat wrapper
│       ├── pages/
│       │   ├── DashboardPage.tsx
│       │   ├── EditProductPage.tsx
│       │   ├── ErrorPage.tsx
│       │   ├── NewProductPage.tsx
│       │   └── ProductsPage.tsx
│       └── schemas/
│           └── product.schema.ts         # Zod validation schema
│
└── README.md
```

---

## Architecture Decisions

**Express 5 native async error handling** — controllers are plain async functions with no try-catch. Rejected promises propagate automatically to the global `errorHandler` middleware, which must be registered last in `server.ts`.

**Service / Repository pattern** — controllers never import Sequelize models directly. All ORM interactions are encapsulated in `product.service.ts`. This makes the business logic independently testable and the controllers trivially thin.

**Typed operational errors** — `AppError` carries an HTTP status code. The error handler uses `instanceof AppError` to distinguish expected operational failures (404, 400) from unexpected bugs (500), without fragile string comparisons.

**Feature-based frontend structure** — domain logic lives in `src/features/products/` (components, loaders, types). `src/components/ui/` is reserved for domain-agnostic primitives that form the design system. Nothing in `ui/` imports from `features/`.

**Centralized API client** — all HTTP calls go through `src/lib/api/products.ts`. Loaders and actions import from this module — never construct `fetch` calls inline. One place to update base URL, headers, or error handling.

**Tailwind CSS 4 — CSS-first** — no `tailwind.config.ts`. Custom tokens live in `src/index.css` under `@theme`.

---

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL (for development) — or skip it, tests run on SQLite in-memory

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgres://user:password@localhost:5432/streamline
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

```bash
# Development (watch mode)
npm run dev

# Production build
npm run build && npm start

# Run tests
npm test

# Coverage report
npm run coverage
```

API will be available at `http://localhost:3000`.
Swagger docs at `http://localhost:3000/docs`.

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

App will be available at `http://localhost:5173`.

---

## API Reference

Full interactive documentation available at `/docs` (Swagger UI).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Full update (name + price required) |
| PATCH | `/api/products/:id` | Partial update (all fields optional) |
| DELETE | `/api/products/:id` | Delete product |

**POST / PUT body:**
```json
{
  "name": "Laptop Pro 16",
  "price": 1499
}
```

**PATCH body** (any combination):
```json
{
  "name": "Laptop Pro 16",
  "price": 1299,
  "availability": false
}
```

---

## Testing

Tests use the native Node.js test runner (`node --test`) with `supertest` for HTTP assertions and an in-memory SQLite database for full isolation — no external dependencies required to run the suite.

```bash
cd backend && npm test
```

Coverage is measured with `c8`:

```bash
cd backend && npm run coverage
```

**Test coverage:**
- `POST /api/products` — 201 created, 400 missing name, 400 missing price, 400 price ≤ 0, 400 empty body
- `GET /api/products` — 200 list
- `GET /api/products/:id` — 200 found, 404 not found
- `PUT /api/products/:id` — 200 updated, 400 validation, 404 not found
- `PATCH /api/products/:id` — 200 availability patched, 200 price only, 404 not found
- `DELETE /api/products/:id` — 200 deleted, 404 after delete, 404 not found

---

## Author

**Diego Clavijo** — Full Stack Developer
