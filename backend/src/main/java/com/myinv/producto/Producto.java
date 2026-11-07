package com.myinv.producto;

import com.myinv.catalogo.Categoria;
import com.myinv.catalogo.Marca;
import com.myinv.catalogo.Presentacion;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/** Bebida del catálogo con su stock actual y umbral mínimo (tabla producto). */
@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "marca_id", nullable = false)
    private Marca marca;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "presentacion_id", nullable = false)
    private Presentacion presentacion;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio = BigDecimal.ZERO;

    @Column(name = "stock_actual", nullable = false)
    private Integer stockActual = 0;

    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo = 0;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private OffsetDateTime creadoEn;

    @Column(name = "actualizado_en", nullable = false)
    private OffsetDateTime actualizadoEn;

    protected Producto() {
    }

    public Producto(String nombre, Categoria categoria, Marca marca, Presentacion presentacion,
                    BigDecimal precio, int stockActual, int stockMinimo) {
        actualizarDatos(nombre, categoria, marca, presentacion, precio, stockMinimo);
        this.stockActual = stockActual;
    }

    /** Modifica los datos descriptivos. El stock actual solo cambia mediante movimientos. */
    public void actualizarDatos(String nombre, Categoria categoria, Marca marca, Presentacion presentacion,
                                BigDecimal precio, int stockMinimo) {
        this.nombre = nombre;
        this.categoria = categoria;
        this.marca = marca;
        this.presentacion = presentacion;
        this.precio = precio;
        this.stockMinimo = stockMinimo;
    }

    public void darDeBaja() {
        this.activo = false;
    }

    public boolean estaEnStockMinimo() {
        return stockActual <= stockMinimo;
    }

    @PrePersist
    void alCrear() {
        creadoEn = OffsetDateTime.now();
        actualizadoEn = creadoEn;
    }

    @PreUpdate
    void alActualizar() {
        actualizadoEn = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public Marca getMarca() {
        return marca;
    }

    public Presentacion getPresentacion() {
        return presentacion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public Integer getStockActual() {
        return stockActual;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public boolean isActivo() {
        return activo;
    }
}
