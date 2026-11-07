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
