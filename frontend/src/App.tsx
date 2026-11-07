import { useEffect, useState } from 'react';
import { obtenerEstado, type EstadoSistema } from './api/health';

// Pantalla inicial de T01: verifica la conexión Frontend → Backend → PostgreSQL.
export default function App() {
  const [estado, setEstado] = useState<EstadoSistema | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerEstado()
      .then(setEstado)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <main className="centrado">
      <div className="tarjeta">
        <h1>MyInv</h1>
        <p className="subtitulo">Gestión de inventario · Distribuidora La previa</p>
        {error && <p className="mensaje-error">Backend: {error}</p>}
        {!error && !estado && <p>Verificando conexión…</p>}
        {estado && (
          <ul className="lista-estado">
            <li>Backend: <strong>{estado.estado}</strong> (v{estado.version})</li>
            <li>Base de datos: <strong>{estado.baseDeDatos}</strong></li>
          </ul>
        )}
      </div>
    </main>
  );
}
