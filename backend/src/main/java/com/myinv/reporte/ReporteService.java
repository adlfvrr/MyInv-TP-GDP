package com.myinv.reporte;

import com.myinv.reporte.ReporteDtos.AlertaResponse;
import com.myinv.reporte.ReporteDtos.CategoriaExistencias;
import com.myinv.reporte.ReporteDtos.ExistenciasResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

/** Detección de stock mínimo (T09) y reporte básico de existencias (T10). */
@Service
public class ReporteService {

    private final ExistenciasRepository existenciasRepository;

    public ReporteService(ExistenciasRepository existenciasRepository) {
        this.existenciasRepository = existenciasRepository;
    }

    @Transactional(readOnly = true)
    public List<AlertaResponse> alertas() {
        return existenciasRepository.buscarEnStockMinimo().stream()
                .map(AlertaResponse::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExistenciasResponse existencias() {
        List<CategoriaExistencias> porCategoria = existenciasRepository.resumirPorCategoria().stream()
                .map(c -> new CategoriaExistencias(c.getCategoria(), c.getProductos(), c.getUnidades()))
                .toList();
        long totalProductos = porCategoria.stream().mapToLong(CategoriaExistencias::productos).sum();
        long totalUnidades = porCategoria.stream().mapToLong(CategoriaExistencias::unidades).sum();
        long enStockMinimo = existenciasRepository.buscarEnStockMinimo().size();
        return new ExistenciasResponse(OffsetDateTime.now(), totalProductos, totalUnidades, enStockMinimo,
                porCategoria);
    }
}
