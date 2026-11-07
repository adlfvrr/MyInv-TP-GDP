import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { obtenerEstado, type EstadoSistema } from '../api/health';
import { listarAlertas } from '../api/reportes';
import '../estilos/reportes.css';

export default function InicioPage() {
  const { usuario } = useAuth();
  const [estado, setEstado] = useState<EstadoSistema | null>(null);
  const [cantidadAlertas, setCantidadAlertas] = useState(0);

  useEffect(() => {
    obtenerEstado().then(setEstado).catch(() => setEstado(null));
    // Aviso destacado de reposición al ingresar (T10).
    listarAlertas()
      .then((alertas) => setCantidadAlertas(alertas.length))
      .catch(() => setCantidadAlertas(0));
  }, []);

  return (
    <section>
      <h2>Hola, {usuario?.nombreCompleto}</h2>
      <p>
        Ingresaste como <strong>{usuario?.rol === 'ADMINISTRADOR' ? 'administrador' : 'empleado'}</strong>. Usá el
        menú superior para acceder a las funciones habilitadas para tu rol.
      </p>
      {cantidadAlertas > 0 && (
        <div className="aviso-reposicion banner-alertas" role="alert">
          <span>
            ⚠ {cantidadAlertas} {cantidadAlertas === 1 ? 'producto está' : 'productos están'} en stock mínimo.
          </span>
          <Link to="/reportes" className="boton boton-chico">
            Ver alertas
          </Link>
        </div>
      )}
      {estado && (
        <p className="texto-suave">
          Sistema {estado.estado} · Base de datos {estado.baseDeDatos} · v{estado.version}
        </p>
      )}
    </section>
  );
}
