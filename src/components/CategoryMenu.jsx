import React, { useState, useEffect } from "react";
import "../styles/CategoryMenu.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { getCategorias, getSubcategorias } from "../data/productService";

const CategoryMenu = ({ isOpen, onClose }) => {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const sliderClassName = isOpen ? "category-slider open" : "category-slider";

  useEffect(() => {
    const fetchData = async () => {
      const categoriasBD = await getCategorias();
      const subcategoriasBD = await getSubcategorias();

      const categoriasConSub = categoriasBD.map((cat) => ({
        ...cat,
        subcategorias: subcategoriasBD.filter(
          (sub) => sub.categoria === cat.id
        ),
      }));

      setCategorias(categoriasConSub);
      if (categoriasConSub.length > 0) {
        setActiveCategoryId(categoriasConSub[0].id); // muestra algo por defecto
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isOpen && (
        <div className="cart-overlay" onClick={onClose}>
          <div className={sliderClassName} onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={onClose}>
              ✕
            </button>

            <div className="category-content">
              <h3 className="category-title">Categorías</h3>
              <div className="category-columns">
                <div className="category-list">
                  {categorias.map((categoria) => (
                    <div
                      key={categoria.id}
                      className={`category-item ${
                        activeCategoryId === categoria.id ? "active" : ""
                      }`}
                      onClick={() => setActiveCategoryId(categoria.id)}
                    >
                      {categoria.nombre}
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        className="arrow-icon"
                      />
                    </div>
                  ))}
                </div>

                <div className="subcategory-list">
                  {categorias
                    .find((cat) => cat.id === activeCategoryId)
                    ?.subcategorias.map((sub) => (
                      <Link
                        to={`/subcategoria/${sub.id}`}
                        key={sub.id}
                        onClick={onClose}
                        className="subcategory-item"
                      >
                        {sub.nombre}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryMenu;
