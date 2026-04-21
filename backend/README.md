# Streamline — Backend

REST API for the Streamline product administration system. Built with Express 5, TypeScript 6 strict mode, and Sequelize on PostgreSQL. Follows a clean Controller → Service → Model architecture with typed operational errors and native Node.js testing.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 22+ |
| Framework | Express 5.2 |
| Language | TypeScript 6 (strict) |
| ORM | Sequelize 6 + sequelize-typescript |
| Database | PostgreSQL (prod) / SQLite in-memory (test) |
| Testing | Node.js native test runner + supertest + c8 |
| Docs | Swagger UI / OpenAPI 3.0 |
| Validation | express-validator |

---

## Project Structure

```
src/
├── config/
│   ├── db.ts                     # Sequelize instance — Postgres or SQLite based on NODE_ENV
│   └── swagger.ts                # OpenAPI 3.0 base spec and component schemas
├── controllers/
│   └── product.controllers.ts    # Thin HTTP handlers — no try-catch, no model imports
├── middlewares/
│   ├── error.middleware.ts       # Global error handler — registered last in server.ts
│   └── validation.middleware.ts  # express-validator result checker — short-circuits on 400
├── models/
│   └── Product.model.ts          # Sequelize-TypeScript with @Table, @Column, @Default decorators
├── routes/
│   └── product.routes.ts         # Route definitions + validation rules + Swagger JSDoc
├── services/
│   └── product.service.ts        # All business logic and ORM calls — single source of truth
├── tests/
│   ├── product.test.ts           # Integration tests covering full CRUD + edge cases
│   └── setup.ts                  # SQLite lifecycle: setup / cleanup / teardown
├── types/
│   ├── AppError.ts               # Operational error class with HTTP status code
│   └── product.dto.ts            # CreateProductDTO and UpdateProductDTO
├── index.ts                      # Bootstrap: connect DB → start HTTP server
└── server.ts                     # Express app assembly and middleware order
```

---

## Architecture

### Controller → Service → Model

Controllers are pure HTTP handlers. They receive a request, call the appropriate service function, and return a response. They never import Sequelize models directly.

```
Request → Route → Validation → Controller → Service → Model → DB
                                                ↓
                                           AppError
                                                ↓
                                       errorHandler (last middleware)
```

### Express 5 async error propagation

Express 5 automatically catches rejected promises from async route handlers and forwards them to the next error-handling middleware. This means controllers require no try-catch blocks — any `throw` inside a service function propagates cleanly to `errorHandler`.

### Typed operational errors

`AppError` extends `Error` with a `statusCode` field. The global error handler uses `instanceof AppError` to distinguish expected failures (404 not found, 400 validation) from unexpected bugs (500 internal). No string comparisons.

```typescript
// service
throw new AppError("Product not found", 404);

// error handler
if (error instanceof AppError) {
  res.status(error.statusCode).json({ message: error.message });
}
```

---

## Setup

### Prerequisites

- Node.js 22+
- PostgreSQL database

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file at the root of `/backend`:

```env
DATABASE_URL=postgres://user:password@localhost:5432/streamline
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

---

## Scripts

```bash
# Start development server with watch mode
npm run dev

# Compile TypeScript to dist/
npm run build

# Run compiled production build
npm start

# Run integration test suite
npm test

# Run tests with coverage report (c8)
npm run coverage
```

---

## API Reference

Interactive documentation available at `http://localhost:3000/docs` once the server is running.

### Base URL

```
http://localhost:3000/api/products
```

### Endpoints

| Method | Path | Description | Body required |
|--------|------|-------------|---------------|
| `GET` | `/` | List all products | — |
| `GET` | `/:id` | Get product by ID | — |
| `POST` | `/` | Create a product | `name`, `price` |
| `PUT` | `/:id` | Full replace | `name`, `price` |
| `PATCH` | `/:id` | Partial update | any field |
| `DELETE` | `/:id` | Delete a product | — |

### Request bodies

**POST / PUT**
```json
{
  "name": "Laptop Pro 16",
  "price": 1499
}
```

**PATCH** — all fields optional:
```json
{
  "name": "Laptop Pro 16",
  "price": 1299,
  "availability": false
}
```

### Responses

**Success — single product:**
```json
{
  "id": 1,
  "name": "Laptop Pro 16",
  "price": 1499,
  "availability": true,
  "createdAt": "2026-04-20T10:00:00.000Z",
  "updatedAt": "2026-04-20T10:00:00.000Z"
}
```

**Error:**
```json
{
  "message": "Product not found"
}
```

**Validation error:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Price must be greater than 0",
      "path": "price",
      "location": "body"
    }
  ]
}
```

---

## Testing

Tests run against an in-memory SQLite database — no PostgreSQL required. The database is created fresh before the suite and destroyed after, guaranteeing full isolation.

```bash
npm test
```

```bash
npm run coverage
```

### Test cases

| Endpoint | Case | Expected |
|----------|------|----------|
| `POST /` | Valid body | 201 + product |
| `POST /` | Missing name | 400 + errors |
| `POST /` | Missing price | 400 + errors |
| `POST /` | Price ≤ 0 | 400 + errors |
| `POST /` | Empty body | 400 + errors |
| `GET /` | Any state | 200 + array |
| `GET /:id` | Existing ID | 200 + product |
| `GET /:id` | Unknown ID | 404 |
| `PUT /:id` | Valid body | 200 + updated |
| `PUT /:id` | Missing fields | 400 + errors |
| `PUT /:id` | Unknown ID | 404 |
| `PATCH /:id` | availability only | 200 + patched |
| `PATCH /:id` | price only | 200 + patched |
| `PATCH /:id` | Unknown ID | 404 |
| `DELETE /:id` | Existing ID | 200 |
| `DELETE /:id` | After delete GET | 404 |
| `DELETE /:id` | Unknown ID | 404 |
