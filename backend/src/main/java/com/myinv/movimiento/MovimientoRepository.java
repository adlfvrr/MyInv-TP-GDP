package com.myinv.movimiento;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long>, JpaSpecificationExecutor<Movimiento> {

    /** Historial (T11): trae producto y usuario en la misma consulta (evita N+1 y mantiene < 5 s). */
    @Override
    @EntityGraph(attributePaths = {"producto", "usuario"})
    List<Movimiento> findAll(Specification<Movimiento> spec, Sort sort);
}
