/* ============================================================
   PRODUCT DTOs
   Tipos de transferencia de datos para el service layer.
   Separados del modelo Sequelize para mantener el límite
   limpio entre ORM y lógica de negocio.
   ============================================================ */

export type CreateProductDTO = {
  name: string;
  sku?: string;
  description?: string;
  category_id?: number;
  price: number;
  cost?: number;
  stock: number;
  availability?: boolean;
};

export type UpdateProductDTO = Partial<CreateProductDTO>;

export type CreateCategoryDTO = {
  name: string;
  color?: string;
};

export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;
