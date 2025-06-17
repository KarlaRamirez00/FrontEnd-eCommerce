import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetalleProducto } from "../data/productService";
import "../styles/ProductDetails.css";

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Estado para la opción seleccionada
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);

  // Estado para mostrar error si no selecciona opción
  const [mostrarError, setMostrarError] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      const data = await getDetalleProducto(id);
      console.log("PRODUCTO COMPLETO del backend:", data);
      console.log("CANTIDAD DE OPCIONES:", data?.stock?.length);
      setProducto(data);

      // Si solo hay una opción, seleccionarla automáticamente
      if (data?.stock?.length === 1) {
        setOpcionSeleccionada(data.stock[0]);
      }

      // Reset estados cuando cambia de producto
      setOpcionSeleccionada(null);
      setMostrarError(false);
    };

    fetchProducto();
  }, [id]);

  const handleOpcionChange = (opcion) => {
    setOpcionSeleccionada(opcion);
    setMostrarError(false); // Quitar error al seleccionar
  };

  const handleAddToCart = () => {
    if (!producto) return;

    // Si hay múltiples opciones y no ha seleccionado ninguna
    if (producto.stock.length > 1 && !opcionSeleccionada) {
      setMostrarError(true);
      return;
    }

    setIsAdding(true);

    // Usar la opción seleccionada o la única disponible
    const opcionFinal = opcionSeleccionada || producto.stock[0];

    const productoParaCarrito = {
      ...producto,
      imagen: `http://localhost:5000/uploads/${
        producto.imagenes[0]?.imagen || ""
      }`,
      precio: producto.valorOferta ?? producto.precio ?? 0,

      // Agregar información de la opción seleccionada
      opcionElegida: {
        idOpcion: opcionFinal.idOpcion,
        nombreOpcion: producto.opcion, // "Color", "Talla", etc.
        valorOpcion: opcionFinal.glosaOpcion, // "Azul", "Verde", etc.
        stock: producto.stock,
      },
    };

    console.log("PRODUCTO PARA CARRITO CON OPCIÓN:", productoParaCarrito);
    onAddToCart(productoParaCarrito);

    setTimeout(() => setIsAdding(false), 800);
  };

  if (!producto) return <p>Cargando...</p>;

  // Determinar si mostrar selector de opciones
  const mostrarSelector = producto.stock.length > 1;

  return (
    <div className="product-details">
      <div className="product-main">
        {/* Imagen principal */}
        <div className="product-image-wrapper">
          {producto.imagenes[0] && (
            <img
              src={`http://localhost:5000/uploads/${producto.imagenes[0].imagen}`}
              alt="Imagen principal del producto"
              className="product-image-main"
            />
          )}
        </div>

        {/* Info: Nombre, Precio, Opciones, Botón */}
        <div className="product-info">
          <h1>{producto.nombre}</h1>
          <p className="product-price">
            {producto.valorOferta ? (
              <>
                <span style={{ textDecoration: "line-through", color: "#888" }}>
                  ${producto.precio?.toLocaleString("es-CL")}
                </span>
                <span
                  style={{ color: "red", fontWeight: "bold", marginLeft: 8 }}
                >
                  ${producto.valorOferta.toLocaleString("es-CL")}
                </span>
              </>
            ) : producto.precio != null ? (
              `$${producto.precio.toLocaleString("es-CL")}`
            ) : (
              "(no disponible aún)"
            )}
          </p>

          {/* Selector de opciones - Solo si hay más de una opción */}
          {mostrarSelector && (
            <div className="product-options">
              <h4 className="options-title">{producto.opcion}:</h4>
              <div className="options-list">
                {producto.stock.map((opcion) => {
                  const sinStock = parseInt(opcion.cantStock) === 0;
                  const isSelected =
                    opcionSeleccionada?.idOpcion === opcion.idOpcion;

                  return (
                    <label
                      key={opcion.idOpcion}
                      className={`option-item ${sinStock ? "disabled" : ""} ${
                        isSelected ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="opcion"
                        value={opcion.idOpcion}
                        checked={isSelected}
                        disabled={sinStock}
                        onChange={() => handleOpcionChange(opcion)}
                        className="option-radio"
                      />
                      <span className="option-label">
                        {opcion.glosaOpcion}
                        <span className="option-stock">
                          {sinStock
                            ? " (Sin stock)"
                            : ` (${opcion.cantStock} disponibles)`}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Mensaje de error si no selecciona opción */}
              {mostrarError && (
                <p className="options-error">
                  Por favor selecciona una opción antes de agregar al carrito
                </p>
              )}
            </div>
          )}

          {/* Información para productos con una sola opción */}
          {!mostrarSelector && producto.stock.length === 1 && (
            <div className="single-option-info">
              <p className="single-option-text">
                <strong>{producto.opcion}:</strong>{" "}
                {producto.stock[0].glosaOpcion}
                {parseInt(producto.stock[0].cantStock) > 0
                  ? ` (${producto.stock[0].cantStock} disponibles)`
                  : " (Sin stock)"}
              </p>
            </div>
          )}

          <button
            className={`btn ${isAdding ? "btn-adding" : "btn-dark"}`}
            onClick={handleAddToCart}
            disabled={
              isAdding ||
              (producto.stock.length === 1 &&
                parseInt(producto.stock[0].cantStock) === 0)
            }
          >
            {isAdding ? "¡Agregado!" : "Agregar al carrito"}
          </button>
        </div>
      </div>

      {/* Resto de la info del producto */}
      <div className="product-extra-info">
        <p>
          <strong>Descripción:</strong> {producto.descripcion}
        </p>
        <p>
          <strong>Marca:</strong> {producto.marca}
        </p>
        <p>
          <strong>Categoría:</strong> {producto.categoria}
        </p>
        <p>
          <strong>Subcategoría:</strong> {producto.subcategoria}
        </p>
        <p>
          <strong>Retiro en tienda:</strong> {producto.retiro ? "Sí" : "No"}
        </p>
        <p>
          <strong>Despacho a domicilio:</strong>{" "}
          {producto.despacho ? "Sí" : "No"}
        </p>

        <h4>Especificaciones:</h4>
        <ul>
          {producto.especificaciones.map((esp, idx) => (
            <li key={idx}>
              {esp.nomEspecificacion}: {esp.valorEspecificacion}
            </li>
          ))}
        </ul>

        <h4>Stock por opción:</h4>
        <ul>
          {producto.stock.map((s, idx) => (
            <li key={idx}>
              {s.glosaOpcion}: {s.cantStock} unidades
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetails;
