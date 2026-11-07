import type { Rol } from '../auth/types';

export interface ItemMenu {
  ruta: string;
  /** Texto según el rol: el administrador gestiona, el empleado consulta. */
  etiqueta: Record<Rol, string>;
  roles: Rol[];
}

// Menú adaptado al rol del usuario (T04). Cada módulo agrega aquí su entrada.
export const MENU: ItemMenu[] = [
  {
    ruta: '/',
    etiqueta: { ADMINISTRADOR: 'Inicio', EMPLEADO: 'Inicio' },
    roles: ['ADMINISTRADOR', 'EMPLEADO'],
  },
  {
    ruta: '/productos',
    etiqueta: { ADMINISTRADOR: 'Gestión de productos', EMPLEADO: 'Catálogo de bebidas' },
    roles: ['ADMINISTRADOR', 'EMPLEADO'],
  },
  {
    ruta: '/movimientos',
    etiqueta: { ADMINISTRADOR: 'Movimientos de stock', EMPLEADO: 'Cargar movimiento' },
    roles: ['ADMINISTRADOR', 'EMPLEADO'],
  },
  {
    ruta: '/reportes',
    etiqueta: { ADMINISTRADOR: 'Reportes y alertas', EMPLEADO: 'Alertas de stock' },
    roles: ['ADMINISTRADOR', 'EMPLEADO'],
  },
  {
    ruta: '/historial',
    etiqueta: { ADMINISTRADOR: 'Historial', EMPLEADO: 'Historial' },
    roles: ['ADMINISTRADOR', 'EMPLEADO'],
  },
];
