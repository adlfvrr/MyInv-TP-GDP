package com.myinv.auth;

import com.myinv.usuario.Usuario;

/** Datos públicos del usuario autenticado. */
public record UsuarioDto(Long id, String username, String nombreCompleto, String rol) {

    public static UsuarioDto de(Usuario usuario) {
        return new UsuarioDto(usuario.getId(), usuario.getUsername(),
                usuario.getNombreCompleto(), usuario.getRol().getNombre());
    }
}
