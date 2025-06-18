import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetalleProducto } from "../data/productService";
import axios from "axios";
import "../styles/ProductDetails.css";

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Nuevo estado para descuentos
  const [descuentoInfo, setDescuentoInfo] = useState(null);

  // Estado para la opción seleccionada
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);

  // Estado para mostrar error si no selecciona opción
  const [mostrarError, setMostrarError] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      const data = await getDetalleProducto(id);
      console.log("PRODUCTO COMPLETO del backend:", data);
      setProducto(data);

      // Si solo hay una opción, seleccionarla automáticamente
      if (data?.stock?.length === 1) {
        setOpcionSeleccionada(data.stock[0]);
      }

      // Reset estados cuando cambia de producto
      setOpcionSeleccionada(null);
      setMostrarError(false);

      // Buscar información de descuentos
      await buscarDescuentos(id);
    };

    fetchProducto();
  }, [id]);

  // Nueva función para buscar descuentos
  const buscarDescuentos = async (productoId) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/producto/ofertas?pagina=1"
      );
      const productosConDescuento = response.data.Productos || [];

      // Buscar si este producto específico tiene descuento
      const productoConDescuento = productosConDescuento.find(
        (p) => p.idProducto === parseInt(productoId)
      );

      if (productoConDescuento) {
        const porcentajeDescuento = Math.round(
          100 -
            (productoConDescuento.valorOferta /
              productoConDescuento.valorOriginal) *
              100
        );

        setDescuentoInfo({
          valorOriginal: productoConDescuento.valorOriginal,
          valorOferta: productoConDescuento.valorOferta,
          porcentajeDescuento,
        });

        console.log("✅ Descuento encontrado:", {
          original: productoConDescuento.valorOriginal,
          oferta: productoConDescuento.valorOferta,
          porcentaje: porcentajeDescuento,
        });
      } else {
        setDescuentoInfo(null);
        console.log("❌ Sin descuento para este producto");
      }
    } catch (error) {
      console.error("Error al buscar descuentos:", error);
      setDescuentoInfo(null);
    }
  };

  const handleOpcionChange = (opcion) => {
    setOpcionSeleccionada(opcion);
    setMostrarError(false);
  };

  const handleAddToCart = () => {
    if (!producto) return;

    if (producto.stock.length > 1 && !opcionSeleccionada) {
      setMostrarError(true);
      return;
    }

    setIsAdding(true);

    const opcionFinal = opcionSeleccionada || producto.stock[0];

    const productoParaCarrito = {
      ...producto,
      imagen: `http://localhost:5000/uploads/${
        producto.imagenes[0]?.imagen || ""
      }`,
      // Usar precio con descuento si existe
      precio: descuentoInfo?.valorOferta ?? producto.precio ?? 0,

      opcionElegida: {
        idOpcion: opcionFinal.idOpcion,
        nombreOpcion: producto.opcion,
        valorOpcion: opcionFinal.glosaOpcion,
        stock: producto.stock,
      },
    };

    console.log("PRODUCTO PARA CARRITO CON DESCUENTO:", productoParaCarrito);
    onAddToCart(productoParaCarrito);

    setTimeout(() => setIsAdding(false), 800);
  };

  if (!producto) return <p>Cargando...</p>;

  const mostrarSelector = producto.stock.length > 1;

  return (
    <div className="product-details">
      <div className="product-main">
        {/* Imagen principal con badge de descuento */}
        <div className="product-image-wrapper">
          {producto.imagenes[0] && (
            <>
              <img
                src={`http://localhost:5000/uploads/${producto.imagenes[0].imagen}`}
                alt="Imagen principal del producto"
                className="product-image-main"
              />
              {/* Badge de descuento */}
              {descuentoInfo && (
                <div className="discount-badge-detail">
                  -{descuentoInfo.porcentajeDescuento}%
                </div>
              )}
            </>
          )}
        </div>

        {/* Info: Nombre, Precio, Opciones, Botón */}
        <div className="product-info">
          <h1>{producto.nombre}</h1>

          {/* Precio con descuentos */}
          <div className="product-price">
            {descuentoInfo ? (
              <div className="price-with-discount">
                {/* Precio con descuento (grande) */}
                <div className="current-price">
                  ${descuentoInfo.valorOferta.toLocaleString("es-CL")}
                </div>
                {/* Precio original (tachado) */}
                <div className="original-price-detail">
                  Antes{" "}
                  <span className="strikethrough">
                    ${descuentoInfo.valorOriginal.toLocaleString("es-CL")}
                  </span>
                </div>
              </div>
            ) : (
              // Sin descuento
              <div className="regular-price">
                {producto.precio != null
                  ? `$${producto.precio.toLocaleString("es-CL")}`
                  : "(no disponible aún)"}
              </div>
            )}
          </div>

          {/* Resto del código igual - selector de opciones */}
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

              {mostrarError && (
                <p className="options-error">
                  Por favor selecciona una opción antes de agregar al carrito
                </p>
              )}
            </div>
          )}

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

      {/* Resto de la info del producto - sin cambios */}
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
