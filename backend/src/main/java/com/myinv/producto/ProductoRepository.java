package com.myinv.producto;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {

    /** Trae categoría, marca y presentación en la misma consulta (evita N+1 y mantiene < 5 s). */
    @Override
    @EntityGraph(attributePaths = {"categoria", "marca", "presentacion"})
    List<Producto> findAll(Specification<Producto> spec, Sort sort);

    boolean existsByNombreIgnoreCaseAndMarca_IdAndPresentacion_IdAndActivoTrue(
            String nombre, Integer marcaId, Integer presentacionId);

    boolean existsByNombreIgnoreCaseAndMarca_IdAndPresentacion_IdAndActivoTrueAndIdNot(
            String nombre, Integer marcaId, Integer presentacionId, Long id);
}
