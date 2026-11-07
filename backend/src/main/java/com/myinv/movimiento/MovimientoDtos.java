package com.myinv.movimiento;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

/** DTOs de movimientos de stock (docs/contrato-api.md, sección 5). */
public final class MovimientoDtos {

    private MovimientoDtos() {
    }

    /** POST /api/movimientos */
    public record MovimientoRequest(
            @NotNull(message = "El producto es obligatorio") Long productoId,
            @NotNull(message = "El tipo de movimiento es obligatorio") TipoMovimiento tipo,
            @NotNull(message = "La cantidad es obligatoria")
            @Positive(message = "La cantidad debe ser mayor a 0") Integer cantidad,
            @Size(max = 120, message = "El proveedor admite hasta 120 caracteres") String proveedor,
            @Size(max = 255, message = "La observación admite hasta 255 caracteres") String observacion
    ) {
    }

    public record ProductoResumen(Long id, String nombre) {
    }

    public record MovimientoResponse(
            Long id,
            ProductoResumen producto,
            TipoMovimiento tipo,
            Integer cantidad,
            Integer stockResultante,
            String proveedor,
            String observacion,
            OffsetDateTime fecha,
            String usuario,
            boolean alertaStockMinimo
    ) {
        public static MovimientoResponse de(Movimiento m) {
            var producto = m.getProducto();
            return new MovimientoResponse(
                    m.getId(),
                    new ProductoResumen(producto.getId(), producto.getNombre()),
                    m.getTipo(),
                    m.getCantidad(),
                    m.getStockResultante(),
                    m.getProveedor(),
                    m.getObservacion(),
                    m.getFecha(),
                    m.getUsuario().getUsername(),
                    m.getStockResultante() <= producto.getStockMinimo());
        }
    }
}
