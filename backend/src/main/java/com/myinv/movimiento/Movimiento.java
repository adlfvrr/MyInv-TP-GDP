package com.myinv.movimiento;

import com.myinv.producto.Producto;
import com.myinv.usuario.Usuario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

/**
 * Entrada (compra a proveedor) o salida (venta) de stock de un producto (tabla movimiento).
 * Guarda el stock que quedó después del movimiento para poder auditar el historial.
 */
@Entity
@Table(name = "movimiento")
public class Movimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoMovimiento tipo;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "stock_resultante", nullable = false)
    private Integer stockResultante;

    @Column(length = 120)
    private String proveedor;

    @Column(length = 255)
    private String observacion;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime fecha;

    protected Movimiento() {
    }

    public Movimiento(Producto producto, Usuario usuario, TipoMovimiento tipo, int cantidad,
                      int stockResultante, String proveedor, String observacion) {
        this.producto = producto;
        this.usuario = usuario;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.stockResultante = stockResultante;
        this.proveedor = proveedor;
        this.observacion = observacion;
    }

    @PrePersist
    void alCrear() {
        if (fecha == null) {
            fecha = OffsetDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Producto getProducto() {
        return producto;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public TipoMovimiento getTipo() {
        return tipo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public Integer getStockResultante() {
        return stockResultante;
    }

    public String getProveedor() {
        return proveedor;
    }

    public String getObservacion() {
        return observacion;
    }

    public OffsetDateTime getFecha() {
        return fecha;
    }
}
