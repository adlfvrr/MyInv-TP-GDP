package com.myinv.movimiento;

/** Tipo de movimiento de stock (columna movimiento.tipo). */
public enum TipoMovimiento {
    /** Compra a un proveedor: suma stock. */
    ENTRADA,
    /** Venta: descuenta stock. */
    SALIDA
}
