import React, { useState, useEffect } from "react";
import "../styles/LoginModal.css";
import axios from "axios";

// Componente principal del modal de login/registro/recuperación
export default function LoginModal({
  onClose,
  onLoginSuccess,
  initialMode = "signin",
  resetUserId = null,
}) {
  const [authMode, setAuthMode] = useState(initialMode);
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: solicitar email, 2: cambiar contraseña

  // Estado para guardar los datos del formulario
  const [formData, setFormData] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    userName: "",
  });

  const [passwordError, setPasswordError] = useState("");

  // Maneja cuando se abre en modo recuperación desde enlace
  useEffect(() => {
    if (initialMode === "recover" && resetUserId) {
      setRecoveryStep(2); // Ir directo a cambiar contraseña
      fetchUserData(resetUserId);
    }
  }, [initialMode, resetUserId]);

  // Obtiene datos del usuario para mostrar nombre
  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/usuarios/${id}`);
      if (response.status === 200) {
        const userData = response.data.usuario;
        setFormData((prev) => ({
          ...prev,
          userName: `${userData.nombre} ${userData.apellido}`,
        }));
      }
    } catch (error) {
      console.error("Error obteniendo datos usuario:", error);
    }
  };

  // Cambia entre modos y limpia los datos del formulario
  const changeAuthMode = (newMode = null) => {
    if (newMode) {
      setAuthMode(newMode);
    } else {
      setAuthMode(authMode === "signin" ? "signup" : "signin");
    }

    setFormData({
      rut: "",
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      userName: "",
    });
    setPasswordError("");
    setRecoveryStep(1);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Funciones de validación
  const formatearRUT = (rut) => {
    rut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (rut.length < 2) return rut;
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);
    return `${cuerpo}-${dv}`;
  };

  const validarRUT = (rut) => {
    const regex = /^\d{7,8}-[\dkK]$/i;
    if (!regex.test(rut)) return false;
    const partes = rut.split("-");
    const cuerpo = partes[0];
    const dv = partes[1].toUpperCase();
    return (cuerpo.length === 7 || cuerpo.length === 8) && /^[0-9K]$/.test(dv);
  };

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

  const validarNombre = (texto) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(texto) && texto.trim().length >= 2;
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const validarPassword = (password) => {
    if (password.length < 6 || password.length > 20) return false;
    return /[A-Z]/.test(password);
  };

  // Función para verificar si el formulario está completo y válido
  const isFormularioValido = () => {
    if (authMode === "signin") {
      return validarEmail(formData.email) && formData.password !== "";
    } else if (authMode === "signup") {
      return (
        validarRUT(formData.rut) &&
        validarNombre(formData.nombre) &&
        validarNombre(formData.apellido) &&
        validarEmail(formData.email) &&
        validarPassword(formData.password) &&
        formData.password === formData.confirmPassword
      );
    } else if (authMode === "recover") {
      if (recoveryStep === 1) {
        return validarEmail(formData.email);
      } else {
        return (
          validarPassword(formData.newPassword) &&
          formData.newPassword === formData.confirmNewPassword
        );
      }
    }
    return false;
  };

  // Función para recuperar contraseña
  const handleForgotPassword = () => {
    changeAuthMode("recover");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseURL = "http://localhost:5000";

    if (authMode === "signin") {
      // Lógica de login
      try {
        const response = await axios.post(`${baseURL}/login`, {
          mail: formData.email,
          password: formData.password,
        });

        const result = response.data;

        if (response.status === 200 && result.token) {
          alert("Login exitoso");
          localStorage.setItem("token", result.token);
          onLoginSuccess(result.token);
          onClose();
        } else {
          alert(result.mensaje || "Error en el login");
        }
      } catch (error) {
        console.error("Error en login:", error);

        // Maneja errores específicos del servidor
        if (
          error.response &&
          error.response.data &&
          error.response.data.mensaje
        ) {
          alert(error.response.data.mensaje);
        } else if (error.response && error.response.status === 401) {
          alert("Credenciales incorrectas. Verifica tu email y contraseña.");
        } else if (error.response && error.response.status === 404) {
          alert("Usuario no encontrado.");
        } else {
          alert("Error de conexión. Verifica tu conexión a internet.");
        }
      }
    } else if (authMode === "signup") {
      // Lógica de registro
      if (formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      try {
        const data = {
          rut: formData.rut,
          nombre: formData.nombre,
          apellido: formData.apellido,
          mail: formData.email,
          password: formData.password,
          rol: 1,
        };

        const response = await axios.post(`${baseURL}/register`, data);
        const result = response.data;

        if (response.status === 200) {
          alert(
            "Usuario registrado exitosamente. Revisa tu correo para activar tu cuenta."
          );
          setAuthMode("signin");
        } else {
          alert(result.mensaje || "Error en el registro");
        }
      } catch (error) {
        console.error("Error en registro:", error);

        // Maneja errores específicos del servidor
        if (
          error.response &&
          error.response.data &&
          error.response.data.mensaje
        ) {
          // El servidor devolvió un mensaje específico (RUT duplicado, email duplicado, etc.)
          alert(error.response.data.mensaje);
        } else if (error.response && error.response.status === 400) {
          // Error 400 pero sin mensaje específico
          alert("Error en los datos proporcionados. Verifica la información.");
        } else if (error.response && error.response.status === 500) {
          // Error interno del servidor
          alert("Error interno del servidor. Inténtalo más tarde.");
        } else {
          // Error de red o desconocido
          alert("Error de conexión. Verifica tu conexión a internet.");
        }
      }
    } else if (authMode === "recover") {
      // Lógica de recuperación
      if (recoveryStep === 1) {
        // Paso 1: Solicitar recuperación por email
        try {
          const response = await axios.post(`${baseURL}/recuperar/mail`, {
            email: formData.email,
          });

          if (response.status === 200) {
            alert(
              "Se han enviado las instrucciones para restablecer la contraseña a tu correo electrónico. Revisa tu bandeja de entrada y haz clic en el enlace."
            );
            onClose();
          }
        } catch (error) {
          console.error("Error en recuperación:", error);
          if (error.response && error.response.data) {
            alert(
              error.response.data.mensaje || "Error al solicitar recuperación"
            );
          } else {
            alert("Error al solicitar recuperación");
          }
        }
      } else if (recoveryStep === 2) {
        // Paso 2: Cambiar contraseña
        if (formData.newPassword !== formData.confirmNewPassword) {
          alert("Las contraseñas no coinciden");
          return;
        }

        if (!validarPassword(formData.newPassword)) {
          alert(
            "La contraseña debe tener mínimo 6 caracteres y al menos 1 mayúscula"
          );
          return;
        }

        if (!resetUserId) {
          alert(
            "Error: No se encontró el ID de usuario. Por favor, usa el enlace del correo."
          );
          return;
        }

        try {
          console.log(
            "Enviando cambio de contraseña para usuario:",
            resetUserId
          );
          const response = await axios.put(`${baseURL}/recuperar/cambiar`, {
            usuario: parseInt(resetUserId),
            password: formData.newPassword,
          });

          if (response.status === 200) {
            alert(
              "Contraseña cambiada exitosamente. Ya puedes iniciar sesión."
            );
            changeAuthMode("signin");
          }
        } catch (error) {
          console.error("Error cambiando contraseña:", error);
          if (error.response && error.response.data) {
            alert(error.response.data.mensaje || "Error al cambiar contraseña");
          } else {
            alert("Error al cambiar contraseña");
          }
        }
      }
    }
  };

  // Función para obtener el título correcto
  const getTitle = () => {
    if (authMode === "signin") return "Iniciar Sesión";
    if (authMode === "signup") return "Registrarse";
    if (authMode === "recover") {
      return recoveryStep === 1 ? "Recuperar Contraseña" : "Nueva Contraseña";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>

        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">{getTitle()}</h3>

            {/* Enlaces para cambiar entre modos */}
            {authMode !== "recover" && (
              <div className="text-center">
                {authMode === "signin"
                  ? "¿No tienes cuenta? "
                  : "¿Ya tienes cuenta? "}
                <span className="link-primary" onClick={() => changeAuthMode()}>
                  {authMode === "signin" ? "Regístrate" : "Inicia Sesión"}
                </span>
              </div>
            )}

            {/* MODO RECUPERACIÓN */}
            {authMode === "recover" && recoveryStep === 1 && (
              <>
                <div className="text-center mb-3">
                  <p>
                    Ingresa tu correo electrónico y te enviaremos las
                    instrucciones para recuperar tu contraseña.
                  </p>
                </div>

                <div className="form-group mt-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="tu.email@aqui.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {authMode === "recover" && recoveryStep === 2 && (
              <>
                <div className="text-center mb-3">
                  {formData.userName ? (
                    <>
                      <small style={{ color: "#666" }}>
                        Hola, {formData.userName}
                      </small>
                      <p>Ingresa tu nueva contraseña</p>
                    </>
                  ) : (
                    <>
                      <small style={{ color: "#666" }}>
                        Usuario ID: {resetUserId}
                      </small>
                      <p>Ingresa tu nueva contraseña</p>
                    </>
                  )}
                </div>

                <div className="form-group mt-3">
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Nueva contraseña"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        newPassword: e.target.value,
                      });
                      if (passwordError) setPasswordError(""); // Limpiar error si existe
                    }}
                    onBlur={() => {
                      // Validar cuando el usuario salga del campo
                      if (
                        formData.newPassword &&
                        !validarPassword(formData.newPassword)
                      ) {
                        setPasswordError(
                          "Mínimo 6 caracteres, al menos 1 mayúscula"
                        );
                      }
                    }}
                    maxLength="20"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Confirma tu nueva contraseña"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    required
                  />
                  {/* Mostrar error si existe */}
                  {passwordError && (
                    <small className="text-danger mt-1">{passwordError}</small>
                  )}
                </div>
              </>
            )}

            {/* CAMPOS DE REGISTRO */}
            {authMode === "signup" && (
              <>
                <div className="form-group mt-3">
                  <label>Rut</label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="12345678-9"
                    name="rut"
                    value={formData.rut}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        rut: formatearRUT(e.target.value),
                      });
                    }}
                    maxLength="10"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label>Nombre</label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Juan"
                    name="nombre"
                    value={formData.nombre}
                    onChange={(e) => {
                      const valor = e.target.value.replace(
                        /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                        ""
                      );
                      setFormData({
                        ...formData,
                        nombre: capitalizarNombre(valor),
                      });
                    }}
                    maxLength="25"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label>Apellido</label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Pérez"
                    name="apellido"
                    value={formData.apellido}
                    onChange={(e) => {
                      const valor = e.target.value.replace(
                        /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                        ""
                      );
                      setFormData({
                        ...formData,
                        apellido: capitalizarNombre(valor),
                      });
                    }}
                    maxLength="25"
                    required
                  />
                </div>
              </>
            )}

            {/* CAMPOS COMUNES (LOGIN Y REGISTRO) */}
            {(authMode === "signin" || authMode === "signup") && (
              <>
                <div className="form-group mt-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="Correo electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Contraseña"
                    name="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      });
                      if (passwordError) setPasswordError("");
                    }}
                    onBlur={() => {
                      if (
                        authMode === "signup" &&
                        formData.password &&
                        !validarPassword(formData.password)
                      ) {
                        setPasswordError(
                          "Mínimo 6 caracteres, al menos 1 mayúscula"
                        );
                      }
                    }}
                    maxLength="20"
                    required
                  />

                  {passwordError && (
                    <small className="text-danger mt-1">{passwordError}</small>
                  )}
                </div>

                {authMode === "signup" && (
                  <div className="form-group mt-3">
                    <label>Confirmar Contraseña</label>
                    <input
                      type="password"
                      className="form-control mt-1"
                      placeholder="Confirma tu contraseña"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </>
            )}

            <div className="d-grid gap-2 mt-3">
              <button
                type="submit"
                className={`btn btn-dark ${
                  !isFormularioValido() ? "disabled" : ""
                }`}
                disabled={!isFormularioValido()}
              >
                {authMode === "signin" && "Iniciar Sesión"}
                {authMode === "signup" && "Registrarse"}
                {authMode === "recover" && recoveryStep === 1 && "Enviar"}
                {authMode === "recover" &&
                  recoveryStep === 2 &&
                  "Cambiar Contraseña"}
              </button>
            </div>

            {/* ENLACES ADICIONALES */}
            {authMode === "signin" && (
              <p className="text-center mt-2">
                <span className="link-primary" onClick={handleForgotPassword}>
                  ¿Olvidaste tu contraseña?
                </span>
              </p>
            )}

            {authMode === "recover" && (
              <p className="text-center mt-2">
                <span
                  className="link-primary"
                  onClick={() => changeAuthMode("signin")}
                >
                  ← Volver al Inicio de Sesión
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
