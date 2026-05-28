# Streamline — Testing & CI/CD Documentation

## Resumen ejecutivo

| Capa | Tests | Estado |
|---|---|---|
| Backend — Integration (Products API) | 49 | ✅ |
| Backend — Integration (Categories API) | 14 | ✅ |
| Backend — Integration (Security) | 22 | ✅ |
| Backend — Unit (ProductService) | 30 | ✅ |
| Backend — Unit (Error Middleware) | 7 | ✅ |
| Frontend — Integration (ProductsPage) | 15 | ✅ |
| Frontend — Integration (NewProductPage) | 10 | ✅ |
| Frontend — Integration (EditProductPage) | 14 | ✅ |
| Frontend — Integration (ErrorPage) | 12 | ✅ |
| Frontend — Unit (createProductAction) | 16 | ✅ |
| Frontend — Unit (updateProductAction) | 12 | ✅ |
| Frontend — Unit (deleteProductAction) | 6 | ✅ |
| Frontend — Unit (toggleAvailabilityAction) | 8 | ✅ |
| Frontend — Component (ProductsTable) | 16 | ✅ |
| Frontend — Component (ProductForm) | 22 | ✅ |
| Frontend — Unit (ProductSchema) | 20 | ✅ |
| Frontend — Unit (Utils: formatCurrency, cn) | 18 | ✅ |
| Frontend — Accessibility (axe-core) | 21 | ✅ |
| **TOTAL AUTOMATIZADOS** | **312** | **✅ 312/312** |
| E2E Playwright (35 specs) | smoke, auth, CRUD, search, a11y | 🟡 requiere servidores |

---

## Stack de Testing

### Backend
- **Runner**: Node.js Test Runner nativo (`node --test`) — sin dependencias extra
- **HTTP**: Supertest
- **Base de datos**: SQLite in-memory — aislada por suite, sin PostgreSQL en CI
- **Auth**: Login real con `seedAdminUser()` → cookie JWT en cada suite

### Frontend
- **Runner**: Vitest con jsdom
- **Componentes**: React Testing Library
- **Mocking HTTP**: MSW v2 (Mock Service Worker)
- **Router**: `createMemoryRouter` (data router real de React Router 7)
- **Actions**: `vi.stubGlobal("fetch", vi.fn())` para tests de actions directos
- **Accessibility**: axe-core via vitest-axe

### E2E
- **Framework**: Playwright
- **Browsers**: Chromium, Firefox
- **Auth**: `loginAsAdmin()` helper reutilizable

---

## Estructura de archivos

```
backend/src/tests/
├── setup/database.ts           ← SQLite lifecycle (setup/clean/teardown)
├── factories/
│   ├── product.factory.ts
│   └── category.factory.ts
├── helpers/request.helper.ts   ← createAuthApi, createApi, assertions
├── integration/
│   ├── products/products.test.ts      ← 49 tests CRUD + auth guard
│   ├── categories/categories.test.ts  ← 14 tests
│   └── security/security.test.ts      ← 22 tests CORS, Helmet, Rate limit
└── unit/
    ├── services/product.service.test.ts     ← 30 tests
    └── middleware/error.middleware.test.ts  ← 7 tests

frontend/src/
├── tests/
│   ├── setup/vitest.setup.ts         ← jest-dom, MSW, axe, browser mocks
│   ├── msw/
│   │   ├── server.ts
│   │   └── handlers/products.handlers.ts
│   ├── factories/product.factory.ts
│   └── helpers/renderWithProviders.tsx
│
└── features/products/__tests__/
    ├── integration/
    │   ├── ProductsPage.test.tsx     ← 15 tests loader → MSW → UI
    │   ├── NewProductPage.test.tsx   ← 10 tests form → action → redirect
    │   ├── EditProductPage.test.tsx  ← 14 tests loader precarga → update
    │   └── ErrorPage.test.tsx        ← 12 tests error boundaries
    ├── components/
    │   ├── ProductsTable.test.tsx    ← 16 tests
    │   └── ProductForm.test.tsx      ← 22 tests
    ├── unit/
    │   ├── utils.test.ts             ← 18 tests formatCurrency, cn
    │   ├── product.schema.test.ts    ← 20 tests Zod validations
    │   ├── product.action.test.ts    ← 16 tests createProductAction
    │   ├── updateProduct.action.test.ts  ← 12 tests
    │   ├── deleteProduct.action.test.ts  ← 6 tests
    │   └── toggleAvailability.action.test.ts ← 8 tests
    └── accessibility/
        └── a11y.test.tsx             ← 21 tests axe-core

frontend/e2e/
├── helpers/auth.ts        ← loginAsAdmin helper
├── smoke.spec.ts          ← 8 specs post-deploy validation
├── auth.spec.ts           ← 7 specs authentication flows
├── inventory.spec.ts      ← 7 specs CRUD completo
├── search-navigation.spec.ts ← 7 specs búsqueda y paginación
└── accessibility.spec.ts  ← 6 specs axe en browser real

.github/workflows/
├── ci.yml              ← CI principal: lint + test + build + coverage
├── pr-validation.yml   ← Feedback rápido en PRs: typecheck + lint
├── coverage.yml        ← Reporte de cobertura como comentario en PR
└── e2e.yml             ← Playwright en merge a main
```

---

## Comandos

### Backend
```bash
cd backend

# Tests completos
npm test

# Solo integration
npm run test:integration

# Solo unit
npm run test:unit

# Watch mode
npm run test:watch
```

### Frontend
```bash
cd frontend

# Tests completos
npm run test:run

# Con watch
npm run test

# Con UI interactiva de Vitest
npm run test:ui

# Coverage con reporte HTML
npm run coverage

# Lint (para CI — con max-warnings)
npm run lint:ci
```

### E2E (requiere backend + frontend levantados)
```bash
cd frontend

# Instalar browsers (solo primera vez)
npx playwright install --with-deps chromium

# Smoke tests (< 30s — ideal post-deploy)
npm run e2e:smoke

# Suite completa
npm run e2e

# Modo interactivo
npm run e2e:ui

# Ver reporte del último run
npm run e2e:report
```

---

## CI/CD Pipeline

### Flujo por evento

| Evento | Workflow | Tiempo estimado |
|---|---|---|
| PR abierto / push | `pr-validation.yml` | ~60s |
| PR abierto / push | `ci.yml` | ~3-4min |
| PR abierto | `coverage.yml` | ~4-5min |
| Merge a main | `e2e.yml` | ~8-10min |

### Quality Gates

El merge a `main` está bloqueado si:
- `backend-ci` falla (tests o build)
- `frontend-ci` falla (lint, typecheck, tests, build)

El E2E (`e2e.yml`) corre después del merge — si falla, genera una alerta pero no bloquea retroactivamente.

### Secrets requeridos en GitHub

| Secret | Descripción | Requerido en |
|---|---|---|
| `JWT_SECRET` | Para los tests de seguridad/auth en CI | ci.yml, e2e.yml |
| `CODECOV_TOKEN` | Para subir coverage a Codecov | ci.yml |
| `DATABASE_URL_TEST` | DB de staging para E2E (opcional — usa SQLite si no existe) | e2e.yml |

---

## Notas Técnicas

### Por qué SQLite en CI
El backend usa `NODE_ENV=test` para activar SQLite in-memory en lugar de PostgreSQL. Esto elimina la necesidad de levantar una instancia de Postgres en el runner de GitHub Actions, reduciendo el tiempo del CI de ~4min a ~90s.

### Por qué vi.mock(ImageUpload) en integration tests
El componente `ProductForm` incluye `ImageUpload` que renderiza un `<input type="file" name="image">`. Cuando el formulario se envía en tests, MSW intenta leer el `FormData` incluyendo el campo imagen vacío (un `File` blob vacío), lo que causa que el parser quede pendiente indefinidamente en Node.js/jsdom. La solución es mockear `ImageUpload` en los tests que hacen submit de formularios.

### Por qué actions se testean directamente (no a través del router)
Los `createProductAction`, `updateProductAction`, etc., se testean llamando la función directamente con `vi.stubGlobal("fetch", vi.fn())`. Intentar testarlos a través del router completo con MSW falla porque el mismo problema del `FormData` + imagen afecta la request del formulario hacia MSW. Los integration tests del router cubren el flujo visible al usuario (render, Zod validation, loading state, redirect), y los unit tests de actions cubren los error scenarios.

### Deuda técnica documentada
- `backend/src/config/swagger.ts` — falta `@types/swagger-jsdoc`
- `backend/src/controllers/product.controllers.ts` — DTO parcial en PATCH
- `frontend/src/pages/SettingsPage.tsx` — `PasswordInput` definido dentro del render

---

## Fases implementadas

| Fase | Contenido |
|---|---|
| **Fase 1** | Infraestructura de testing: factories, helpers, MSW, setup. Tests CRUD backend, unit tests frontend. |
| **Fase 2** | Robustez: integration tests de pages (New/Edit/Error), unit tests de todos los actions, security tests backend. |
| **Fase 3** | Calidad productiva: accessibility con axe-core (21 tests), Playwright E2E (35 specs). |
| **Fase 4** | Nivel profesional: CI/CD con 4 workflows de GitHub Actions, coverage reports automáticos, quality gates, fixes de lint/typecheck. |
