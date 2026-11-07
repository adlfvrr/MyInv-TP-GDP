package com.myinv.producto;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {

    /** Trae categoría, marca y presentación en la misma consulta (evita N+1 y mantiene < 5 s). */
    @Override
    @EntityGraph(attributePaths = {"categoria", "marca", "presentacion"})
    List<Producto> findAll(Specification<Producto> spec, Sort sort);

    boolean existsByNombreIgnoreCaseAndMarca_IdAndPresentacion_IdAndActivoTrue(
            String nombre, Integer marcaId, Integer presentacionId);

    boolean existsByNombreIgnoreCaseAndMarca_IdAndPresentacion_IdAndActivoTrueAndIdNot(
            String nombre, Integer marcaId, Integer presentacionId, Long id);

    /** Bloquea la fila del producto hasta el fin de la transacción (registro de movimientos, T07). */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Producto p where p.id = :id")
    Optional<Producto> buscarParaActualizarStock(@Param("id") Long id);
}
