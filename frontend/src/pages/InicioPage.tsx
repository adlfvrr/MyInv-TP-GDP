import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { obtenerEstado, type EstadoSistema } from '../api/health';

export default function InicioPage() {
  const { usuario } = useAuth();
  const [estado, setEstado] = useState<EstadoSistema | null>(null);

  useEffect(() => {
    obtenerEstado().then(setEstado).catch(() => setEstado(null));
  }, []);

  return (
    <section>
      <h2>Hola, {usuario?.nombreCompleto}</h2>
      <p>
        Ingresaste como <strong>{usuario?.rol === 'ADMINISTRADOR' ? 'administrador' : 'empleado'}</strong>. Usá el
        menú superior para acceder a las funciones habilitadas para tu rol.
      </p>
      {estado && (
        <p className="texto-suave">
          Sistema {estado.estado} · Base de datos {estado.baseDeDatos} · v{estado.version}
        </p>
      )}
    </section>
  );
}
