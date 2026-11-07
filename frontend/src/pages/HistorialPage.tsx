import { useEffect, useMemo, useState } from 'react';
import { listarMovimientos, type Movimiento, type TipoMovimiento } from '../api/movimientos';
import '../estilos/reportes.css';

const formatoFecha = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' });

// Historial de movimientos filtrable por fecha y tipo de operación (T11). Ambos roles (contrato, sección 3).
export default function HistorialPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tiempoConsulta, setTiempoConsulta] = useState<number | null>(null);

  const [tipo, setTipo] = useState<TipoMovimiento | ''>('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const rangoInvalido = desde !== '' && hasta !== '' && desde > hasta;

  // Cada cambio de filtro consulta al backend (el filtrado de fechas se hace en PostgreSQL).
  useEffect(() => {
    if (rangoInvalido) return;
    let vigente = true;
    setCargando(true);
    setError(null);
    const inicio = performance.now();
    listarMovimientos({ tipo: tipo || undefined, desde: desde || undefined, hasta: hasta || undefined })
      .then((lista) => {
        if (!vigente) return;
        setMovimientos(lista);
        setTiempoConsulta(Math.round(performance.now() - inicio));
      })
      .catch((e: Error) => vigente && setError(e.message))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [tipo, desde, hasta, rangoInvalido]);

  const totales = useMemo(
    () =>
      movimientos.reduce(
        (acc, m) => {
          if (m.tipo === 'ENTRADA') acc.entradas += m.cantidad;
          else acc.salidas += m.cantidad;
          return acc;
        },
        { entradas: 0, salidas: 0 },
      ),
    [movimientos],
  );

  function limpiarFiltros() {
    setTipo('');
    setDesde('');
    setHasta('');
  }

  return (
    <section>
      <h2>Historial de movimientos</h2>

      <div className="filtros">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoMovimiento | '')}
          aria-label="Filtrar por tipo de operación"
        >
          <option value="">Entradas y salidas</option>
          <option value="ENTRADA">Solo entradas</option>
          <option value="SALIDA">Solo salidas</option>
        </select>
        <label className="filtro-fecha">
          Desde
          <input type="date" value={desde} max={hasta || undefined} onChange={(e) => setDesde(e.target.value)} />
        </label>
        <label className="filtro-fecha">
          Hasta
          <input type="date" value={hasta} min={desde || undefined} onChange={(e) => setHasta(e.target.value)} />
        </label>
        <button type="button" className="boton" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </div>

      {rangoInvalido && (
        <p className="mensaje-error" role="alert">
          La fecha "desde" no puede ser posterior a la fecha "hasta".
        </p>
      )}
      {error && <p className="mensaje-error" role="alert">{error}</p>}

      <p className="texto-suave">
        {cargando
          ? 'Consultando…'
          : `${movimientos.length} movimientos · entraron ${totales.entradas} u. · salieron ${totales.salidas} u.`}
        {!cargando && tiempoConsulta !== null && ` · consulta resuelta en ${tiempoConsulta} ms`}
      </p>

      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Producto</th>
              <th className="numero">Cantidad</th>
              <th className="numero">Stock resultante</th>
              <th>Proveedor / Observación</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => (
              <tr key={m.id}>
                <td>{formatoFecha.format(new Date(m.fecha))}</td>
                <td>
                  <span className={`insignia insignia-${m.tipo.toLowerCase()}`}>{m.tipo}</span>
                </td>
                <td>{m.producto.nombre}</td>
                <td className="numero">{m.cantidad}</td>
                <td className="numero">{m.stockResultante}</td>
                <td>{[m.proveedor, m.observacion].filter(Boolean).join(' · ') || '—'}</td>
                <td>{m.usuario}</td>
              </tr>
            ))}
            {!cargando && movimientos.length === 0 && (
              <tr>
                <td colSpan={7} className="sin-resultados">
                  No hay movimientos para los filtros elegidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
