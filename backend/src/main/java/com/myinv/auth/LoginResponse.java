package com.myinv.auth;

/** Respuesta de POST /api/auth/login (ver docs/contrato-api.md, sección 3). */
public record LoginResponse(String token, String tipo, long expiraEn, UsuarioDto usuario) {
}
