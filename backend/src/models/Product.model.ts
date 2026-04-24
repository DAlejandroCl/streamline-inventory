/* ============================================================
   PRODUCT MODEL
   Modelo Sequelize-TypeScript con decoradores estrictos.
   Solo esta capa conoce los detalles de la tabla en Postgres.
   Ningún controller debe importar este archivo directamente —
   toda interacción pasa por product.service.ts.

   Cambios respecto al modelo original:
   - FLOAT → DECIMAL(12,2): evita imprecisión financiera
   - Añadido: sku, description, category_id, cost, stock
   - BelongsTo Category para eager loading con include
   ============================================================ */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
  Unique,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Category from "./Category.model.js";

@Table({
  tableName: "products",
  timestamps: true,
})
class Product extends Model {
  /* PRIMARY KEY */
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  /* SKU — optional internal reference code */
  @Unique
  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare sku: string | null;

  /* PRODUCT NAME */
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare name: string;

  /* DESCRIPTION */
  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description: string | null;

  /* CATEGORY FK */
  @ForeignKey(() => Category)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare category_id: number | null;

  @BelongsTo(() => Category)
  declare category: Category | null;

  /* SALE PRICE — DECIMAL avoids floating point imprecision */
  @AllowNull(false)
  @Column(DataType.DECIMAL(12, 2))
  declare price: number;

  /* COST PRICE — for margin calculation */
  @AllowNull(true)
  @Column(DataType.DECIMAL(12, 2))
  declare cost: number | null;

  /* STOCK QUANTITY */
  @Default(0)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare stock: number;

  /* AVAILABILITY — manual override independent of stock */
  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare availability: boolean;
}

export default Product;
