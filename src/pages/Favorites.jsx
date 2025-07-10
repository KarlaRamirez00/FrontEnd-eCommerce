import React from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import FilterModal from "../components/FilterModal";
import { useProductFilter } from "../hooks/useProductFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingBag,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../styles/Subcategory.css";

// Vista de productos marcados como favoritos por el usuario

const Favorites = ({ onAddToCart }) => {
  const { favorites, clearFavorites, favoritesCount } = useFavorites();

  // Aplica filtros personalizados a los favoritos
  const productosFiltrados = useProductFilter(favorites);

  // Si no hay favoritos, mostrar mensaje de estado vacío
  if (favoritesCount === 0) {
    return (
      <div className="subcategory-container">
        <div className="breadcrumb">
          <Link to="/">Inicio</Link> &gt; <span>Mis Favoritos</span>
        </div>

        <div className="no-products">
          <FontAwesomeIcon icon={faHeart} size="3x" className="empty-heart" />
          <h2>Aún no tienes favoritos</h2>
          <p>Explora nuestros productos y guarda los que más te gusten</p>
          <Link to="/" className="btn btn-dark">
            <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="subcategory-container">
      <div className="breadcrumb">
        <Link to="/">Inicio</Link> &gt; <span>Mis Favoritos</span>
      </div>

      <div className="section">
        {/* FilterBar */}
        <FilterBar
          titulo="Mis Favoritos"
          cantidadProductos={productosFiltrados.length}
        />

        {/* Botón sutil para vaciar la lista de favoritos */}
        {favoritesCount > 0 && (
          <div className="clear-favorites-container">
            <button className="clear-favorites-button" onClick={clearFavorites}>
              Vaciar Favoritos
            </button>
          </div>
        )}

        <div className="products-grid">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <ProductCard
                key={`favorite-${producto.id}`}
                producto={producto}
                onAddToCart={onAddToCart}
              />
            ))
          ) : favorites.length > 0 ? (
            // Mensaje cuando hay favoritos pero ninguno pasa los filtros
            <div className="no-results">
              <p>
                No se encontraron favoritos que coincidan con los filtros
                seleccionados.
              </p>
              <p>
                Prueba ajustando los filtros o{" "}
                <button
                  className="link-button"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  limpiar todos los filtros
                </button>
                .
              </p>
            </div>
          ) : (
            <div className="no-products">
              <FontAwesomeIcon
                icon={faHeart}
                size="3x"
                className="empty-heart"
              />
              <h2>Aún no tienes favoritos</h2>
              <p>Explora nuestros productos y guarda los que más te gusten</p>
              <Link to="/" className="btn btn-dark">
                <FontAwesomeIcon icon={faHome} className="me-2" />
                Volver al Inicio
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* FilterModal - para filtrar productos favoritos */}
      <FilterModal productosDisponibles={favorites} />
    </div>
  );
};

export default Favorites;
