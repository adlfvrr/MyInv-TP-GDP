import { apiFetch } from './client';

// Tipos y llamadas del Módulo 3 (docs/contrato-api.md, sección 5).

export type TipoMovimiento = 'ENTRADA' | 'SALIDA';

export interface Movimiento {
  id: number;
  producto: { id: number; nombre: string };
  tipo: TipoMovimiento;
  cantidad: number;
  stockResultante: number;
  proveedor: string | null;
  observacion: string | null;
  fecha: string;
  usuario: string;
  alertaStockMinimo: boolean;
}

export interface MovimientoDatos {
  productoId: number;
  tipo: TipoMovimiento;
  cantidad: number;
  proveedor?: string;
  observacion?: string;
}

export function registrarMovimiento(datos: MovimientoDatos): Promise<Movimiento> {
  return apiFetch<Movimiento>('/movimientos', { method: 'POST', body: JSON.stringify(datos) });
}

export interface FiltrosHistorial {
  tipo?: TipoMovimiento;
  /** Fecha YYYY-MM-DD, inclusive. */
  desde?: string;
  /** Fecha YYYY-MM-DD, inclusive. */
  hasta?: string;
  productoId?: number;
}

// Historial de movimientos (T11): del más reciente al más antiguo.
export function listarMovimientos(filtros: FiltrosHistorial = {}): Promise<Movimiento[]> {
  const parametros = new URLSearchParams();
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== '') parametros.set(clave, String(valor));
  });
  const consulta = parametros.toString();
  return apiFetch<Movimiento[]>(`/movimientos${consulta ? `?${consulta}` : ''}`);
}
