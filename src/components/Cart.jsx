import React, { useState, useEffect } from "react";
import "../styles/Cart.css";
import "../styles/Checkout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { procesarVenta, transformarDatosVenta } from "../data/saleService";

// Componente del carrito deslizante (CartSlider)
const CartSlider = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onClearCart,
  user,
}) => {
  // Título dinámico del carrito según si tiene productos o está vacío
  const cartTitle =
    cartItems && cartItems.length > 0
      ? "Tu carrito"
      : "Tu carrito está vacío 😞";

  // Clase dinámica para abrir o cerrar el carrito con CSS
  const sliderClassName = isOpen ? "cart-slider open" : "cart-slider";

  // Para sumar todos los productos del carrito y saber el Total a Pagar
  const total = cartItems.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );

  // Estado para controlar el modal de checkout
  const [showCheckout, setShowCheckout] = useState(false);

  // Estado para el método de entrega
  const [metodoEntrega, setMetodoEntrega] = useState("despacho");

  // Estados para formularios
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    rut: user?.rut || "",
    email: user?.email || "",
    calle: "",
    numero: "",
    region: "",
    comuna: "",
    infoAdicional: "",
  });

  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");

  const [datosPago, setDatosPago] = useState({
    numeroTarjeta: "",
    fechaVencimiento: "",
    cvv: "",
  });

  // Actualiza datos cuando cambie el usuario
  useEffect(() => {
    if (user) {
      setDatosEnvio((prev) => ({
        ...prev,
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        rut: formatearRUT(user.rut || ""),
        email: user.email || "",
      }));
    }
  }, [user]);

  // Función para verificar si el checkout está completo
  const isCheckoutCompleto = () => {
    // Valida datos de pago (siempre requeridos)
    const pagoCompleto =
      validarTarjeta(datosPago.numeroTarjeta) &&
      validarFechaVencimiento(datosPago.fechaVencimiento) &&
      validarCVV(datosPago.cvv);

    if (metodoEntrega === "despacho") {
      // Si es despacho, validar datos de envío
      const envioCompleto =
        (!user ? validarNombre(datosEnvio.nombre) : datosEnvio.nombre !== "") &&
        (!user
          ? validarNombre(datosEnvio.apellido)
          : datosEnvio.apellido !== "") &&
        validarRUT(datosEnvio.rut) &&
        (!user ? validarEmail(datosEnvio.email) : true) &&
        datosEnvio.calle !== "" &&
        datosEnvio.numero !== "" &&
        datosEnvio.region !== "" &&
        datosEnvio.comuna !== "";
      return envioCompleto && pagoCompleto;
    } else if (metodoEntrega === "retiro") {
      // Si es retiro, validar que haya elegido sucursal
      return sucursalSeleccionada !== "" && pagoCompleto;
    }

    return false;
  };

  // Funciones de validación

  // Función para capitalizar nombres y apellidos
  const capitalizarNombre = (texto) => {
    return texto
      .toLowerCase()
      .split(" ")
      .map((palabra) => {
        return palabra.length > 0
          ? palabra.charAt(0).toUpperCase() + palabra.slice(1)
          : "";
      })
      .join(" ");
  };

  // Función para validar que solo contenga letras y espacios
  const validarNombre = (texto) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(texto) && texto.trim().length >= 2;
  };

  const formatearNumeroTarjeta = (valor) => {
    // Remueve espacios y caracteres no numéricos
    const soloNumeros = valor.replace(/\D/g, "");
    // Agrupa de 4 en 4
    const formateado = soloNumeros.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formateado;
  };

  const formatearFechaVencimiento = (valor) => {
    // Remueve caracteres no numéricos
    const soloNumeros = valor.replace(/\D/g, "");

    // Limita a máximo 4 dígitos
    const limitado = soloNumeros.slice(0, 4);

    // Agrega / después del mes SOLO si hay al menos 3 dígitos
    if (limitado.length >= 3) {
      return limitado.slice(0, 2) + "/" + limitado.slice(2);
    }

    return limitado;
  };

  // Formateo de RUT chileno agregando "-" antes del DV
  const formatearRUT = (rut) => {
    // Elimina todo lo que no es número o la letra K, y convierte a mayúscula
    rut = rut.replace(/[^0-9kK]/g, "").toUpperCase();

    // Si tiene menos de 2 caracteres, no se puede formatear
    if (rut.length < 2) return rut;
    // Separa el cuerpo del RUT
    const cuerpo = rut.slice(0, -1);
    // Separa el dígito verificador
    const dv = rut.slice(-1);
    // Retorna el RUT formateado: cuerpo + guion + DV
    return `${cuerpo}-${dv}`;
  };

  // Valida numero Tarjeta
  const validarTarjeta = (numero) => {
    const soloNumeros = numero.replace(/\D/g, "");
    return soloNumeros.length === 16;
  };

  const validarFechaVencimiento = (fecha) => {
    // Valida formato MM/YY
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(fecha)) return false;
    // Extrae mes y año (convierto año a formato 20YY)
    const [mesStr, anioStr] = fecha.split("/");
    const mes = parseInt(mesStr, 10);
    const anio = parseInt("20" + anioStr, 10);
    // Obtiene fecha actual (mes y año)
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1; // getMonth() devuelve 0 para enero, 11 para diciembre, sumamos 1 para obtener 1-12
    const anioActual = hoy.getFullYear();

    // Compara años
    if (anio < anioActual) return false;
    if (anio === anioActual && mes < mesActual) return false;

    return true;
  };
  // Valida formato de CVV
  const validarCVV = (cvv) => {
    return /^\d{3}$/.test(cvv);
  };
  const formatearCVV = (valor) => {
    // Solo permite números y máximo 3 dígitos
    return valor.replace(/\D/g, "").slice(0, 3);
  };

  const validarRUT = (rut) => {
    // Formato: 7-8 dígitos, guión, y dígito verificador (número o K)
    const regex = /^\d{7,8}-[\dkK]$/i;

    if (!regex.test(rut)) return false;

    const partes = rut.split("-");
    const cuerpo = partes[0];
    const dv = partes[1].toUpperCase();

    // Verifica que el cuerpo tenga exactamente 7 u 8 dígitos
    // y que el DV sea un dígito (0-9) o la letra K
    return (cuerpo.length === 7 || cuerpo.length === 8) && /^[0-9K]$/.test(dv);
  };

  // Valida formato email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  // Calcula costo de envío
  const costoEnvio = metodoEntrega === "despacho" ? 3990 : 0;
  const totalConEnvio = total + costoEnvio;

  // Función para abrir el modal de checkout
  const handleOpenCheckout = () => {
    setMetodoEntrega("despacho");
    setShowCheckout(true);
  };

  // Función para manejar el pago
  const handlePago = async () => {
    try {
      // Transforma datos al formato del backend
      const ventaData = transformarDatosVenta(
        cartItems,
        user,
        datosEnvio,
        datosPago,
        totalConEnvio
      );

      // Envia al backend
      const resultado = await procesarVenta(ventaData);

      if (resultado.success) {
        alert(`¡Compra exitosa! ID de venta: ${resultado.ventaId}`);
        // Limpia carrito y cierra el modal
        onClearCart();
        setShowCheckout(false);
        onClose();
      } else {
        alert(`Error: ${resultado.message}`);
      }
    } catch (error) {
      console.error("Error al procesar compra:", error);
      alert("Error inesperado al procesar la compra");
    }
  };

  return (
    <>
      {/* Se cierra el Modal al hacer clic fuera o haciendo click en la ✕ */}
      {isOpen && (
        <div className="cart-overlay" onClick={onClose}>
          <div className={sliderClassName} onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={onClose}>
              ✕
            </button>

            <div className="cart-content">
              <h3 className="cart-title">{cartTitle}</h3>
              {/* Si hay productos en el carrito, los mostramos */}
              {cartItems && cartItems.length > 0 ? (
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div
                      className="cart-item"
                      key={`${item.id}-${
                        item.opcionElegida?.idOpcion || "default"
                      }`}
                    >
                      {/* Imagen del producto */}
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="cart-item-image"
                      />
                      {/* Detalles del producto: nombre, opción elegida, controles, precio */}
                      <div className="cart-item-details">
                        <div className="cart-item-name">{item.nombre}</div>

                        {/* Mostrar opción elegida solo si existe */}
                        {item.opcionElegida && (
                          <div className="cart-item-option">
                            {item.opcionElegida.nombreOpcion}:{" "}
                            {item.opcionElegida.valorOpcion}
                          </div>
                        )}

                        {/* Controles para modificar cantidad, eliminar y ver precio */}
                        <div className="cart-item-controls">
                          <button
                            className="quantity-button"
                            onClick={() => onDecreaseQuantity(item)}
                          >
                            -
                          </button>

                          <span className="quantity">{item.quantity}</span>

                          <button
                            className="quantity-button"
                            onClick={() => onIncreaseQuantity(item)}
                          >
                            +
                          </button>

                          {/* Botón para eliminar el producto del carrito */}
                          <button
                            className="remove-button"
                            onClick={() => onRemoveFromCart(item)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          {/* Precio total por cantidad */}
                          <span className="cart-item-price">
                            $
                            {(item.precio * item.quantity).toLocaleString(
                              "es-CL"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Si no hay productos en el carrito, mostramos este mensaje
                <p>¡Explora y encuentra lo que buscas!</p>
              )}
              {cartItems && cartItems.length > 0 && (
                <div className="checkout-button-container">
                  {/* Botón para vaciar el carrito */}
                  <button
                    type="button"
                    className="clear-cart-button"
                    onClick={onClearCart}
                  >
                    Vaciar Carrito
                  </button>

                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={handleOpenCheckout}
                  >
                    Ir a Pagar{" "}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      style={{ margin: "0 0.5rem" }}
                    />
                    ${total.toLocaleString("es-CL")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Checkout */}
      {showCheckout && (
        <div
          className="checkout-overlay"
          onClick={() => setShowCheckout(false)}
        >
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="checkout-close"
              onClick={() => setShowCheckout(false)}
            >
              ✕
            </button>
            <div className="checkout-content">
              <h2 className="checkout-title">Finalizar Compra</h2>

              {/* Resumen de productos */}
              <div className="checkout-section">
                <h3 className="section-title">Resumen de tu pedido</h3>
                <div className="checkout-items">
                  {cartItems.map((item) => (
                    <div
                      className="checkout-item"
                      key={`checkout-${item.id}-${
                        item.opcionElegida?.idOpcion || "default"
                      }`}
                    >
                      {/* Imagen del producto */}
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="checkout-item-image"
                      />
                      {/* Detalles del producto */}
                      <div className="checkout-item-details">
                        <div className="checkout-item-name">{item.nombre}</div>
                        <div className="checkout-item-info">
                          <span>Cantidad: {item.quantity}</span>
                          <span>
                            Precio unitario: $
                            {item.precio.toLocaleString("es-CL")}
                          </span>
                          <span className="checkout-item-subtotal">
                            Subtotal: $
                            {(item.precio * item.quantity).toLocaleString(
                              "es-CL"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal simple */}
                <div className="checkout-subtotal">
                  <div className="subtotal-line">
                    <span>Subtotal:</span>
                    <strong>${total.toLocaleString("es-CL")}</strong>
                  </div>
                </div>
              </div>

              {/* Método de entrega */}
              <div className="checkout-section">
                <h3 className="section-title">Método de entrega</h3>
                <div className="delivery-options">
                  <div className="delivery-option">
                    <label htmlFor="despacho" className="delivery-label">
                      <div className="delivery-info">
                        <div className="delivery-title-container">
                          <input
                            onChange={() => setMetodoEntrega("despacho")}
                            type="radio"
                            id="despacho"
                            name="metodoEntrega"
                            value="despacho"
                            className="delivery-radio"
                            defaultChecked
                          />
                          <span className="delivery-title">
                            Despacho a domicilio
                          </span>
                        </div>
                        <span className="delivery-price">$3.990</span>
                      </div>
                      <span className="delivery-description">
                        Recibe en la comodidad de tu hogar en 2-3 días hábiles
                      </span>
                    </label>
                  </div>

                  <div className="delivery-option disabled">
                    {" "}
                    {/* Pondremos delivery-option disabled por mientras */}
                    <label htmlFor="retiro" className="delivery-label">
                      <div className="delivery-info">
                        <div className="delivery-title-container">
                          <input
                            onChange={() => setMetodoEntrega("retiro")}
                            type="radio"
                            id="retiro"
                            name="metodoEntrega"
                            value="retiro"
                            className="delivery-radio"
                            disabled
                          />
                          <span className="delivery-title">
                            Retiro en sucursal
                          </span>
                        </div>
                        <span className="delivery-price">Gratis</span>{" "}
                      </div>
                      <span className="delivery-description">
                        No disponible
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Datos de envío --> ¡Después tengo que usar los datos de Region y comuna de la BD! */}
              {metodoEntrega === "despacho" && (
                <div className="checkout-section">
                  <h3 className="section-title">Datos de envío</h3>
                  <div className="shipping-form">
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Nombre"
                        className="form-input"
                        value={datosEnvio.nombre}
                        onChange={(e) => {
                          if (!user) {
                            // Solo para usuarios invitados: filtrar y capitalizar
                            const valor = e.target.value.replace(
                              /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                              ""
                            );
                            setDatosEnvio({
                              ...datosEnvio,
                              nombre: capitalizarNombre(valor),
                            });
                          } else {
                            // Para usuarios logueados: no cambiar
                            setDatosEnvio({
                              ...datosEnvio,
                              nombre: e.target.value,
                            });
                          }
                        }}
                        readOnly={!!user}
                        maxLength="25"
                      />
                      <input
                        type="text"
                        placeholder="Apellido"
                        className="form-input"
                        value={datosEnvio.apellido}
                        onChange={(e) => {
                          if (!user) {
                            // Solo para usuarios invitados: filtrar y capitalizar
                            const valor = e.target.value.replace(
                              /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                              ""
                            );
                            setDatosEnvio({
                              ...datosEnvio,
                              apellido: capitalizarNombre(valor),
                            });
                          } else {
                            // Para usuarios logueados: no cambiar
                            setDatosEnvio({
                              ...datosEnvio,
                              apellido: e.target.value,
                            });
                          }
                        }}
                        readOnly={!!user}
                        maxLength="25"
                      />
                    </div>

                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="RUT (ej: 12.345.678-9)"
                        className="form-input full-width"
                        maxLength="10" // Máximo XXXXXXXX-X (10 caracteres)
                        value={datosEnvio.rut}
                        onChange={(e) =>
                          setDatosEnvio({
                            ...datosEnvio,
                            rut: formatearRUT(e.target.value),
                          })
                        }
                        readOnly={!!user}
                      />
                      {/* Campo email */}
                      <input
                        type="email"
                        placeholder="Email"
                        className="form-input"
                        value={datosEnvio.email || ""}
                        onChange={(e) =>
                          setDatosEnvio({
                            ...datosEnvio,
                            email: e.target.value,
                          })
                        }
                        readOnly={!!user}
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Calle"
                        className="form-input"
                        value={datosEnvio.calle}
                        onChange={(e) =>
                          setDatosEnvio({
                            ...datosEnvio,
                            calle: e.target.value,
                          })
                        }
                      />

                      <input
                        type="text"
                        placeholder="Número"
                        className="form-input"
                        value={datosEnvio.numero}
                        onChange={(e) => {
                          // Solo permitir números, máximo 6 dígitos
                          const valor = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          setDatosEnvio({
                            ...datosEnvio,
                            numero: valor,
                          });
                        }}
                      />
                    </div>
                    <div className="form-row">
                      <textarea
                        placeholder="Información adicional (Depto, Torre, Referencias, etc.)"
                        className="form-input full-width"
                        rows="3"
                        value={datosEnvio.infoAdicional}
                        onChange={(e) =>
                          setDatosEnvio({
                            ...datosEnvio,
                            infoAdicional: e.target.value,
                          })
                        }
                        maxLength="200"
                      />
                    </div>

                    <div className="form-row">
                      <select
                        className="form-input"
                        value={datosEnvio.region}
                        onChange={(e) =>
                          setDatosEnvio({
                            ...datosEnvio,
                            region: e.target.value,
                          })
                        }
                      >
                        <option value="">Seleccionar Región</option>
                        <option value="13">Región Metropolitana</option>
                      </select>

                      <select
                        className="form-input"
                        value={datosEnvio.comuna}
                        onChange={(e) =>
                          setDatosEnvio({
                            ...datosEnvio,
                            comuna: e.target.value,
                          })
                        }
                      >
                        <option value="">Seleccionar Comuna</option>
                        <option value="109">La Florida</option>
                        <option value="110">Las Condes</option>
                        <option value="111">Maipú</option>
                        <option value="112">Ñuñoa</option>
                        <option value="113">Providencia</option>
                        <option value="114">Puente Alto</option>
                        <option value="115">Santiago Centro</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de sucursales - Solo si elige retiro */}
              {metodoEntrega === "retiro" && (
                <div className="checkout-section">
                  <h3 className="section-title">Seleccionar sucursal</h3>
                  <div className="sucursal-options">
                    <div className="sucursal-option">
                      <input
                        type="radio"
                        id="florida"
                        name="sucursal"
                        value="florida"
                        onChange={(e) =>
                          setSucursalSeleccionada(e.target.value)
                        }
                      />
                      <label htmlFor="florida">Sucursal La Florida</label>
                    </div>
                    <div className="sucursal-option">
                      <input
                        type="radio"
                        id="condes"
                        name="sucursal"
                        value="condes"
                        onChange={(e) =>
                          setSucursalSeleccionada(e.target.value)
                        }
                      />
                      <label htmlFor="condes">Sucursal Las Condes</label>
                    </div>
                  </div>
                </div>
              )}

              {/* Total final - Solo aparece después de elegir método */}
              {(metodoEntrega === "despacho" || metodoEntrega === "retiro") && (
                <div className="checkout-section">
                  <div className="checkout-total-final">
                    <div className="total-line">
                      <span>Subtotal productos:</span>
                      <span>${total.toLocaleString("es-CL")}</span>
                    </div>
                    <div className="total-line">
                      <span>Envío:</span>
                      <span>
                        {costoEnvio === 0
                          ? "Gratis"
                          : `$${costoEnvio.toLocaleString("es-CL")}`}
                      </span>
                    </div>
                    <div className="total-line final-total">
                      <strong>Total a pagar:</strong>
                      <strong>${totalConEnvio.toLocaleString("es-CL")}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Datos de pago */}
              <div className="checkout-section">
                <h3 className="section-title">Datos de pago</h3>

                {/* Métodos de pago disponibles */}
                <div className="payment-methods">
                  <div className="payment-method active">
                    <span>💳 Tarjeta de crédito/débito</span>
                    <div className="payment-logos">
                      <span>VISA</span>
                      <span>Mastercard</span>
                    </div>
                  </div>
                </div>

                {/* Formulario de tarjeta */}
                <div className="payment-form">
                  <input
                    type="text"
                    placeholder="Número de tarjeta (1234 5678 9012 3456)"
                    className="form-input full-width"
                    maxLength="19"
                    value={datosPago.numeroTarjeta}
                    onChange={(e) =>
                      setDatosPago({
                        ...datosPago,
                        numeroTarjeta: formatearNumeroTarjeta(e.target.value),
                      })
                    }
                  />

                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="form-input"
                      maxLength="5"
                      value={datosPago.fechaVencimiento}
                      onChange={(e) =>
                        setDatosPago({
                          ...datosPago,
                          fechaVencimiento: formatearFechaVencimiento(
                            e.target.value
                          ),
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="form-input"
                      maxLength="3"
                      value={datosPago.cvv}
                      onChange={(e) =>
                        setDatosPago({
                          ...datosPago,
                          cvv: formatearCVV(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Botón final */}
              <div className="checkout-actions">
                <button
                  className={`btn-dark-btn ${
                    !isCheckoutCompleto() ? "disabled" : ""
                  }`}
                  disabled={!isCheckoutCompleto()}
                  onClick={handlePago}
                >
                  Pagar ahora{" "}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ margin: "0 0.5rem" }}
                  />
                  ${totalConEnvio.toLocaleString("es-CL")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSlider;
