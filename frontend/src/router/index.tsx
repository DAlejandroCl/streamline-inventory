import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import NewProductPage from "../pages/NewProductPage";

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
        path: "products/new",
        element: <NewProductPage />
      }
    ]
  }
]);