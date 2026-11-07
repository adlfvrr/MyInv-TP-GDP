// Cliente HTTP base para consumir la API REST de MyInv (ver docs/contrato-api.md).

export interface ApiErrorBody {
  status: number;
  error: string;
  mensaje: string;
  ruta: string;
  errores?: Record<string, string>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly errores?: Record<string, string>;

  constructor(body: ApiErrorBody) {
    super(body.mensaje);
    this.status = body.status;
    this.errores = body.errores;
  }
}

const BASE_URL = '/api';
const CLAVE_TOKEN = 'myinv.token';

// ---- Manejo del token JWT ---------------------------------------------------

export function obtenerToken(): string | null {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function guardarToken(token: string): void {
  localStorage.setItem(CLAVE_TOKEN, token);
}

export function borrarToken(): void {
  localStorage.removeItem(CLAVE_TOKEN);
}

// Se ejecuta cuando la API responde 401 con una sesión abierta (token vencido o inválido).
let alExpirarSesion: (() => void) | null = null;

export function registrarAlExpirarSesion(callback: (() => void) | null): void {
  alExpirarSesion = callback;
}

export async function apiFetch<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const headers = new Headers(opciones.headers);
  if (opciones.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const token = obtenerToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}`, { ...opciones, headers });
  } catch {
    throw new ApiError({ status: 0, error: 'Sin conexión', mensaje: 'No se pudo conectar con el servidor', ruta });
  }

  if (respuesta.status === 401 && token) {
    borrarToken();
    alExpirarSesion?.();
  }

  if (!respuesta.ok) {
    let body: ApiErrorBody;
    try {
      body = await respuesta.json();
    } catch {
      body = { status: respuesta.status, error: respuesta.statusText, mensaje: 'Ocurrió un error inesperado', ruta };
    }
    throw new ApiError(body);
  }

  if (respuesta.status === 204) {
    return undefined as T;
  }
  return respuesta.json() as Promise<T>;
}
