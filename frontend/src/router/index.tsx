import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import NewProductPage from "../pages/NewProductPage";
import ProductsPage from "../pages/ProductsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
        element: <NewProductPage />
      }
    ]
  }
]);