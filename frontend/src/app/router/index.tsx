/* ============================================================
   ROUTER
   Route structure:
   /           → LandingPage (public)
   /login      → LoginPage (public, redirects to /app if authed)
   /app/*      → AppLayout (protected via authLoader)
     /app            → DashboardPage
     /app/products   → ProductsPage
     /app/products/new
     /app/products/:id/edit
     /app/settings
     /app/logout     → logoutAction (action-only route, no element)

   The authLoader on the /app layout is the single enforcement
   point. Every child route inherits the auth check.
   ============================================================ */

import { createBrowserRouter, Navigate } from "react-router-dom";

import LandingPage    from "../../pages/LandingPage";
import LoginPage      from "../../pages/LoginPage";
import AppLayout      from "../../layouts/AppLayout";
import DashboardPage  from "../../pages/DashboardPage";
import ProductsPage   from "../../pages/ProductsPage";
import NewProductPage from "../../pages/NewProductPage";
import EditProductPage from "../../pages/EditProductPage";
import SettingsPage   from "../../pages/SettingsPage";
import ErrorPage      from "../../pages/ErrorPage";

import { authLoader }   from "../../features/auth/loaders/auth.loader";
import { loginAction }  from "../../features/auth/actions/login.action";
import { logoutAction } from "../../features/auth/actions/logout.action";

import {
  productsLoader,
  newProductLoader,
  productByIdLoader,
} from "../../features/products/loaders/products.loader";

import { createProductAction }    from "../../actions/product.actions";
import { deleteProductAction }    from "../../actions/deleteProduct.action";
import { toggleAvailabilityAction } from "../../actions/toggleAvailability.action";
import { updateProductAction }    from "../../actions/updateProduct.action";

export const router = createBrowserRouter([
  /* ---- PUBLIC ROUTES ------------------------------------ */
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    action: loginAction,
    errorElement: <ErrorPage />,
  },

  /* ---- PROTECTED ROUTES --------------------------------- */
  {
    path: "/app",
    element: <AppLayout />,
    loader: authLoader,
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
        loader: newProductLoader,
        action: createProductAction,
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
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        /* Action-only route — clears cookie and redirects */
        path: "logout",
        action: logoutAction,
      },
    ],
  },

  /* ---- CATCH-ALL ---------------------------------------- */
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
