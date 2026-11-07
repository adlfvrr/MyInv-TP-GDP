package com.myinv.movimiento;

import com.myinv.movimiento.MovimientoDtos.MovimientoRequest;
import com.myinv.movimiento.MovimientoDtos.MovimientoResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Movimientos de stock (docs/contrato-api.md, sección 5).
 * Registrar: ADMINISTRADOR y EMPLEADO (ver SecurityConfig).
 */
@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    private final MovimientoService movimientoService;

    public MovimientoController(MovimientoService movimientoService) {
        this.movimientoService = movimientoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MovimientoResponse registrar(@Valid @RequestBody MovimientoRequest request, Authentication autenticacion) {
        return movimientoService.registrar(request, autenticacion.getName());
    }
}
