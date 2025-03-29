import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getStartOfTheDay() {
  const newDate = new Date();
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function getEndOfTheDay() {
  const newDate = new Date();
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

/**
 * Normaliza un texto eliminando acentos y convirtiendo a minúsculas
 * @param {string} texto - El texto a normalizar
 * @returns {string} - El texto normalizado
 */
export const normalizarTexto = (texto) => {
  return texto?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";
};

/**
 * Busca coincidencias en un array de objetos basado en campos específicos
 * @param {Array} datos - Array de objetos a filtrar
 * @param {string} termino - Término de búsqueda
 * @param {Array} campos - Array de campos a buscar
 * @returns {Array} - Array filtrado con las coincidencias
 */
export const buscarEnCampos = (datos, termino, campos) => {
  if (!termino.trim()) return datos;

  const terminoNormalizado = normalizarTexto(termino);
  return datos.filter(item =>
    campos.some(campo =>
      normalizarTexto(item[campo]).includes(terminoNormalizado)
    )
  );
};