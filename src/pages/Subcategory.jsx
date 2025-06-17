import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faHome } from "@fortawesome/free-solid-svg-icons";
import "../styles/Home.css";
import "../styles/Subcategory.css";
import ProductCard from "../components/ProductCard";
import { getProductosPorSubcategoria } from "../data/productService";

const Subcategory = ({ onAddToCart }) => {
  const { id } = useParams(); // ID de la subcategoría desde la URL
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombreSubcategoria, setNombreSubcategoria] = useState("");

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
    // Scroll al inicio cuando se cambia de subcategoría
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
        <h1 className="subcategory-title">{nombreSubcategoria}</h1>

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
          <>
            <p className="products-count">
              {productos.length} producto(s) encontrado(s)
            </p>
            <div className="products-grid">
              {productos.map((producto) => (
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
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Subcategory;
