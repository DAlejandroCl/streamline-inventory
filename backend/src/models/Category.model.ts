/* ============================================================
   CATEGORY MODEL
   Agrupa productos por tipo (Electronics, Furniture, etc.).
   La columna color es un hex code para identificación visual
   en filtros y badges del frontend.
   ============================================================ */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  HasMany,
} from "sequelize-typescript";
import Product from "./Product.model.js";

@Table({
  tableName: "categories",
  timestamps: true,
})
class Category extends Model {
  /* PRIMARY KEY */
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  /* CATEGORY NAME */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  /* COLOR — hex code for visual identification */
  @Default("#6366f1")
  @Column({
    type: DataType.STRING(7),
    allowNull: false,
  })
  declare color: string;

  /* ASSOCIATION */
  @HasMany(() => Product)
  declare products: Product[];
}

export default Category;
