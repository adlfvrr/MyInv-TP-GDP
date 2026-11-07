package com.myinv.catalogo;

import com.myinv.catalogo.CatalogoDtos.CategoriaDto;
import com.myinv.catalogo.CatalogoDtos.DescripcionRequest;
import com.myinv.catalogo.CatalogoDtos.MarcaDto;
import com.myinv.catalogo.CatalogoDtos.NombreRequest;
import com.myinv.catalogo.CatalogoDtos.PresentacionDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Endpoints de catálogos auxiliares (docs/contrato-api.md, sección 4.1). */
@RestController
@RequestMapping("/api")
public class CatalogoController {

    private final CatalogoService catalogoService;

    public CatalogoController(CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    @GetMapping("/categorias")
    public List<CategoriaDto> categorias() {
        return catalogoService.categorias();
    }

    @PostMapping("/categorias")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaDto crearCategoria(@Valid @RequestBody NombreRequest request) {
        return catalogoService.crearCategoria(request.nombre());
    }

    @GetMapping("/marcas")
    public List<MarcaDto> marcas() {
        return catalogoService.marcas();
    }

    @PostMapping("/marcas")
    @ResponseStatus(HttpStatus.CREATED)
    public MarcaDto crearMarca(@Valid @RequestBody NombreRequest request) {
        return catalogoService.crearMarca(request.nombre());
    }

    @GetMapping("/presentaciones")
    public List<PresentacionDto> presentaciones() {
        return catalogoService.presentaciones();
    }

    @PostMapping("/presentaciones")
    @ResponseStatus(HttpStatus.CREATED)
    public PresentacionDto crearPresentacion(@Valid @RequestBody DescripcionRequest request) {
        return catalogoService.crearPresentacion(request.descripcion());
    }
}
