package com.myinv.catalogo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** DTOs de categorías, marcas y presentaciones (docs/contrato-api.md, sección 4.1). */
public final class CatalogoDtos {

    private CatalogoDtos() {
    }

    public record CategoriaDto(Integer id, String nombre) {
        public static CategoriaDto de(Categoria c) {
            return new CategoriaDto(c.getId(), c.getNombre());
        }
    }

    public record MarcaDto(Integer id, String nombre) {
        public static MarcaDto de(Marca m) {
            return new MarcaDto(m.getId(), m.getNombre());
        }
    }

    public record PresentacionDto(Integer id, String descripcion) {
        public static PresentacionDto de(Presentacion p) {
            return new PresentacionDto(p.getId(), p.getDescripcion());
        }
    }

    public record NombreRequest(
            @NotBlank(message = "El nombre es obligatorio")
            @Size(max = 60, message = "El nombre admite hasta 60 caracteres") String nombre) {
    }

    public record DescripcionRequest(
            @NotBlank(message = "La descripción es obligatoria")
            @Size(max = 60, message = "La descripción admite hasta 60 caracteres") String descripcion) {
    }
}
