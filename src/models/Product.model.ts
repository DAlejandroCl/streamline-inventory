import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement
} from "sequelize-typescript";

// MODEL DEFINITION
@Table({
  tableName: "products",
  timestamps: true
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
    allowNull: false
  })
  declare name: string;

  // PRODUCT PRICE
  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  declare price: number;
}

export default Product;