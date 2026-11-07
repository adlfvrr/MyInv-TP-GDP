package com.myinv.catalogo;

import com.myinv.catalogo.CatalogoDtos.CategoriaDto;
import com.myinv.catalogo.CatalogoDtos.MarcaDto;
import com.myinv.catalogo.CatalogoDtos.PresentacionDto;
import com.myinv.common.ConflictoException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Alta y consulta de categorías, marcas y presentaciones (T05). */
@Service
public class CatalogoService {

    private final CategoriaRepository categoriaRepository;
    private final MarcaRepository marcaRepository;
    private final PresentacionRepository presentacionRepository;

    public CatalogoService(CategoriaRepository categoriaRepository, MarcaRepository marcaRepository,
                           PresentacionRepository presentacionRepository) {
        this.categoriaRepository = categoriaRepository;
        this.marcaRepository = marcaRepository;
        this.presentacionRepository = presentacionRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoriaDto> categorias() {
        return categoriaRepository.findAllOrdenados().stream().map(CategoriaDto::de).toList();
    }

    @Transactional(readOnly = true)
    public List<MarcaDto> marcas() {
        return marcaRepository.findAllOrdenados().stream().map(MarcaDto::de).toList();
    }

    @Transactional(readOnly = true)
    public List<PresentacionDto> presentaciones() {
        return presentacionRepository.findAllOrdenados().stream().map(PresentacionDto::de).toList();
    }

    @Transactional
    public CategoriaDto crearCategoria(String nombre) {
        String valor = nombre.trim();
        if (categoriaRepository.existsByNombreIgnoreCase(valor)) {
            throw new ConflictoException("Ya existe la categoría \"" + valor + "\"");
        }
        return CategoriaDto.de(categoriaRepository.save(new Categoria(valor)));
    }

    @Transactional
    public MarcaDto crearMarca(String nombre) {
        String valor = nombre.trim();
        if (marcaRepository.existsByNombreIgnoreCase(valor)) {
            throw new ConflictoException("Ya existe la marca \"" + valor + "\"");
        }
        return MarcaDto.de(marcaRepository.save(new Marca(valor)));
    }

    @Transactional
    public PresentacionDto crearPresentacion(String descripcion) {
        String valor = descripcion.trim();
        if (presentacionRepository.existsByDescripcionIgnoreCase(valor)) {
            throw new ConflictoException("Ya existe la presentación \"" + valor + "\"");
        }
        return PresentacionDto.de(presentacionRepository.save(new Presentacion(valor)));
    }
}
