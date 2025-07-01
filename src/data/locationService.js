import { useState } from "react";

const API_BASE_URL = "http://localhost:5000";

export const useUbicaciones = () => {
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarRegiones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/region`);
      const data = await response.json();
      setRegiones(data);
    } catch (err) {
      setError("Error al cargar regiones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarComunasPorRegion = async (regionId) => {
    try {
      setLoading(true);
      // Obtener provincias de la región
      const respProvincias = await fetch(
        `${API_BASE_URL}/provincia?region=${regionId}`
      );
      const provincias = await respProvincias.json();

      // Obtener comunas de todas las provincias
      const todasLasComunas = [];
      for (const provincia of provincias) {
        const respComunas = await fetch(
          `${API_BASE_URL}/comuna?provincia=${provincia.id}`
        );
        const comunas = await respComunas.json();
        todasLasComunas.push(...comunas);
      }

      setComunas(todasLasComunas);
    } catch (err) {
      setError("Error al cargar comunas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarSucursales = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sucursal?todos=1`);
      const data = await response.json();
      setSucursales(data.sucursales || []);
    } catch (err) {
      setError("Error al cargar sucursales");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    regiones,
    comunas,
    sucursales,
    loading,
    error,
    cargarRegiones,
    cargarComunasPorRegion,
    cargarSucursales,
  };
};
