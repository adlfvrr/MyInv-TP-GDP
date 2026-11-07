package com.myinv.reporte;

import com.myinv.producto.Producto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;

/** Consultas de solo lectura sobre el stock para alertas y reportes (Módulo 4). */
public interface ExistenciasRepository extends Repository<Producto, Long> {

    /**
     * Productos activos que alcanzaron el umbral mínimo (stock_actual <= stock_minimo),
     * del mayor faltante al menor. Se evalúa sobre el stock vigente, que cada movimiento
     * actualiza en la misma transacción: la alerta aparece apenas se registra el movimiento.
     */
    @Query("""
            select p from Producto p
            join fetch p.marca
            join fetch p.presentacion
            where p.activo = true and p.stockActual <= p.stockMinimo
            order by (p.stockMinimo - p.stockActual) desc, p.nombre asc
            """)
    List<Producto> buscarEnStockMinimo();

    /** Productos activos y unidades en stock agrupados por categoría. */
    @Query("""
            select c.nombre as categoria, count(p) as productos, coalesce(sum(p.stockActual), 0) as unidades
            from Producto p join p.categoria c
            where p.activo = true
            group by c.nombre
            order by c.nombre
            """)
    List<ExistenciaPorCategoria> resumirPorCategoria();

    /** Proyección del resumen por categoría. */
    interface ExistenciaPorCategoria {
        String getCategoria();

        Long getProductos();

        Long getUnidades();
    }
}
