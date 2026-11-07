import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { Rol } from '../auth/types';

interface Props {
  children: ReactNode;
  /** Si se indica, solo esos roles pueden entrar; el resto ve "Acceso denegado". */
  roles?: Rol[];
}

// Bloquea las rutas a usuarios sin sesión o sin el rol requerido (T04).
export default function ProtectedRoute({ children, roles }: Props) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return <p className="cargando">Cargando sesión…</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return <>{children}</>;
}
