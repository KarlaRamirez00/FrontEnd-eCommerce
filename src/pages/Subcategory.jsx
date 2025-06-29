import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faHome } from "@fortawesome/free-solid-svg-icons";
import "../styles/Home.css";
import "../styles/Subcategory.css";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import FilterModal from "../components/FilterModal";
import { useProductFilter } from "../hooks/useProductFilter";
import { getProductosPorSubcategoria } from "../data/productService";

const Subcategory = ({ onAddToCart }) => {
  const { id } = useParams(); // ID de la subcategoría desde la URL
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombreSubcategoria, setNombreSubcategoria] = useState("");

  // Usa el hook de filtros para obtener productos filtrados
  const productosFiltrados = useProductFilter(productos);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const productosAPI = await getProductosPorSubcategoria(id);

        if (productosAPI && productosAPI.length > 0) {
          setProductos(productosAPI);
          setNombreSubcategoria(
            productosAPI[0].nomSubCategoria || "Subcategoría"
          );
        } else {
          setProductos([]);
        }
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError(
          "No se pudieron cargar los productos. Por favor, intente más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
    // Scroll al inicio cuando cambia de subcategoría
    window.scrollTo(0, 0);
  }, [id]);

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <div className="error-actions">
          <button
            className="btn btn-dark"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
          <Link to="/" className="btn btn-outline">
            <FontAwesomeIcon icon={faHome} /> Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="subcategory-container">
      <div className="breadcrumb">
        <Link to="/">Inicio</Link> &gt; <span>{nombreSubcategoria}</span>
      </div>

      <div className="section">
        {/* Agregamos FilterBar */}
        <FilterBar
          titulo={nombreSubcategoria}
          cantidadProductos={productosFiltrados.length} // Usa productos filtrados
        />

        {loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p>Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="no-products">
            <p>No se encontraron productos en esta categoría.</p>
            <Link to="/" className="btn btn-dark">
              <FontAwesomeIcon icon={faHome} /> Volver al Inicio
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {productosFiltrados.length > 0 ? ( // Usa productos filtrados
              productosFiltrados.map((producto) => (
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
                />
              ))
            ) : (
              // Mensaje cuando hay productos pero ninguno pasa los filtros
              <div className="no-results">
                <p>
                  No se encontraron productos que coincidan con los filtros
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
            )}
          </div>
        )}
      </div>

      {/* Agregamos FilterModal */}
      <FilterModal productosDisponibles={productos} />
    </div>
  );
};

export default Subcategory;
