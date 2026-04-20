/* ============================================================
   PRODUCT DTOs
   Tipos de transferencia de datos para el service layer.
   Separados del modelo Sequelize para mantener el límite
   limpio entre ORM y lógica de negocio.
   ============================================================ */

export type CreateProductDTO = {
  name: string;
  price: number;
  availability?: boolean;
};

export type UpdateProductDTO = Partial<CreateProductDTO>;
