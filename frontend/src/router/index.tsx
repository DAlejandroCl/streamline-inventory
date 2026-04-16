import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProductsPage from "../pages/ProductsPage";
import NewProductPage from "../pages/NewProductPage";
import EditProductPage from "../pages/EditProductPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ProductsPage />,
      },
      {
        path: "products/new",
        element: <NewProductPage />,
      },
      {
        path: "products/:id/edit",
        element: <EditProductPage />,
      },
    ],
  },
]);