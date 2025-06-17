import { StrictMode } from "react"; // Modo estricto para detectar errores en desarrollo
import { createRoot } from "react-dom/client"; // Nueva forma de renderizar React 18+
import "bootstrap/dist/css/bootstrap.min.css"; // CSS de Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // JS de Bootstrap

import "./index.css"; // Estilos personalizados de la app
import App from "./App.jsx"; // Componente principal de toda la aplicación
import { BrowserRouter } from "react-router-dom"; // Habilita la navegación de rutas en toda la aplicación.

createRoot(document.getElementById("root")).render(
  //<StrictMode>
  <BrowserRouter>
    {" "}
    {/* Aquí envuelves tu aplicación con BrowserRouter */}
    <App />
  </BrowserRouter>
  //</StrictMode>
);
