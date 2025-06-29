import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useFilters } from "../contexts/FilterContext";
import "../styles/Home.css"; // Reutilizamos estilos existentes

const FilterBar = ({ titulo, cantidadProductos = 0 }) => {
  const { cantidadFiltrosActivos, toggleModal, ordenarPor, setOrdenarPor } =
    useFilters();

  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  const opcionesOrden = [
    { valor: "relevancia", texto: "Más relevantes" },
    { valor: "precio_asc", texto: "Menor precio" },
    { valor: "precio_desc", texto: "Mayor precio" },
    { valor: "descuento", texto: "Mayor descuento" },
  ];

  const textoOrdenActual =
    opcionesOrden.find((op) => op.valor === ordenarPor)?.texto ||
    "Más relevantes";

  const handleOrdenChange = (nuevoOrden) => {
    setOrdenarPor(nuevoOrden);
    setMostrarDropdown(false);
  };

  return (
    <div className="filter-bar">
      {/* Botón Filtros a la izquierda */}
      <button className="filter-button" onClick={toggleModal}>
        <FontAwesomeIcon icon={faFilter} />
        <span>Filtros</span>
        {cantidadFiltrosActivos > 0 && (
          <span className="filter-count">({cantidadFiltrosActivos})</span>
        )}
      </button>

      {/* Título centrado */}
      <div className="filter-bar-title">
        <h2>{titulo}</h2>
        {cantidadProductos > 0 && (
          <p className="products-count">
            {cantidadProductos} producto(s) encontrado(s)
          </p>
        )}
      </div>

      {/* Dropdown Ordenar por a la derecha */}
      <div className="sort-dropdown">
        <button
          className="sort-button"
          onClick={() => setMostrarDropdown(!mostrarDropdown)}
        >
          <span>Ordenar por: {textoOrdenActual}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`dropdown-icon ${mostrarDropdown ? "rotated" : ""}`}
          />
        </button>

        {mostrarDropdown && (
          <div className="sort-dropdown-menu">
            {opcionesOrden.map((opcion) => (
              <button
                key={opcion.valor}
                className={`sort-option ${
                  ordenarPor === opcion.valor ? "active" : ""
                }`}
                onClick={() => handleOrdenChange(opcion.valor)}
              >
                {opcion.texto}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
