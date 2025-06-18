import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

import {
  getSubcategorias,
  getProductosDestacadosAleatorios,
} from "../data/productService";

const Home = ({ onAddToCart }) => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [subcategoriasDestacadas, setSubcategoriasDestacadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar si hay datos en caché y si no han expirado (24 horas)
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

        // Obtener productos destacados
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

        // Obtener subcategorías destacadas
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

  // TEMPORAL - para debuggear
  console.log("Productos destacados:", productosDestacados);
  productosDestacados.forEach((p) => {
    if (p.valorOferta && p.valorOriginal) {
      console.log(`${p.nomProducto}:`, {
        original: p.valorOriginal,
        oferta: p.valorOferta,
        calculo: Math.round(100 - (p.valorOferta / p.valorOriginal) * 100),
      });
    }
  });

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

      {/* Sección de Productos Destacados */}
      <div className="section">
        <h2>Productos Destacados</h2>
        {loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          </div>
        ) : (
          <div className="best-sellers">
            {productosDestacados.length > 0 ? (
              productosDestacados.map((producto) => (
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
              <p className="no-products-message">
                No hay productos destacados disponibles.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
