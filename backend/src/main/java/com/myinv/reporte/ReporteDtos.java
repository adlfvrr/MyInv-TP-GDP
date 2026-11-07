package com.myinv.reporte;

import com.myinv.producto.Producto;

import java.time.OffsetDateTime;
import java.util.List;

/** DTOs de alertas y reportes (docs/contrato-api.md, sección 6). */
public final class ReporteDtos {

    private ReporteDtos() {
    }

    /** GET /api/alertas — un producto que necesita reposición. */
    public record AlertaResponse(
            Long productoId,
            String nombre,
            String marca,
            String presentacion,
            Integer stockActual,
            Integer stockMinimo,
            Integer faltante
    ) {
        public static AlertaResponse de(Producto p) {
            return new AlertaResponse(
                    p.getId(),
                    p.getNombre(),
                    p.getMarca().getNombre(),
                    p.getPresentacion().getDescripcion(),
                    p.getStockActual(),
                    p.getStockMinimo(),
                    p.getStockMinimo() - p.getStockActual());
        }
    }

    public record CategoriaExistencias(String categoria, long productos, long unidades) {
    }

    /** GET /api/reportes/existencias */
    public record ExistenciasResponse(
            OffsetDateTime generadoEn,
            long totalProductos,
            long totalUnidades,
            long productosEnStockMinimo,
            List<CategoriaExistencias> porCategoria
    ) {
    }
}
