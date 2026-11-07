package com.myinv.producto;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/** Filtros opcionales de GET /api/productos. */
final class ProductoSpecs {

    private ProductoSpecs() {
    }

    static Specification<Producto> conFiltros(Integer categoriaId, Integer marcaId, Integer presentacionId,
                                              String texto, boolean soloActivos) {
        return (root, query, cb) -> {
            List<Predicate> predicados = new ArrayList<>();
            if (categoriaId != null) {
                predicados.add(cb.equal(root.get("categoria").get("id"), categoriaId));
            }
            if (marcaId != null) {
                predicados.add(cb.equal(root.get("marca").get("id"), marcaId));
            }
            if (presentacionId != null) {
                predicados.add(cb.equal(root.get("presentacion").get("id"), presentacionId));
            }
            if (texto != null && !texto.isBlank()) {
                predicados.add(cb.like(cb.lower(root.<String>get("nombre")),
                        "%" + texto.trim().toLowerCase() + "%"));
            }
            if (soloActivos) {
                predicados.add(cb.isTrue(root.<Boolean>get("activo")));
            }
            return cb.and(predicados.toArray(new Predicate[0]));
        };
    }
}
