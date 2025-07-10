import React, { useState } from "react";
import UserMenu from "./UserMenu";
import "../styles/Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faUser,
  faShoppingCart,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";

// Definimos el componente Header, que recibe varios props desde App.jsx
const Header = ({
  isLoggedIn,
  onCartIconClick,
  cartItemCount,
  onLoginClick,
  userName,
  onLogoutClick,
  onToggleCategoryMenu,
  onSearch,
}) => {
  // Estado para controlar el texto del buscador
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { favoritesCount } = useFavorites();

  return (
    <>
      <header>
        {/* Top Bar */}
        <div className="top-bar bg-light py-2">
          <div className="container-fluid top-header d-flex flex-wrap justify-content-between align-items-center">
            {/* Logo */}
            <a className="navbar-brand" href="/">
              <img src="/Logo-MultiShop.png" alt="Logo" className="logo" />
            </a>

            {/* Search Form */}
            <form
              className="d-flex search-form flex-grow-1 mx-3"
              onSubmit={handleSearchSubmit}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="¿Qué buscas?"
                aria-label="Buscar"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="btn btn-outline-secondary" type="submit">
                Buscar
              </button>
            </form>

            {/* Iconos */}
            <div className="icon-group d-flex justify-content-center justify-content-lg-end">
              <Link to="/favoritos" className="icon-link">
                <FontAwesomeIcon icon={faHeart} />
                {favoritesCount > 0 && (
                  <span className="favorites-badge">{favoritesCount}</span>
                )}
              </Link>

              <div
                className="icon-link cart-icon-container"
                onClick={onCartIconClick}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </div>

              {/* Icono de usuario */}
              <span
                className="icon-link"
                onClick={
                  isLoggedIn ? () => setShowUserMenu(true) : onLoginClick
                }
              >
                {isLoggedIn && (
                  <div className="welcome-text">¡Bienvenid@ {userName}!</div>
                )}
                <FontAwesomeIcon icon={faUser} />
              </span>

              {/* Icono logout */}
              {isLoggedIn && (
                <span className="icon-link" onClick={onLogoutClick}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <button className="nav-link" onClick={onToggleCategoryMenu}>
                    Categorías
                  </button>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/">
                    Inicio
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link ofertas-link" to="/ofertas">
                    Ofertas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/nosotros">
                    Nosotros
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      {/* UserMenu*/}
      <UserMenu
        isOpen={showUserMenu}
        onClose={() => setShowUserMenu(false)}
        userName={userName}
      />
    </>
  );
};

export default Header;
