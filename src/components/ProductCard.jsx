import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";

const ProductCard = ({ producto, onAddToCart }) => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  // Nombre truncado con un máximo de caracteres
  const displayName =
    producto.nombre.length > 60
      ? `${producto.nombre.substring(0, 60)}...`
      : producto.nombre;

  // Función para manejar el clic en la tarjeta
  const handleCardClick = (e) => {
    // Solo navegar si el clic no fue en el botón
    if (!e.target.closest("button")) {
      navigate(`/producto/${producto.id}`);
    }
  };

  // Función para manejar la adición al carrito con feedback visual
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evita que el evento llegue al div padre

    setIsAdding(true);

    /**/ // Para productos con 1 opción, creamos la opción automáticamente
    const productoConOpcion = {
      ...producto,
      // Agregamos opción por defecto para productos con 1 opción
      opcionElegida: {
        idOpcion: null, // Se llenará cuando tengamos los datos completos
        nombreOpcion: "Opción", // Temporal
        valorOpcion: "Única", // Temporal
      },
    };

    // Llamamos a la función de añadir al carrito
    onAddToCart(productoConOpcion);

    // Reseteamos el estado después de un breve tiempo
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  // Función para manejar clics en productos con múltiples opciones
  const handleVerOpciones = (e) => {
    e.stopPropagation(); // Evita que el evento llegue al div padre
    navigate(`/producto/${producto.id}`);
  };

  // Verificar si la imagen existe
  const handleImageError = (e) => {
    e.target.src = "/assets/placeholder-product.png"; // Imagen de respaldo
  };

  // Determinar texto y acción del botón basado en cantidadOpciones
  const getButtonConfig = () => {
    if (producto.cantidadOpciones === 1) {
      return {
        text: isAdding ? "¡Agregado!" : "Agregar al Carrito",
        onClick: handleAddToCart,
        disabled: isAdding,
      };
    } else if (producto.cantidadOpciones > 1) {
      return {
        text: "Ver Opciones",
        onClick: handleVerOpciones,
        disabled: false,
      };
    } else {
      // Caso por defecto (sin stock o error)
      return {
        text: "Ver Detalles",
        onClick: handleVerOpciones,
        disabled: false,
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img
          src={producto.imagen}
          alt={`Producto: ${producto.nombre}`}
          onError={handleImageError}
          loading="lazy"
        />
        {producto.valorOferta &&
          producto.valorOriginal &&
          producto.valorOferta < producto.valorOriginal && (
            <div className="discount-badge">
              -
              {Math.round(
                100 - (producto.valorOferta / producto.valorOriginal) * 100
              )}
              %
            </div>
          )}
      </div>

      <h3 className="product-title" title={producto.nombre}>
        {displayName}
      </h3>

      <div className="product-price-container">
        {producto.valorOferta && producto.valorOriginal && (
          <span className="original-price">
            ${producto.valorOriginal.toLocaleString("es-CL")}
          </span>
        )}
        <div className="product-price">
          {producto.precio != null
            ? `$${producto.precio.toLocaleString("es-CL")}`
            : "Precio no disponible"}
        </div>
      </div>

      {/* Botón único con texto dinámico */}
      <button
        className={`btn ${isAdding ? "btn-adding" : "btn-dark"}`}
        onClick={buttonConfig.onClick}
        disabled={buttonConfig.disabled}
        aria-label={buttonConfig.text}
      >
        {buttonConfig.text}
      </button>
    </div>
  );
};

export default ProductCard;
