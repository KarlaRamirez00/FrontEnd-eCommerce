import axios from "axios";

const baseURL = "http://localhost:5000";

export const procesarVenta = async (ventaData) => {
  try {
    console.log("Enviando venta al backend:", ventaData);

    const response = await axios.post(`${baseURL}/venta`, ventaData);

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        ventaId: response.data.venta,
      };
    }

    return {
      success: false,
      message: "Error inesperado",
    };
  } catch (error) {
    console.error("Error al procesar venta:", error);
    return {
      success: false,
      message:
        error.response?.data?.mensaje || "Error al conectar con el servidor",
    };
  }
};

export const transformarDatosVenta = (
  cartItems,
  user,
  datosEnvio,
  datosPago,
  totalConEnvio
) => {
  // 1. Transforma productos del carrito
  const productos = cartItems.map((item) => ({
    producto: item.id,
    opcion: item.opcionElegida
      ? item.opcionElegida.idOpcion
      : item.stock?.[0]?.idOpcion || 1,
    cant: item.quantity,
  }));

  // 2. Cliente o clienteInvitado
  const clienteData = user
    ? {
        cliente: user.id,
        clienteInvitado: null,
      }
    : {
        cliente: null,
        clienteInvitado: {
          rutCliente: datosEnvio.rut.replace(/[-]/g, ""), // Ignora guión, para no exceder el largo, ya que el backend acepta solo VARCHAR(10)
          nomCliente: datosEnvio.nombre,
          apeCliente: datosEnvio.apellido,
          mailCliente: "email@ejemplo.com",
        },
      };

  // 3. Datos de pago
  const pago = {
    nroTarjeta: datosPago.numeroTarjeta.replace(/\s/g, ""), // Quita espacios
    fecVenTarjeta: datosPago.fechaVencimiento,
    cvv: datosPago.cvv,
    monto: totalConEnvio,
  };

  // 4. Datos de despacho
  const despacho = {
    calleDespacho: datosEnvio.calle,
    numeroCalleDespacho: datosEnvio.numero,
    comunaDespacho: datosEnvio.comuna,
  };

  // 5. Estructura final
  return {
    productos,
    ...clienteData,
    pago,
    despacho,
    retiro: null,
    sucursal: 1, // Sucursal fija para despachos por el momento
  };
};
