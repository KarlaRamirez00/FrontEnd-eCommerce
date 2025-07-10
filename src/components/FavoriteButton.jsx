import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useFavorites } from "../contexts/FavoritesContext";
import "../styles/FavoriteButton.css";

const FavoriteButton = ({ producto, className = "", size = "1x" }) => {
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();
  const isFav = isFavorite(producto.id);

  // Evita que el clic active otras acciones (como navegar al detalle del producto) y solo marca/desmarca como favorito
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(producto);
  };

  return (
    <button
      className={`favorite-btn ${className} ${isFav ? "is-favorite" : ""} ${
        isLoading ? "loading" : ""
      }`}
      onClick={handleClick}
      disabled={isLoading}
      title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <FontAwesomeIcon
        icon={isFav ? faHeartSolid : faHeartRegular}
        size={size}
        className={`heart-icon ${isFav ? "filled" : ""}`}
      />
    </button>
  );
};

export default FavoriteButton;
