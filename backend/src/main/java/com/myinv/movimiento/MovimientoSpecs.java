package com.myinv.movimiento;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

/** Filtros opcionales del historial de movimientos (T11). */
final class MovimientoSpecs {

    /** Las fechas del filtro se interpretan en la hora local de la distribuidora. */
    private static final ZoneId ZONA = ZoneId.of("America/Argentina/Buenos_Aires");

    private MovimientoSpecs() {
    }

    static Specification<Movimiento> conFiltros(TipoMovimiento tipo, LocalDate desde, LocalDate hasta,
                                                Long productoId) {
        return (root, query, cb) -> {
            List<Predicate> condiciones = new ArrayList<>();
            if (tipo != null) {
                condiciones.add(cb.equal(root.get("tipo"), tipo));
            }
            if (desde != null) {
                OffsetDateTime inicio = desde.atStartOfDay(ZONA).toOffsetDateTime();
                condiciones.add(cb.greaterThanOrEqualTo(root.get("fecha"), inicio));
            }
            if (hasta != null) {
                // "hasta" es inclusive: se toma hasta el comienzo del día siguiente.
                OffsetDateTime fin = hasta.plusDays(1).atStartOfDay(ZONA).toOffsetDateTime();
                condiciones.add(cb.lessThan(root.get("fecha"), fin));
            }
            if (productoId != null) {
                condiciones.add(cb.equal(root.get("producto").get("id"), productoId));
            }
            return cb.and(condiciones.toArray(Predicate[]::new));
        };
    }
}
