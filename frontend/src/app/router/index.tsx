import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import DashboardPage from "../../pages/DashboardPage";
import ProductsPage from "../../pages/ProductsPage";
import NewProductPage from "../../pages/NewProductPage";
import ErrorPage from "../../pages/ErrorPage";

import { productsLoader } from "../../features/products/loaders/products.loader";

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
        errorElement: <ErrorPage />,
      },
      {
        path: "products/new",
        element: <NewProductPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);
