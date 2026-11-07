package com.myinv.auth;

/** Usuario inexistente, inactivo o contraseña incorrecta (HTTP 401). */
public class CredencialesInvalidasException extends RuntimeException {
    public CredencialesInvalidasException() {
        super("Usuario o contraseña incorrectos");
    }
}
