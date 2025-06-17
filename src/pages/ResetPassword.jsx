import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal"; // Ajusta la ruta según tu estructura

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
    // Obtener el ID de la URL
    const params = new URLSearchParams(location.search);
    const idParam = params.get("id");

    if (idParam) {
      console.log("ID para restablecer contraseña:", idParam);
      setUserId(idParam);
      setShowModal(true);
    } else {
      // Si no hay ID, redirigir al home
      navigate("/");
    }
  }, [location, navigate]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  const handleLoginSuccess = (token) => {
    // Manejar login exitoso igual que en tu App principal
    console.log("Login exitoso:", token);
    setShowModal(false);
    navigate("/");
  };

  return (
    <>
      {showModal && (
        <LoginModal
          onClose={handleCloseModal}
          onLoginSuccess={handleLoginSuccess}
          onOpenRecuperarPassword={() => {}} // No necesario en este contexto
          initialMode="recover" // Abrir en modo recuperación
          resetUserId={userId} // Pasar el ID del usuario
        />
      )}
    </>
  );
};

export default ResetPassword;
