package com.myinv.catalogo;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarcaRepository extends JpaRepository<Marca, Integer> {

    boolean existsByNombreIgnoreCase(String nombre);

    default List<Marca> findAllOrdenados() {
        return findAll(Sort.by("nombre"));
    }
}
