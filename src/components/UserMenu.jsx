// Aun no le doy funcionalidad a este componente.
import React from "react";
import "../styles/CategoryMenu.css"; // Reutilizo el estilo de CategoryMenu CSS

const UserMenu = ({ isOpen, onClose, userName }) => {
  const sliderClassName = isOpen ? "user-menu-slider open" : "user-menu-slider";

  return (
    <>
      {isOpen && (
        <div className="cart-overlay" onClick={onClose}>
          <div className={sliderClassName} onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={onClose}>
              ✕
            </button>

            <div className="category-content">
              <h3 className="category-title">¡Hola, {userName}!</h3>

              <div className="category-list">
                <div
                  className="category-item"
                  onClick={() => alert("Próximamente")}
                >
                  📦 Mis Compras
                </div>
                <div
                  className="category-item"
                  onClick={() => alert("Próximamente")}
                >
                  ⭐ Calificar Productos
                </div>
                <div
                  className="category-item"
                  onClick={() => alert("Próximamente")}
                >
                  ⚙️ Mi Cuenta
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserMenu;
