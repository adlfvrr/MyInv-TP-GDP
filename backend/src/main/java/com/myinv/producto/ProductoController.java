package com.myinv.producto;

import com.myinv.producto.ProductoDtos.ProductoActualizarRequest;
import com.myinv.producto.ProductoDtos.ProductoCrearRequest;
import com.myinv.producto.ProductoDtos.ProductoResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * ABM de productos (docs/contrato-api.md, sección 4.2).
 * Consultas: ambos roles · Alta, modificación y baja: ADMINISTRADOR (ver SecurityConfig).
 */
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<ProductoResponse> listar(@RequestParam(required = false) Integer categoriaId,
                                         @RequestParam(required = false) Integer marcaId,
                                         @RequestParam(required = false) Integer presentacionId,
                                         @RequestParam(required = false) String q,
                                         @RequestParam(defaultValue = "true") boolean soloActivos) {
        return productoService.listar(categoriaId, marcaId, presentacionId, q, soloActivos);
    }

    @GetMapping("/{id}")
    public ProductoResponse obtener(@PathVariable Long id) {
        return productoService.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoResponse crear(@Valid @RequestBody ProductoCrearRequest request) {
        return productoService.crear(request);
    }

    @PutMapping("/{id}")
    public ProductoResponse actualizar(@PathVariable Long id, @Valid @RequestBody ProductoActualizarRequest request) {
        return productoService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
    }
}
