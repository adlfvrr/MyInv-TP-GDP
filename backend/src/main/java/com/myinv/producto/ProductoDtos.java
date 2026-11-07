package com.myinv.producto;

import com.myinv.catalogo.CatalogoDtos.CategoriaDto;
import com.myinv.catalogo.CatalogoDtos.MarcaDto;
import com.myinv.catalogo.CatalogoDtos.PresentacionDto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/** DTOs de productos (docs/contrato-api.md, sección 4.2). */
public final class ProductoDtos {

    private ProductoDtos() {
    }

    public record ProductoResponse(
            Long id,
            String nombre,
            CategoriaDto categoria,
            MarcaDto marca,
            PresentacionDto presentacion,
            BigDecimal precio,
            Integer stockActual,
            Integer stockMinimo,
            boolean enStockMinimo,
            boolean activo
    ) {
        public static ProductoResponse de(Producto p) {
            return new ProductoResponse(
                    p.getId(),
                    p.getNombre(),
                    CategoriaDto.de(p.getCategoria()),
                    MarcaDto.de(p.getMarca()),
                    PresentacionDto.de(p.getPresentacion()),
                    p.getPrecio(),
                    p.getStockActual(),
                    p.getStockMinimo(),
                    p.estaEnStockMinimo(),
                    p.isActivo());
        }
    }

    /** POST /api/productos — incluye el stock inicial. */
    public record ProductoCrearRequest(
            @NotBlank(message = "El nombre es obligatorio")
            @Size(max = 120, message = "El nombre admite hasta 120 caracteres") String nombre,
            @NotNull(message = "La categoría es obligatoria") Integer categoriaId,
            @NotNull(message = "La marca es obligatoria") Integer marcaId,
            @NotNull(message = "La presentación es obligatoria") Integer presentacionId,
            @NotNull(message = "El precio es obligatorio")
            @DecimalMin(value = "0.00", message = "El precio no puede ser negativo")
            @Digits(integer = 10, fraction = 2, message = "El precio admite hasta 2 decimales") BigDecimal precio,
            @NotNull(message = "El stock inicial es obligatorio")
            @PositiveOrZero(message = "El stock no puede ser negativo") Integer stockActual,
            @NotNull(message = "El stock mínimo es obligatorio")
            @PositiveOrZero(message = "El stock mínimo no puede ser negativo") Integer stockMinimo
    ) {
    }

    /** PUT /api/productos/{id} — sin stock actual: el stock solo cambia con movimientos. */
    public record ProductoActualizarRequest(
            @NotBlank(message = "El nombre es obligatorio")
            @Size(max = 120, message = "El nombre admite hasta 120 caracteres") String nombre,
            @NotNull(message = "La categoría es obligatoria") Integer categoriaId,
            @NotNull(message = "La marca es obligatoria") Integer marcaId,
            @NotNull(message = "La presentación es obligatoria") Integer presentacionId,
            @NotNull(message = "El precio es obligatorio")
            @DecimalMin(value = "0.00", message = "El precio no puede ser negativo")
            @Digits(integer = 10, fraction = 2, message = "El precio admite hasta 2 decimales") BigDecimal precio,
            @NotNull(message = "El stock mínimo es obligatorio")
            @PositiveOrZero(message = "El stock mínimo no puede ser negativo") Integer stockMinimo
    ) {
    }
}
