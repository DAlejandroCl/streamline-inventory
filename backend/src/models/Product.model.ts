/* ============================================================
   PRODUCT MODEL
   Modelo Sequelize-TypeScript con decoradores estrictos.
   Solo esta capa conoce los detalles de la tabla en Postgres.
   Ningún controller debe importar este archivo directamente.
   ============================================================ */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
} from "sequelize-typescript";

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

  /* PRODUCT NAME */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  /* PRODUCT PRICE */
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare price: number;

  /* PRODUCT AVAILABILITY */
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare availability: boolean;
}

export default Product;
