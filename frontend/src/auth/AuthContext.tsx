import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { login as loginApi, obtenerUsuarioActual } from '../api/auth';
import { borrarToken, guardarToken, obtenerToken, registrarAlExpirarSesion } from '../api/client';
import type { Rol, Usuario } from './types';

interface AuthContextValue {
  usuario: Usuario | null;
  /** true mientras se restaura la sesión guardada al recargar la página. */
  cargando: boolean;
  iniciarSesion: (username: string, password: string) => Promise<Usuario>;
  cerrarSesion: () => void;
  tieneRol: (...roles: Rol[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState<boolean>(() => obtenerToken() !== null);

  const cerrarSesion = useCallback(() => {
    borrarToken();
    setUsuario(null);
  }, []);

  // Si el token vence, la API responde 401 y se cierra la sesión automáticamente.
  useEffect(() => {
    registrarAlExpirarSesion(() => setUsuario(null));
    return () => registrarAlExpirarSesion(null);
  }, []);

  // Al recargar la página, restaura la sesión a partir del token guardado.
  useEffect(() => {
    if (!obtenerToken()) return;
    obtenerUsuarioActual()
      .then(setUsuario)
      .catch(() => borrarToken())
      .finally(() => setCargando(false));
  }, []);

  const iniciarSesion = useCallback(async (username: string, password: string) => {
    const respuesta = await loginApi(username, password);
    guardarToken(respuesta.token);
    setUsuario(respuesta.usuario);
    return respuesta.usuario;
  }, []);

  const tieneRol = useCallback(
    (...roles: Rol[]) => usuario !== null && roles.includes(usuario.rol),
    [usuario],
  );

  const valor = useMemo(
    () => ({ usuario, cargando, iniciarSesion, cerrarSesion, tieneRol }),
    [usuario, cargando, iniciarSesion, cerrarSesion, tieneRol],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return contexto;
}
