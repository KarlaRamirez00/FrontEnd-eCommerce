import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import FilterModal from "../components/FilterModal";
import { useProductFilter } from "../hooks/useProductFilter";

import {
  getSubcategorias,
  getProductosDestacadosAleatorios,
} from "../data/productService";

const Home = ({ onAddToCart }) => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [subcategoriasDestacadas, setSubcategoriasDestacadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usa el hook de filtros para obtener productos filtrados
  const productosFiltrados = useProductFilter(productosDestacados);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verifica si hay datos en caché y si no han expirado (24 horas)
        const productosCache = sessionStorage.getItem("productosDestacados");
        const productosTimestamp = sessionStorage.getItem(
          "productosDestacadosTimestamp"
        );
        const subcatsCache = sessionStorage.getItem("subcategoriasDestacadas");
        const subcatsTimestamp = sessionStorage.getItem(
          "subcategoriasDestacadasTimestamp"
        );

        const now = Date.now();
        const cacheExpiration = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

        // Obtiene productos destacados
        let productos = [];
        if (
          productosCache &&
          productosTimestamp &&
          now - parseInt(productosTimestamp) < cacheExpiration
        ) {
          productos = JSON.parse(productosCache);
          setProductosDestacados(productos);
        } else {
          productos = await getProductosDestacadosAleatorios(4);
          setProductosDestacados(productos);
          sessionStorage.setItem(
            "productosDestacados",
            JSON.stringify(productos)
          );
          sessionStorage.setItem(
            "productosDestacadosTimestamp",
            now.toString()
          );
        }

        // Obtiene subcategorías destacadas
        let subcategorias = [];
        if (
          subcatsCache &&
          subcatsTimestamp &&
          now - parseInt(subcatsTimestamp) < cacheExpiration
        ) {
          subcategorias = JSON.parse(subcatsCache);
          setSubcategoriasDestacadas(subcategorias);
        } else {
          const todasSubcategorias = await getSubcategorias();
          subcategorias = [...todasSubcategorias]
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
          setSubcategoriasDestacadas(subcategorias);
          sessionStorage.setItem(
            "subcategoriasDestacadas",
            JSON.stringify(subcategorias)
          );
          sessionStorage.setItem(
            "subcategoriasDestacadasTimestamp",
            now.toString()
          );
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(
          "No se pudieron cargar los datos. Por favor, intente más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button
            className="btn btn-dark"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="home-container">
      {/* Sección de Subcategorías Destacadas */}
      <div className="section subcategories-section">
        <h2>Categorías Populares</h2>
        {loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          </div>
        ) : (
          <div className="home-subcategory-list">
            {subcategoriasDestacadas.map((sub) => (
              <Link
                key={sub.id}
                to={`/subcategoria/${sub.id}`}
                className="home-subcategory-link"
              >
                <FontAwesomeIcon icon={faTag} />
                <span>{sub.nombre}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Productos Destacados CON FILTROS */}
      <div className="section">
        <FilterBar
          titulo="Productos Destacados"
          cantidadProductos={productosFiltrados.length}
        />

        {loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          </div>
        ) : (
          <div className="best-sellers">
            {productosFiltrados.length > 0 ? (
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
            ) : productosDestacados.length > 0 ? (
              // Muestra mensaje cuando hay productos pero ninguno pasa los filtros
              <p className="no-results-message">
                No se encontraron productos que coincidan con los filtros
                seleccionados.
              </p>
            ) : (
              <p className="no-products-message">
                No hay productos destacados disponibles.
              </p>
            )}
          </div>
        )}
      </div>

      {/* FilterModal - pasamos todos los productos para extraer marcas/categorías */}
      <FilterModal productosDisponibles={productosDestacados} />
    </div>
  );
};

export default Home;
