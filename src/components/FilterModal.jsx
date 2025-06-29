import React, { useState, useEffect, useMemo } from "react";
import { useFilters } from "../contexts/FilterContext";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/CategoryMenu.css";

const FilterModal = ({ productosDisponibles = [] }) => {
  const {
    modalAbierto,
    toggleModal,
    precioMin,
    precioMax,
    setPrecioInicial,
    setPrecioRango,
    soloConDescuento,
    toggleSoloDescuento,
    limpiarFiltros,
  } = useFilters();

  // Estados locales para el slider de precio
  const [minTemp, setMinTemp] = useState(0);
  const [maxTemp, setMaxTemp] = useState(10000000);
  const [rangoInicializado, setRangoInicializado] = useState(false);

  // Detecta automáticamente el rango de precios de los productos
  const rangoPrecios = useMemo(() => {
    if (!productosDisponibles || productosDisponibles.length === 0) {
      return { min: 0, max: 10000000 };
    }

    const precios = productosDisponibles
      .map((producto) => {
        const precio =
          producto.valorOferta ||
          producto.valorOriginal ||
          producto.precio ||
          0;
        return precio;
      })
      .filter((precio) => precio > 0);

    if (precios.length === 0) {
      return { min: 0, max: 10000000 };
    }

    const minReal = Math.min(...precios);
    const maxReal = Math.max(...precios);

    const minRedondeado = Math.floor(minReal / 10000) * 10000;
    const maxRedondeado = Math.ceil(maxReal / 10000) * 10000;

    return {
      min: Math.max(0, minRedondeado),
      max: Math.max(maxRedondeado, minRedondeado + 100000),
    };
  }, [productosDisponibles]);

  // Inicializa solo UNA VEZ cuando cambian los productos
  useEffect(() => {
    if (!rangoInicializado) {
      setMinTemp(rangoPrecios.min);
      setMaxTemp(rangoPrecios.max);
      setPrecioInicial(rangoPrecios.min, rangoPrecios.max);
      setRangoInicializado(true);
    }
  }, [rangoPrecios, rangoInicializado, setPrecioInicial]);

  // Resetea cuando cambien los productos
  useEffect(() => {
    setRangoInicializado(false);
  }, [productosDisponibles]);

  // Sincroniza valores temporales con el contexto
  useEffect(() => {
    setMinTemp(precioMin);
    setMaxTemp(precioMax);
  }, [precioMin, precioMax]);

  const handleMinChange = (value) => {
    const newMin = Math.min(value, maxTemp - 1000);
    setMinTemp(newMin);
    setPrecioRango(newMin, maxTemp);
  };

  const handleMaxChange = (value) => {
    const newMax = Math.max(value, minTemp + 1000);
    setMaxTemp(newMax);
    setPrecioRango(minTemp, newMax);
  };

  const formatearPrecio = (precio) => {
    return precio.toLocaleString("es-CL");
  };

  const handleLimpiarFiltros = () => {
    limpiarFiltros();
    // Resetea al rango automático
    setMinTemp(rangoPrecios.min);
    setMaxTemp(rangoPrecios.max);
    setPrecioInicial(rangoPrecios.min, rangoPrecios.max);
  };

  if (!modalAbierto) return null;

  return (
    <div className="cart-overlay" onClick={toggleModal}>
      <div
        className="category-slider open"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={toggleModal}>
          ✕
        </button>

        <div className="category-content">
          <div className="filter-header">
            <h3 className="category-title">Filtros</h3>
          </div>

          <button className="clear-filters-btn" onClick={handleLimpiarFiltros}>
            Limpiar filtros
          </button>

          <div className="filter-sections">
            {/* DIV 1: Título Rango de Precio */}
            <div>
              <h4 className="filter-section-title">Rango de Precio</h4>
            </div>

            {/* DIV 2: Barras + precio debajo */}
            <div>
              <div className="slider-labels">
                <span className="slider-label">Mínimo</span>
                <span className="slider-label">Máximo</span>
              </div>

              <div className="professional-slider">
                <Slider
                  range
                  min={rangoPrecios.min}
                  max={rangoPrecios.max}
                  step={1000}
                  value={[minTemp, maxTemp]}
                  onChange={([min, max]) => {
                    setMinTemp(min);
                    setMaxTemp(max);
                    setPrecioRango(min, max);
                  }}
                  styles={{
                    track: {
                      backgroundColor: "#f6af33",
                    },
                    handle: {
                      backgroundColor: "#f6af33",
                      borderColor: "#f6af33",
                    },
                    rail: {
                      backgroundColor: "#ddd",
                    },
                  }}
                />
              </div>

              <div className="selected-price">
                ${formatearPrecio(minTemp)} - ${formatearPrecio(maxTemp)}
              </div>
            </div>

            {/* DIV 3: Título Ofertas */}
            <div>
              <h4 className="filter-section-title">Ofertas</h4>
            </div>

            {/* DIV 4: Checkbox + texto */}
            <div>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={soloConDescuento}
                  onChange={toggleSoloDescuento}
                />
                <span className="checkmark"></span>
                Solo productos con descuento
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
