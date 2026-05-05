/* ============================================================
   ROUTER
   FIXES:
   1. AppLayout NO es lazy — es el shell de la app, siempre
      se necesita. Lazy en el shell causaba que el errorElement
      capturara errores del Suspense boundary mezclados con
      errores reales del render.
   2. Los children siguen siendo lazy — se cargan en paralelo
      con sus loaders como estaba diseñado.
   ============================================================ */

import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import LandingPage from "../../pages/LandingPage";
import LoginPage   from "../../pages/LoginPage";
import ErrorPage   from "../../pages/ErrorPage";
import PageLoader  from "../../components/ui/PageLoader";
import AppLayout   from "../../layouts/AppLayout";

/* ---- Lazy chunks — solo las páginas, no el layout --------- */

const DashboardPage   = lazy(() => import("../../pages/DashboardPage"));
const ProductsPage    = lazy(() => import("../../pages/ProductsPage"));
const NewProductPage  = lazy(() => import("../../pages/NewProductPage"));
const EditProductPage = lazy(() => import("../../pages/EditProductPage"));
const SettingsPage    = lazy(() => import("../../pages/SettingsPage"));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

/* ---- Loaders & Actions ------------------------------------ */

import { authLoader }   from "../../features/auth/loaders/auth.loader";
import { loginAction }  from "../../features/auth/actions/login.action";
import { logoutAction } from "../../features/auth/actions/logout.action";

import {
  productsLoader,
  dashboardLoader,
  newProductLoader,
  productByIdLoader,
} from "../../features/products/loaders/products.loader";

import { createProductAction }      from "../../actions/product.actions";
import { deleteProductAction }      from "../../actions/deleteProduct.action";
import { toggleAvailabilityAction } from "../../actions/toggleAvailability.action";
import { updateProductAction }      from "../../actions/updateProduct.action";

export const router = createBrowserRouter([
  /* ---- PUBLIC ------------------------------------------- */
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

  /* ---- PROTECTED ---------------------------------------- */
  {
    path: "/app",
    element: <AppLayout />,
    loader: authLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Lazy><DashboardPage /></Lazy>,
        loader: dashboardLoader,
      },
      {
        path: "products",
        element: <Lazy><ProductsPage /></Lazy>,
        loader: productsLoader,
      },
      {
        path: "products/new",
        element: <Lazy><NewProductPage /></Lazy>,
        loader: newProductLoader,
        action: createProductAction,
      },
      {
        path: "products/:id/edit",
        element: <Lazy><EditProductPage /></Lazy>,
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
        element: <Lazy><SettingsPage /></Lazy>,
      },
      {
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
