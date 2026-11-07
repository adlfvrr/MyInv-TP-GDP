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

export async function apiFetch<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const headers = new Headers(opciones.headers);
  if (opciones.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}`, { ...opciones, headers });
  } catch {
    throw new ApiError({ status: 0, error: 'Sin conexión', mensaje: 'No se pudo conectar con el servidor', ruta });
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
