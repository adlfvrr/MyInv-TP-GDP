package com.myinv.security;

import com.myinv.usuario.Usuario;
import com.myinv.usuario.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Lee el encabezado "Authorization: Bearer ..." y, si el token es válido y el usuario
 * sigue activo, lo registra como autenticado con su rol (ROLE_ADMINISTRADOR / ROLE_EMPLEADO).
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String PREFIJO = "Bearer ";

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthFilter(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null && header.startsWith(PREFIJO)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            jwtService.validar(header.substring(PREFIJO.length()))
                    .flatMap(info -> usuarioRepository.findByUsername(info.username()))
                    .filter(Usuario::isActivo)
                    .ifPresent(usuario -> {
                        var autoridad = new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre());
                        var autenticacion = new UsernamePasswordAuthenticationToken(
                                usuario.getUsername(), null, List.of(autoridad));
                        SecurityContextHolder.getContext().setAuthentication(autenticacion);
                    });
        }

        chain.doFilter(request, response);
    }
}
