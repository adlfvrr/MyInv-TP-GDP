package com.myinv.reporte;

import com.myinv.reporte.ReporteDtos.AlertaResponse;
import com.myinv.reporte.ReporteDtos.ExistenciasResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Alertas de reposición y reporte de existencias (docs/contrato-api.md, sección 6).
 * Ambos roles (consultas GET, ver SecurityConfig).
 */
@RestController
@RequestMapping("/api")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping("/alertas")
    public List<AlertaResponse> alertas() {
        return reporteService.alertas();
    }

    @GetMapping("/reportes/existencias")
    public ExistenciasResponse existencias() {
        return reporteService.existencias();
    }
}
