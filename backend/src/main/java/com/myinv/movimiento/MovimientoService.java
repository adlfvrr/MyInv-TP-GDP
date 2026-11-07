package com.myinv.movimiento;

import com.myinv.common.ConflictoException;
import com.myinv.common.RecursoNoEncontradoException;
import com.myinv.movimiento.MovimientoDtos.MovimientoRequest;
import com.myinv.movimiento.MovimientoDtos.MovimientoResponse;
import com.myinv.producto.Producto;
import com.myinv.producto.ProductoRepository;
import com.myinv.usuario.Usuario;
import com.myinv.usuario.UsuarioRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** Registro de entradas y salidas de stock (T07) e historial filtrable (T11). */
@Service
public class MovimientoService {

    private final MovimientoRepository movimientoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public MovimientoService(MovimientoRepository movimientoRepository, ProductoRepository productoRepository,
                             UsuarioRepository usuarioRepository) {
        this.movimientoRepository = movimientoRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Registra el movimiento y actualiza el stock en una sola transacción.
     * El producto se bloquea (SELECT ... FOR UPDATE) para que dos ventas simultáneas
     * no descuenten sobre el mismo stock (mitigación del riesgo R3).
     */
    @Transactional
    public MovimientoResponse registrar(MovimientoRequest r, String username) {
        Producto producto = productoRepository.buscarParaActualizarStock(r.productoId())
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el producto " + r.productoId()));
        if (!producto.isActivo()) {
            throw new ConflictoException("No se pueden registrar movimientos de un producto dado de baja");
        }
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + username));

        int cantidad = r.cantidad();
        if (r.tipo() == TipoMovimiento.ENTRADA) {
            producto.sumarStock(cantidad);
        } else {
            if (cantidad > producto.getStockActual()) {
                throw new ConflictoException("Stock insuficiente: disponible " + producto.getStockActual()
                        + ", solicitado " + cantidad);
            }
            producto.descontarStock(cantidad);
        }

        Movimiento movimiento = new Movimiento(producto, usuario, r.tipo(), cantidad, producto.getStockActual(),
                textoOpcional(r.proveedor()), textoOpcional(r.observacion()));
        return MovimientoResponse.de(movimientoRepository.save(movimiento));
    }

    /** Historial del más reciente al más antiguo, con filtros opcionales (T11). */
    @Transactional(readOnly = true)
    public List<MovimientoResponse> listar(TipoMovimiento tipo, LocalDate desde, LocalDate hasta, Long productoId) {
        var filtros = MovimientoSpecs.conFiltros(tipo, desde, hasta, productoId);
        return movimientoRepository.findAll(filtros, Sort.by(Sort.Direction.DESC, "fecha", "id")).stream()
                .map(MovimientoResponse::de)
                .toList();
    }

    private static String textoOpcional(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }
}
