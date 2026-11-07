package com.myinv.catalogo;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PresentacionRepository extends JpaRepository<Presentacion, Integer> {

    boolean existsByDescripcionIgnoreCase(String descripcion);

    default List<Presentacion> findAllOrdenados() {
        return findAll(Sort.by("descripcion"));
    }
}
