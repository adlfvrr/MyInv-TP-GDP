package com.myinv.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

/**
 * Genera y valida los tokens JWT firmados con HMAC-SHA256.
 */
@Service
public class JwtService {

    private static final String CLAIM_ROL = "rol";

    private final SecretKey clave;
    private final long expiracionSegundos;

    public JwtService(@Value("${myinv.jwt.secret}") String secreto,
                      @Value("${myinv.jwt.expiracion-segundos}") long expiracionSegundos) {
        if (secreto.length() < 32) {
            throw new IllegalStateException("myinv.jwt.secret debe tener al menos 32 caracteres");
        }
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.expiracionSegundos = expiracionSegundos;
    }

    public String generarToken(String username, String rol) {
        Instant ahora = Instant.now();
        return Jwts.builder()
                .subject(username)
                .claim(CLAIM_ROL, rol)
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(ahora.plusSeconds(expiracionSegundos)))
                .signWith(clave)
                .compact();
    }

    /** Devuelve los datos del token si la firma es válida y no está vencido. */
    public Optional<TokenInfo> validar(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(clave).build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Optional.of(new TokenInfo(claims.getSubject(), claims.get(CLAIM_ROL, String.class)));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public long getExpiracionSegundos() {
        return expiracionSegundos;
    }

    public record TokenInfo(String username, String rol) {
    }
}
