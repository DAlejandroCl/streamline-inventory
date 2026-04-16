import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import NewProductPage from "../pages/NewProductPage";
import ProductsPage from "../pages/ProductsPage";
import ErrorPage from "../pages/ErrorPage";

import { createProductAction } from "../actions/product.actions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "products",
        element: <ProductsPage />
      },
      {
        path: "products/new",
        element: <NewProductPage />,
        action: createProductAction
      }
    ]
  }
]);