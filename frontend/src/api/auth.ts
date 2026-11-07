import { apiFetch } from './client';
import type { LoginResponse, Usuario } from '../auth/types';

export function login(username: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function obtenerUsuarioActual(): Promise<Usuario> {
  return apiFetch<Usuario>('/auth/me');
}
