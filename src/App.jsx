import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import CategoryMenu from "./components/CategoryMenu";
import AppRouter from "./router/AppRouter";
import LoginModal from "./components/LoginModal";
import { useNavigate } from "react-router-dom";
import { getCategorias, getSubcategorias } from "./data/productService";
import { FilterProvider } from "./contexts/FilterContext";

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // ESTADOS PARA RECUPERAR CONTRASEÑA
  const [showRecuperarPassword, setShowRecuperarPassword] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const userName = user?.nombre || "";

  // FUNCIONES PARA MANEJO DE CARRITO POR USUARIO
  const getCartKey = () => {
    return user ? `cart_${user.id}` : "cart_temp";
  };

  const saveCartToStorage = (items) => {
    const cartKey = getCartKey();
    if (user) {
      // Usuario logueado: localStorage persiste entre sesiones
      localStorage.setItem(cartKey, JSON.stringify(items));
    } else {
      // Usuario no logueado: sessionStorage (se borra al cerrar navegador)
      sessionStorage.setItem(cartKey, JSON.stringify(items));
    }
  };

  const loadCartFromStorage = () => {
    const cartKey = getCartKey();
    let savedCart = null;

    if (user) {
      // Usuario logueado: buscar en localStorage
      savedCart = localStorage.getItem(cartKey);
    } else {
      // Usuario no logueado: buscar en sessionStorage
      savedCart = sessionStorage.getItem(cartKey);
    }

    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error("Error parsing cart:", error);
        return [];
      }
    }
    return [];
  };

  // FUNCIONES PARA MANEJAR LOS MODALES
  const openRecuperarPassword = () => {
    setShowRecuperarPassword(true);
  };

  const closeRecuperarPassword = () => {
    setShowRecuperarPassword(false);
  };

  const backToLogin = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      const cats = await getCategorias();
      const subs = await getSubcategorias();

      const categoriasConSub = cats.map((cat) => ({
        ...cat,
        subcategorias: subs.filter((sub) => sub.categoria === cat.id),
      }));

      setCategorias(categoriasConSub);
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    // Verificar si hay token guardado al cargar la página
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split(".")[1]));
        setToken(savedToken);
        setUser({
          nombre: payload.nomUsuario,
          apellido: payload.apeUsuario || "",
          rut: payload.rutUsuario || "",
          id: payload.id,
          email: payload.mailUsuario,
        });
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  // useEffect para cargar carrito cuando cambie el usuario
  useEffect(() => {
    // Carga carrito del usuario actual (o temporal si no hay usuario)
    const cartData = loadCartFromStorage();
    setCartItems(cartData);
  }, [user]); // Se ejecuta cuando cambia el usuario

  const handleCartIconClick = () => {
    setCartOpen(true);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  // Función que se ejecuta cuando haya login exitoso
  const handleLoginSuccess = (tokenReceived) => {
    setToken(tokenReceived);
    const payload = JSON.parse(atob(tokenReceived.split(".")[1]));
    const newUser = {
      nombre: payload.nomUsuario,
      apellido: payload.apeUsuario || "",
      rut: payload.rutUsuario || "",
      id: payload.id,
      email: payload.mailUsuario,
    };

    setUser(newUser);

    // IMPORTANTE: Cargar carrito del usuario que se acaba de loguear
    const userCartKey = `cart_${newUser.id}`;
    const userCart = localStorage.getItem(userCartKey);

    if (userCart) {
      try {
        setCartItems(JSON.parse(userCart));
      } catch (error) {
        setCartItems([]);
      }
    } else {
      setCartItems([]); // Usuario nuevo o sin carrito guardado
    }

    // Limpiar carrito temporal de sessionStorage
    sessionStorage.removeItem("cart_temp");

    setShowLoginModal(false);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar datos de usuario
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);

    // IMPORTANTE: Limpiar carrito actual y cargar carrito temporal (vacío)
    setCartItems([]);

    alert("Sesión cerrada");
    navigate("/");
  };

  // Función para agregar productos al carrito
  const handleAddToCart = (producto) => {
    setCartItems((prevItems) => {
      // Crea clave única que incluya producto + opción
      const claveUnica = producto.opcionElegida
        ? `${producto.id}-${producto.opcionElegida.idOpcion}`
        : `${producto.id}`;

      const existingItem = prevItems.find((item) => {
        const itemClave = item.opcionElegida
          ? `${item.id}-${item.opcionElegida.idOpcion}`
          : `${item.id}`;
        return itemClave === claveUnica;
      });

      let newItems;

      if (existingItem) {
        newItems = prevItems.map((item) => {
          const itemClave = item.opcionElegida
            ? `${item.id}-${item.opcionElegida.idOpcion}`
            : `${item.id}`;
          return itemClave === claveUnica
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      } else {
        newItems = [...prevItems, { ...producto, quantity: 1 }];
      }

      // Usa saveCartToStorage en lugar de localStorage.setItem
      saveCartToStorage(newItems);
      return newItems;
    });
  };

  // Funciones para actualizar cantidades del carrito
  const handleRemoveFromCart = (producto) => {
    setCartItems((prevItems) => {
      const productoClave = producto.opcionElegida
        ? `${producto.id}-${producto.opcionElegida.idOpcion}`
        : `${producto.id}`;

      const newItems = prevItems.filter((item) => {
        const itemClave = item.opcionElegida
          ? `${item.id}-${item.opcionElegida.idOpcion}`
          : `${item.id}`;
        return itemClave !== productoClave;
      });

      // Usa saveCartToStorage
      saveCartToStorage(newItems);
      return newItems;
    });
  };

  const handleIncreaseQuantity = (producto) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        // Crea claves únicas para comparar
        const itemClave = item.opcionElegida
          ? `${item.id}-${item.opcionElegida.idOpcion}`
          : `${item.id}`;
        const productoClave = producto.opcionElegida
          ? `${producto.id}-${producto.opcionElegida.idOpcion}`
          : `${producto.id}`;

        return itemClave === productoClave
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      });

      // Usa saveCartToStorage
      saveCartToStorage(newItems);
      return newItems;
    });
  };

  const handleDecreaseQuantity = (producto) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        const itemClave = item.opcionElegida
          ? `${item.id}-${item.opcionElegida.idOpcion}`
          : `${item.id}`;
        const productoClave = producto.opcionElegida
          ? `${producto.id}-${producto.opcionElegida.idOpcion}`
          : `${producto.id}`;

        return itemClave === productoClave && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item;
      });

      // Usa saveCartToStorage
      saveCartToStorage(newItems);
      return newItems;
    });
  };

  // Función para Vaciar el carrito
  const handleClearCart = () => {
    setCartItems([]);

    // Limpia del storage correcto
    const cartKey = getCartKey();
    if (user) {
      localStorage.removeItem(cartKey);
    } else {
      sessionStorage.removeItem(cartKey);
    }
  };

  const handleOpenCategoryMenu = () => {
    setIsCategoryMenuOpen(true);
  };

  const handleCloseCategoryMenu = () => {
    setIsCategoryMenuOpen(false);
  };

  const handleSearch = (query) => {
    navigate(`/buscar?q=${encodeURIComponent(query)}`);
  };

  // Render principal de la App
  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        onCartIconClick={handleCartIconClick}
        cartItemCount={cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        )}
        onLoginClick={handleLoginClick}
        userName={userName}
        onLogoutClick={handleLogout}
        onToggleCategoryMenu={handleOpenCategoryMenu}
        onSearch={handleSearch}
      />

      <CategoryMenu
        isOpen={isCategoryMenuOpen}
        onClose={handleCloseCategoryMenu}
        categorias={categorias}
      />

      {/* Provee el contexto de filtros a las rutas internas */}
      <FilterProvider>
        {/* Envolvemos en main-content */}
        <main className="main-content">
          {/* MODAL DE LOGIN/REGISTRO */}
          {showLoginModal && (
            <LoginModal
              onClose={closeLoginModal}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {/* Carrito de compras */}
          <Cart
            isOpen={cartOpen}
            onClose={() => setCartOpen(false)}
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            onClearCart={handleClearCart}
            user={user}
          />

          {/* Rutas principales de navegación */}
          <AppRouter onAddToCart={handleAddToCart} onSearch={handleSearch} />
        </main>
      </FilterProvider>

      <Footer />
    </>
  );
};

export default App;
