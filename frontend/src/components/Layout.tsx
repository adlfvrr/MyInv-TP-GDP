import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { MENU } from './menu';

// Estructura común de las pantallas: barra superior con el menú del rol y botón de salida.
export default function Layout() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  if (!usuario) return null;

  const items = MENU.filter((item) => item.roles.includes(usuario.rol));

  function salir() {
    cerrarSesion();
    navigate('/login', { replace: true });
  }

  return (
    <div className="aplicacion">
      <header className="barra-superior">
        <span className="logo">MyInv</span>
        <nav className="menu">
          {items.map((item) => (
            <NavLink key={item.ruta} to={item.ruta} end={item.ruta === '/'}>
              {item.etiqueta[usuario.rol]}
            </NavLink>
          ))}
        </nav>
        <div className="usuario-actual">
          <span>{usuario.nombreCompleto}</span>
          <span className={`insignia insignia-${usuario.rol.toLowerCase()}`}>{usuario.rol}</span>
          <button type="button" className="boton" onClick={salir}>
            Salir
          </button>
        </div>
      </header>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
}
