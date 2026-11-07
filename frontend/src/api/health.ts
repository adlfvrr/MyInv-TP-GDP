import { apiFetch } from './client';

export interface EstadoSistema {
  estado: 'OK' | 'DEGRADADO';
  baseDeDatos: 'CONECTADA' | 'DESCONECTADA';
  version: string;
  timestamp: string;
}

export function obtenerEstado(): Promise<EstadoSistema> {
  return apiFetch<EstadoSistema>('/health');
}
