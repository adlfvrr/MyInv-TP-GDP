package com.myinv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

/**
 * Punto de entrada del backend de MyInv.
 * Sistema de gestión de inventario y control de stock de bebidas para la distribuidora "La previa".
 */
@SpringBootApplication
public class MyinvApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("America/Argentina/Buenos_Aires"));
        SpringApplication.run(MyinvApplication.class, args);
    }
}
