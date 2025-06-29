import axios from "axios";

// Obtiene todas las categorías desde el backend
export const getCategorias = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/producto/categoria"
    );
    return response.data.categoria || [];
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
};

// Obtiene todas las subcategorías desde el backend
export const getSubcategorias = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/producto/subcategoria"
    );
    return response.data.subcategorias || [];
  } catch (error) {
    console.error("Error al obtener subcategorías:", error);
    return [];
  }
};

// Obtiene productos aleatorios desde la primera página (para mostrar destacados)
export const getProductosDestacadosAleatorios = async (cantidad = 4) => {
  try {
    const response = await axios.get("http://localhost:5000/producto?pagina=1");
    const todos = response.data.Productos || [];
    // Mezcla aleatoriamente y corta según la cantidad pedida
    return [...todos].sort(() => 0.5 - Math.random()).slice(0, cantidad);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

// Obtiene productos que pertenecen a una subcategoría específica
export const getProductosPorSubcategoria = async (
  subcategoriaId,
  pagina = 1
) => {
  try {
    const response = await axios.get("http://localhost:5000/producto", {
      params: {
        subcategoria: subcategoriaId,
        pagina,
      },
    });
    return response.data.Productos || [];
  } catch (error) {
    console.error("Error al obtener productos por subcategoría:", error);
    return [];
  }
};

// Obtiene productos que pertenecen a una categoría específica
export const getProductosPorCategoria = async (categoriaId, pagina = 1) => {
  try {
    const response = await axios.get("http://localhost:5000/producto", {
      params: {
        categoria: categoriaId,
        pagina,
      },
    });
    return response.data.Productos || [];
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    return [];
  }
};

// Obtiene productos que coinciden con una palabra clave de búsqueda
export const getProductosPorBusqueda = async (query, pagina = 1) => {
  try {
    const response = await axios.get("http://localhost:5000/producto", {
      params: {
        search: query,
        pagina,
      },
    });
    return response.data.Productos || [];
  } catch (error) {
    console.error("Error al buscar productos:", error);
    return [];
  }
};

// Obtiene detalles de cada producto
export const getDetalleProducto = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/producto/${id}`);
    return response.data.producto;
  } catch (error) {
    console.error("Error al obtener detalle del producto:", error);
    return null;
  }
};
