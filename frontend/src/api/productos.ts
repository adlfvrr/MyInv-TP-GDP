import { apiFetch } from './client';

// Tipos y llamadas del Módulo 2 (docs/contrato-api.md, sección 4).

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Marca {
  id: number;
  nombre: string;
}

export interface Presentacion {
  id: number;
  descripcion: string;
}

export interface Producto {
  id: number;
  nombre: string;
  categoria: Categoria;
  marca: Marca;
  presentacion: Presentacion;
  precio: number;
  stockActual: number;
  stockMinimo: number;
  enStockMinimo: boolean;
  activo: boolean;
}

export interface ProductoDatos {
  nombre: string;
  categoriaId: number;
  marcaId: number;
  presentacionId: number;
  precio: number;
  stockMinimo: number;
  /** Solo en el alta (stock inicial). Después cambia con movimientos. */
  stockActual?: number;
}

export const listarProductos = () => apiFetch<Producto[]>('/productos');
export const listarCategorias = () => apiFetch<Categoria[]>('/categorias');
export const listarMarcas = () => apiFetch<Marca[]>('/marcas');
export const listarPresentaciones = () => apiFetch<Presentacion[]>('/presentaciones');

export function crearProducto(datos: ProductoDatos): Promise<Producto> {
  return apiFetch<Producto>('/productos', { method: 'POST', body: JSON.stringify(datos) });
}

export function actualizarProducto(id: number, datos: ProductoDatos): Promise<Producto> {
  const { stockActual: _ignorado, ...resto } = datos;
  return apiFetch<Producto>(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(resto) });
}

export function eliminarProducto(id: number): Promise<void> {
  return apiFetch<void>(`/productos/${id}`, { method: 'DELETE' });
}
