import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarCategorias,
  listarMarcas,
  listarPresentaciones,
  listarProductos,
  type Categoria,
  type Marca,
  type Presentacion,
  type Producto,
  type ProductoDatos,
} from '../api/productos';
import ProductoFormulario from '../components/productos/ProductoFormulario';

const formatoPrecio = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

// Catálogo de bebidas (T06): consulta para ambos roles y ABM solo para el administrador.
export default function ProductosPage() {
  const { tieneRol } = useAuth();
  const esAdmin = tieneRol('ADMINISTRADOR');

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [presentaciones, setPresentaciones] = useState<Presentacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [tiempoConsulta, setTiempoConsulta] = useState<number | null>(null);

  const [texto, setTexto] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [marcaId, setMarcaId] = useState('');

  // undefined = formulario cerrado · null = alta · Producto = modificación
  const [enEdicion, setEnEdicion] = useState<Producto | null | undefined>(undefined);

  const cargarProductos = useCallback(async () => {
    const inicio = performance.now();
    const lista = await listarProductos();
    setTiempoConsulta(Math.round(performance.now() - inicio));
    setProductos(lista);
  }, []);

  useEffect(() => {
    Promise.all([cargarProductos(), listarCategorias(), listarMarcas(), listarPresentaciones()])
      .then(([, cats, mars, pres]) => {
        setCategorias(cats);
        setMarcas(mars);
        setPresentaciones(pres);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, [cargarProductos]);

  // El filtrado se hace en memoria: la respuesta es inmediata (objetivo < 5 s por consulta).
  const filtrados = useMemo(() => {
    const busqueda = texto.trim().toLowerCase();
    return productos.filter(
      (p) =>
        (!categoriaId || p.categoria.id === Number(categoriaId)) &&
        (!marcaId || p.marca.id === Number(marcaId)) &&
        (!busqueda || p.nombre.toLowerCase().includes(busqueda)),
    );
  }, [productos, texto, categoriaId, marcaId]);

  async function guardar(datos: ProductoDatos) {
    if (enEdicion) {
      await actualizarProducto(enEdicion.id, datos);
      setAviso(`Se modificó "${datos.nombre}".`);
    } else {
      await crearProducto(datos);
      setAviso(`Se creó "${datos.nombre}".`);
    }
    setEnEdicion(undefined);
    await cargarProductos();
  }

  async function eliminar(producto: Producto) {
    const confirmado = window.confirm(
      `¿Eliminar "${producto.nombre} · ${producto.presentacion.descripcion}"?\nSe conserva su historial de movimientos.`,
    );
    if (!confirmado) return;
    try {
      await eliminarProducto(producto.id);
      setAviso(`Se eliminó "${producto.nombre}".`);
      await cargarProductos();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function limpiarFiltros() {
    setTexto('');
    setCategoriaId('');
    setMarcaId('');
  }

  if (cargando) return <p className="cargando">Cargando catálogo…</p>;

  return (
    <section>
      <div className="encabezado-seccion">
        <h2>{esAdmin ? 'Gestión de productos' : 'Catálogo de bebidas'}</h2>
        {esAdmin && (
          <button type="button" className="boton boton-primario" onClick={() => setEnEdicion(null)}>
            + Nuevo producto
          </button>
        )}
      </div>

      {error && <p className="mensaje-error" role="alert">{error}</p>}
      {aviso && <p className="mensaje-ok" role="status">{aviso}</p>}

      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar por nombre…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-label="Buscar por nombre"
        />
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} aria-label="Filtrar por categoría">
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <select value={marcaId} onChange={(e) => setMarcaId(e.target.value)} aria-label="Filtrar por marca">
          <option value="">Todas las marcas</option>
          {marcas.map((m) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
        <button type="button" className="boton" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </div>

      <p className="texto-suave">
        {filtrados.length} de {productos.length} productos
        {tiempoConsulta !== null && ` · consulta resuelta en ${tiempoConsulta} ms`}
      </p>

      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Marca</th>
              <th>Presentación</th>
              <th className="numero">Precio</th>
              <th className="numero">Stock</th>
              <th className="numero">Mínimo</th>
              {esAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p) => (
              <tr key={p.id} className={p.enStockMinimo ? 'fila-alerta' : undefined}>
                <td>
                  {p.nombre}
                  {p.enStockMinimo && <span className="insignia insignia-alerta">Stock mínimo</span>}
                </td>
                <td>{p.categoria.nombre}</td>
                <td>{p.marca.nombre}</td>
                <td>{p.presentacion.descripcion}</td>
                <td className="numero">{formatoPrecio.format(p.precio)}</td>
                <td className="numero">{p.stockActual}</td>
                <td className="numero">{p.stockMinimo}</td>
                {esAdmin && (
                  <td className="acciones">
                    <button type="button" className="boton boton-chico" onClick={() => setEnEdicion(p)}>
                      Modificar
                    </button>
                    <button type="button" className="boton boton-chico boton-peligro" onClick={() => eliminar(p)}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={esAdmin ? 8 : 7} className="sin-resultados">
                  No hay productos que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {enEdicion !== undefined && (
        <ProductoFormulario
          producto={enEdicion}
          categorias={categorias}
          marcas={marcas}
          presentaciones={presentaciones}
          onGuardar={guardar}
          onCancelar={() => setEnEdicion(undefined)}
        />
      )}
    </section>
  );
}
