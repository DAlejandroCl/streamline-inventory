import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import DashboardPage from "../../pages/DashboardPage";
import ProductsPage from "../../pages/ProductsPage";
import NewProductPage from "../../pages/NewProductPage";
import EditProductPage from "../../pages/EditProductPage";
import ErrorPage from "../../pages/ErrorPage";

import {
  productsLoader,
  productByIdLoader,
} from "../../features/products/loaders/products.loader";

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
      },
      {
        path: "products",
        element: <ProductsPage />,
        loader: productsLoader,
      },
      {
        path: "products/new",
        element: <NewProductPage />,
      },
      {
        path: "products/:id/edit",
        element: <EditProductPage />,
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