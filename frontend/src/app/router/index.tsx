/* ============================================================
   ROUTER
   Lazy loading strategy:
   - LandingPage + LoginPage: síncronos (livianos, públicos,
     necesarios en el primer render sin autenticación)
   - Todo bajo /app/*: lazy (el usuario ya pasó authLoader,
     el chunk se descarga en paralelo con los datos del loader)

   React Router 7 ejecuta el loader y carga el chunk al mismo
   tiempo — no hay waterfall. El Suspense fallback solo se
   muestra si el chunk tarda más que los datos (raro en prod).

   Route structure:
   /           → LandingPage (sync)
   /login      → LoginPage (sync)
   /app/*      → AppLayout lazy, protegido por authLoader
     /app            → DashboardPage (lazy)
     /app/products   → ProductsPage (lazy)
     /app/products/new
     /app/products/:id/edit
     /app/settings
     /app/logout     → action-only, no element
   ============================================================ */

import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import LandingPage from "../../pages/LandingPage";
import LoginPage   from "../../pages/LoginPage";
import ErrorPage   from "../../pages/ErrorPage";
import PageLoader  from "../../components/ui/PageLoader";

/* ---- Lazy chunks — cada import() genera un JS chunk separado */

const AppLayout      = lazy(() => import("../../layouts/AppLayout"));
const DashboardPage  = lazy(() => import("../../pages/DashboardPage"));
const ProductsPage   = lazy(() => import("../../pages/ProductsPage"));
const NewProductPage = lazy(() => import("../../pages/NewProductPage"));
const EditProductPage = lazy(() => import("../../pages/EditProductPage"));
const SettingsPage   = lazy(() => import("../../pages/SettingsPage"));

/* ---- Wrapper: envuelve cada lazy element con Suspense ------ */

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

/* ---- Loaders ---------------------------------------------- */

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

/* ---- Router definition ------------------------------------ */

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
    element: <Lazy><AppLayout /></Lazy>,
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
