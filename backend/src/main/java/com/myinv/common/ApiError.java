package com.myinv.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.OffsetDateTime;
import java.util.Map;

/**
 * Formato estándar de error definido en docs/contrato-api.md (sección 1.1).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
        OffsetDateTime timestamp,
        int status,
        String error,
        String mensaje,
        String ruta,
        Map<String, String> errores
) {
    public static ApiError of(int status, String error, String mensaje, String ruta) {
        return new ApiError(OffsetDateTime.now(), status, error, mensaje, ruta, null);
    }
}
