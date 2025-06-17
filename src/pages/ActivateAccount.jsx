import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Componente que SOLO maneja activación de cuentas nuevas:
 * URL: /activar-cuenta?id=1
 * Acción: cambiar activeUsuario de 0 a 1
 */
const ActivateAccount = () => {
  console.log("🔵 ActivateAccount component rendered"); // AGREGAR

  const location = useLocation();
  const navigate = useNavigate();
  const [hasActivated, setHasActivated] = useState(false);

  console.log("🟡 hasActivated state:", hasActivated); // AGREGAR

  useEffect(() => {
    console.log("🟢 useEffect ejecutándose, hasActivated:", hasActivated); // AGREGAR

    const params = new URLSearchParams(location.search);
    const idParam = params.get("id");

    console.log("🟠 idParam:", idParam); // AGREGAR

    if (idParam && !hasActivated) {
      console.log("🔴 DENTRO del if - Activando cuenta"); // AGREGAR
      setHasActivated(true);

      fetch(`http://localhost:5000/activar-usuario/${idParam}`, {
        method: "PUT",
      })
        .then((response) => {
          console.log("⚪ Response:", response.status); // AGREGAR
          return response.json();
        })
        .then((data) => {
          console.log("🟣 Respuesta del servidor:", data);
          alert("¡Cuenta activada exitosamente! Ya puedes iniciar sesión.");
          navigate("/");
        })
        .catch((error) => {
          console.error("❌ Error:", error);
          alert("Error al activar la cuenta");
        });
    } else {
      console.log(
        "⚫ NO entró al if. Razón:",
        !idParam ? "no hay idParam" : "hasActivated es true"
      ); // AGREGAR
    }
  }, [location, hasActivated]);

  return null;
};

export default ActivateAccount;
