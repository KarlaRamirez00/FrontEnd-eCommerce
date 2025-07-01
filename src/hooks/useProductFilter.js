import { useMemo } from "react";
import { useFilters } from "../contexts/FilterContext";

// Hook personalizado que aplica todos los filtros a un array de productos
export const useProductFilter = (productos = []) => {
  const {
    precioMin,
    precioMax,
    soloConDescuento,
    marcas,
    categorias,
    subcategorias,
    ordenarPor,
  } = useFilters();

  // useMemo optimiza el rendimiento - solo recalcula cuando cambian los filtros o productos
  const productosFiltrados = useMemo(() => {
    if (!productos || productos.length === 0) {
      return [];
    }

    // PASO 1: Aplicar filtros
    let resultado = productos.filter((producto) => {
      // Obtener precio actual (prioriza precio de oferta si existe)
      const precioActual =
        producto.valorOferta || producto.valorOriginal || producto.precio || 0;

      // FILTRO DE PRECIO
      const cumplePrecio =
        precioActual >= precioMin && precioActual <= precioMax;
      if (!cumplePrecio) return false;

      // FILTRO DE DESCUENTO
      if (soloConDescuento) {
        const tieneDescuento =
          producto.valorOferta &&
          producto.valorOriginal &&
          producto.valorOferta < producto.valorOriginal;
        if (!tieneDescuento) return false;
      }

      // FILTRO DE MARCAS (si hay marcas seleccionadas)
      if (marcas.length > 0) {
        const marcaProducto = producto.marca || producto.fabricante || "";
        if (!marcas.includes(marcaProducto)) return false;
      }

      // FILTRO DE CATEGORÍAS (si hay categorías seleccionadas)
      if (categorias.length > 0) {
        const categoriaProducto =
          producto.categoria || producto.idCategoria || "";
        if (!categorias.includes(categoriaProducto.toString())) return false;
      }

      // FILTRO DE SUBCATEGORÍAS (si hay subcategorías seleccionadas)
      if (subcategorias.length > 0) {
        const subcategoriaProducto =
          producto.subcategoria || producto.idSubCategoria || "";
        if (!subcategorias.includes(subcategoriaProducto.toString()))
          return false;
      }

      return true;
    });

    // PASO 2: Aplicar ordenamiento
    switch (ordenarPor) {
      case "precio_asc":
        resultado.sort((a, b) => {
          const precioA = a.valorOferta || a.valorOriginal || a.precio || 0;
          const precioB = b.valorOferta || b.valorOriginal || b.precio || 0;
          return precioA - precioB;
        });
        break;

      case "precio_desc":
        resultado.sort((a, b) => {
          const precioA = a.valorOferta || a.valorOriginal || a.precio || 0;
          const precioB = b.valorOferta || b.valorOriginal || b.precio || 0;
          return precioB - precioA;
        });
        break;

      case "descuento":
        resultado.sort((a, b) => {
          // Calcular porcentaje de descuento
          const descuentoA = calcularPorcentajeDescuento(a);
          const descuentoB = calcularPorcentajeDescuento(b);
          return descuentoB - descuentoA; // Mayor descuento primero
        });
        break;

      case "relevancia":
      default:
        // Ordenar por ID descendente (productos más nuevos primero)
        // El ID más alto corresponde al producto más recientemente agregado
        resultado.sort((a, b) => {
          const idA = a.idProducto || a.id || 0;
          const idB = b.idProducto || b.id || 0;
          return idB - idA; // Descendente: mayor ID primero
        });
        break;
    }

    return resultado;
  }, [
    productos,
    precioMin,
    precioMax,
    soloConDescuento,
    marcas,
    categorias,
    subcategorias,
    ordenarPor,
  ]);

  return productosFiltrados;
};

// Función helper para calcular porcentaje de descuento
const calcularPorcentajeDescuento = (producto) => {
  if (
    !producto.valorOferta ||
    !producto.valorOriginal ||
    producto.valorOferta >= producto.valorOriginal
  ) {
    return 0;
  }

  return Math.round(
    ((producto.valorOriginal - producto.valorOferta) / producto.valorOriginal) *
      100
  );
};
