import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
} from "sequelize-typescript";

// MODEL DEFINITION
@Table({
  tableName: "products",
  timestamps: true,
})
class Product extends Model {
  // PRIMARY KEY
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // PRODUCT NAME
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  // PRODUCT PRICE
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare price: number;

  // PRODUCT AVAILABILITY
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare availability: boolean;
}

export default Product;
