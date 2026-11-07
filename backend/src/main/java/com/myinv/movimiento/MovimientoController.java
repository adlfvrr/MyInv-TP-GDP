package com.myinv.movimiento;

import com.myinv.movimiento.MovimientoDtos.MovimientoRequest;
import com.myinv.movimiento.MovimientoDtos.MovimientoResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/**
 * Movimientos de stock (docs/contrato-api.md, sección 5).
 * Registrar y consultar el historial: ADMINISTRADOR y EMPLEADO (ver SecurityConfig).
 */
@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    private final MovimientoService movimientoService;

    public MovimientoController(MovimientoService movimientoService) {
        this.movimientoService = movimientoService;
    }

    /** Historial filtrable por tipo, rango de fechas (YYYY-MM-DD, inclusive) y producto (T11). */
    @GetMapping
    public List<MovimientoResponse> listar(
            @RequestParam(required = false) TipoMovimiento tipo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(required = false) Long productoId) {
        return movimientoService.listar(tipo, desde, hasta, productoId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MovimientoResponse registrar(@Valid @RequestBody MovimientoRequest request, Authentication autenticacion) {
        return movimientoService.registrar(request, autenticacion.getName());
    }
}
