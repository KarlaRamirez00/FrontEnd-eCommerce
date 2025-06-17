import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getProductosPorBusqueda,
  getSubcategorias,
} from "../data/productService";
import ProductCard from "../components/ProductCard";
import "../styles/SearchResults.css"; // Necesitaremos crear este archivo

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = ({ onAddToCart }) => {
  const query = useQuery();
  const navigate = useNavigate();
  const searchTerm = query.get("q") || "";
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategoriaEncontrada, setSubcategoriaEncontrada] = useState(null);
  const [subcategorias, setSubcategorias] = useState([]);

  // Cargar subcategorías al montar el componente
  useEffect(() => {
    const cargarSubcategorias = async () => {
      try {
        const data = await getSubcategorias();
        setSubcategorias(data);
      } catch (error) {
        console.error("Error cargando subcategorías:", error);
      }
    };
    cargarSubcategorias();
  }, []);

  // Función para buscar coincidencias en subcategorías
  const buscarEnSubcategorias = (termino) => {
    return subcategorias.find((sub) =>
      sub.nombre.toLowerCase().includes(termino.toLowerCase())
    );
  };

  // Función para resaltar coincidencias
  const resaltarCoincidencia = (texto, termino) => {
    const regex = new RegExp(`(${termino})`, "gi");
    return texto.replace(regex, "<strong>$1</strong>");
  };

  // Función para redirigir a subcategoría
  const irASubcategoria = (subcategoriaId) => {
    navigate(`/subcategoria/${subcategoriaId}`);
  };

  useEffect(() => {
    const buscar = async () => {
      setLoading(true);
      setSubcategoriaEncontrada(null);

      if (searchTerm) {
        // Primero buscar productos
        const data = await getProductosPorBusqueda(searchTerm);
        setProductos(data);

        // Si no hay productos, buscar en subcategorías
        if (data.length === 0 && subcategorias.length > 0) {
          const subcategoriaCoincidente = buscarEnSubcategorias(searchTerm);
          if (subcategoriaCoincidente) {
            setSubcategoriaEncontrada(subcategoriaCoincidente);
          }
        }
      }
      setLoading(false);
    };

    buscar();
  }, [searchTerm, subcategorias]);

  return (
    <div className="search-results-container">
      <h2>Resultados de búsqueda: "{searchTerm}"</h2>

      {loading ? (
        <div className="loading-container">
          <p>Cargando...</p>
        </div>
      ) : productos.length > 0 ? (
        // Mostrar productos encontrados
        <div className="best-sellers">
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
      ) : subcategoriaEncontrada ? (
        // Mostrar sugerencia de subcategoría
        <div className="subcategory-suggestion">
          <div className="suggestion-content">
            <h3>¿Buscabas esta categoría?</h3>
            <p>
              Resultado de Búsqueda: Subcategoría "
              <span
                dangerouslySetInnerHTML={{
                  __html: resaltarCoincidencia(
                    subcategoriaEncontrada.nombre,
                    searchTerm
                  ),
                }}
              />
              "
            </p>
            <button
              className="btn btn-primary"
              onClick={() => irASubcategoria(subcategoriaEncontrada.id)}
            >
              Ver productos en {subcategoriaEncontrada.nombre}
            </button>
          </div>
        </div>
      ) : (
        // Mostrar página "No encontrado" con imagen
        <div className="no-results-container">
          <div className="no-results-content">
            <img
              src="/no-products-found.png"
              alt="No se encontraron productos"
              className="no-results-image"
            />
            <h3>No se encontraron resultados</h3>
            <p>
              Lo sentimos, no pudimos encontrar productos que coincidan con "
              {searchTerm}"
            </p>
            <div className="search-suggestions">
              <p>Intenta con:</p>
              <ul>
                <li>Términos más generales</li>
                <li>Verificar la ortografía</li>
                <li>Usar sinónimos</li>
              </ul>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
