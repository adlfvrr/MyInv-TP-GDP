import { useState, type FormEvent } from 'react';
import { ApiError } from '../../api/client';
import type { Categoria, Marca, Presentacion, Producto, ProductoDatos } from '../../api/productos';

interface Props {
  producto: Producto | null; // null = alta
  categorias: Categoria[];
  marcas: Marca[];
  presentaciones: Presentacion[];
  onGuardar: (datos: ProductoDatos) => Promise<void>;
  onCancelar: () => void;
}

type Campos = Record<'nombre' | 'categoriaId' | 'marcaId' | 'presentacionId' | 'precio' | 'stockActual' | 'stockMinimo', string>;

function valoresIniciales(p: Producto | null): Campos {
  return {
    nombre: p?.nombre ?? '',
    categoriaId: p ? String(p.categoria.id) : '',
    marcaId: p ? String(p.marca.id) : '',
    presentacionId: p ? String(p.presentacion.id) : '',
    precio: p ? String(p.precio) : '',
    stockActual: p ? String(p.stockActual) : '0',
    stockMinimo: p ? String(p.stockMinimo) : '',
  };
}

// Validación en el navegador; el backend vuelve a validar (docs/contrato-api.md, 4.2).
function validar(c: Campos, esAlta: boolean): Record<string, string> {
  const errores: Record<string, string> = {};
  const entero = (v: string) => /^\d+$/.test(v);
  if (!c.nombre.trim()) errores.nombre = 'El nombre es obligatorio';
  if (!c.categoriaId) errores.categoriaId = 'Elegí una categoría';
  if (!c.marcaId) errores.marcaId = 'Elegí una marca';
  if (!c.presentacionId) errores.presentacionId = 'Elegí una presentación';
  if (c.precio === '' || Number.isNaN(Number(c.precio)) || Number(c.precio) < 0) {
    errores.precio = 'Ingresá un precio válido (0 o más)';
  }
  if (esAlta && !entero(c.stockActual)) errores.stockActual = 'Ingresá un número entero (0 o más)';
  if (!entero(c.stockMinimo)) errores.stockMinimo = 'Ingresá un número entero (0 o más)';
  return errores;
}

export default function ProductoFormulario({ producto, categorias, marcas, presentaciones, onGuardar, onCancelar }: Props) {
  const esAlta = producto === null;
  const [campos, setCampos] = useState<Campos>(() => valoresIniciales(producto));
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo: keyof Campos) => (e: { target: { value: string } }) =>
    setCampos((prev) => ({ ...prev, [campo]: e.target.value }));

  async function manejarSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrorGeneral(null);
    const erroresLocales = validar(campos, esAlta);
    setErrores(erroresLocales);
    if (Object.keys(erroresLocales).length > 0) return;

    setGuardando(true);
    try {
      await onGuardar({
        nombre: campos.nombre.trim(),
        categoriaId: Number(campos.categoriaId),
        marcaId: Number(campos.marcaId),
        presentacionId: Number(campos.presentacionId),
        precio: Number(campos.precio),
        stockMinimo: Number(campos.stockMinimo),
        ...(esAlta ? { stockActual: Number(campos.stockActual) } : {}),
      });
    } catch (e) {
      if (e instanceof ApiError) {
        setErrores(e.errores ?? {});
        setErrorGeneral(e.message);
      } else {
        setErrorGeneral('No se pudo guardar el producto.');
      }
    } finally {
      setGuardando(false);
    }
  }

  const error = (campo: string) => errores[campo] && <span className="error-campo">{errores[campo]}</span>;

  return (
    <div className="fondo-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-formulario">
      <form className="tarjeta modal" onSubmit={manejarSubmit} noValidate>
        <h2 id="titulo-formulario">{esAlta ? 'Nuevo producto' : 'Modificar producto'}</h2>

        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" value={campos.nombre} onChange={cambiar('nombre')} maxLength={120} autoFocus />
        {error('nombre')}

        <div className="fila-campos">
          <div>
            <label htmlFor="categoria">Categoría</label>
            <select id="categoria" value={campos.categoriaId} onChange={cambiar('categoriaId')}>
              <option value="">Seleccionar…</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {error('categoriaId')}
          </div>
          <div>
            <label htmlFor="marca">Marca</label>
            <select id="marca" value={campos.marcaId} onChange={cambiar('marcaId')}>
              <option value="">Seleccionar…</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            {error('marcaId')}
          </div>
        </div>

        <label htmlFor="presentacion">Presentación</label>
        <select id="presentacion" value={campos.presentacionId} onChange={cambiar('presentacionId')}>
          <option value="">Seleccionar…</option>
          {presentaciones.map((p) => (
            <option key={p.id} value={p.id}>{p.descripcion}</option>
          ))}
        </select>
        {error('presentacionId')}

        <div className="fila-campos">
          <div>
            <label htmlFor="precio">Precio ($)</label>
            <input id="precio" type="number" min="0" step="0.01" value={campos.precio} onChange={cambiar('precio')} />
            {error('precio')}
          </div>
          <div>
            <label htmlFor="stockActual">{esAlta ? 'Stock inicial' : 'Stock actual'}</label>
            <input
              id="stockActual"
              type="number"
              min="0"
              step="1"
              value={campos.stockActual}
              onChange={cambiar('stockActual')}
              disabled={!esAlta}
              title={esAlta ? undefined : 'El stock se modifica registrando movimientos'}
            />
            {error('stockActual')}
          </div>
          <div>
            <label htmlFor="stockMinimo">Stock mínimo</label>
            <input id="stockMinimo" type="number" min="0" step="1" value={campos.stockMinimo} onChange={cambiar('stockMinimo')} />
            {error('stockMinimo')}
          </div>
        </div>

        {errorGeneral && <p className="mensaje-error" role="alert">{errorGeneral}</p>}

        <div className="acciones-modal">
          <button type="button" className="boton" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </button>
          <button type="submit" className="boton boton-primario" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
