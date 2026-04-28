/* ============================================================
   USER MODEL
   Stores admin accounts for Streamline.
   Password is never returned in API responses — the toJSON
   override strips it at the model level so no controller
   can accidentally leak it.

   Role is a simple enum: "admin" | "viewer".
   Future phases can extend this with RBAC.
   ============================================================ */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  Default,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

export type UserRole = "admin" | "viewer";

@Table({
  tableName: "users",
  timestamps: true,
})
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare name: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(255))
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare password: string;

  @AllowNull(false)
  @Default("admin")
  @Column(DataType.ENUM("admin", "viewer"))
  declare role: UserRole;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  /* Strip password from every JSON serialization */
  toJSON(): object {
    const values = super.toJSON() as Record<string, unknown>;
    delete values["password"];
    return values;
  }
}
