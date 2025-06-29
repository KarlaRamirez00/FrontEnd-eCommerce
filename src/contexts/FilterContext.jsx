import React, { createContext, useContext, useReducer } from "react";

// Estado inicial de filtros
const initialState = {
  // Filtros
  precioMin: 0,
  precioMax: 10000000,
  precioModificadoManualmente: false,
  marcas: [],
  categorias: [],
  subcategorias: [],
  soloConDescuento: false,

  // Ordenamiento
  ordenarPor: "relevancia",

  // Estado del modal
  modalAbierto: false,

  // Contadores para UI
  cantidadFiltrosActivos: 0,
};

// Tipos de acciones
const ACTIONS = {
  SET_PRECIO_RANGO: "SET_PRECIO_RANGO",
  SET_PRECIO_INICIAL: "SET_PRECIO_INICIAL",
  TOGGLE_MARCA: "TOGGLE_MARCA",
  TOGGLE_CATEGORIA: "TOGGLE_CATEGORIA",
  TOGGLE_SUBCATEGORIA: "TOGGLE_SUBCATEGORIA",
  TOGGLE_SOLO_DESCUENTO: "TOGGLE_SOLO_DESCUENTO",
  SET_ORDENAR_POR: "SET_ORDENAR_POR",
  TOGGLE_MODAL: "TOGGLE_MODAL",
  LIMPIAR_FILTROS: "LIMPIAR_FILTROS",
  ACTUALIZAR_CONTADOR: "ACTUALIZAR_CONTADOR",
};

// Función para contar filtros activos
const contarFiltrosActivos = (state) => {
  let contador = 0;

  // Precio (solo si fue modificado manualmente)
  if (state.precioModificadoManualmente) {
    contador++;
  }

  // Marcas
  if (state.marcas && state.marcas.length > 0) {
    contador++;
  }

  // Categorías
  if (state.categorias && state.categorias.length > 0) {
    contador++;
  }

  // Subcategorías
  if (state.subcategorias && state.subcategorias.length > 0) {
    contador++;
  }

  // Solo con descuento
  if (state.soloConDescuento) {
    contador++;
  }

  return contador;
};

// Reducer para manejar las acciones
const filterReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case ACTIONS.SET_PRECIO_INICIAL:
      newState = {
        ...state,
        precioMin: action.payload.min,
        precioMax: action.payload.max,
        precioModificadoManualmente: false,
      };
      break;

    case ACTIONS.SET_PRECIO_RANGO:
      const { min, max } = action.payload;
      const modificadoManualmente =
        min !== initialState.precioMin || max !== initialState.precioMax;
      newState = {
        ...state,
        precioMin: min,
        precioMax: max,
        precioModificadoManualmente: modificadoManualmente,
      };
      break;

    case ACTIONS.TOGGLE_MARCA:
      const marcas = state.marcas.includes(action.payload)
        ? state.marcas.filter((m) => m !== action.payload)
        : [...state.marcas, action.payload];
      newState = { ...state, marcas };
      break;

    case ACTIONS.TOGGLE_CATEGORIA:
      const categorias = state.categorias.includes(action.payload)
        ? state.categorias.filter((c) => c !== action.payload)
        : [...state.categorias, action.payload];
      newState = { ...state, categorias };
      break;

    case ACTIONS.TOGGLE_SUBCATEGORIA:
      const subcategorias = state.subcategorias.includes(action.payload)
        ? state.subcategorias.filter((s) => s !== action.payload)
        : [...state.subcategorias, action.payload];
      newState = { ...state, subcategorias };
      break;

    case ACTIONS.TOGGLE_SOLO_DESCUENTO:
      newState = {
        ...state,
        soloConDescuento: !state.soloConDescuento,
      };
      break;

    case ACTIONS.SET_ORDENAR_POR:
      newState = {
        ...state,
        ordenarPor: action.payload,
      };
      break;

    case ACTIONS.TOGGLE_MODAL:
      newState = {
        ...state,
        modalAbierto: !state.modalAbierto,
      };
      break;

    case ACTIONS.LIMPIAR_FILTROS:
      newState = {
        ...initialState,
        modalAbierto: state.modalAbierto,
      };
      break;

    default:
      return state;
  }

  // Actualiza contador automáticamente
  newState.cantidadFiltrosActivos = contarFiltrosActivos(newState);
  return newState;
};

// Crea contexto
const FilterContext = createContext();

// Provider del contexto
export const FilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, {
    ...initialState,
    cantidadFiltrosActivos: contarFiltrosActivos(initialState),
  });

  // Funciones helper para dispatch
  const setPrecioInicial = (min, max) => {
    dispatch({
      type: ACTIONS.SET_PRECIO_INICIAL,
      payload: { min, max },
    });
  };

  const setPrecioRango = (min, max) => {
    dispatch({
      type: ACTIONS.SET_PRECIO_RANGO,
      payload: { min, max },
    });
  };

  const toggleMarca = (marca) => {
    dispatch({
      type: ACTIONS.TOGGLE_MARCA,
      payload: marca,
    });
  };

  const toggleCategoria = (categoria) => {
    dispatch({
      type: ACTIONS.TOGGLE_CATEGORIA,
      payload: categoria,
    });
  };

  const toggleSubcategoria = (subcategoria) => {
    dispatch({
      type: ACTIONS.TOGGLE_SUBCATEGORIA,
      payload: subcategoria,
    });
  };

  const toggleSoloDescuento = () => {
    dispatch({
      type: ACTIONS.TOGGLE_SOLO_DESCUENTO,
    });
  };

  const setOrdenarPor = (orden) => {
    dispatch({
      type: ACTIONS.SET_ORDENAR_POR,
      payload: orden,
    });
  };

  const toggleModal = () => {
    dispatch({
      type: ACTIONS.TOGGLE_MODAL,
    });
  };

  const limpiarFiltros = () => {
    dispatch({
      type: ACTIONS.LIMPIAR_FILTROS,
    });
  };

  const value = {
    ...state,
    setPrecioInicial,
    setPrecioRango,
    toggleMarca,
    toggleCategoria,
    toggleSubcategoria,
    toggleSoloDescuento,
    setOrdenarPor,
    toggleModal,
    limpiarFiltros,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters debe ser usado dentro de FilterProvider");
  }
  return context;
};
