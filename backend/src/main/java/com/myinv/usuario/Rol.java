package com.myinv.usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Rol del usuario: ADMINISTRADOR o EMPLEADO (tabla rol). */
@Entity
@Table(name = "rol")
public class Rol {

    public static final String ADMINISTRADOR = "ADMINISTRADOR";
    public static final String EMPLEADO = "EMPLEADO";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Short id;

    @Column(nullable = false, unique = true, length = 30)
    private String nombre;

    protected Rol() {
    }

    public Short getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }
}
