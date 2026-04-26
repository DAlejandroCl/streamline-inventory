import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import DashboardPage from "../../pages/DashboardPage";
import ProductsPage from "../../pages/ProductsPage";
import NewProductPage from "../../pages/NewProductPage";
import EditProductPage from "../../pages/EditProductPage";
import ErrorPage from "../../pages/ErrorPage";

import {
  productsLoader,
  newProductLoader,
  productByIdLoader,
} from "../../features/products/loaders/products.loader";

import { createProductAction } from "../../actions/product.actions";
import { deleteProductAction } from "../../actions/deleteProduct.action";
import { toggleAvailabilityAction } from "../../actions/toggleAvailability.action";
import { updateProductAction } from "../../actions/updateProduct.action";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        loader: productsLoader,
      },
      {
        path: "products",
        element: <ProductsPage />,
        loader: productsLoader,
      },
      {
        path: "products/new",
        element: <NewProductPage />,
        /*
         * newProductLoader devuelve { categories } para poblar
         * el selector de categorías en el formulario.
         */
        loader: newProductLoader,
        action: createProductAction,
      },
      {
        path: "products/:id/edit",
        element: <EditProductPage />,
        /*
         * productByIdLoader devuelve { product, categories }
         * para precargar el formulario con todos los campos.
         */
        loader: productByIdLoader,
        action: updateProductAction,
        errorElement: <ErrorPage />,
      },
      {
        path: "products/delete",
        action: deleteProductAction,
      },
      {
        path: "products/toggle",
        action: toggleAvailabilityAction,
      },
    ],
  },
]);
