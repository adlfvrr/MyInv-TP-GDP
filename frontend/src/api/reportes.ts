import { apiFetch } from './client';

// Tipos y llamadas del Módulo 4 (docs/contrato-api.md, sección 6).

export interface Alerta {
  productoId: number;
  nombre: string;
  marca: string;
  presentacion: string;
  stockActual: number;
  stockMinimo: number;
  faltante: number;
}

export interface ExistenciasCategoria {
  categoria: string;
  productos: number;
  unidades: number;
}

export interface ReporteExistencias {
  generadoEn: string;
  totalProductos: number;
  totalUnidades: number;
  productosEnStockMinimo: number;
  porCategoria: ExistenciasCategoria[];
}

export const listarAlertas = () => apiFetch<Alerta[]>('/alertas');
export const obtenerExistencias = () => apiFetch<ReporteExistencias>('/reportes/existencias');
