/* ============================================================
   PRODUCT MODEL
   Sequelize-TypeScript con decoradores estrictos.
   Solo esta capa conoce los detalles de la tabla en Postgres.
   Ningún controller debe importar este archivo directamente —
   toda interacción pasa por product.service.ts.

   image_url: path relativo servido desde /public/uploads/products/
   Se guarda null si el producto no tiene imagen.
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
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import Category from "./Category.model.js";

@Table({
  tableName: "products",
  timestamps: true,
})
class Product extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Unique
  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare sku: string | null;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare name: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description: string | null;

  @ForeignKey(() => Category)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare category_id: number | null;

  @BelongsTo(() => Category)
  declare category: Category | null;

  /* DECIMAL(12,2) — evita imprecisión financiera de FLOAT */
  @AllowNull(false)
  @Column(DataType.DECIMAL(12, 2))
  declare price: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL(12, 2))
  declare cost: number | null;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare stock: number;

  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare availability: boolean;

  /* IMAGE — path relativo, ej: /uploads/products/abc123.webp */
  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare image_url: string | null;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}

export default Product;
