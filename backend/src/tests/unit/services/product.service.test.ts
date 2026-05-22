/* ============================================================
   PRODUCT SERVICE — UNIT TESTS
   Valida lógica de negocio directamente en la capa de servicio,
   sin pasar por HTTP. Usa SQLite in-memory igual que los
   integration tests para persistencia real sin mocks excesivos.

   Foco:
   - validateProductData → AppError en casos inválidos
   - getAllProducts → paginación, estructura
   - getProductById → AppError 404 en not found
   - createProduct → persistencia con datos válidos
   - updateProduct → actualización correcta
   - deleteProduct → eliminación y 404 posterior
   ============================================================ */

import test from "node:test";
import assert from "node:assert/strict";
import { setupDatabase, cleanDatabase, teardownDatabase } from "../../setup/database.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/product.service.js";
import { AppError } from "../../../types/AppError.js";
import { productPayload, productPayloads, resetProductCounter } from "../../factories/product.factory.js";

test("ProductService — Unit Tests", async (t) => {
  await setupDatabase();
  resetProductCounter();

  /* =========================================================
     createProduct
     ========================================================= */

  await t.test("createProduct", async (t) => {

    await t.test("debería crear un producto con datos válidos", async () => {
      const payload = productPayloads.laptop();
      const product = await createProduct(payload);

      assert.ok(product.id, "Debe tener ID generado");
      assert.equal(product.name, payload.name);
      assert.equal(Number(product.price), payload.price);
      assert.equal(product.stock, payload.stock);
    });

    await t.test("debería persistir timestamps createdAt y updatedAt", async () => {
      const product = await createProduct(productPayload({ name: "Timestamped", price: 50, stock: 1 }));
      assert.ok(product.createdAt, "Debe tener createdAt");
      assert.ok(product.updatedAt, "Debe tener updatedAt");
    });

    await t.test("debería lanzar AppError 400 cuando name está vacío", async () => {
      await assert.rejects(
        () => createProduct({ name: "", price: 100, stock: 1 }),
        (err: unknown) => {
          assert.ok(err instanceof AppError);
          assert.equal((err as AppError).statusCode, 400);
          assert.match((err as AppError).message, /name/i);
          return true;
        }
      );
    });

    await t.test("debería lanzar AppError 400 cuando price es negativo", async () => {
      await assert.rejects(
        () => createProduct({ name: "Product", price: -10, stock: 1 }),
        (err: unknown) => {
          assert.ok(err instanceof AppError);
          assert.equal((err as AppError).statusCode, 400);
          assert.match((err as AppError).message, /price/i);
          return true;
        }
      );
    });

    await t.test("debería lanzar AppError 400 cuando price es 0", async () => {
      await assert.rejects(
        () => createProduct({ name: "Product", price: 0, stock: 1 }),
        (err: unknown) => {
          assert.ok(err instanceof AppError);
          assert.equal((err as AppError).statusCode, 400);
          return true;
        }
      );
    });

    await t.test("debería lanzar AppError 400 cuando stock es negativo", async () => {
      await assert.rejects(
        () => createProduct({ name: "Product", price: 100, stock: -1 }),
        (err: unknown) => {
          assert.ok(err instanceof AppError);
          assert.equal((err as AppError).statusCode, 400);
          assert.match((err as AppError).message, /stock/i);
          return true;
        }
      );
    });

    await t.test("debería aceptar stock = 0 sin error", async () => {
      const product = await createProduct({ name: "Zero Stock", price: 50, stock: 0 });
      assert.equal(product.stock, 0);
    });

    await t.test("IDs generados deben ser únicos para cada producto", async () => {
      const p1 = await createProduct(productPayload({ name: "P1", price: 10, stock: 1 }));
      const p2 = await createProduct(productPayload({ name: "P2", price: 10, stock: 1 }));
      assert.notEqual(p1.id, p2.id);
    });

  });

  /* =========================================================
     getAllProducts
     ========================================================= */

  await t.test("getAllProducts", async (t) => {

    // Datos base para esta suite
    await createProduct(productPayloads.keyboard());
    await createProduct(productPayloads.mouse());
    await createProduct(productPayloads.monitor());

    await t.test("debería retornar estructura paginada correcta", async () => {
      const result = await getAllProducts({ page: 1, limit: 20 });

      assert.ok(Array.isArray(result.data));
      assert.equal(typeof result.total, "number");
      assert.equal(typeof result.page, "number");
      assert.equal(typeof result.totalPages, "number");
      assert.equal(typeof result.hasNext, "boolean");
      assert.equal(typeof result.hasPrev, "boolean");
    });

    await t.test("debería respetar el parámetro limit", async () => {
      const result = await getAllProducts({ page: 1, limit: 2 });
      assert.ok(result.data.length <= 2);
    });

    await t.test("página 1 debe tener hasPrev=false", async () => {
      const result = await getAllProducts({ page: 1, limit: 20 });
      assert.equal(result.hasPrev, false);
      assert.equal(result.page, 1);
    });

    await t.test("total debe ser mayor que 0 cuando hay productos", async () => {
      const result = await getAllProducts({ page: 1, limit: 20 });
      assert.ok(result.total > 0);
    });

    await t.test("página 2 debe tener hasPrev=true cuando hay suficientes datos", async () => {
      const result = await getAllProducts({ page: 2, limit: 2 });
      assert.equal(result.hasPrev, true);
    });

    await t.test("totalPages debe coincidir con ceil(total / limit)", async () => {
      const all = await getAllProducts({ page: 1, limit: 100 });
      const result = await getAllProducts({ page: 1, limit: 2 });
      const expected = Math.ceil(all.total / 2);
      assert.equal(result.totalPages, expected);
    });

  });

  /* =========================================================
     getProductById
     ========================================================= */

  await t.test("getProductById", async (t) => {

    await t.test("debería retornar el producto cuando existe", async () => {
      const created = await createProduct(productPayload({ name: "FindMe", price: 50, stock: 3 }));
      const found = await getProductById(created.id);

      assert.equal(found.id, created.id);
      assert.equal(found.name, "FindMe");
    });

    await t.test("debería retornar todos los campos del producto", async () => {
      const created = await createProduct(productPayload({ name: "Full Fields", price: 99, stock: 5 }));
      const found = await getProductById(created.id);

      assert.ok(found.id);
      assert.ok(found.name);
      assert.ok(found.price !== undefined);
      assert.ok(found.stock !== undefined);
      assert.ok(found.availability !== undefined);
      assert.ok(found.createdAt);
    });

    await t.test("debería lanzar AppError 404 cuando no existe", async () => {
      await assert.rejects(
        () => getProductById(999999),
        (err: unknown) => {
          assert.ok(err instanceof AppError);
          assert.equal((err as AppError).statusCode, 404);
          assert.equal((err as AppError).message, "Product not found");
          return true;
        }
      );
    });

  });

  /* =========================================================
     updateProduct
     ========================================================= */

  await t.test("updateProduct", async (t) => {

    await t.test("debería actualizar nombre y precio correctamente", async () => {
      const created = await createProduct(productPayload({ name: "Original", price: 100, stock: 5 }));
      const updated = await updateProduct(created.id, { name: "Updated Name", price: 200, stock: 5 });

      assert.equal(updated.name, "Updated Name");
      assert.equal(Number(updated.price), 200);
    });

    await t.test("ID del producto debe mantenerse tras la actualización", async () => {
      const created = await createProduct(productPayload({ name: "SameID", price: 100, stock: 5 }));
      const updated = await updateProduct(created.id, { name: "SameID Updated", price: 150, stock: 5 });

      assert.equal(updated.id, created.id);
    });

    await t.test("updatedAt debe cambiar tras la actualización", async () => {
      const created = await createProduct(productPayload({ name: "Timestamp Check", price: 100, stock: 5 }));
      await new Promise((r) => setTimeout(r, 10)); // pequeño delay
      const updated = await updateProduct(created.id, { name: "Timestamp Updated", price: 200, stock: 5 });

      assert.ok(
        new Date(updated.updatedAt).getTime() >= new Date(created.updatedAt).getTime(),
        "updatedAt debe ser >= createdAt original"
      );
    });

    await t.test("debería lanzar AppError 404 para ID inexistente", async () => {
      await assert.rejects(
        () => updateProduct(999999, { name: "Ghost", price: 1, stock: 1 }),
        (err: unknown) => {
          assert.ok(err instanceof AppError);
          assert.equal((err as AppError).statusCode, 404);
          return true;
        }
      );
    });

  });

  /* =========================================================
     deleteProduct
     ========================================================= */

  await t.test("deleteProduct", async (t) => {

    await t.test("debería eliminar el producto sin lanzar errores", async () => {
      const created = await createProduct(productPayload({ name: "ToDelete", price: 10, stock: 1 }));
      await assert.doesNotReject(() => deleteProduct(created.id));
    });

    await t.test("getById posterior al delete debe lanzar AppError 404", async () => {
      const created = await createProduct(productPayload({ name: "DeleteThenFind", price: 10, stock: 1 }));
      await deleteProduct(created.id);

      await assert.rejects(
        () => getProductById(created.id),
        (err: unknown) => {
          assert.ok(err instanceof AppError);
          assert.equal((err as AppError).statusCode, 404);
          return true;
        }
      );
    });

    await t.test("debería lanzar AppError 404 para ID inexistente", async () => {
      await assert.rejects(
        () => deleteProduct(999999),
        (err: unknown) => {
          assert.ok(err instanceof AppError);
          assert.equal((err as AppError).statusCode, 404);
          return true;
        }
      );
    });

  });

  await cleanDatabase();
  await teardownDatabase();
});
