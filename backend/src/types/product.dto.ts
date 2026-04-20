/* ============================================================
   PRODUCT DTOs
   Shared data-transfer types consumed by the service layer.
   Kept separate from the Sequelize model to maintain clean
   architecture boundaries between ORM and business logic.
   ============================================================ */

export type CreateProductDTO = {
  name: string;
  price: number;
  availability?: boolean;
};

export type UpdateProductDTO = Partial<CreateProductDTO>;