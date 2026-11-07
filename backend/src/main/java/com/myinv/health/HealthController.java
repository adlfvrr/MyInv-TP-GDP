package com.myinv.health;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * GET /api/health — verifica que el backend esté levantado y conectado a PostgreSQL (T01).
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    private static final String VERSION = "1.0.0";

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public Map<String, Object> estado() {
        boolean conectada;
        try {
            Integer uno = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            conectada = uno != null && uno == 1;
        } catch (Exception e) {
            conectada = false;
        }

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("estado", conectada ? "OK" : "DEGRADADO");
        respuesta.put("baseDeDatos", conectada ? "CONECTADA" : "DESCONECTADA");
        respuesta.put("version", VERSION);
        respuesta.put("timestamp", OffsetDateTime.now());
        return respuesta;
    }
}
