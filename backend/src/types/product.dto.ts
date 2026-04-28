/* ============================================================
   PRODUCT DTOs
   Tipos de transferencia de datos para el service layer.
   Separados del modelo Sequelize para mantener el límite
   limpio entre ORM y lógica de negocio.

   image_url: path relativo generado por Multer.
   Se omite del DTO de entrada — el controller lo inyecta
   desde req.file después de que Multer procesa el archivo.
   ============================================================ */

export type CreateProductDTO = {
  name: string;
  sku?: string;
  description?: string;
  category_id?: number | null;
  price: number;
  cost?: number;
  stock: number;
  availability?: boolean;
  image_url?: string | null;
};

export type UpdateProductDTO = Partial<CreateProductDTO>;

export type CreateCategoryDTO = {
  name: string;
  color?: string;
};

export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;
