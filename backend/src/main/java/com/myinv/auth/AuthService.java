package com.myinv.auth;

import com.myinv.common.RecursoNoEncontradoException;
import com.myinv.security.JwtService;
import com.myinv.usuario.Usuario;
import com.myinv.usuario.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Valida credenciales y emite el token JWT (T03).
 */
@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByUsername(request.username().trim())
                .filter(Usuario::isActivo)
                .filter(u -> passwordEncoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(CredencialesInvalidasException::new);

        String token = jwtService.generarToken(usuario.getUsername(), usuario.getRol().getNombre());
        return new LoginResponse(token, "Bearer", jwtService.getExpiracionSegundos(), UsuarioDto.de(usuario));
    }

    @Transactional(readOnly = true)
    public UsuarioDto usuarioActual(String username) {
        return usuarioRepository.findByUsername(username)
                .map(UsuarioDto::de)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }
}
