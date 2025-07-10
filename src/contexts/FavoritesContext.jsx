import React, { createContext, useContext, useState, useEffect } from "react";

// Crea el contexto para manejar productos favoritos
const FavoritesContext = createContext();

// Componente proveedor del contexto de favoritos
export const FavoritesProvider = ({ children, user }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Obtiene la clave de almacenamiento según si el usuario está logueado o no
  const getFavoritesKey = () => {
    return user ? `favorites_${user.id}` : "favorites_temp";
  };

  // Guarda los favoritos en el storage adecuado
  const saveFavoritesToStorage = (items) => {
    const favoritesKey = getFavoritesKey();
    if (user) {
      localStorage.setItem(favoritesKey, JSON.stringify(items)); // Persistente
    } else {
      sessionStorage.setItem(favoritesKey, JSON.stringify(items)); // Temporal
    }
  };

  // Carga los favoritos desde storage cuando inicia o cambia el usuario
  const loadFavoritesFromStorage = () => {
    const favoritesKey = getFavoritesKey();
    let savedFavorites = null;

    if (user) {
      savedFavorites = localStorage.getItem(favoritesKey);
    } else {
      savedFavorites = sessionStorage.getItem(favoritesKey);
    }

    if (savedFavorites) {
      try {
        return JSON.parse(savedFavorites);
      } catch (error) {
        console.error("Error parsing favorites:", error);
        return [];
      }
    }
    return [];
  };

  // Cuando el usuario cambia (o al cargar), recupera sus favoritos
  useEffect(() => {
    const favoritesData = loadFavoritesFromStorage();
    setFavorites(favoritesData);
  }, [user]);

  // Verifica si un producto está marcado como favorito
  const isFavorite = (productId) => {
    return favorites.some((fav) => fav.id === productId);
  };

  // Agrega producto a favoritos
  const addToFavorites = (producto) => {
    if (isFavorite(producto.id)) return;
    setIsLoading(true);

    const newFavorites = [
      ...favorites,
      {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        valorOriginal: producto.valorOriginal,
        valorOferta: producto.valorOferta,
        imagen: producto.imagen,
        cantidadOpciones: producto.cantidadOpciones,
        dateAdded: new Date().toISOString(),
      },
    ];

    setFavorites(newFavorites);
    saveFavoritesToStorage(newFavorites);

    setTimeout(() => setIsLoading(false), 300);
  };

  // Quita producto de favoritos
  const removeFromFavorites = (productId) => {
    setIsLoading(true);

    const newFavorites = favorites.filter((fav) => fav.id !== productId);
    setFavorites(newFavorites);
    saveFavoritesToStorage(newFavorites);

    setTimeout(() => setIsLoading(false), 300);
  };

  // Marca o desmarca un producto como favorito
  const toggleFavorite = (producto) => {
    if (isFavorite(producto.id)) {
      removeFromFavorites(producto.id);
    } else {
      addToFavorites(producto);
    }
  };

  // Limpia todos los favoritos
  const clearFavorites = () => {
    setFavorites([]);
    const favoritesKey = getFavoritesKey();
    if (user) {
      localStorage.removeItem(favoritesKey);
    } else {
      sessionStorage.removeItem(favoritesKey);
    }
  };

  const value = {
    favorites,
    isLoading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de favoritos
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe ser usado dentro de FavoritesProvider");
  }
  return context;
};
