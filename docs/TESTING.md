# Streamline — Testing Infrastructure

## Resumen

| Suite | Tests | Estado |
|-------|-------|--------|
| Backend Integration — Products API | 49 | ✅ |
| Backend Integration — Categories API | 14 | ✅ |
| Backend Unit — ProductService | 30 | ✅ |
| Backend Unit — Error Middleware | 7 | ✅ |
| Frontend Integration — ProductsPage | 15 | ✅ |
| Frontend Component — ProductsTable | 16 | ✅ |
| Frontend Component — ProductForm | 22 | ✅ |
| Frontend Unit — ProductSchema (Zod) | 20 | ✅ |
| Frontend Unit — Utils (formatCurrency, cn) | 18 | ✅ |
| **TOTAL** | **191** | **✅ 191/191** |

---

## Stack de Testing

### Backend
- **Runner**: Node.js Test Runner nativo (`node --test`)
- **HTTP**: Supertest
- **DB**: SQLite in-memory (aislada por suite)
- **Auth**: Login real con `seedAdminUser()` → cookie JWT

### Frontend
- **Runner**: Vitest
- **Componentes**: React Testing Library
- **Mocking HTTP**: MSW (Mock Service Worker) v2
- **Router**: `createMemoryRouter` (data router real de React Router 7)

---

## Estructura

```
backend/src/tests/
├── setup/
│   └── database.ts          ← SQLite lifecycle (setup/clean/teardown)
├── factories/
│   ├── product.factory.ts   ← Generador de payloads de producto
│   └── category.factory.ts  ← Generador de payloads de categoría
├── helpers/
│   └── request.helper.ts    ← createAuthApi, createApi, assertions
├── integration/
│   ├── products/
│   │   └── products.test.ts ← CRUD completo + auth guard
│   └── categories/
│       └── categories.test.ts
└── unit/
    ├── services/
    │   └── product.service.test.ts
    └── middleware/
        └── error.middleware.test.ts

frontend/src/tests/
├── setup/
│   └── vitest.setup.ts      ← jest-dom, MSW lifecycle, window mocks
├── msw/
│   ├── server.ts            ← setupServer(handlers)
│   └── handlers/
│       └── products.handlers.ts ← MSW handlers para /api/products
├── factories/
│   └── product.factory.ts   ← makeProduct, makeProducts, productVariants
└── helpers/
    └── renderWithProviders.tsx ← createMemoryRouter + all context providers

frontend/src/features/products/__tests__/
├── integration/
│   └── ProductsPage.test.tsx ← loader → MSW → render → UI
├── components/
│   ├── ProductsTable.test.tsx
│   └── ProductForm.test.tsx
└── unit/
    ├── utils.test.ts         ← formatCurrency, cn
    └── product.schema.test.ts ← Zod schema validations
```

---

## Comandos

### Backend
```bash
# Suite completa
cd backend && npm test

# Solo integration
npm run test:integration

# Solo unit
npm run test:unit

# Con watch mode
npm run test:watch
```

### Frontend
```bash
# Suite completa
cd frontend && npm run test:run

# Con UI interactiva
npm run test:ui

# Con watch
npm run test

# Con coverage
npm run coverage
```

---

## Notas Técnicas

### Auth en Backend Tests
Todas las rutas protegidas usan `createAuthApi(server)` que:
1. Llama a `seedAdminUser()` para crear el admin si no existe
2. Hace login real en `POST /api/auth/login`
3. Extrae la cookie JWT `token=<value>` de la respuesta
4. Adjunta la cookie a todas las requests subsecuentes

### ILIKE en SQLite
Los tests de búsqueda (`?search=`) omiten validación estricta en SQLite
porque `Op.iLike` es exclusivo de PostgreSQL. En producción con PostgreSQL
la búsqueda funciona correctamente.

**Fix recomendado** (auditoría técnica): reemplazar `Op.iLike` por
`Op.like` con `Sequelize.fn('LOWER', ...)` para compatibilidad cross-DB.

### MSW y VITE_API_URL
Los handlers de MSW usan `http://localhost:3000` como base URL.
El `vite.config.ts` inyecta `VITE_API_URL=http://localhost:3000` en
el entorno de test para que el API client use la misma URL.

---

## Próximas Fases (Plan Maestro)

### Fase 2 — Robustez (pendiente)
- [ ] Tests de `NewProductPage` (form → action → redirect)
- [ ] Tests de `EditProductPage` (loader → precarga → update)
- [ ] Tests del `DeleteModal` (confirmación → DELETE → UI sync)
- [ ] Tests de error boundaries globales
- [ ] Tests de security (CORS, rate limiting) en backend

### Fase 3 — Calidad Productiva
- [ ] Accessibility tests con axe-core
- [ ] Playwright E2E: flujos críticos end-to-end
- [ ] Smoke tests post-deploy

### Fase 4 — Nivel Profesional
- [ ] GitHub Actions CI/CD pipeline
- [ ] Coverage reports automáticos
- [ ] Quality gates (bloquear deploy si tests fallan)
