package com.myinv.producto;

import com.myinv.catalogo.Categoria;
import com.myinv.catalogo.CategoriaRepository;
import com.myinv.catalogo.Marca;
import com.myinv.catalogo.MarcaRepository;
import com.myinv.catalogo.Presentacion;
import com.myinv.catalogo.PresentacionRepository;
import com.myinv.common.ConflictoException;
import com.myinv.common.RecursoNoEncontradoException;
import com.myinv.producto.ProductoDtos.ProductoActualizarRequest;
import com.myinv.producto.ProductoDtos.ProductoCrearRequest;
import com.myinv.producto.ProductoDtos.ProductoResponse;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Reglas de negocio del ABM de productos (T05). */
@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MarcaRepository marcaRepository;
    private final PresentacionRepository presentacionRepository;

    public ProductoService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository,
                           MarcaRepository marcaRepository, PresentacionRepository presentacionRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.marcaRepository = marcaRepository;
        this.presentacionRepository = presentacionRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listar(Integer categoriaId, Integer marcaId, Integer presentacionId,
                                         String texto, boolean soloActivos) {
        var filtros = ProductoSpecs.conFiltros(categoriaId, marcaId, presentacionId, texto, soloActivos);
        return productoRepository.findAll(filtros, Sort.by("nombre", "id")).stream()
                .map(ProductoResponse::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtener(Long id) {
        return ProductoResponse.de(buscar(id));
    }

    @Transactional
    public ProductoResponse crear(ProductoCrearRequest r) {
        String nombre = r.nombre().trim();
        if (productoRepository.existsByNombreIgnoreCaseAndMarca_IdAndPresentacion_IdAndActivoTrue(
                nombre, r.marcaId(), r.presentacionId())) {
            throw new ConflictoException("Ya existe un producto activo con ese nombre, marca y presentación");
        }
        Producto producto = new Producto(nombre, categoria(r.categoriaId()), marca(r.marcaId()),
                presentacion(r.presentacionId()), r.precio(), r.stockActual(), r.stockMinimo());
        return ProductoResponse.de(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponse actualizar(Long id, ProductoActualizarRequest r) {
        Producto producto = buscar(id);
        String nombre = r.nombre().trim();
        if (productoRepository.existsByNombreIgnoreCaseAndMarca_IdAndPresentacion_IdAndActivoTrueAndIdNot(
                nombre, r.marcaId(), r.presentacionId(), id)) {
            throw new ConflictoException("Ya existe un producto activo con ese nombre, marca y presentación");
        }
        producto.actualizarDatos(nombre, categoria(r.categoriaId()), marca(r.marcaId()),
                presentacion(r.presentacionId()), r.precio(), r.stockMinimo());
        return ProductoResponse.de(producto);
    }

    /** Baja lógica: conserva el historial de movimientos del producto. */
    @Transactional
    public void eliminar(Long id) {
        buscar(id).darDeBaja();
    }

    private Producto buscar(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el producto " + id));
    }

    private Categoria categoria(Integer id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la categoría " + id));
    }

    private Marca marca(Integer id) {
        return marcaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la marca " + id));
    }

    private Presentacion presentacion(Integer id) {
        return presentacionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la presentación " + id));
    }
}
