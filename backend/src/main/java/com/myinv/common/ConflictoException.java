package com.myinv.common;

/** Se lanza ante un conflicto de reglas de negocio (HTTP 409). */
public class ConflictoException extends RuntimeException {
    public ConflictoException(String mensaje) {
        super(mensaje);
    }
}
