import { useCallback, useEffect, useState } from 'react';
import { listarAlertas, obtenerExistencias, type Alerta, type ReporteExistencias } from '../api/reportes';
import '../estilos/reportes.css';

const formatoFecha = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' });
const formatoNumero = new Intl.NumberFormat('es-AR');

// Alertas de reposición y reporte básico de existencias (T10).
export default function ReportesPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [reporte, setReporte] = useState<ReporteExistencias | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tiempoConsulta, setTiempoConsulta] = useState<number | null>(null);

  const cargar = useCallback(async () => {
    setError(null);
    const inicio = performance.now();
    try {
      const [listaAlertas, existencias] = await Promise.all([listarAlertas(), obtenerExistencias()]);
      setAlertas(listaAlertas);
      setReporte(existencias);
      setTiempoConsulta(Math.round(performance.now() - inicio));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (cargando) return <p className="cargando">Cargando reportes…</p>;

  return (
    <section>
      <div className="encabezado-seccion">
        <h2>Alertas de stock y existencias</h2>
        <button type="button" className="boton" onClick={cargar}>
          Actualizar
        </button>
      </div>

      {error && <p className="mensaje-error" role="alert">{error}</p>}

      <h3>Alertas de reposición</h3>
      {alertas.length === 0 ? (
        <p className="mensaje-ok" role="status">
          No hay productos en stock mínimo. 👍
        </p>
      ) : (
        <>
          <p className="aviso-reposicion" role="alert">
            ⚠ {alertas.length} {alertas.length === 1 ? 'producto alcanzó' : 'productos alcanzaron'} el stock mínimo y{' '}
            {alertas.length === 1 ? 'necesita' : 'necesitan'} reposición.
          </p>
          <div className="grilla-alertas">
            {alertas.map((a) => (
              <article key={a.productoId} className="tarjeta-alerta">
                <h4>{a.nombre}</h4>
                <p className="texto-suave">
                  {a.marca} · {a.presentacion}
                </p>
                <p className="cifras-alerta">
                  <span>
                    Stock <strong>{a.stockActual}</strong>
                  </span>
                  <span>
                    Mínimo <strong>{a.stockMinimo}</strong>
                  </span>
                  <span className="faltante">
                    Reponer <strong>{a.faltante > 0 ? a.faltante : 'al menos 1'}</strong>
                  </span>
                </p>
              </article>
            ))}
          </div>
        </>
      )}

      {reporte && (
        <>
          <h3>Reporte de existencias</h3>
          <div className="resumen-existencias">
            <div className="indicador">
              <span className="indicador-valor">{formatoNumero.format(reporte.totalProductos)}</span>
              <span className="indicador-titulo">Productos activos</span>
            </div>
            <div className="indicador">
              <span className="indicador-valor">{formatoNumero.format(reporte.totalUnidades)}</span>
              <span className="indicador-titulo">Unidades en stock</span>
            </div>
            <div className={`indicador${reporte.productosEnStockMinimo > 0 ? ' indicador-alerta' : ''}`}>
              <span className="indicador-valor">{reporte.productosEnStockMinimo}</span>
              <span className="indicador-titulo">En stock mínimo</span>
            </div>
          </div>

          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th className="numero">Productos</th>
                  <th className="numero">Unidades</th>
                </tr>
              </thead>
              <tbody>
                {reporte.porCategoria.map((c) => (
                  <tr key={c.categoria}>
                    <td>{c.categoria}</td>
                    <td className="numero">{formatoNumero.format(c.productos)}</td>
                    <td className="numero">{formatoNumero.format(c.unidades)}</td>
                  </tr>
                ))}
                {reporte.porCategoria.length === 0 && (
                  <tr>
                    <td colSpan={3} className="sin-resultados">
                      No hay productos activos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="texto-suave">
            Generado el {formatoFecha.format(new Date(reporte.generadoEn))}
            {tiempoConsulta !== null && ` · consulta resuelta en ${tiempoConsulta} ms`}
          </p>
        </>
      )}
    </section>
  );
}
