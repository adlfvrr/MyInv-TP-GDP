package com.myinv.catalogo;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    boolean existsByNombreIgnoreCase(String nombre);

    default List<Categoria> findAllOrdenados() {
        return findAll(Sort.by("nombre"));
    }
}
