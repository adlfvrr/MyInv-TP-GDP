import { Link } from 'react-router-dom';

export default function AccesoDenegadoPage() {
  return (
    <section>
      <h2>Acceso denegado</h2>
      <p>Tu rol no tiene permiso para ver esta pantalla.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}
