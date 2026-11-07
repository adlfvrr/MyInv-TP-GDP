import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ApiError } from '../api/client';
import { listarProductos, type Producto } from '../api/productos';
import { registrarMovimiento, type Movimiento, type TipoMovimiento } from '../api/movimientos';

const formatoHora = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' });

// Carga de movimientos de stock (T08): pensada para un empleado sin capacitación previa.
export default function MovimientosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [tipo, setTipo] = useState<TipoMovimiento>('ENTRADA');
  const [busqueda, setBusqueda] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [observacion, setObservacion] = useState('');

  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [erroresApi, setErroresApi] = useState<Record<string, string>>({});
  const [ultimo, setUltimo] = useState<Movimiento | null>(null);
  const [registrados, setRegistrados] = useState<Movimiento[]>([]);

  useEffect(() => {
    listarProductos()
      .then(setProductos)
      .catch((e: Error) => setErrorCarga(e.message))
      .finally(() => setCargando(false));
  }, []);

  const opciones = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return productos.filter(
      (p) =>
        !texto ||
        p.nombre.toLowerCase().includes(texto) ||
        p.marca.nombre.toLowerCase().includes(texto) ||
        p.presentacion.descripcion.toLowerCase().includes(texto),
    );
  }, [productos, busqueda]);

  const producto = productos.find((p) => p.id === Number(productoId));
  const cantidadNumero = Number(cantidad);

  // Validación visual inmediata, antes de enviar.
  const errorCantidad =
    cantidad === ''
      ? null
      : !Number.isInteger(cantidadNumero) || cantidadNumero <= 0
        ? 'Ingresá un número entero mayor a 0'
        : tipo === 'SALIDA' && producto && cantidadNumero > producto.stockActual
          ? `Stock insuficiente: hay ${producto.stockActual} disponibles`
          : null;

  const stockPrevisto =
    producto && cantidad !== '' && !errorCantidad
      ? tipo === 'ENTRADA'
        ? producto.stockActual + cantidadNumero
        : producto.stockActual - cantidadNumero
      : null;

  const puedeEnviar = !!producto && cantidad !== '' && !errorCantidad && !guardando;

  function cambiarTipo(nuevo: TipoMovimiento) {
    setTipo(nuevo);
    setErrorGeneral(null);
    setErroresApi({});
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!puedeEnviar || !producto) return;
    setGuardando(true);
    setErrorGeneral(null);
    setErroresApi({});
    try {
      const movimiento = await registrarMovimiento({
        productoId: producto.id,
        tipo,
        cantidad: cantidadNumero,
        proveedor: tipo === 'ENTRADA' && proveedor.trim() ? proveedor.trim() : undefined,
        observacion: observacion.trim() || undefined,
      });
      // Actualiza el stock en pantalla sin recargar el catálogo.
      setProductos((lista) =>
        lista.map((p) =>
          p.id === producto.id
            ? { ...p, stockActual: movimiento.stockResultante, enStockMinimo: movimiento.alertaStockMinimo }
            : p,
        ),
      );
      setUltimo(movimiento);
      setRegistrados((lista) => [movimiento, ...lista].slice(0, 10));
      setCantidad('');
      setObservacion('');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorGeneral(err.message);
        setErroresApi(err.errores ?? {});
      } else {
        setErrorGeneral('No se pudo registrar el movimiento.');
      }
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="cargando">Cargando productos…</p>;
  if (errorCarga) return <p className="mensaje-error" role="alert">{errorCarga}</p>;

  return (
    <section>
      <h2>Cargar movimiento de stock</h2>
      <p className="texto-suave">
        Elegí si entra mercadería (compra a un proveedor) o sale (venta), buscá el producto e indicá la cantidad.
      </p>

      <form className="tarjeta formulario-movimiento" onSubmit={enviar} noValidate>
        <div className="selector-tipo" role="radiogroup" aria-label="Tipo de movimiento">
          <button
            type="button"
            role="radio"
            aria-checked={tipo === 'ENTRADA'}
            className={`opcion-tipo opcion-entrada${tipo === 'ENTRADA' ? ' activa' : ''}`}
            onClick={() => cambiarTipo('ENTRADA')}
          >
            ⬇ Entrada
            <small>Compra a proveedor</small>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={tipo === 'SALIDA'}
            className={`opcion-tipo opcion-salida${tipo === 'SALIDA' ? ' activa' : ''}`}
            onClick={() => cambiarTipo('SALIDA')}
          >
            ⬆ Salida
            <small>Venta</small>
          </button>
        </div>

        <label htmlFor="buscar-producto">Producto</label>
        <input
          id="buscar-producto"
          type="search"
          placeholder="Buscar por nombre, marca o presentación…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          id="producto"
          aria-label="Seleccionar producto"
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
          size={Math.min(6, Math.max(2, opciones.length))}
        >
          {opciones.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} · {p.marca.nombre} · {p.presentacion.descripcion} (stock {p.stockActual})
            </option>
          ))}
        </select>
        {opciones.length === 0 && <span className="error-campo">No hay productos que coincidan con la búsqueda.</span>}
        {erroresApi.productoId && <span className="error-campo">{erroresApi.productoId}</span>}

        {producto && (
          <p className={`stock-seleccionado${producto.enStockMinimo ? ' en-alerta' : ''}`}>
            Stock actual: <strong>{producto.stockActual}</strong> · mínimo {producto.stockMinimo}
            {producto.enStockMinimo && <span className="insignia insignia-alerta">Stock mínimo</span>}
          </p>
        )}

        <div className="fila-campos">
          <div>
            <label htmlFor="cantidad">Cantidad (unidades)</label>
            <input
              id="cantidad"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              aria-invalid={!!errorCantidad}
            />
            {errorCantidad && <span className="error-campo">{errorCantidad}</span>}
            {erroresApi.cantidad && <span className="error-campo">{erroresApi.cantidad}</span>}
          </div>
          {tipo === 'ENTRADA' && (
            <div>
              <label htmlFor="proveedor">Proveedor</label>
              <input
                id="proveedor"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                maxLength={120}
                placeholder="Ej.: Distribuidora Norte"
              />
              {erroresApi.proveedor && <span className="error-campo">{erroresApi.proveedor}</span>}
            </div>
          )}
        </div>

        <label htmlFor="observacion">Observación (opcional)</label>
        <input
          id="observacion"
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          maxLength={255}
        />

        {stockPrevisto !== null && (
          <p className="texto-suave">
            Después de registrar quedarán <strong>{stockPrevisto}</strong> unidades.
          </p>
        )}

        {errorGeneral && <p className="mensaje-error" role="alert">{errorGeneral}</p>}

        <button type="submit" className="boton boton-primario boton-ancho" disabled={!puedeEnviar}>
          {guardando ? 'Registrando…' : tipo === 'ENTRADA' ? 'Registrar entrada' : 'Registrar salida'}
        </button>
      </form>

      {ultimo && (
        <div className={ultimo.alertaStockMinimo ? 'mensaje-alerta' : 'mensaje-ok'} role="status">
          Se registró la {ultimo.tipo === 'ENTRADA' ? 'entrada' : 'salida'} de {ultimo.cantidad} u. de "
          {ultimo.producto.nombre}". Stock actual: <strong>{ultimo.stockResultante}</strong>.
          {ultimo.alertaStockMinimo && ' ⚠ El producto quedó en stock mínimo: hay que reponer.'}
        </div>
      )}

      {registrados.length > 0 && (
        <>
          <h3>Registrados en esta sesión</h3>
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Tipo</th>
                  <th>Producto</th>
                  <th className="numero">Cantidad</th>
                  <th className="numero">Stock resultante</th>
                </tr>
              </thead>
              <tbody>
                {registrados.map((m) => (
                  <tr key={m.id} className={m.alertaStockMinimo ? 'fila-alerta' : undefined}>
                    <td>{formatoHora.format(new Date(m.fecha))}</td>
                    <td>
                      <span className={`insignia insignia-${m.tipo.toLowerCase()}`}>{m.tipo}</span>
                    </td>
                    <td>{m.producto.nombre}</td>
                    <td className="numero">{m.cantidad}</td>
                    <td className="numero">{m.stockResultante}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
