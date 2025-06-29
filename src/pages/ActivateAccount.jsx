import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ActivateAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasActivated, setHasActivated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get("id");

    if (idParam && !hasActivated) {
      setHasActivated(true);

      fetch(`http://localhost:5000/activar-usuario/${idParam}`, {
        method: "PUT",
      })
        .then((response) => response.json())
        .then(() => {
          alert("¡Cuenta activada exitosamente! Ya puedes iniciar sesión.");
          navigate("/");
        })
        .catch(() => {
          alert("Error al activar la cuenta");
        });
    }
  }, [location, hasActivated]);

  return null;
};

export default ActivateAccount;
