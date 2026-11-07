import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../api/client';

interface EstadoNavegacion {
  desde?: string;
}

// Pantalla de inicio de sesión (T04). Valida los campos antes de llamar a la API.
export default function LoginPage() {
  const { usuario, iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = (location.state as EstadoNavegacion | null)?.desde ?? '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (usuario) {
    return <Navigate to={destino} replace />;
  }

  async function manejarSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Completá el usuario y la contraseña.');
      return;
    }

    setEnviando(true);
    try {
      await iniciarSesion(username.trim(), password);
      navigate(destino, { replace: true });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No se pudo iniciar sesión.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="centrado">
      <form className="tarjeta formulario-login" onSubmit={manejarSubmit} noValidate>
        <h1>MyInv</h1>
        <p className="subtitulo">Distribuidora La previa · Iniciá sesión para continuar</p>

        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={enviando}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={enviando}
        />

        {error && (
          <p className="mensaje-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="boton boton-primario boton-ancho" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </main>
  );
}
