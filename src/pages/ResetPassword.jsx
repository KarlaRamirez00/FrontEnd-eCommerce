import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";

/**
 * Página que procesa enlaces de recuperación de contraseña: /restablecer-password?id=123
 * Abre el LoginModal en modo recuperación con el ID del usuario
 */
const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Obtiene el ID de la URL
    const params = new URLSearchParams(location.search);
    const idParam = params.get("id");

    if (idParam) {
      setUserId(idParam);
      setShowModal(true);
    } else {
      // Si no hay ID, redirige al home
      navigate("/");
    }
  }, [location, navigate]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  const handleLoginSuccess = (token) => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <>
      {showModal && (
        <LoginModal
          onClose={handleCloseModal}
          onLoginSuccess={handleLoginSuccess}
          //onOpenRecuperarPassword={() => {}}
          initialMode="recover"
          resetUserId={userId}
        />
      )}
    </>
  );
};

export default ResetPassword;
