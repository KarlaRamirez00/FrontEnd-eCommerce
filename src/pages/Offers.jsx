import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import "../styles/Subcategory.css"; // Reutilizamos estilos existentes

const Offers = ({ onAddToCart }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroDescuento, setFiltroDescuento] = useState("todos");

  useEffect(() => {
    obtenerOfertas();
  }, []);

  const obtenerOfertas = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/producto/ofertas?pagina=1"
      );
      const data = await response.json();

      if (response.ok) {
        setProductos(data.Productos);
      } else {
        setError("Error al cargar ofertas");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    if (filtroDescuento === "todos") return true;

    const descuentoPorcentaje = Math.round(
      ((producto.valorOriginal - producto.valorOferta) /
        producto.valorOriginal) *
        100
    );

    return descuentoPorcentaje.toString() === filtroDescuento;
  });

  if (loading) {
    return (
      <div className="subcategory-container">
        <div className="loading-message">Cargando ofertas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subcategory-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="subcategory-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Inicio</Link> &gt; <span>Ofertas</span>
      </div>

      {/* Header de ofertas */}
      <div className="section">
        <h1 className="subcategory-title">🔥 Ofertas Especiales</h1>

        {/* Filtros integrados sin borde */}
        <div className="filter-section">
          <p>Filtrar por descuento:</p>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${
                filtroDescuento === "todos" ? "active" : ""
              }`}
              onClick={() => setFiltroDescuento("todos")}
            >
              Todas las ofertas
            </button>
            <button
              className={`filter-btn ${
                filtroDescuento === "10" ? "active" : ""
              }`}
              onClick={() => setFiltroDescuento("10")}
            >
              10% OFF
            </button>
            <button
              className={`filter-btn ${
                filtroDescuento === "15" ? "active" : ""
              }`}
              onClick={() => setFiltroDescuento("15")}
            >
              15% OFF
            </button>
            <button
              className={`filter-btn ${
                filtroDescuento === "20" ? "active" : ""
              }`}
              onClick={() => setFiltroDescuento("20")}
            >
              20% OFF
            </button>
          </div>
        </div>
      </div>

      {/* Contador */}
      <p className="products-count">
        {productosFiltrados.length}{" "}
        {productosFiltrados.length === 1 ? "producto" : "productos"} en oferta
      </p>

      {/* Grid de productos */}
      {productosFiltrados.length > 0 ? (
        <div className="products-grid">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.idProducto}
              producto={{
                id: producto.idProducto,
                nombre: producto.nomProducto,
                precio: producto.valorOferta || producto.valorOriginal,
                valorOriginal: producto.valorOriginal,
                valorOferta: producto.valorOferta,
                imagen: `http://localhost:5000/uploads/${producto.imagen}`,
                cantidadOpciones: producto.cantidadOpciones,
              }}
              onAddToCart={onAddToCart}
              showDiscount={true}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h3>No hay ofertas con este filtro</h3>
          <p>Intenta con otro porcentaje de descuento</p>
        </div>
      )}
    </div>
  );
};

export default Offers;
