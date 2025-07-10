// Organizamos y declaramos las rutas específicas de la app usando React Router, facilitando la navegación entre páginas.

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SearchResults from "../pages/SearchResults";
import Subcategory from "../pages/Subcategory";
import ProductDetails from "../pages/ProductDetails";
import ActivateAccount from "../pages/ActivateAccount";
import ResetPassword from "../pages/ResetPassword";
import Offers from "../pages/Offers";
import AboutUs from "../pages/AboutUs";
import Favorites from "../pages/Favorites";

const AppRouter = ({ onAddToCart, onOpenRecuperarPassword }) => {
  return (
    <Routes>
      <Route path="/" element={<Home onAddToCart={onAddToCart} />} />

      <Route
        path="/buscar"
        element={<SearchResults onAddToCart={onAddToCart} />}
      />

      <Route
        path="/categoria/:id"
        element={<Subcategory onAddToCart={onAddToCart} />}
      />

      <Route
        path="/subcategoria/:id"
        element={<Subcategory onAddToCart={onAddToCart} />}
      />

      <Route
        path="/producto/:id"
        element={<ProductDetails onAddToCart={onAddToCart} />}
      />

      <Route path="/activar-cuenta" element={<ActivateAccount />} />

      <Route path="/restablecer-password" element={<ResetPassword />} />

      <Route path="/ofertas" element={<Offers onAddToCart={onAddToCart} />} />

      <Route path="/nosotros" element={<AboutUs />} />

      <Route
        path="/favoritos"
        element={<Favorites onAddToCart={onAddToCart} />}
      />
    </Routes>
  );
};

export default AppRouter;
